import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styles from "./ClassAddModal.module.scss";
import { Spinner } from "../../../../components/Spinner/Spinner";
import { useClassesContext } from "../../../../context/DataContext/ClassesContext";
import { VerifyDelete } from "../../../ClassFolder/components/Content/components/ContentModals/DeleteModal/DeleteModal";

type ClassEditProps = {
  setEditActive: Dispatch<SetStateAction<boolean>>;
  classId: string;
};

export const ClassEditModal = ({ setEditActive, classId }: ClassEditProps) => {
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const classesCtx = useClassesContext();

  useEffect(() => {
    setInput(classesCtx.classesById[classId].name);
  }, [classesCtx, classId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputError(false);
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("SUBMITTED");
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const input = form[0] as HTMLInputElement;

    if (input.value.trim() === "") {
      setInputError(true);
      return;
    }

    setLoading(false);
  };

  const handleDelete = () => {};
  return (
    <div>
      {verifying && (
        <VerifyDelete
          closeCb={() => setVerifying(false)}
          deleteCb={handleDelete}
          title={input}
          deleting={deleting}
          type="Class"
        />
      )}

      <div className={styles.container}>
        <div
          className={styles.modalBackground}
          onClick={() => setEditActive(false)}
        ></div>

        <div className={styles.modalWrapper}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <Spinner size="m" txt="Saving Class..." />
            </div>
          ) : (
            <div>
              <p className={styles.modalTitle}>Edit Class</p>

              <form onSubmit={handleSubmit}>
                <div className={styles.modalInputWrapper}>
                  <label className={styles.inputLabel}>Class Name</label>
                  <input
                    className={`${styles.input} ${inputError && styles.error}`}
                    type="text"
                    placeholder="e.g., Biology 201"
                    value={input}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.btnsWrapper}>
                  <div className={`${styles.modalBtns} ${styles.editBtns}`}>
                    <button
                      type="button"
                      className={`${styles.modalBtn} ${styles.deleteBtn}`}
                      onClick={() => setVerifying(true)}
                    >
                      Delete Class
                    </button>
                  </div>
                  <div className={`${styles.modalBtns} ${styles.editBtns}`}>
                    <button
                      type="button"
                      className={`${styles.modalBtn} ${styles.cancelBtn}`}
                      onClick={() => setEditActive(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`${styles.modalBtn} ${styles.addBtn}`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
