import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import shared from "../ContentModal.module.scss";
import styles from "./ReviewModal.module.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ActiveModal } from "../../../Content";
import { useContentContext } from "../../../../../../../context/DataContext/ContentContext";
import {
  ContentMeta,
  QuizAttempts,
} from "../../../../../../../context/DataContext/types";
import { Spinner } from "../../../../../../../components/Spinner/Spinner";
import { formatTime } from "../../../../../../Quiz/components/Results/Results";
import { useNavigate } from "react-router-dom";
import { useClassesContext } from "../../../../../../../context/DataContext/ClassesContext";

type ReviewModalProps = {
  contentId: string;
  classId: string;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
  selectedInfo: ContentMeta;
};

export const ReviewModal = ({
  setActiveModal,
  contentId,
  classId,
  selectedInfo,
}: ReviewModalProps) => {
  const contentCtx = useContentContext();
  const classesCtx = useClassesContext();
  const [attempts, setAttempts] = useState<QuizAttempts>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  function formatSupabaseDate(timestamp: string): string {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return timestamp;

    const d = date.toLocaleDateString(undefined, {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    });

    const t = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

    return `${d} · ${t}`;
  }

  useEffect(() => {
    if (!contentId) return;

    (async () => {
      try {
        setLoading(true);
        const data = await contentCtx.getPastAttempts(contentId);
        setAttempts(data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
    })();
  }, [contentId]);

  const handleClick = (index: number) => {
    const params = new URLSearchParams({
      mode: "reviewing",
      attemptIndex: index.toString(),
    });

    const className = classesCtx.classesById[classId].name;
    const quizName = contentCtx.quizMetaById[contentId].title;

    nav(
      `/quiz/${className}/${classId}/${quizName}/${contentId}?${params.toString()}`
    );
  };

  return (
    <div>
      <div
        className={shared.modalBackground}
        onClick={() => setActiveModal("content")}
      ></div>

      <div className={shared.modalWrapper}>
        <div className={shared.outsideWrapper}>
          <div
            className={shared.exitBtn}
            onClick={() => setActiveModal("content")}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
          <p className={shared.modalTitle}>Past Attempts</p>

          {loading ? (
            <Spinner size="m" />
          ) : (
            <div className={styles.reviewsWrapper}>
              {/* Header */}
              <div className={styles.reviewHeader}>
                <p className={styles.reviewStat}>#</p>
                <p className={styles.reviewStat}>Date</p>
                <p className={styles.reviewStat}>Score</p>
                <p className={styles.reviewStat}>Time</p>
                <p className={styles.reviewStat}></p>{" "}
                {/* empty header for button column */}
              </div>

              {attempts.map((a, i) => (
                <div key={a.id} className={styles.reviewRow}>
                  <p className={styles.reviewStat}>{attempts.length - i}</p>
                  <p className={styles.reviewStat}>
                    {formatSupabaseDate(a.completed_at)}
                  </p>
                  <p className={styles.reviewStat}>
                    {a.num_correct} / {selectedInfo.num_items}
                  </p>
                  <p className={styles.reviewStat}>{formatTime(a.seconds)}</p>
                  <button
                    className={styles.reviewCta}
                    onClick={() => handleClick(i)}
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
