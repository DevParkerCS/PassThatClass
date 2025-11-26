import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Spinner.module.scss";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type SpinnerProps = {
  txt?: string;
};

export const Spinner = ({ txt }: SpinnerProps) => {
  return (
    <div className={styles.wrapper}>
      <FontAwesomeIcon className={styles.spinner} icon={faSpinner} />
      <p className={styles.spinnerTxt}>{txt}</p>
    </div>
  );
};
