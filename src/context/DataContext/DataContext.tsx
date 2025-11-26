import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    fetchClasses(setClassesById, setClasses);
  }, []);

  const AddClass = async (name: string) => {
    try {
      const res = await axios.post("http://localhost:8000/classes", { name });
      const classData: ClassMeta = res.data;

      setClasses((prev) => [...prev, classData]);
      setClassesById((prev) => ({ ...prev, [classData.id]: classData }));
    } catch (e) {
      throw new Error("Error Adding New Class");
    }
  };

  const loadContent = (classId: string) => {
    fetchContent(classId, setContentById);
  };

  const fetchQuizContent = async (quizId: string) => {
    console.log(quizId);
    console.log(questionsById[quizId]);
    console.log(quizMetaById[quizId]);
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

  const AddNewQuiz = async (formData: FormData, classId: string) => {
    const res = await axios.post(
      "http://localhost:8000/quiz/from-notes",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const data = res.data;
    const quizData: QuizMeta = data.quiz;
    const questions: QuizQuestionType[] = data.questions;

    const contentMeta: ContentMeta = {
      id: quizData.id,
      last_used_at: quizData.last_taken_at,
      num_items: `${quizData.num_questions} Questions`,
      title: quizData.title,
      type: "quiz",
    };

    setQuizMetaById((prev) => ({
      ...prev,
      [quizData.id]: quizData, // also use quizData.id, not data.id
    }));

    setContentById((prev) => ({
      ...prev,
      [classId]: [contentMeta, ...(prev[classId] ?? [])],
    }));

    setQuestionsById((prev) => ({
      ...prev,
      [quizData.id]: questions,
    }));
    console.log(quizData.id);

    return quizData;
  };

  return (
    <DataContext.Provider
      value={{
        classes,
        classesById,
        contentById,
        loadContent,
        fetchQuizContent,
        questionsById,
        quizMetaById,
        AddClass,
        AddNewQuiz,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
