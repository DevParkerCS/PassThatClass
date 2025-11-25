import { useNavigate } from "react-router-dom";
import styles from "./Content.module.scss";
import { useEffect, useState } from "react";
import { ContentItem } from "./components/contentItem/ContentItem";
import { ContentModal } from "./components/ContentModal/ContentModal";
import { useDataContext } from "../../../../context/DataContext/DataContext";
import { ContentMeta } from "../../../../context/DataContext/types";

type FilterType = "all" | "quiz" | "card";

type ContentProps = {
  classId: string;
};

export const Content = ({ classId }: ContentProps) => {
  const data = useDataContext();
  const [filter, setFilter] = useState<FilterType>("all");
  const [filtered, setFiltered] = useState<ContentMeta[]>([]);
  const [selectedInfo, setSelectedInfo] = useState<ContentMeta | null>(null);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    if (modalActive) {
      if (selectedInfo?.type === "quiz") data.fetchQuizContent(selectedInfo.id);

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalActive]);

  useEffect(() => {
    const items = data.contentById[classId] ?? [];

    if (filter === "all") {
      setFiltered(items);
      return;
    }

    setFiltered(
      items.filter((p) => p.type === (filter === "card" ? "card" : "quiz"))
    );
  }, [filter, data.contentById, classId]);

  return (
    <div
      className={`${styles.contentWrapper} ${
        modalActive && styles.modalActive
      }`}
    >
      {modalActive && selectedInfo && (
        <ContentModal
          classId={classId}
          contentId={selectedInfo.id}
          setModalActive={setModalActive}
        />
      )}

      <div>
        <div className={styles.contentTxtWrapper}>
          <p className={styles.contentTitle}>{filtered.length} Items</p>
          <p
            className={`${styles.contentFilter} ${
              filter === "all" && styles.active
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </p>
          <p
            className={`${styles.contentFilter} ${
              filter === "quiz" && styles.active
            }`}
            onClick={() => setFilter("quiz")}
          >
            Quizzes
          </p>
          <p
            className={`${styles.contentFilter} ${
              filter === "card" && styles.active
            }`}
            onClick={() => setFilter("card")}
          >
            Cards
          </p>
        </div>

        <div className={styles.itemsOuter}>
          <div className={styles.itemsWrapper}>
            {filtered.map((q, i) => (
              <ContentItem
                content={q}
                setModalActive={setModalActive}
                setSelectedInfo={setSelectedInfo}
                key={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
