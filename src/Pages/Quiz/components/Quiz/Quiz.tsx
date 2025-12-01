import { useEffect, useRef, useState } from "react";
import { QuizStatusBar } from "./components/QuizStatusBar/QuizStatusBar";
import { QuizQuestion } from "./components/QuizQuestion/QuizQuestion";
import { QuizButtons } from "./components/QuizButtons/QuizButtons";
import styles from "./Quiz.module.scss";
import shared from "../../Shared/styles.module.scss";
import { QuizMode } from "../../QuizContent";
import { Breadcrumb } from "../../../../components/Breadcrumb/Breadcrumb";
import { useDataContext } from "../../../../context/DataContext/DataContext";
import { useParams } from "react-router-dom";
import { QuizQuestionType } from "../../../../context/DataContext/types";
import { useAuthContext } from "../../../../context/AuthContext/AuthContext";

type QuizProps = {
  mode: QuizMode;
  setMode: React.Dispatch<React.SetStateAction<QuizMode>>;
  setNumCorrect: React.Dispatch<React.SetStateAction<number>>;
  questions: QuizQuestionType[];
};

export const Quiz = ({
  mode,
  setMode,
  setNumCorrect,
  questions,
}: QuizProps) => {
  const [qIndex, setQIndex] = useState(0);
  const [canGoNext, setCanGoNext] = useState(false);
  const [wrongIndexes, setWrongIndexes] = useState<number[]>([]);
  const auth = useAuthContext();

  const data = useDataContext();

  return (
    <div className={shared.contentWrapper}>
      <div className={styles.quizWrapper}>
        <QuizStatusBar qIndex={qIndex} questions={questions} />

        <div className={styles.quizContent}>
          {mode === "reviewing" && (
            <div className={styles.incorrectWrapper}>
              <p className={styles.incorrectTitle}>Incorrect Questions</p>

              <div className={styles.incorrectItems}>
                {wrongIndexes.map((w) => (
                  <div
                    className={styles.incorrectItem}
                    onClick={() => setQIndex(w)}
                  >
                    <p>Question {w + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {questions.map((q, i) => {
            return (
              <QuizQuestion
                key={q.id}
                question={q}
                index={i}
                qIndex={qIndex}
                setCanGoNext={setCanGoNext}
                mode={mode}
                setNumCorrect={setNumCorrect}
                setWrongIndexes={setWrongIndexes}
              />
            );
          })}
        </div>

        <QuizButtons
          qIndex={qIndex}
          setQIndex={setQIndex}
          canGoNext={canGoNext}
          setCanGoNext={setCanGoNext}
          mode={mode}
          setMode={setMode}
          questions={questions}
        />
      </div>
    </div>
  );
};
