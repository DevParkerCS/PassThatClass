import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./ContentModal.module.scss";
import { useNavigate } from "react-router-dom";
import {
  ContentMeta,
  QuizMeta,
  QuizQuestionType,
} from "../../../../../../context/DataContext/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "../../../../../../components/Spinner/Spinner";
import { ContentList } from "./ContentList";
import { ModalStats } from "./ModalStats";
import { useContentContext } from "../../../../../../context/DataContext/ContentContext";
import { useClassesContext } from "../../../../../../context/DataContext/ClassesContext";

type ContentModalProps = {
  contentId: string;
  classId: string;
  setModalActive: Dispatch<SetStateAction<boolean>>;
  setReviewActive: Dispatch<SetStateAction<boolean>>;
};

export const ContentModal = ({
  contentId,
  classId,
  setModalActive,
  setReviewActive,
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
    setReviewActive(true);
    setModalActive(false);
  };

  return (
    <div>
      <div
        className={styles.modalBackground}
        onClick={() => setModalActive(false)}
      ></div>

      <div className={styles.modalWrapper}>
        <div className={styles.outsideWrapper}>
          <div className={styles.exitBtn} onClick={() => setModalActive(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
          {!content || !meta ? (
            <div className={styles.loadingWrapper}>
              <Spinner size="l" />
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
              </div>

              <div className={styles.modalContent}>
                <ContentList ModalContent={content} />
                <div className={styles.contentRight}>
                  <ModalStats info={meta} />

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
          )}
        </div>
      </div>
    </div>
  );
};
