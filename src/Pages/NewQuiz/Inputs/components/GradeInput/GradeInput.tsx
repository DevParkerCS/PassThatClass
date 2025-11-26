import styles from "./GradeInput.module.scss";
import shared from "../../../shared/styles.module.scss";
import { Dispatch, SetStateAction, useState } from "react";

type GradeInputProps = {
  setChosenGrade: Dispatch<SetStateAction<string>>;
  chosenGrade: string;
};

export const GradeInput = ({
  setChosenGrade,
  chosenGrade,
}: GradeInputProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const text = e.currentTarget.textContent;
    if (text) setChosenGrade(text);

    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={shared.inputWrapper}>
      <p className={shared.inputLabel}>Grade:</p>
      <div className={styles.gradeInput}>
        <p
          className={styles.chosenGrade}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{chosenGrade}</span> <span>&#8964;</span>
        </p>
        <ul
          className={`${styles.gradesWrapper} ${dropdownOpen && styles.active}`}
        >
          <li className={styles.grade} onClick={handleClick}>
            Select Grade
          </li>
          <li className={styles.grade} onClick={handleClick}>
            Elementary School
          </li>
          <li className={styles.grade} onClick={handleClick}>
            Middle School
          </li>
          <li className={styles.grade} onClick={handleClick}>
            High School
          </li>
          <li className={styles.grade} onClick={handleClick}>
            College/University
          </li>
          <li className={styles.grade} onClick={handleClick}>
            Postgrad
          </li>
        </ul>
      </div>
    </div>
  );
};
