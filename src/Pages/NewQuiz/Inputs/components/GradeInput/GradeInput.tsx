import styles from "./GradeInput.module.scss";
import shared from "../../../shared/styles.module.scss";
import { Dispatch, SetStateAction, useState, type MouseEvent } from "react";
import { Difficulty } from "../../../../../context/DataContext/types";

type GradeInputProps = {
  setChosenGrade: Dispatch<SetStateAction<Difficulty>>;
  chosenGrade: Difficulty;
};

export const GradeInput = ({
  setChosenGrade,
  chosenGrade,
}: GradeInputProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClick = (e: MouseEvent<HTMLLIElement>) => {
    const value = e.currentTarget.dataset.value as Difficulty | undefined;
    if (value) {
      setChosenGrade(value);
    }
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className={shared.inputWrapper}>
      <p className={shared.inputLabel}>Grade:</p>
      <div className={styles.gradeInput}>
        <p
          className={styles.chosenGrade}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <span>{chosenGrade}</span> <span>&#8964;</span>
        </p>
        <ul
          className={`${styles.gradesWrapper} ${dropdownOpen && styles.active}`}
        >
          <li
            className={styles.grade}
            data-value="Select Grade"
            onClick={handleClick}
          >
            Select Grade
          </li>
          <li
            className={styles.grade}
            data-value="Elementary School"
            onClick={handleClick}
          >
            Elementary School
          </li>
          <li
            className={styles.grade}
            data-value="Middle School"
            onClick={handleClick}
          >
            Middle School
          </li>
          <li
            className={styles.grade}
            data-value="High School"
            onClick={handleClick}
          >
            High School
          </li>
          <li
            className={styles.grade}
            data-value="College/University"
            onClick={handleClick}
          >
            College/University
          </li>
          <li
            className={styles.grade}
            data-value="Postgrad"
            onClick={handleClick}
          >
            Postgrad
          </li>
        </ul>
      </div>
    </div>
  );
};
