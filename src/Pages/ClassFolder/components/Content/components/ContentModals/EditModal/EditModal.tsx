import { faXmark } from "@fortawesome/free-solid-svg-icons";
import shared from "../ContentModal.module.scss";
import styles from "./EditModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ActiveModal } from "../../../Content";
import {
  QuizMeta,
  QuizQuestionType,
} from "../../../../../../../context/DataContext/types";
import { useContentContext } from "../../../../../../../context/DataContext/ContentContext";
import { Spinner } from "../../../../../../../components/Spinner/Spinner";
import { AutoResizeTextarea } from "../../../../../../../components/AutoResizeTextArea/AutoResizeTextArea";

type EditModalProps = {
  contentId: string;
  classId: string;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
};

export const EditModal = ({
  contentId,
  setActiveModal,
  classId,
}: EditModalProps) => {
  const contentCtx = useContentContext();
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [changed, setChanged] = useState(false);
  const [closing, setClosing] = useState(false);
  const [saving, setSaving] = useState(false);
  let originalTitle = useRef(contentCtx.quizMetaById[contentId].title);

  useEffect(() => {
    setEditedTitle(contentCtx.quizMetaById[contentId].title);
    originalTitle.current = contentCtx.quizMetaById[contentId].title;
  }, [contentCtx.quizMetaById, contentId]);

  useEffect(() => {
    if (
      changed === true ||
      editedTitle === originalTitle.current ||
      editedTitle === ""
    )
      return;

    setChanged(true);
  }, [editedTitle]);

  const handleClose = () => {
    if (saving) return;

    if (changed) {
      setClosing(true);
    } else {
      setActiveModal("content");
    }
  };

  const handleSave = async () => {
    if (editedTitle === null || editedTitle === originalTitle.current)
      setActiveModal("content");
    try {
      setSaving(true);
      await contentCtx.updateTitle(contentId, classId, editedTitle);
      setSaving(false);
      setActiveModal("content");
    } catch (e) {
      console.log("Error saving content");
    }
  };

  return (
    <div className={`${styles.modalContainer}`}>
      <div className={shared.modalBackground} onClick={handleClose}></div>

      {closing && changed ? (
        <VerifyClose setClosing={setClosing} setActiveModal={setActiveModal} />
      ) : (
        ""
      )}

      <div className={`${shared.modalWrapper} ${styles.editModalWrapper}`}>
        <div className={shared.outsideWrapper}>
          <div className={shared.exitBtn} onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} />
          </div>

          <p className={shared.modalTitle}>Quick Edit</p>

          {!editedTitle || saving ? (
            <div className={shared.loadingWrapper}>
              <Spinner size="l" />
            </div>
          ) : (
            <div className={styles.inputsWrapper}>
              <div className={styles.inputWrapper}>
                <label className={styles.inputLabel}>Title</label>
                <AutoResizeTextarea
                  value={editedTitle}
                  className={styles.input}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              </div>

              <div className={styles.editBtns}>
                <button
                  className={`${styles.editBtn} ${styles.cnclBtn}`}
                  onClick={handleClose}
                >
                  Cancel
                </button>
                {/* <button className={`${styles.editBtn} ${styles.fullBtn}`}>
                  Open Full Editor
                </button> */}
                <button
                  onClick={handleSave}
                  className={`${styles.editBtn} ${styles.saveBtn}`}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type EditQuestionProps = {
  index: number;
  editedContent: QuizQuestionType[];
  setEditedContent: Dispatch<SetStateAction<QuizQuestionType[] | undefined>>;
};

export const EditQuestion = ({
  index,
  editedContent,
  setEditedContent,
}: EditQuestionProps) => {
  return (
    <div className={`${shared.question}`}>
      <p className={shared.questionIndex}>{index + 1}</p>
      <AutoResizeTextarea
        className={shared.input}
        value={editedContent[index].question}
        onChange={(e) =>
          setEditedContent((prev) => {
            if (!prev) return prev;
            const next = [...prev];
            next[index] = {
              ...next[index],
              question: e.target.value,
            };
            return next;
          })
        }
      />
    </div>
  );
};

type VerifyCloseProps = {
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
  setClosing: Dispatch<SetStateAction<boolean>>;
};

export const VerifyClose = ({
  setActiveModal,
  setClosing,
}: VerifyCloseProps) => {
  return (
    <div>
      <div
        className={`${shared.modalBackground} ${styles.closeBackground}`}
      ></div>
      <div className={styles.closeWrapper}>
        <p className={styles.closeTxt}>You have unsaved changes.</p>

        <div>
          <div className={styles.editBtns}>
            <button
              className={`${styles.closeBtn} ${styles.cnclBtn}`}
              onClick={() => setClosing(false)}
            >
              Cancel
            </button>
            <button
              className={`${styles.closeBtn} ${styles.clsBtn}`}
              onClick={() => setActiveModal("content")}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
