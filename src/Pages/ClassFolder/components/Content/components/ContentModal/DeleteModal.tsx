import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./ContentModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "../../../../../../components/Spinner/Spinner";
import { ContentMeta } from "../../../../../../context/DataContext/types";
import { useContentContext } from "../../../../../../context/DataContext/ContentContext";

type DeleteModalProps = {
  contentId: string;
  classId: string;
  setDeleteActive: Dispatch<SetStateAction<boolean>>;
  setSelectedInfo: Dispatch<SetStateAction<ContentMeta | null>>;
};

export const DeleteModal = ({
  contentId,
  classId,
  setDeleteActive,
  setSelectedInfo,
}: DeleteModalProps) => {
  const contentCtx = useContentContext();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);

    contentCtx.contentById[classId].map((c) => {
      if (c.id === contentId) {
        setTitle(c.title);
      }
    });

    setLoading(false);
  }, [contentId, classId, contentCtx.contentById]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await contentCtx.deleteQuiz(contentId, classId);
      setSelectedInfo(null);
      setDeleteActive(false);
      setDeleting(false);
    } catch (e) {
      setDeleting(false);
      console.log(e);
    }
  };

  return (
    <div>
      <div
        className={styles.modalBackground}
        onClick={() => setDeleteActive(false)}
      ></div>

      <div className={styles.deleteWrapper}>
        <div className={styles.outsideWrapper}>
          <div
            className={styles.exitBtn}
            onClick={() => setDeleteActive(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>

          {loading && <Spinner size="m" />}
          {deleting && <Spinner size="m" txt="Deleting Quiz..." />}

          {!loading && !deleting && (
            <div>
              <p className={styles.exitTxt}>Are you sure you want to delete </p>
              <p className={`${styles.exitTxt} ${styles.exitName}`}>{title}</p>
              <div className={styles.exitBtns}>
                <button
                  className={`${styles.exitCta} ${styles.cancel}`}
                  onClick={() => setDeleteActive(false)}
                >
                  Cancel
                </button>
                <button
                  className={`${styles.exitCta} ${styles.delete}`}
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
