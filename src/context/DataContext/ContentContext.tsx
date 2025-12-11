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
  Status,
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

  const STALE_GENERATION_MS = 5 * 60 * 1000; // 5 minutes

  const hasGenerating = (classId: string) => {
    const content = contentRef.current;
    const items = content[classId];
    if (!items) return false;

    const now = Date.now();
    let changed = false;

    const updatedItems = items.map((c) => {
      if (c.status === "error") {
        contentIds.current.delete(c.id);
      }
      if (c.status !== "generating") return c;

      // If you don't have created_at yet, add it to ContentMeta & fetch it from Supabase
      if (!c.created_at) {
        // no timestamp → just treat as still generating
        return c;
      }

      const createdTime = new Date(c.created_at).getTime();
      const age = now - createdTime;

      if (age > STALE_GENERATION_MS) {
        // mark as failed
        contentIds.current.delete(c.id);
        changed = true;
        const errorState: Status = "error";
        axios.patch(
          `${process.env.REACT_APP_BACKEND_API}/quiz/${c.id}/setError`,
          {},
          {
            headers: {
              Authorization: auth.session?.access_token
                ? `Bearer ${auth.session.access_token}`
                : "",
            },
          }
        );
        return {
          ...c,
          status: errorState,
          title: "Error Generating",
        };
      }

      // still within 5 minutes → keep as generating
      return c;
    });

    // If we converted anything to error, push the updated array back into state
    if (changed) {
      setContentById((prev) => ({
        ...prev,
        [classId]: updatedItems,
      }));
    }

    // Only report "has generating" for non-stale ones
    return updatedItems.some((c) => c.status === "generating");
  };

  const resetContentState = () => {
    setContentById({});
    setContentLoadStatus({});
    setQuestionsById({});
    setQuizMetaById({});
    setAttemptsById({});
    setQuizLoading(false);
    setLastUploaded({});

    contentRef.current = {};
    contentIds.current = new Set<string>();
  };

  useEffect(() => {
    if (!auth.session) {
      resetContentState();
    }
  }, [auth.session]);

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
    existingQuiz: boolean,
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

    if (contentIds.current.has(newId)) {
      console.error("Duplicate Attempts Detected");
      return;
    }

    contentIds.current.add(newId);

    if (!existingQuiz) {
      const generatingClass: ContentMeta = {
        id: newId,
        created_at: new Date().toISOString(),
        last_used_at: null,
        num_items: numQuestions,
        status: "generating",
        title: "Generating...",
        type: "quiz",
        difficulty: chosenGrade,
      };

      setContentById((prev) => ({
        ...prev,
        [classId]: [generatingClass, ...(prev[classId] ?? [])],
      }));
    } else {
      setContentById((prev) => ({
        ...prev,
        [classId]: prev[classId]?.map((p) => {
          if (p.id === newId) {
            console.log(p);
            p = {
              ...p,
              created_at: new Date().toISOString(),
              num_items: numQuestions,
              title: "Generating...",
              status: "generating",
            };
          }
          return p;
        }),
      }));
    }

    setLastUploaded((prev) => ({
      ...prev,
      [classId]: [files, input],
    }));

    const params = {
      classId,
      existingQuiz,
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
      auth.decrementGenerations();
      await addNewQuiz(params);
    } catch (e) {
      auth.incrementGenerations();
      contentIds.current.delete(newId);
      console.error(e);
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
    resetContentState,
  });

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
