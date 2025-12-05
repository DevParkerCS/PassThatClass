import { useRef, useState } from "react";
import styles from "./ContentModal.module.scss";
import { QuizQuestionType } from "../../../../../../context/DataContext/types";

type ListItemProps = {
  itemContent: QuizQuestionType;
  index: number;
  hoverable?: boolean;
};

export const ListItem = ({
  itemContent,
  index,
  hoverable = false,
}: ListItemProps) => {
  const [displayHover, setDisplayHover] = useState(false);
  const timeoutId = useRef<number>(-1);

  const handleHover = () => {
    if (!hoverable) return;
    timeoutId.current = window.setTimeout(() => {
      setDisplayHover(true);
    }, 500);
  };

  const handleExit = () => {
    if (!hoverable) return;
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
