import { createSearchParams, useNavigate } from "react-router-dom";
import styles from "./ContentItem.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { ContentMeta } from "../../../../../../context/DataContext/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useContentContext } from "../../../../../../context/DataContext/ContentContext";
import { useClassesContext } from "../../../../../../context/DataContext/ClassesContext";
import { ActiveModal } from "../../Content";
import { formatRelativeTime } from "../../../../../../utils/DateUtils";
import { formatTime } from "../../../../../Quiz/components/Results/Results";

type ContentItemProps = {
  content: ContentMeta;
  classId: string;
  setSelectedInfo: Dispatch<SetStateAction<ContentMeta | null>>;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
};

export function formatEstimatedWait(seconds: number): string {
  if (seconds < 30) {
    return "Estimated wait: under 30 seconds";
  }

  if (seconds < 70) {
    return "Estimated wait: about 1 minute";
  }

  if (seconds < 120) {
    return "Estimated wait: 1–2 minutes";
  }

  return "Estimated wait: a few minutes";
}

export const ContentItem = ({
  classId,
  content,
  setActiveModal,
  setSelectedInfo,
}: ContentItemProps) => {
  const nav = useNavigate();
  const classesCtx = useClassesContext();

  const handleClick = () => {
    if (content.status === "ready") {
      setSelectedInfo(content);
      setActiveModal("content");
    } else if (content.status === "error") {
      const curClass = classesCtx.classesById[classId];
      nav(`/quiz/${curClass.name}/${curClass.id}/new?quizId=${content.id}&`);
    }
  };

  const handleErrorDel = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setSelectedInfo(content);
    setActiveModal("delete");
  };

  const isGenerating = content.status === "generating";
  const isError = content.status === "error";

  const statusText =
    content.status === "ready"
      ? formatRelativeTime(content.last_used_at)
      : content.status === "generating"
      ? formatEstimatedWait(35 + 1.5 * content.num_items)
      : "Click to Retry";

  const className = [
    styles.contentItem,
    isGenerating && styles.generating,
    isError && styles.error,
  ]
    .filter(Boolean)
    .join(" ");

  const handleCardClick = isGenerating ? undefined : handleClick;
  const typeLabel = content.type === "quiz" ? "QUIZ" : "CARD";

  return (
    <div className={className} onClick={handleCardClick}>
      <div className={styles.contentFlex}>
        <div className={styles.itemLabel}>{typeLabel}</div>
        <p className={styles.itemName}>{content.title}</p>
        {isError && (
          <FontAwesomeIcon
            className={styles.errDelBtn}
            onClick={handleErrorDel}
            icon={faTrash}
          />
        )}
      </div>
      <div>
        <p className={styles.itemInfoTxt}>
          <span>{content.num_items} Questions</span> &bull;{" "}
          <span className={styles.status}>{statusText}</span>
        </p>
      </div>
    </div>
  );
};

type EmptyItemProps = {
  classId: string;
};

export const EmptyItem = ({ classId }: EmptyItemProps) => {
  const nav = useNavigate();
  const classesCtx = useClassesContext();

  return (
    <div
      className={`${styles.contentItem} ${styles.emptyItem}`}
      onClick={() =>
        nav(`/quiz/${classesCtx.classesById[classId].name}/${classId}/new`)
      }
    >
      <p className={styles.itemName}>No quizzes yet</p>
      <p className={styles.itemInfoTxt}>
        Create your first quiz from your notes or images.
      </p>
    </div>
  );
};
