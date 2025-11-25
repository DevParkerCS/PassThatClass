import axios from "axios";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ClassUIType } from "../../Pages/Dashboard/Dashboard";
import {
  ClassesById,
  ContentById,
  DataProviderProps,
  DataState,
  QuestionsById,
  QuizMeta,
  QuizMetaById,
  QuizQuestionType,
} from "./types";
import { fetchClasses, fetchContent } from "./utils";

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
  const [classes, setClasses] = useState<ClassUIType[]>([]);
  const [classesById, setClassesById] = useState<ClassesById>({});
  const [contentById, setContentById] = useState<ContentById>({});
  const [questionsById, setQuestionsById] = useState<QuestionsById>({});
  const [quizMetaById, setQuizMetaById] = useState<QuizMetaById>({});

  useEffect(() => {
    fetchClasses(setClassesById, setClasses);
  }, []);

  const loadContent = (classId: string) => {
    fetchContent(classId, setContentById);
  };

  const fetchQuizContent = async (quizId: string) => {
    if (questionsById[quizId] && quizMetaById[quizId]) {
      return;
    }

    const res = await axios.get(
      `http://localhost:8000/quiz/questions/${quizId}`
    );
    const data: QuizContentFetch = res.data;
    setQuestionsById((prev) => ({ ...prev, [quizId]: data.questions }));
    setQuizMetaById((prev) => ({ ...prev, [quizId]: data.quizInfo }));
  };

  return (
    <DataContext.Provider
      value={{
        classes,
        setClasses,
        classesById,
        contentById,
        loadContent,
        fetchQuizContent,
        questionsById,
        quizMetaById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
