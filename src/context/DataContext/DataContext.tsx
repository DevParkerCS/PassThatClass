import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
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
import { useAuthContext } from "../AuthContext/AuthContext";
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
  const classesFetched = useRef(false);
  const auth = useAuthContext();

  useEffect(() => {
    if (!auth.loading && auth.session && !classesFetched.current) {
      classesFetched.current = true;
      fetchClasses(setClassesById, setClasses, auth.session?.access_token);
    }
  }, [auth.loading, auth.session]);

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
    console.log(quizId);
    console.log(questionsById[quizId]);
    console.log(quizMetaById[quizId]);
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
  }): Promise<QuizMeta> => {
    const { classId, chosenGrade, files, input, numQuestions, genExample } =
      params;

    if (!auth.session) {
      throw new Error("No active session");
    }

    const token = auth.session.access_token;

    // ---------- 1) OCR STEP ----------
    const ocrFormData = new FormData();
    ocrFormData.append("notesText", input);

    files.forEach((file) => {
      ocrFormData.append("images", file);
    });

    const ocrRes = await axios.post(
      `${process.env.REACT_APP_BACKEND_API}/quiz/from-notes/ocr`,
      ocrFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { combinedNotes } = ocrRes.data as {
      combinedNotes: string;
      typedNotes: string;
      ocrText: string;
    };

    // ---------- 2) QUIZ GENERATION STEP ----------
    const generateRes = await axios.post(
      `${process.env.REACT_APP_BACKEND_API}/quiz/from-notes`,
      {
        notesText: combinedNotes,
        gradeLevel: chosenGrade,
        numQuestions,
        classId,
        genExample,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = generateRes.data;
    const quizData: QuizMeta = data.quiz;
    const questions: QuizQuestionType[] = data.questions;

    const contentMeta: ContentMeta = {
      id: quizData.id,
      last_used_at: quizData.last_taken_at,
      num_items: `${quizData.num_questions} Questions`,
      title: quizData.title,
      type: "quiz",
    };

    // ---- update local state caches ----
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
    questionsById,
    quizMetaById,
    AddClass,
    AddNewQuiz,
  });

  return (
    <DataContext.Provider value={dataMemo}>{children}</DataContext.Provider>
  );
};
