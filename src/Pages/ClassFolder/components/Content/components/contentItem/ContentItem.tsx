import { useNavigate } from "react-router-dom";
import styles from "./ContentItem.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { ContentMeta } from "../../../../../../context/DataContext/types";

type ContentItemProps = {
  content: ContentMeta;
  setModalActive: Dispatch<SetStateAction<boolean>>;
  setSelectedInfo: Dispatch<SetStateAction<ContentMeta | null>>;
};

export const ContentItem = ({
  content,
  setModalActive,
  setSelectedInfo,
}: ContentItemProps) => {
  const handleClick = () => {
    setSelectedInfo(content);
    setModalActive(true);
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
          <span>{content.num_items}</span> &bull;{" "}
          <span>Last Used 2 days ago</span>
        </p>
      </div>
    </div>
  );
};
