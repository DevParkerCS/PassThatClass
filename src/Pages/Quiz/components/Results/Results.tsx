import { QuizMode } from "../../QuizContent";
import styles from "./Results.module.scss";
import shared from "../../Shared/styles.module.scss";
import { ResultsCircle } from "./components/ResultsCircle/ResultsCircle";
import { ResultButtons } from "./components/ResultButtons/ResultButtons";
import { useRef } from "react";

type ResultsProps = {
  setMode: React.Dispatch<React.SetStateAction<QuizMode>>;
  numCorrect: number;
  quizId: string;
  classId: string;
  time: number;
  quizLength: number;
};

export const formatTime = (seconds: number) => {
  const timeMins = Math.floor(seconds / 60);
  const timeSecs = seconds % 60;

  return `${timeMins}m ${timeSecs}s`;
};

export function getScoreMessage(scorePercent: number): string {
  const messages = {
    perfect: [
      "Flawless work. You crushed this!",
      "A perfect run. Nicely done!",
      "You nailed every question.",
      "Top score. Really impressive!",
      "Nothing to improve here. Great job!",
    ],
    great: [
      "Nice work. You crushed this!",
      "You really know this material.",
      "Strong performance. Keep it up!",
      "Great job. You are dialed in.",
      "You are clearly prepared for this.",
    ],
    good: [
      "Solid effort. You are close.",
      "Nice work. A bit more review and you will ace it.",
      "You have the core ideas down.",
      "Good job. Tighten a few weak spots.",
      "You are on the right track.",
    ],
    ok: [
      "Decent attempt. Time for a quick review.",
      "You are partway there. A bit more practice will help.",
      "Not bad. Use this to see what to study.",
      "You have some of it. Fill in the gaps next.",
      "Good start. Try another quiz after reviewing.",
    ],
    low: [
      "Tough round, but a useful starting point.",
      "This shows you what to focus on next.",
      "Do a quick review, then take another shot.",
      "This score is a roadmap, not a verdict.",
    ],
  } as const;

  const pickRandom = (arr: readonly string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  if (scorePercent >= 95) {
    return pickRandom(messages.perfect);
  } else if (scorePercent >= 85) {
    return pickRandom(messages.great);
  } else if (scorePercent >= 70) {
    return pickRandom(messages.good);
  } else if (scorePercent >= 50) {
    return pickRandom(messages.ok);
  } else {
    return pickRandom(messages.low);
  }
}

export const Results = ({
  setMode,
  numCorrect,
  classId,
  quizId,
  time,
  quizLength,
}: ResultsProps) => {
  const scoreMsg = useRef(getScoreMessage(numCorrect / quizLength));

  return (
    <div className={shared.contentWrapper} style={{ width: "fit-content" }}>
      <div>
        <h2 className={shared.quizTitle}>Quiz Results</h2>
        <p className={styles.resultTxt}>{scoreMsg.current}</p>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.resultsWrapper}>
          <ResultsCircle numCorrect={numCorrect} length={quizLength} />

          <div>
            <p className={styles.infoTitle}>Performance Summary</p>

            <div className={styles.infoTxtsWrapper}>
              <div className={styles.infoTxtWrapper}>
                <p className={styles.infoTxt}>Time</p>
                <p className={`${styles.infoTxt} ${styles.infoValue}`}>
                  {formatTime(time)}
                </p>
              </div>
              <div className={styles.infoTxtWrapper}>
                <p className={styles.infoTxt}>Avg / Question</p>
                <p className={`${styles.infoTxt} ${styles.infoValue}`}>
                  {formatTime(Math.ceil(time / quizLength))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ResultButtons setMode={setMode} quizId={quizId} classId={classId} />
      </div>
    </div>
  );
};
