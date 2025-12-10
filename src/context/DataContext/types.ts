import { Dispatch, ReactNode, SetStateAction } from "react";

export type ClassesState = {
  classes: ClassMeta[];
  classesById: ClassesById;
  callClasses: () => void;
  AddClass: (name: string) => Promise<void>;
  classesLoading: boolean;
  classesError: string;
  editClass: (classId: string, newTitle: string) => Promise<void>;
  deleteClass: (classId: string) => Promise<void>;
};

export type ContentState = {
  contentById: ContentById;
  loadContent: (classId: string) => Promise<void>;
  callQuizContent: (quizId: string) => Promise<void>;
  callDeleteQuiz: (quizId: string, classId: string) => Promise<void>;
  quizLoading: boolean;
  questionsById: QuestionsById;
  quizMetaById: QuizMetaById;
  callAddNewQuiz: (
    newId: string,
    existingQuiz: boolean,
    classId: string,
    chosenGrade: Difficulty,
    files: File[],
    input: string,
    numQuestions: number,
    genExample: boolean
  ) => Promise<void>;
  updateTitle: (
    quizId: string,
    classId: string,
    title: string
  ) => Promise<void>;
  addAttempt: (
    numCorrect: number,
    seconds: number,
    incorrectIndexes: number[],
    quizId: string
  ) => void;
  getPastAttempts: (quizId: string) => Promise<QuizAttempts>;
  startPolling: (classId: string) => void;
  lastUploaded: LastUploaded;
  contentLoadStatus: Record<string, boolean>;
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
  num_items: number;
  last_used_at: string | null;
  created_at: string;
  status: Status;
  difficulty: Difficulty;
};

export type Status = "generating" | "ready" | "error";

export type Difficulty =
  | "Elementary School"
  | "Middle School"
  | "High School"
  | "College/University"
  | "Postgrad"
  | "Select Grade";

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
  difficulty: Difficulty;
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

export type QuizAttemptType = {
  id: string;
  quiz_id: string;
  num_correct: number;
  incorrect_indexes: number[];
  seconds: number;
  completed_at: string;
};

export type QuizAttempts = QuizAttemptType[];

export type ClassesById = Record<string, ClassMeta>;
export type ContentById = Record<string, ContentMeta[]>;
export type QuestionsById = Record<string, QuizQuestionType[]>;
export type QuizMetaById = Record<string, QuizMeta>;
export type QuizAttemptsById = Record<string, QuizAttempts>;
export type LastUploaded = Record<string, [File[], string]>;
