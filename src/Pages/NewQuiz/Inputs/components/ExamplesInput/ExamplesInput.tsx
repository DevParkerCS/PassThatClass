import { Dispatch, SetStateAction } from "react";
import shared from "../../../shared/styles.module.scss";
import styles from "./ExamplesInput.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

type ExamplesInputProps = {
  setGenExamples: Dispatch<SetStateAction<boolean>>;
  genExamples: boolean;
};

export const ExamplesInput = ({
  setGenExamples,
  genExamples,
}: ExamplesInputProps) => {
  return (
    <div className={shared.inputWrapper}>
      <label className={shared.inputLabel} htmlFor="gen-ex">
        Generate Example Problems?
      </label>
      <p className={shared.inputNote}>
        * This will allow questions to be generated outside of your exact notes
      </p>
      <div
        className={styles.checkbox}
        id="gen-ex"
        onClick={() => setGenExamples(!genExamples)}
      >
        <FontAwesomeIcon
          icon={faCheck}
          className={`${styles.checkboxIcon} ${genExamples && styles.active}`}
        />
      </div>
    </div>
  );
};
