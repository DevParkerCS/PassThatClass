import { Dispatch, ReactNode, SetStateAction } from "react";

export type DataState = {
  classes: ClassMeta[];
  classesById: ClassesById;
  contentById: ContentById;
  loadContent: (classId: string) => void;
  fetchQuizContent: (quizId: string) => Promise<void>;
  AddClass: (name: string) => Promise<void>;
  questionsById: QuestionsById;
  quizMetaById: QuizMetaById;
  AddNewQuiz: (params: {
    classId: string;
    chosenGrade: string;
    files: File[];
    input: string;
    numQuestions: number;
    genExample: boolean;
  }) => Promise<QuizMeta>;
};

export type DataProviderProps = {
  children: ReactNode;
};

export type ClassMeta = {
  id: string;
  name: string;
  created_at: Date;
};

export type ContentMeta = {
  id: string;
  type: string;
  title: string;
  num_items: string;
  last_used_at: string | null;
};

export type QuizMeta = {
  id: string;
  class_id: string;
  attempts_count: number;
  average_score: number;
  average_time_seconds: number;
  highest_score: number;
  last_taken_at: string | null;
  num_questions: number;
  title: string;
};

export type QuizQuestionType = {
  id: string;
  type: string;
  question: string;
  options: QuizAnswerType[];
  explanation: string;
  correct_index: number;
  created_at: string;
};

export type QuizAnswerType = {
  id: string;
  text: string;
};

export type ClassesById = Record<string, ClassMeta>;
export type ContentById = Record<string, ContentMeta[]>;
export type QuestionsById = Record<string, QuizQuestionType[]>;
export type QuizMetaById = Record<string, QuizMeta>;
