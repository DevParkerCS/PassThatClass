import { useNavigate } from "react-router-dom";
import styles from "./Content.module.scss";

type ContentType = {
  label: string;
  name: string;
  numAmount: number;
  daysSince: number;
};

export const Content = () => {
  const quizzes = [
    {
      label: "QUIZ",
      name: "Chapter 1: Introduction & Syllabus",
      numAmount: 10,
      daysSince: 2,
    },
    {
      label: "CARD",
      name: "Final Exam Prep: Mixed Topics",
      numAmount: 10,
      daysSince: 2,
    },
    {
      label: "CARD",
      name: "Final Exam Prep: Mixed Topics",
      numAmount: 10,
      daysSince: 2,
    },
    {
      label: "QUIZ",
      name: "Lecture 3: Sorting Algorithms",
      numAmount: 10,
      daysSince: 2,
    },
    {
      label: "QUIZ",
      name: "Midterm Review: Units 1–3",
      numAmount: 10,
      daysSince: 2,
    },
    {
      label: "CARD",
      name: "Lecture 3: Sorting Algorithms",
      numAmount: 10,
      daysSince: 2,
    },
    {
      label: "CARD",
      name: "Midterm Review: Units 1–3",
      numAmount: 10,
      daysSince: 2,
    },
    {
      label: "QUIZ",
      name: "Dynamic Programming Practice",
      numAmount: 10,
      daysSince: 2,
    },
    {
      label: "QUIZ",
      name: "Final Exam Prep: Mixed Topics",
      numAmount: 10,
      daysSince: 2,
    },
    {
      label: "CARD",
      name: "Chapter 1: Introduction & Syllabus",
      numAmount: 10,
      daysSince: 2,
    },
    {
      label: "CARD",
      name: "Dynamic Programming Practice",
      numAmount: 10,
      daysSince: 2,
    },
  ];

  return (
    <div className={styles.contentWrapper}>
      <div>
        <p className={styles.contentTitle}>{quizzes.length} Items</p>

        <div className={styles.itemsWrapper}>
          {quizzes.map((q, i) => (
            <ContentItem content={q} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

type ContentItemProps = {
  content: ContentType;
};

const ContentItem = ({ content }: ContentItemProps) => {
  const nav = useNavigate();

  return (
    <div className={styles.contentItem} onClick={() => nav("/quiz")}>
      <div className={styles.contentFlex}>
        <div className={styles.itemLabel}>{content.label}</div>
        <p className={styles.itemName}>{content.name}</p>
      </div>
      <div>
        <p className={styles.itemInfoTxt}>
          <span>{content.numAmount} Questions</span> &bull;{" "}
          <span>Last Used {content.daysSince} days ago</span>
        </p>
      </div>
    </div>
  );
};
