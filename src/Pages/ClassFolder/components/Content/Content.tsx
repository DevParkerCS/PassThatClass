import { useNavigate } from "react-router-dom";
import styles from "./Content.module.scss";
import { useEffect, useState } from "react";
import { ContentItem } from "./components/contentItem/ContentItem";
import { ContentModal } from "../ContentModal/ContentModal";
import { MockQuiz } from "../../../../mock";

const quizzes = [
  {
    label: "QUIZ",
    name: "Chapter 1: Introduction & Syllabus",
    numAmount: 10,
    daysSince: 3,
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
  {
    label: "QUIZ",
    name: "Chapter 1: Introduction & Syllabus",
    numAmount: 10,
    daysSince: 3,
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
    name: "Final Exam Prep: Mixed Topics fadfljfdalkfklaklflkadfk  la lfda",
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

type FilterType = "all" | "quiz" | "card";

export const Content = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [filtered, setFiltered] = useState(quizzes);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    if (modalActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalActive]);

  useEffect(() => {
    if (filter === "all") {
      setFiltered(quizzes);
      return;
    }
    setFiltered(
      quizzes.filter((p) => {
        return p.label === (filter === "card" ? "CARD" : "QUIZ");
      })
    );
  }, [filter]);

  return (
    <div
      className={`${styles.contentWrapper} ${
        modalActive && styles.modalActive
      }`}
    >
      {modalActive && (
        <ContentModal
          ModalContent={MockQuiz}
          ModalInfo={quizzes[0]}
          setModalActive={setModalActive}
        />
      )}

      <div>
        <div className={styles.contentTxtWrapper}>
          <p className={styles.contentTitle}>{filtered.length} Items</p>
          <p
            className={`${styles.contentFilter} ${
              filter === "all" && styles.active
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </p>
          <p
            className={`${styles.contentFilter} ${
              filter === "quiz" && styles.active
            }`}
            onClick={() => setFilter("quiz")}
          >
            Quizzes
          </p>
          <p
            className={`${styles.contentFilter} ${
              filter === "card" && styles.active
            }`}
            onClick={() => setFilter("card")}
          >
            Cards
          </p>
        </div>

        <div className={styles.itemsOuter}>
          <div className={styles.itemsWrapper}>
            {filtered.map((q, i) => (
              <ContentItem
                content={q}
                setModalActive={setModalActive}
                key={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
