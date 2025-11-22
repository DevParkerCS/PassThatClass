import { useNavigate } from "react-router-dom";
import styles from "./ContentItem.module.scss";
import { Dispatch, SetStateAction, useState } from "react";

export type ContentType = {
  label: string;
  name: string;
  numAmount: number;
  daysSince: number;
};

type ContentItemProps = {
  content: ContentType;
  setModalActive: Dispatch<SetStateAction<boolean>>;
};

export const ContentItem = ({ content, setModalActive }: ContentItemProps) => {
  const nav = useNavigate();

  const handleClick = () => {
    setModalActive(true);
  };

  return (
    <div className={styles.contentItem} onClick={handleClick}>
      <div className={styles.contentFlex}>
        <div className={styles.itemLabel}>{content.label}</div>
        <p className={styles.itemName}>{content.name}</p>
      </div>
      <div>
        <p className={styles.itemInfoTxt}>
          <span>{content.numAmount} Questions</span> &bull;{" "}
          <span>Last Used {content.daysSince} days ago</span>
        </p>
      </div>
    </div>
  );
};
