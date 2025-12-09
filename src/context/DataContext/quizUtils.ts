// quizUtils.ts
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

import {
  ContentById,
  QuestionsById,
  QuizMetaById,
  QuizMeta,
  QuizQuestionType,
  ContentMeta,
} from "./types"; // adjust import paths
import { fetchContent } from "./utils"; // wherever this lives

/* ------------ loadContent ------------ */

export const loadContent = (params: {
  classId: string;
  token?: string;
  setContentById: Dispatch<SetStateAction<ContentById>>;
}) => {
  const { classId, token, setContentById } = params;
  fetchContent(classId, setContentById, token);
};

export const fetchQuizContent = async (params: {
  quizId: string;
  token?: string;
  questionsById: QuestionsById;
  quizMetaById: QuizMetaById;
  setQuizLoading: Dispatch<SetStateAction<boolean>>;
  setQuestionsById: Dispatch<SetStateAction<QuestionsById>>;
  setQuizMetaById: Dispatch<SetStateAction<QuizMetaById>>;
}) => {
  const {
    quizId,
    token,
    questionsById,
    quizMetaById,
    setQuizLoading,
    setQuestionsById,
    setQuizMetaById,
  } = params;

  // Already have it cached
  if (questionsById[quizId] && quizMetaById[quizId]) {
    return;
  }

  try {
    setQuizLoading(true);

    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_API}/quiz/questions/${quizId}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    setQuizLoading(false);

    const data = res.data;

    setQuestionsById((prev) => ({ ...prev, [quizId]: data.questions }));
    setQuizMetaById((prev) => ({ ...prev, [quizId]: data.quizInfo }));
  } catch (e) {
    setQuizLoading(false);
    throw e;
  }
};

/* ------------ deleteQuiz ------------ */

export const deleteQuiz = async (params: {
  quizId: string;
  classId: string;
  token?: string;
  setQuizMetaById: Dispatch<SetStateAction<QuizMetaById>>;
  setQuestionsById: Dispatch<SetStateAction<QuestionsById>>;
  setContentById: Dispatch<SetStateAction<ContentById>>;
}) => {
  const {
    quizId,
    classId,
    token,
    setQuizMetaById,
    setQuestionsById,
    setContentById,
  } = params;

  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_API}/quiz/${quizId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

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

export const addNewQuiz = async (params: {
  classId: string;
  quizId: string;
  chosenGrade: string;
  files: File[];
  input: string;
  numQuestions: number;
  genExample: boolean;
  token: string;
  setQuizMetaById: Dispatch<SetStateAction<QuizMetaById>>;
  setContentById: Dispatch<SetStateAction<ContentById>>;
  setQuestionsById: Dispatch<SetStateAction<QuestionsById>>;
}): Promise<void> => {
  const {
    classId,
    quizId,
    chosenGrade,
    files,
    input,
    numQuestions,
    genExample,
    token,
    setQuizMetaById,
    setContentById,
    setQuestionsById,
  } = params;

  const formData = new FormData();
  formData.append("newQuizId", quizId);
  formData.append("notesText", input);
  formData.append("gradeLevel", chosenGrade);
  formData.append("numQuestions", String(numQuestions));
  formData.append("classId", classId);
  formData.append("genExample", String(genExample));

  files.forEach((file) => {
    formData.append("images", file);
  });

  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/quiz/from-notes`,
    formData,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
