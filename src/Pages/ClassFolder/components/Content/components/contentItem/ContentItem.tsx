import { useNavigate } from "react-router-dom";
import styles from "./ContentItem.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { ContentMeta } from "../../../../../../context/DataContext/types";
import { useDataContext } from "../../../../../../context/DataContext/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type ContentItemProps = {
  content: ContentMeta;
  setModalActive: Dispatch<SetStateAction<boolean>>;
  setSelectedInfo: Dispatch<SetStateAction<ContentMeta | null>>;
  setDeleteActive: Dispatch<SetStateAction<boolean>>;
};

export const ContentItem = ({
  content,
  setModalActive,
  setSelectedInfo,
  setDeleteActive,
}: ContentItemProps) => {
  const handleClick = () => {
    setSelectedInfo(content);
    setModalActive(true);
  };

  const handleDelClick = () => {
    setSelectedInfo(content);
    setDeleteActive(true);
  };

  return (
    <div className={styles.contentItem} onClick={handleClick}>
      <FontAwesomeIcon
        icon={faTrash}
        onClick={(e) => {
          e.stopPropagation();
          handleDelClick();
        }}
        className={`${styles.deleteIcon}`}
      />
      <div className={styles.contentFlex}>
        <div className={styles.itemLabel}>
          {content.type === "quiz" ? "QUIZ" : "CARD"}
        </div>
        <p className={styles.itemName}>{content.title}</p>
      </div>
      <div>
        <p className={styles.itemInfoTxt}>
          <span>{content.num_items}</span> &bull;{" "}
          <span>Last reviewed 2 days ago</span>
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
  const data = useDataContext();

  return (
    <div
      className={`${styles.contentItem} ${styles.emptyItem}`}
      onClick={() =>
        nav(`/quiz/${data.classesById[classId].name}/${classId}/new`)
      }
    >
      <p className={styles.itemName}>No quizzes yet</p>
      <p className={styles.itemInfoTxt}>
        Create your first quiz from your notes or images.
      </p>
    </div>
  );
};
