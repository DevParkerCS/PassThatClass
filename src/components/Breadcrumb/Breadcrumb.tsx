import { useNavigate } from "react-router-dom";
import styles from "./Breadcrumb.module.scss";

export const Breadcrumb = () => {
  const nav = useNavigate();

  return (
    <span className={styles.breadcrumb}>
      <p
        className={`${styles.breadcrumbItem} ${styles.breadcrumbClickable}`}
        onClick={() => nav("/dashboard")}
      >
        Dashboard
      </p>
      <p className={`${styles.breadcrumbItem}`}>{">"}</p>
      <p className={`${styles.breadcrumbItem}`}>Biology 201</p>
    </span>
  );
};
