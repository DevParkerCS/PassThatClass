import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Ctas.module.scss";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useClassesContext } from "../../../../context/DataContext/ClassesContext";

type CtasProps = {
  classId: string;
};

export const Ctas = ({ classId }: CtasProps) => {
  const nav = useNavigate();
  const classesCtx = useClassesContext();

  return (
    <div className={styles.ctasWrapper}>
      <button
        className={styles.newCta}
        onClick={() =>
          nav(`/quiz/${classesCtx.classesById[classId].name}/${classId}/new`)
        }
      >
        <FontAwesomeIcon icon={faPlus} className={styles.ctaIcon} />
        <p className={styles.ctaTxt}>New Quiz</p>
      </button>
    </div>
  );
};
