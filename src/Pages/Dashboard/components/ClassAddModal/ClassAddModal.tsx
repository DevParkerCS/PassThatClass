import { Dispatch, SetStateAction, useState } from "react";
import styles from "./ClassAddModal.module.scss";

type ClassAddModalProps = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  cb: (name: string) => void;
};

export const ClassAddModal = ({ setModalOpen, cb }: ClassAddModalProps) => {
  const [input, setInput] = useState("");

  return (
    <div className={styles.container}>
      <div
        className={styles.modalBackground}
        onClick={() => setModalOpen(false)}
      ></div>

      <div className={styles.modalWrapper}>
        <p className={styles.modalTitle}>Add New Class</p>

        <div className={styles.modalInputWrapper}>
          <label className={styles.inputLabel}>Class Name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g., Biology 201"
            onChange={(e) => setInput(e.target.value)}
            onSubmit={() => cb(input)}
          />
        </div>

        <div className={styles.modalBtns}>
          <button
            className={`${styles.modalBtn} ${styles.cancelBtn}`}
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className={`${styles.modalBtn} ${styles.addBtn}`}
            onClick={() => cb(input)}
          >
            Add Class
          </button>
        </div>
      </div>
    </div>
  );
};
