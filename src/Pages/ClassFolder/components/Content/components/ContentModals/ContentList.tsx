import { QuizQuestionType } from "../../../../../../context/DataContext/types";
import styles from "./ContentModal.module.scss";
import { ListItem } from "./ListItem";

type ModalContentProps = {
  ModalContent: QuizQuestionType[];
};

export const ContentList = ({ ModalContent }: ModalContentProps) => {
  return (
    <div className={styles.modalListWrapper}>
      <div className={styles.modalList}>
        {ModalContent.map((c, i) => (
          <ListItem itemContent={c} key={i} index={i} />
        ))}
      </div>
    </div>
  );
};

export const EditContentList = ({ ModalContent }: ModalContentProps) => {
  return (
    <div className={styles.modalListWrapper}>
      <div className={styles.modalList}>
        {ModalContent.map((c, i) => (
          <ListItem itemContent={c} key={i} index={i} />
        ))}
      </div>
    </div>
  );
};
