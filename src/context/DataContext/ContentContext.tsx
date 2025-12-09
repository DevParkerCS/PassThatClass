// ContentContext.tsx

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import {
  ContentById,
  ContentMeta,
  ContentState,
  DataProviderProps,
  Difficulty,
  QuestionsById,
  QuizAttempts,
  QuizAttemptsById,
  QuizAttemptType,
  QuizMeta,
  QuizMetaById,
  QuizQuestionType,
} from "./types";
import { fetchContent } from "./utils";
import { useAuthContext } from "../AuthContext/AuthContext";
import { useShallowMemo } from "../../hooks/useShallowMemo";
import { addNewQuiz, deleteQuiz, fetchQuizContent } from "./quizUtils";

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
  const [contentLoadStatus, setContentLoadStatus] = useState<
    Record<string, boolean>
  >({});
  const [questionsById, setQuestionsById] = useState<QuestionsById>({});
  const [quizMetaById, setQuizMetaById] = useState<QuizMetaById>({});
  const [attemptsById, setAttemptsById] = useState<QuizAttemptsById>({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [lastUploaded, setLastUploaded] = useState({});
  const auth = useAuthContext();
  const contentRef = useRef<ContentById>({});
  const contentIds = useRef<Set<string>>(new Set());
  useEffect(() => {
    contentRef.current = contentById;
  }, [contentById]);
  const pollingRef = useRef<Record<string, boolean>>({});

  const hasGenerating = (classId: string) => {
    const content = contentRef.current;
    return content[classId]?.some((c) => c.status === "generating");
  };

  const startPolling = (classId: string) => {
    if (pollingRef.current[classId]) return;
    pollingRef.current[classId] = true;

    const poll = async () => {
      if (hasGenerating(classId)) {
        // still generating → schedule next check
        setTimeout(async () => {
          await fetchContent(
            classId,
            setContentById,
            auth.session?.access_token
          );
          poll();
        }, 10000);
      } else {
        pollingRef.current[classId] = false;
      }
    };

    // kick off the loop
    poll();
  };

  const loadContent = async (classId: string) => {
    try {
      await fetchContent(classId, setContentById, auth.session?.access_token);
      setContentLoadStatus((prev) => ({
        ...prev,
        [classId]: true,
      }));
    } catch (e) {
      throw e;
    }
  };

  const callQuizContent = async (quizId: string) => {
    const params = {
      quizId,
      token: auth.session?.access_token,
      questionsById,
      quizMetaById,
      setQuizLoading,
      setQuestionsById,
      setQuizMetaById,
    };

    await fetchQuizContent(params);
  };

  const callDeleteQuiz = async (quizId: string, classId: string) => {
    const params = {
      quizId,
      classId,
      token: auth.session?.access_token,
      setQuestionsById,
      setQuizMetaById,
      setContentById,
    };
    await deleteQuiz(params);
  };

  const updateTitle = async (
    quizId: string,
    classId: string,
    title: string
  ) => {
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_BACKEND_API}/quiz/${quizId}/title`,
        { title },
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.session?.access_token}`,
          },
        }
      );

      setQuizMetaById((prev) => {
        prev[quizId].title = title;

        return { ...prev };
      });

      setContentById((prev) => {
        prev[classId].map((p) => {
          if (p.id === quizId) p.title = title;
        });

        return prev;
      });
    } catch (e) {
      throw new Error("Error saving");
    }
  };

  const addAttempt = async (
    numCorrect: number,
    seconds: number,
    incorrectIndexes: number[],
    quizId: string
  ) => {
    try {
      const params = { numCorrect, seconds, incorrectIndexes };
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/quiz/${quizId}/attempt`,
        params,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.session?.access_token}`,
          },
        }
      );

      const data = res.data;
      const quizData: QuizMeta = data.quiz;
      const attemptData: QuizAttemptType = data.attempt;

      setQuizMetaById((prev) => ({ ...prev, [quizId]: quizData }));
      setContentById((prev) => {
        const prevContent = prev[quizData.class_id];

        if (!prevContent) return prev;

        return {
          ...prev,
          [quizData.class_id]: prevContent.map((p) =>
            p.id === quizId ? { ...p, last_used_at: quizData.last_taken_at } : p
          ),
        };
      });

      setAttemptsById((prev) => {
        const prevAttempts = prev[quizId];
        if (!prevAttempts) return prev;

        return {
          ...prev,
          [quizId]: [attemptData, ...prevAttempts],
        };
      });
    } catch (e) {
      throw new Error("Error adding new attempt data");
    }
  };

  const getPastAttempts = async (quizId: string) => {
    if (attemptsById[quizId]) return attemptsById[quizId];

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_API}/quiz/${quizId}/attempts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.session?.access_token}`,
          },
        }
      );

      const data: QuizAttempts = res.data;
      console.log(data);
      attemptsById[quizId] = data;
      return data;
    } catch (e) {
      throw new Error("Error Getting attempt data");
    }
  };

  const callAddNewQuiz = async (
    newId: string,
    classId: string,
    chosenGrade: Difficulty,
    files: File[],
    input: string,
    numQuestions: number,
    genExample: boolean
  ) => {
    if (!auth.session) {
      console.error("Not Logged In");
      return;
    }
    console.log(contentIds.current.has(newId));
    if (contentIds.current.has(newId)) {
      console.error("Duplicate Attempts Detected");
      return;
    }

    contentIds.current.add(newId);

    const generatingClass: ContentMeta = {
      id: newId,
      last_used_at: null,
      num_items: numQuestions,
      status: "generating",
      title: "Generating...",
      type: "quiz",
      difficulty: chosenGrade,
    };

    setLastUploaded((prev) => ({
      ...prev,
      [classId]: [files, input],
    }));

    setContentById((prev) => ({
      ...prev,
      [classId]: [generatingClass, ...(prev[classId] ?? [])],
    }));

    const params = {
      classId,
      quizId: newId,
      chosenGrade,
      files,
      input,
      numQuestions,
      genExample,
      token: auth.session?.access_token,
      setQuizMetaById,
      setContentById,
      setQuestionsById,
    };

    try {
      await addNewQuiz(params);
    } catch (e) {
      console.error("Error adding quiz");
    }
  };

  const value = useShallowMemo<ContentState>({
    contentById,
    contentLoadStatus,
    loadContent,
    callQuizContent,
    callDeleteQuiz,
    updateTitle,
    quizLoading,
    questionsById,
    quizMetaById,
    callAddNewQuiz,
    addAttempt,
    getPastAttempts,
    startPolling,
    lastUploaded,
  });

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
