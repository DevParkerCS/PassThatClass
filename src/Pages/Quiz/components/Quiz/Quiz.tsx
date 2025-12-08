import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { QuizStatusBar } from "./components/QuizStatusBar/QuizStatusBar";
import { QuizQuestion } from "./components/QuizQuestion/QuizQuestion";
import { QuizButtons } from "./components/QuizButtons/QuizButtons";
import styles from "./Quiz.module.scss";
import { QuizMode } from "../../QuizContent";
import { QuizQuestionType } from "../../../../context/DataContext/types";
import { Spinner } from "../../../../components/Spinner/Spinner";
import { useSearchParams } from "react-router-dom";
import { useContentContext } from "../../../../context/DataContext/ContentContext";

type QuizProps = {
  mode: QuizMode;
  setMode: React.Dispatch<React.SetStateAction<QuizMode>>;
  setNumCorrect: React.Dispatch<React.SetStateAction<number>>;
  questions: QuizQuestionType[];
  numCorrect: number;
  quizId: string;
  startTime: React.RefObject<number>;
  setTimeSeconds: React.Dispatch<React.SetStateAction<number>>;
};

type Params = {
  mode: string;
  attemptIndex: number;
};

export const Quiz = ({
  mode,
  setMode,
  setNumCorrect,
  questions,
  numCorrect,
  startTime,
  setTimeSeconds,
  quizId,
}: QuizProps) => {
  const [qIndex, setQIndex] = useState(0);
  const [canGoNext, setCanGoNext] = useState(false);
  const [incorrectIndexes, setIncorrectIndexes] = useState<number[]>([]);
  const questionsRef = useRef<HTMLDivElement>(null);
  const [questionsHeight, setQuestionsHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const contentCtx = useContentContext();

  useEffect(() => {
    const queryMode = searchParams.get("mode");
    const queryIndex = searchParams.get("attemptIndex");

    if (!queryMode || !queryIndex) return;

    loadReviewData(queryIndex);
  }, []);

  const loadReviewData = async (queryIndex: string) => {
    setLoading(true);
    try {
      const attempts = await contentCtx.getPastAttempts(quizId);
      const index = parseInt(queryIndex);
      const attempt = attempts[index];
      setNumCorrect(attempt.num_correct);
      setIncorrectIndexes(attempt.incorrect_indexes);
      setTimeSeconds(attempt.seconds);
      setMode("reviewing");
      setLoading(false);
    } catch (e) {
      console.log("error");
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (questionsRef.current) {
      setQuestionsHeight(questionsRef.current.clientHeight);
    }
  }, [questions.length, mode, qIndex]);

  return (
    <div className={styles.quizWrapper}>
      {loading ? (
        <Spinner size="l" />
      ) : (
        <div>
          <QuizStatusBar qIndex={qIndex} questions={questions} />

          <div
            className={`${styles.quizContent} ${
              mode === "reviewing" ? styles.quizContentReviewing : ""
            }`}
          >
            {mode === "reviewing" && (
              <div
                className={styles.incorrectWrapper}
                style={{ maxHeight: questionsHeight ?? undefined }}
              >
                <p className={styles.incorrectTitle}>Incorrect Questions</p>

                <div className={styles.incorrectItems}>
                  {incorrectIndexes.map((w) => (
                    <div
                      key={w}
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
              {questions.map((q, i) => (
                <QuizQuestion
                  key={q.id}
                  question={q}
                  index={i}
                  qIndex={qIndex}
                  setCanGoNext={setCanGoNext}
                  mode={mode}
                  setNumCorrect={setNumCorrect}
                  setIncorrectIndexes={setIncorrectIndexes}
                />
              ))}
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
            numCorrect={numCorrect}
            setTimeSeconds={setTimeSeconds}
            startTime={startTime}
            quizId={quizId}
            incorrectIndexes={incorrectIndexes}
          />
        </div>
      )}
    </div>
  );
};
