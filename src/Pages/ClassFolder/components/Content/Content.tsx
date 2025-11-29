import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Content.module.scss";
import { useEffect, useState } from "react";
import { ContentItem, EmptyItem } from "./components/contentItem/ContentItem";
import { ContentModal } from "./components/ContentModal/ContentModal";
import { useDataContext } from "../../../../context/DataContext/DataContext";
import { ContentMeta } from "../../../../context/DataContext/types";
import { Ctas } from "../Ctas/Ctas";
import { Breadcrumb } from "../../../../components/Breadcrumb/Breadcrumb";

type FilterType = "all" | "quiz" | "card";

type ContentProps = {
  classId: string;
};

export const Content = ({ classId }: ContentProps) => {
  const data = useDataContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<FilterType>("all");
  const [filtered, setFiltered] = useState<ContentMeta[]>([]);
  const [selectedInfo, setSelectedInfo] = useState<ContentMeta | null>(null);
  const [modalActive, setModalActive] = useState(false);

  const quizId = searchParams.get("quizId");

  useEffect(() => {
    if (quizId && data.contentById[classId]) {
      setModalActive(true);
      setSelectedInfo(
        data.contentById[classId].find((d) => d.id === quizId) ?? null
      );
    }
  }, [quizId, data.contentById]);

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

      <div style={{ width: "100%" }}>
        <div className={styles.contentTxtWrapper}>
          <div>
            <p className={styles.classTitle}>
              {data.classesById[classId]?.name}
            </p>
            <p className={styles.contentTitle}>
              {filtered.length} {filtered.length !== 1 ? "Quizzes" : "Quiz"}
            </p>
          </div>

          <Ctas classId={classId} />
        </div>

        {filtered.length === 0 && <EmptyItem classId={classId} />}

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
