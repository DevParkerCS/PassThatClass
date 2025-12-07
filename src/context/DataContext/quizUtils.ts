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

/* ------------ AddNewQuiz (streaming) ------------ */

export const addNewQuiz = async (params: {
  classId: string;
  chosenGrade: string;
  files: File[];
  input: string;
  numQuestions: number;
  genExample: boolean;
  token: string;
  setLoadingState: Dispatch<SetStateAction<string>>;
  setQuizMetaById: Dispatch<SetStateAction<QuizMetaById>>;
  setContentById: Dispatch<SetStateAction<ContentById>>;
  setQuestionsById: Dispatch<SetStateAction<QuestionsById>>;
}): Promise<QuizMeta> => {
  const {
    classId,
    chosenGrade,
    files,
    input,
    numQuestions,
    genExample,
    token,
    setLoadingState,
    setQuizMetaById,
    setContentById,
    setQuestionsById,
  } = params;

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
