import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Ctas.module.scss";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

type CtasProps = {
  id: string;
};

export const Ctas = ({ id }: CtasProps) => {
  const nav = useNavigate();

  return (
    <div className={styles.ctasWrapper}>
      <button
        className={styles.newCta}
        onClick={() => nav(`/class/${id}/newQuiz`)}
      >
        <FontAwesomeIcon icon={faPlus} className={styles.ctaIcon} />
        <p className={styles.ctaTxt}>New Quiz</p>
      </button>
    </div>
  );
};
