import React, { useEffect, useState } from "react";
import styles from "./QuizContent.module.scss";
import { Nav } from "../../components/Nav/Nav";
import { Quiz } from "./components/Quiz/Quiz";
import { Results } from "./components/Results/Results";

export type QuizMode = "answering" | "reviewing" | "results";

export const QuizContent = () => {
  const [mode, setMode] = useState<QuizMode>("answering");
  const [numCorrect, setNumCorrect] = useState(0);

  useEffect(() => {
    if (mode === "answering") setNumCorrect(0);
  }, [mode]);

  return (
    <div>
      <Nav />

      <div
        className={`${styles.quizWrapper} ${
          mode !== "results" && styles.active
        }`}
      >
        <Quiz mode={mode} setMode={setMode} setNumCorrect={setNumCorrect} />
      </div>
      {mode === "results" && (
        <Results setMode={setMode} numCorrect={numCorrect} />
      )}
    </div>
  );
};
