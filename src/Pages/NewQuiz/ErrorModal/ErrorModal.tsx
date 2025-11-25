import { useEffect, useState } from "react";
import styles from "./ErrorModal.module.scss";

type ErrorModalProps = {
  error: string;
  isActive: boolean;
};

export const ErrorModal = ({ error, isActive }: ErrorModalProps) => {
  const [errorTxt, setErrorTxt] = useState(error);

  useEffect(() => {
    if (error) {
      setErrorTxt(error);
    }
  }, [error]);

  return (
    <div className={`${styles.errorWrapper} ${isActive && styles.active}`}>
      <p className={styles.errorTxt}>{errorTxt}</p>
    </div>
  );
};
