import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ClassesById,
  ClassMeta,
  ContentById,
  ContentMeta,
  DataProviderProps,
  DataState,
  QuestionsById,
  QuizMeta,
  QuizMetaById,
  QuizQuestionType,
} from "./types";
import { fetchClasses, fetchContent } from "./utils";
import { supabase, useAuthContext } from "../AuthContext/AuthContext";
import { useShallowMemo } from "../../hooks/useShallowMemo";

export const DataContext = createContext<DataState | null>(null);

export const useDataContext = (): DataState => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useDataContext must be within DataProvider");
  }

  return ctx;
};

type QuizContentFetch = {
  questions: QuizQuestionType[];
  quizInfo: QuizMeta;
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const [classes, setClasses] = useState<ClassMeta[]>([]);
  const [classesById, setClassesById] = useState<ClassesById>({});
  const [contentById, setContentById] = useState<ContentById>({});
  const [questionsById, setQuestionsById] = useState<QuestionsById>({});
  const [quizMetaById, setQuizMetaById] = useState<QuizMetaById>({});
  const [classesLoading, setClassesLoading] = useState(false);
  const classesFetched = useRef(false);
  const [classesError, setClassesError] = useState("");
  const auth = useAuthContext();

  useEffect(() => {
    if (!auth.loading && auth.session && !classesFetched.current) {
      classesFetched.current = true;
      callClasses();
    }
  }, [auth.loading, auth.session?.user?.id]);

  const callClasses = async () => {
    // optional guard
    if (!auth.session?.access_token) {
      setClassesError("Not authenticated");
      return;
    }

    setClassesError("");
    setClassesLoading(true);

    try {
      await fetchClasses(setClassesById, setClasses, auth.session.access_token);
    } catch (err: any) {
      console.error("Error in fetchClasses", err);

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        await auth.handleLogout();
        return;
      }

      // generic error
      setClassesError("Error getting classes");
    } finally {
      setClassesLoading(false);
    }
  };

  const deleteQuiz = async (quizId: string, classId: string) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_API}/quiz/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.session?.access_token}`,
          },
        }
      );

      setQuizMetaById((prev) => {
        const { [quizId]: _removed, ...rest } = prev;
        return rest;
      });

      // 3. Remove questions for that quiz
      setQuestionsById((prev) => {
        const { [quizId]: _removed, ...rest } = prev;
        return rest;
      });

      // 4. Remove it from the content list for that class
      setContentById((prev) => {
        const prevContent = prev[classId] ?? [];
        return {
          ...prev,
          [classId]: prevContent.filter(
            (item) => !(item.type === "quiz" && item.id === quizId)
          ),
        };
      });
    } catch (e) {
      throw e;
    }
  };

  const AddClass = async (name: string) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/classes`,
        { name },
        {
          headers: {
            Authorization: auth.session?.access_token
              ? `Bearer ${auth.session.access_token}`
              : "",
          },
        }
      );
      const classData: ClassMeta = res.data;

      setClasses((prev) => [...prev, classData]);
      setClassesById((prev) => ({ ...prev, [classData.id]: classData }));
    } catch (e) {
      throw new Error("Error Adding New Class");
    }
  };

  const loadContent = (classId: string) => {
    fetchContent(classId, setContentById, auth.session?.access_token);
  };

  const fetchQuizContent = async (quizId: string) => {
    if (questionsById[quizId] && quizMetaById[quizId]) {
      return;
    }

    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_API}/quiz/questions/${quizId}`,
      {
        headers: {
          Authorization: auth.session?.access_token
            ? `Bearer ${auth.session.access_token}`
            : "",
        },
      }
    );
    const data: QuizContentFetch = res.data;
    setQuestionsById((prev) => ({ ...prev, [quizId]: data.questions }));
    setQuizMetaById((prev) => ({ ...prev, [quizId]: data.quizInfo }));
  };

  const AddNewQuiz = async (params: {
    classId: string;
    chosenGrade: string;
    files: File[];
    input: string;
    numQuestions: number;
    genExample: boolean;
    setRunningOcr: Dispatch<SetStateAction<boolean>>;
  }): Promise<QuizMeta> => {
    const {
      classId,
      chosenGrade,
      files,
      input,
      numQuestions,
      genExample,
      setRunningOcr,
    } = params;

    if (!auth.session) {
      throw new Error("No active session");
    }

    const token = auth.session.access_token;

    // Build one FormData for the combined /from-notes endpoint
    const formData = new FormData();
    formData.append("notesText", input);
    formData.append("gradeLevel", chosenGrade);
    formData.append("numQuestions", String(numQuestions));
    formData.append("classId", classId);
    formData.append("genExample", String(genExample));

    files.forEach((file) => {
      formData.append("images", file);
    });

    // ----- Single streaming request -----
    // We use fetch here because axios in the browser doesn't handle streaming nicely.
    setRunningOcr(true);

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_API}/quiz/from-notes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type here; the browser will handle the multipart boundary.
        },
        body: formData,
      }
    );

    if (!response.body) {
      setRunningOcr(false);
      throw new Error("Streaming response not supported by the browser");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let quizDataNull: QuizMeta | null = null;
    let questions: QuizQuestionType[] = [];
    let encounteredError: string | null = null;

    // Read the NDJSON stream line-by-line
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // keep any partial line for the next chunk

      for (const line of lines) {
        if (!line.trim()) continue;

        let msg: any;
        try {
          msg = JSON.parse(line);
        } catch (e) {
          console.error("Failed to parse streaming line:", line, e);
          continue;
        }

        switch (msg.stage) {
          case "ocr_started":
            // You could also set some local "status" state here if you add it later
            // e.g., setStatus("Parsing images…");
            setRunningOcr(true);
            break;

          case "ocr_done":
            setRunningOcr(false);
            break;

          case "quiz_started":
            break;

          case "quiz_done":
            quizDataNull = msg.quiz as QuizMeta;
            questions = msg.questions as QuizQuestionType[];
            break;

          case "error":
            console.error("Error from /quiz/from-notes:", msg);
            encounteredError = msg.error || "Failed to generate quiz";
            setRunningOcr(false);
            break;

          default:
            console.warn("Unknown stage message:", msg);
        }
      }
    }

    if (encounteredError) {
      throw new Error(encounteredError);
    }

    if (!quizDataNull) {
      setRunningOcr(false);
      throw new Error("Quiz generation did not complete");
    }

    const quizData: QuizMeta = quizDataNull;

    // ---- update local state caches ----
    const contentMeta: ContentMeta = {
      id: quizData.id,
      last_used_at: quizData.last_taken_at,
      num_items: `${quizData.num_questions} Questions`,
      title: quizData.title,
      type: "quiz",
    };

    setQuizMetaById((prev) => ({
      ...prev,
      [quizData.id]: quizData,
    }));

    setContentById((prev) => ({
      ...prev,
      [classId]: [contentMeta, ...(prev[classId] ?? [])],
    }));

    setQuestionsById((prev) => ({
      ...prev,
      [quizData.id]: questions,
    }));

    return quizData;
  };

  const dataMemo = useShallowMemo({
    classes,
    classesById,
    contentById,
    loadContent,
    fetchQuizContent,
    callClasses,
    deleteQuiz,
    classesLoading,
    classesError,
    questionsById,
    quizMetaById,
    AddClass,
    AddNewQuiz,
  });

  return (
    <DataContext.Provider value={dataMemo}>{children}</DataContext.Provider>
  );
};
