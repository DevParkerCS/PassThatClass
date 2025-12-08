import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./ContentModal.module.scss";
import { useNavigate } from "react-router-dom";
import {
  ContentMeta,
  QuizMeta,
  QuizQuestionType,
} from "../../../../../../context/DataContext/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "../../../../../../components/Spinner/Spinner";
import { ContentList } from "./ContentList";
import { ModalStats } from "./ModalStats";
import { useContentContext } from "../../../../../../context/DataContext/ContentContext";
import { useClassesContext } from "../../../../../../context/DataContext/ClassesContext";
import { ActiveModal } from "../../Content";

type ContentModalProps = {
  contentId: string;
  classId: string;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
};

export const ContentModal = ({
  contentId,
  classId,
  setActiveModal,
}: ContentModalProps) => {
  const nav = useNavigate();
  const contentCtx = useContentContext();
  const classesCtx = useClassesContext();
  const [content, setContent] = useState<QuizQuestionType[] | undefined>(
    contentCtx.questionsById[contentId]
  );
  const [meta, setMeta] = useState<QuizMeta>(
    contentCtx.quizMetaById[contentId]
  );

  useEffect(() => {
    setContent(contentCtx.questionsById[contentId]);
    setMeta(contentCtx.quizMetaById[contentId]);
  }, [contentCtx.questionsById, contentCtx.quizMetaById, contentId]);

  const handleReviewClick = () => {
    setActiveModal("review");
  };

  return (
    <div>
      <div
        className={styles.modalBackground}
        onClick={() => setActiveModal(null)}
      ></div>

      <div className={styles.modalWrapper}>
        <div className={styles.outsideWrapper}>
          <div className={styles.exitBtn} onClick={() => setActiveModal(null)}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
          {!content || !meta ? (
            <div className={styles.loadingWrapper}>
              <Spinner size="m" txt="Loading Information..." />
            </div>
          ) : (
            <div>
              <h2 className={styles.modalTitle}>{meta.title}</h2>

              <div className={styles.infoWrapper}>
                <div className={styles.infoItem}>
                  <p className={styles.infoTxt}>
                    {meta.num_questions} Questions
                  </p>
                </div>

                <div className={styles.infoItem}>
                  <p className={styles.infoTxt}>Last Attempt: 2 days ago</p>
                </div>

                <div>
                  <FontAwesomeIcon
                    className={styles.editCta}
                    onClick={() => setActiveModal("edit")}
                    icon={faPenToSquare}
                  />
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={(e) => setActiveModal("delete")}
                    className={`${styles.editCta}`}
                  />
                </div>
              </div>

              <div className={styles.modalContent}>
                <ContentList ModalContent={content} />
                <div className={styles.contentRight}>
                  <ModalStats info={meta} />

                  <div className={styles.ctasWrapper}>
                    <button
                      className={`${styles.modalCta} ${styles.startBtn}`}
                      onClick={() =>
                        nav(
                          `/quiz/${classesCtx.classesById[classId].name}/${classId}/${contentCtx.quizMetaById[contentId].title}/${contentId}`
                        )
                      }
                    >
                      Start Quiz
                    </button>
                    <button
                      className={`${styles.modalCta} ${styles.editBtn}`}
                      onClick={handleReviewClick}
                    >
                      Review Attempts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
