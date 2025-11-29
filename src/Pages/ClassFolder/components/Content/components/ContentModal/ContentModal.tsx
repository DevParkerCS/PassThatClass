import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./ContentModal.module.scss";
import { useNavigate } from "react-router-dom";
import {
  ContentMeta,
  QuizMeta,
  QuizQuestionType,
} from "../../../../../../context/DataContext/types";
import { useDataContext } from "../../../../../../context/DataContext/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "../../../../../../components/Spinner/Spinner";

type ContentModalProps = {
  contentId: string;
  classId: string;
  setModalActive: Dispatch<SetStateAction<boolean>>;
};

export const ContentModal = ({
  contentId,
  classId,
  setModalActive,
}: ContentModalProps) => {
  const nav = useNavigate();
  const data = useDataContext();
  const [content, setContent] = useState(data.questionsById[contentId]);
  const [meta, setMeta] = useState<QuizMeta>(data.quizMetaById[contentId]);

  useEffect(() => {
    setContent(data.questionsById[contentId]);
    setMeta(data.quizMetaById[contentId]);
  }, [data.questionsById, data.quizMetaById]);

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
                        `/quiz/${data.classesById[classId].name}/${classId}/${data.quizMetaById[contentId].title}/${contentId}`
                      )
                    }
                  >
                    Start Quiz
                  </button>
                  <button
                    className={`${styles.modalCta} ${styles.editBtn}`}
                    onClick={() =>
                      nav(
                        `/quiz/${data.classesById[classId].name}/${classId}/${contentId}`
                      )
                    }
                  >
                    Edit Quiz
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

type ModalContentProps = {
  ModalContent: QuizQuestionType[];
};

export const ContentList = ({ ModalContent }: ModalContentProps) => {
  return (
    <div className={styles.modalListWrapper}>
      <div className={styles.modalList}>
        {ModalContent.map((c, i) => (
          <div className={styles.listItem} key={i}>
            <p className={styles.itemTxt}>
              <span className={styles.itemIndex}>{i + 1}</span>
              {c.question}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

type ModalStatsProps = {
  info: QuizMeta;
};

const ModalStats = ({ info }: ModalStatsProps) => {
  return (
    <div className={styles.statWrapper}>
      <p className={styles.statTitle}>Quiz Stats</p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Average Score</span>
        <span className={styles.statValue}>{info.average_score}</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Average Time</span>
        <span className={styles.statValue}>{info.average_time_seconds}</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Best Score</span>
        <span className={styles.statValue}>{info.highest_score}</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Attempts</span>
        <span className={styles.statValue}>{info.attempts_count}</span>
      </p>
    </div>
  );
};

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
  const data = useDataContext();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);

    data.contentById[classId].map((c) => {
      if (c.id === contentId) {
        setTitle(c.title);
      }
    });

    setLoading(false);
  }, [contentId, classId]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await data.deleteQuiz(contentId, classId);
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
