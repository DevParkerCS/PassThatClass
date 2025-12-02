// ContentContext.tsx

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {
  ContentById,
  ContentMeta,
  ContentState,
  DataProviderProps,
  QuestionsById,
  QuizMeta,
  QuizMetaById,
  QuizQuestionType,
} from "./types";
import { fetchContent } from "./utils";
import { useAuthContext } from "../AuthContext/AuthContext";
import { useShallowMemo } from "../../hooks/useShallowMemo";

type QuizContentFetch = {
  questions: QuizQuestionType[];
  quizInfo: QuizMeta;
};

export const ContentContext = createContext<ContentState | null>(null);

export const useContentContext = (): ContentState => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContentContext must be within ContentProvider");
  }
  return ctx;
};

export const ContentProvider = ({ children }: DataProviderProps) => {
  const [contentById, setContentById] = useState<ContentById>({});
  const [questionsById, setQuestionsById] = useState<QuestionsById>({});
  const [quizMetaById, setQuizMetaById] = useState<QuizMetaById>({});
  const [quizLoading, setQuizLoading] = useState(false);
  const auth = useAuthContext();

  const loadContent = (classId: string) => {
    fetchContent(classId, setContentById, auth.session?.access_token);
  };

  const fetchQuizContent = async (quizId: string) => {
    if (questionsById[quizId] && quizMetaById[quizId]) {
      return;
    }

    try {
      setQuizLoading(true);
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
      setQuizLoading(false);
      const data: QuizContentFetch = res.data;
      setQuestionsById((prev) => ({ ...prev, [quizId]: data.questions }));
      setQuizMetaById((prev) => ({ ...prev, [quizId]: data.quizInfo }));
    } catch (e) {
      setQuizLoading(false);
      throw e;
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

      setQuestionsById((prev) => {
        const { [quizId]: _removed, ...rest } = prev;
        return rest;
      });

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

  const AddNewQuiz = async (params: {
    classId: string;
    chosenGrade: string;
    files: File[];
    input: string;
    numQuestions: number;
    genExample: boolean;
    setLoadingState: Dispatch<SetStateAction<string>>;
  }): Promise<QuizMeta> => {
    const {
      classId,
      chosenGrade,
      files,
      input,
      numQuestions,
      genExample,
      setLoadingState,
    } = params;

    if (!auth.session) {
      throw new Error("No active session");
    }

    const token = auth.session.access_token;

    const formData = new FormData();
    formData.append("notesText", input);
    formData.append("gradeLevel", chosenGrade);
    formData.append("numQuestions", String(numQuestions));
    formData.append("classId", classId);
    formData.append("genExample", String(genExample));

    files.forEach((file) => {
      formData.append("images", file);
    });

    setLoadingState("Parsing Images...");

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_API}/quiz/from-notes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.body) {
      setLoadingState("");
      throw new Error("Streaming response not supported by the browser");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let quizDataNull: QuizMeta | null = null;
    let questions: QuizQuestionType[] = [];
    let encounteredError: string | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

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
            setLoadingState("Parsing Images...");
            break;

          case "ocr_done":
            setLoadingState("Generating Quiz...");
            break;

          case "quiz_started":
            break;

          case "cleaning_quiz":
            setLoadingState("Cleaning Up Quiz...");
            break;

          case "quiz_done":
            quizDataNull = msg.quiz as QuizMeta;
            questions = msg.questions as QuizQuestionType[];
            break;

          case "error":
            console.error("Error from /quiz/from-notes:", msg);
            encounteredError = msg.error || "Failed to generate quiz";
            setLoadingState("");
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
      setLoadingState("");
      throw new Error("Quiz generation did not complete");
    }

    const quizData: QuizMeta = quizDataNull;

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

  const value = useShallowMemo<ContentState>({
    contentById,
    loadContent,
    fetchQuizContent,
    deleteQuiz,
    quizLoading,
    questionsById,
    quizMetaById,
    AddNewQuiz,
  });

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
