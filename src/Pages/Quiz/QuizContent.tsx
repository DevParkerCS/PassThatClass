import React, { useEffect, useState } from "react";
import styles from "./QuizContent.module.scss";
import { Nav } from "../../components/Nav/Nav";
import { Quiz } from "./components/Quiz/Quiz";
import { Results } from "./components/Results/Results";
import { useParams } from "react-router-dom";

export type QuizMode = "answering" | "reviewing" | "results";

export const QuizContent = () => {
  const [mode, setMode] = useState<QuizMode>("answering");
  const [numCorrect, setNumCorrect] = useState(0);
  const { classId, quizId } = useParams<{ classId: string; quizId: string }>();

  useEffect(() => {
    if (mode === "answering") setNumCorrect(0);
  }, [mode]);

  if (!classId || !quizId) {
    return <div>Quiz Not Found</div>;
  }

  return (
    <div>
      <Nav />

      <div
        className={`${styles.quizWrapper} ${
          mode !== "results" && styles.active
        }`}
      >
        <Quiz
          mode={mode}
          setMode={setMode}
          setNumCorrect={setNumCorrect}
          id={quizId}
        />
      </div>
      {mode === "results" && (
        <Results
          setMode={setMode}
          numCorrect={numCorrect}
          classId={classId}
          quizId={quizId}
        />
      )}
    </div>
  );
};
