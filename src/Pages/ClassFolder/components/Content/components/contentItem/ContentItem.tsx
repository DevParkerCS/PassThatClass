import { useNavigate } from "react-router-dom";
import styles from "./ContentItem.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { ContentMeta } from "../../../../../../context/DataContext/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useContentContext } from "../../../../../../context/DataContext/ContentContext";
import { useClassesContext } from "../../../../../../context/DataContext/ClassesContext";
import { ActiveModal } from "../../Content";

type ContentItemProps = {
  content: ContentMeta;
  setSelectedInfo: Dispatch<SetStateAction<ContentMeta | null>>;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
};

export const ContentItem = ({
  content,
  setActiveModal,
  setSelectedInfo,
}: ContentItemProps) => {
  const handleClick = () => {
    setSelectedInfo(content);
    setActiveModal("content");
  };

  return (
    <div className={styles.contentItem} onClick={handleClick}>
      <div className={styles.contentFlex}>
        <div className={styles.itemLabel}>
          {content.type === "quiz" ? "QUIZ" : "CARD"}
        </div>
        <p className={styles.itemName}>{content.title}</p>
      </div>
      <div>
        <p className={styles.itemInfoTxt}>
          <span>{content.num_items} Questions</span> &bull; <span>2d ago</span>
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
