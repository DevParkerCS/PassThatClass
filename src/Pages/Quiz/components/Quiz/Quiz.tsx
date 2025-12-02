import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { QuizStatusBar } from "./components/QuizStatusBar/QuizStatusBar";
import { QuizQuestion } from "./components/QuizQuestion/QuizQuestion";
import { QuizButtons } from "./components/QuizButtons/QuizButtons";
import styles from "./Quiz.module.scss";
import shared from "../../Shared/styles.module.scss";
import { QuizMode } from "../../QuizContent";
import { QuizQuestionType } from "../../../../context/DataContext/types";

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
  const questionsRef = useRef<HTMLDivElement>(null);
  const [questionsHeight, setQuestionsHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (questionsRef.current) {
      setQuestionsHeight(questionsRef.current.clientHeight);
    }
  }, [questions.length, mode, qIndex]);

  console.log(questionsHeight);

  return (
    <div className={shared.contentWrapper}>
      <div className={styles.quizWrapper}>
        <QuizStatusBar qIndex={qIndex} questions={questions} />

        <div
          className={`${styles.quizContent} ${
            mode === "reviewing" ? styles.quizContentReviewing : ""
          }`}
        >
          {mode === "reviewing" && (
            <div
              className={styles.incorrectWrapper}
              style={{ maxHeight: `${questionsHeight}px` }}
            >
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

          <div className={styles.questionsWrapper} ref={questionsRef}>
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
