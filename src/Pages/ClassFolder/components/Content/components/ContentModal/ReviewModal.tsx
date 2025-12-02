import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ContentModal.module.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction } from "react";

type ReviewModalProps = {
  contentId: string;
  setReviewActive: Dispatch<SetStateAction<boolean>>;
};

export const ReviewModal = ({ setReviewActive }: ReviewModalProps) => {
  return (
    <div>
      <div
        className={styles.modalBackground}
        onClick={() => setReviewActive(false)}
      ></div>

      <div className={styles.modalWrapper}>
        <div className={styles.outsideWrapper}>
          <div
            className={styles.exitBtn}
            onClick={() => setReviewActive(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
      </div>
    </div>
  );
};
