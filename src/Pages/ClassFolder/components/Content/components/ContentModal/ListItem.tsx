import { useRef, useState } from "react";
import styles from "./ContentModal.module.scss";
import { QuizQuestionType } from "../../../../../../context/DataContext/types";

type ListItemProps = {
  itemContent: QuizQuestionType;
  index: number;
};

export const ListItem = ({ itemContent, index }: ListItemProps) => {
  const [displayHover, setDisplayHover] = useState(false);
  const timeoutId = useRef<number>(-1);

  const handleHover = () => {
    timeoutId.current = window.setTimeout(() => {
      setDisplayHover(true);
    }, 500);
  };

  const handleExit = () => {
    clearTimeout(timeoutId.current);
    setDisplayHover(false);
  };

  return (
    <div className={styles.listItem} key={index}>
      <div className={`${styles.itemHover} ${displayHover && styles.active}`}>
        <p className={styles.itemHoverTxt}>{itemContent.question}</p>
      </div>
      <p
        className={styles.itemTxt}
        onMouseEnter={handleHover}
        onMouseLeave={handleExit}
      >
        <span className={styles.itemIndex}>{index + 1}</span>
        {itemContent.question}
      </p>
    </div>
  );
};
