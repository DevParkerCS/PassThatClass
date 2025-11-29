import styles from "./NumInput.module.scss";
import shared from "../../../shared/styles.module.scss";
import { Dispatch, SetStateAction } from "react";

type NumInputProps = {
  setNumQuestions: Dispatch<SetStateAction<number>>;
  numQuestions: number;
};

export const NumInput = ({ numQuestions, setNumQuestions }: NumInputProps) => {
  return (
    <div className={shared.inputWrapper}>
      <label className={shared.inputLabel} htmlFor="num-questions">
        Number of Questions: {numQuestions}
      </label>
      <p className={shared.inputNote}>
        * We Will Generate Up To this amount but may be less depending on notes
      </p>
      <input
        className={styles.numInput}
        id="num-questions"
        type="range"
        min={5}
        max={50}
        value={numQuestions}
        onChange={(e) => setNumQuestions(parseInt(e.target.value))}
      />
    </div>
  );
};
