import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ContentModal.module.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction } from "react";
import { ActiveModal } from "../../Content";

type ReviewModalProps = {
  contentId: string;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
};

export const ReviewModal = ({ setActiveModal }: ReviewModalProps) => {
  return (
    <div>
      <div
        className={styles.modalBackground}
        onClick={() => setActiveModal("content")}
      ></div>

      <div className={styles.modalWrapper}>
        <div className={styles.outsideWrapper}>
          <div
            className={styles.exitBtn}
            onClick={() => setActiveModal("content")}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
      </div>
    </div>
  );
};
