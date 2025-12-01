import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import styles from "./ClassAddModal.module.scss";
import { Spinner } from "../../../../components/Spinner/Spinner";

type ClassAddModalProps = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  cb: (name: string) => Promise<void>;
};

export const ClassAddModal = ({ setModalOpen, cb }: ClassAddModalProps) => {
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputError(false);
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const input = form[0] as HTMLInputElement;

    if (input.value.trim() === "") {
      setInputError(true);
      return;
    }

    await cb(input.value);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.modalBackground}
        onClick={() => setModalOpen(false)}
      ></div>

      <div className={styles.modalWrapper}>
        {loading ? (
          <div className={styles.loadingWrapper}>
            <Spinner size="m" txt="Adding Class..." />
          </div>
        ) : (
          <div>
            <p className={styles.modalTitle}>Add New Class</p>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalInputWrapper}>
                <label className={styles.inputLabel}>Class Name</label>
                <input
                  className={`${styles.input} ${inputError && styles.error}`}
                  type="text"
                  placeholder="e.g., Biology 201"
                  onChange={handleChange}
                />
              </div>

              <div className={styles.modalBtns}>
                <button
                  type="button"
                  className={`${styles.modalBtn} ${styles.cancelBtn}`}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.modalBtn} ${styles.addBtn}`}
                >
                  Add Class
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
