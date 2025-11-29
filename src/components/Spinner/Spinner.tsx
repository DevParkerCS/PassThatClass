import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Spinner.module.scss";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type SpinnerProps = {
  txt?: string;
  size: Size;
};

type Size = "l" | "m" | "s";

export const Spinner = ({ txt, size }: SpinnerProps) => {
  return (
    <div className={styles.wrapper}>
      <FontAwesomeIcon
        className={`${styles.spinner} ${styles[size]}`}
        icon={faSpinner}
      />
      <p className={styles.spinnerTxt}>{txt}</p>
    </div>
  );
};
