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
  const [questionsById, setQuestionsById] = useState<QuestionsById>({});
  const [quizMetaById, setQuizMetaById] = useState<QuizMetaById>({});
  const [quizLoading, setQuizLoading] = useState(false);
  const auth = useAuthContext();

  const loadContent = (classId: string) => {
    fetchContent(classId, setContentById, auth.session?.access_token);
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
      await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/quiz/${quizId}/attempt`,
        params,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.session?.access_token}`,
          },
        }
      );
    } catch (e) {
      throw new Error("Error adding new attempt data");
    }
  };

  const callAddNewQuiz = async (
    classId: string,
    chosenGrade: string,
    files: File[],
    input: string,
    numQuestions: number,
    genExample: boolean,
    setLoadingState: Dispatch<SetStateAction<string>>
  ) => {
    if (!auth.session) return;

    const params = {
      classId,
      chosenGrade,
      files,
      input,
      numQuestions,
      genExample,
      token: auth.session?.access_token,
      setLoadingState,
      setQuizMetaById,
      setContentById,
      setQuestionsById,
    };

    try {
      const res = await addNewQuiz(params);
      return res;
    } catch (e) {
      throw new Error("Error adding quiz");
    }
  };

  const value = useShallowMemo<ContentState>({
    contentById,
    loadContent,
    callQuizContent,
    callDeleteQuiz,
    updateTitle,
    quizLoading,
    questionsById,
    quizMetaById,
    callAddNewQuiz,
    addAttempt,
  });

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
