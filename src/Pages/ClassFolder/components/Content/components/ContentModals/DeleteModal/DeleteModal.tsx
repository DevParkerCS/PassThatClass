import { Dispatch, SetStateAction, useEffect, useState } from "react";
import shared from "../ContentModal.module.scss";
import styles from "./DeleteModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "../../../../../../../components/Spinner/Spinner";
import { ContentMeta } from "../../../../../../../context/DataContext/types";
import { useContentContext } from "../../../../../../../context/DataContext/ContentContext";
import { ActiveModal } from "../../../Content";

type DeleteModalProps = {
  contentId: string;
  classId: string;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
  setSelectedInfo: Dispatch<SetStateAction<ContentMeta | null>>;
};

export const DeleteModal = ({
  contentId,
  classId,
  setActiveModal,
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
      await contentCtx.callDeleteQuiz(contentId, classId);
      setSelectedInfo(null);
      setActiveModal(null);
      setDeleting(false);
    } catch (e) {
      setDeleting(false);
      console.log(e);
    }
  };

  const handleVerifyClose = () => {
    setActiveModal("content");
  };

  return (
    <VerifyDelete
      closeCb={handleVerifyClose}
      deleteCb={handleDelete}
      title={title}
      deleting={deleting}
      loading={loading}
      type="Quiz"
    />
  );
};

type VerifyDeleteProps = {
  deleteCb: () => void;
  closeCb: () => void;
  title: string;
  loading?: boolean;
  deleting: boolean;
  type: "Quiz" | "Class";
};

export const VerifyDelete = ({
  closeCb,
  deleteCb,
  title,
  loading = false,
  deleting,
  type,
}: VerifyDeleteProps) => {
  return (
    <div>
      <div className={shared.modalBackground} onClick={closeCb}></div>

      <div className={`${styles.deleteWrapper} ${loading && styles.loading}`}>
        <div className={` ${styles.outsideWrapper} ${shared.outsideWrapper}`}>
          <div className={shared.exitBtn} onClick={closeCb}>
            <FontAwesomeIcon icon={faXmark} />
          </div>

          {loading && <Spinner size="m" />}
          {deleting && <Spinner size="m" txt={`Deleting ${type}...`} />}
          {!loading && !deleting && (
            <div>
              <p className={styles.exitTxt}>Are you sure you want to delete </p>
              <p className={`${styles.exitTxt} ${styles.exitName}`}>{title}?</p>
              <div className={styles.exitBtns}>
                <button
                  className={`${styles.exitCta} ${styles.cancel}`}
                  onClick={closeCb}
                >
                  Cancel
                </button>
                <button
                  className={`${styles.exitCta} ${styles.delete}`}
                  onClick={deleteCb}
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
