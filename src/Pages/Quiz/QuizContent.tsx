import React, { useEffect, useRef, useState } from "react";
import styles from "./QuizContent.module.scss";
import { Nav } from "../../components/Nav/Nav";
import { Quiz } from "./components/Quiz/Quiz";
import { Results } from "./components/Results/Results";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import { useDataContext } from "../../context/DataContext/DataContext";
import { QuizQuestionType } from "../../context/DataContext/types";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";

export type QuizMode = "answering" | "reviewing" | "results";

export const QuizContent = () => {
  const [mode, setMode] = useState<QuizMode>("answering");
  const [numCorrect, setNumCorrect] = useState(0);
  const { classId, quizId } = useParams<{ classId: string; quizId: string }>();
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const quizzesFetched = useRef(false);
  const auth = useAuthContext();
  const data = useDataContext();
  const nav = useNavigate();

  useEffect(() => {
    if (!auth.loading && auth.session && !quizzesFetched.current && quizId) {
      quizzesFetched.current = true;
      data.fetchQuizContent(quizId);
    }
  }, [auth.loading, auth.session]);

  useEffect(() => {
    if (quizId && data.questionsById[quizId]) {
      setQuestions(data.questionsById[quizId]);
    }
  }, [data.questionsById]);

  useEffect(() => {
    if (mode === "answering") setNumCorrect(0);
  }, [mode]);

  useEffect(() => {
    if (!auth.loading && !auth.session) {
      nav("/login");
    }
  }, [auth.session, auth.loading]);

  if (!classId || !quizId) {
    return <div>Quiz Not Found</div>;
  }

  return (
    <div>
      <Nav />

      <div className={styles.contentWrapper}>
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb />
        </div>

        {!data.quizLoading && mode !== "results" && (
          <div className={`${styles.quizWrapper}`}>
            <Quiz
              mode={mode}
              setMode={setMode}
              setNumCorrect={setNumCorrect}
              questions={questions}
            />
          </div>
        )}
        {mode === "results" && (
          <Results
            setMode={setMode}
            numCorrect={numCorrect}
            classId={classId}
            quizId={quizId}
          />
        )}
      </div>
    </div>
  );
};
