import { useState } from "react";
import { QuizStatusBar } from "./components/QuizStatusBar/QuizStatusBar";
import { QuizQuestion } from "./components/QuizQuestion/QuizQuestion";
import { QuizButtons } from "./components/QuizButtons/QuizButtons";
import { MockQuiz } from "../../../../mock";
import styles from "./Quiz.module.scss";
import shared from "../../Shared/styles.module.scss";
import { QuizMode } from "../../QuizContent";

type QuizProps = {
  mode: QuizMode;
  setMode: React.Dispatch<React.SetStateAction<QuizMode>>;
  setNumCorrect: React.Dispatch<React.SetStateAction<number>>;
};

export const Quiz = ({ mode, setMode, setNumCorrect }: QuizProps) => {
  const [qIndex, setQIndex] = useState(0);
  const [canGoNext, setCanGoNext] = useState(false);
  const [isReviewing, setisReviewing] = useState(false);

  return (
    <div className={shared.contentWrapper}>
      <h2 className={shared.quizTitle}>Quiz: Test Quiz</h2>

      <div className={styles.quizWrapper}>
        <QuizStatusBar qIndex={qIndex} />

        {MockQuiz.map((q, i) => {
          return (
            <QuizQuestion
              key={q.id}
              question={q}
              index={i}
              qIndex={qIndex}
              setCanGoNext={setCanGoNext}
              mode={mode}
              setNumCorrect={setNumCorrect}
            />
          );
        })}

        <QuizButtons
          qIndex={qIndex}
          setQIndex={setQIndex}
          canGoNext={canGoNext}
          setCanGoNext={setCanGoNext}
          mode={mode}
          setMode={setMode}
        />
      </div>
    </div>
  );
};
