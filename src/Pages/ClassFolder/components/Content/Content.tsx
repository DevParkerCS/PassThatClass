import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Content.module.scss";
import { useEffect, useState } from "react";
import { ContentItem, EmptyItem } from "./components/contentItem/ContentItem";
import { ContentModal } from "./components/ContentModal/ContentModal";
import { ContentMeta } from "../../../../context/DataContext/types";
import { Ctas } from "../Ctas/Ctas";
import { DeleteModal } from "./components/ContentModal/DeleteModal";
import { ReviewModal } from "./components/ContentModal/ReviewModal";
import { useContentContext } from "../../../../context/DataContext/ContentContext";
import { useClassesContext } from "../../../../context/DataContext/ClassesContext";
import { EditModal } from "./components/ContentModal/EditModal";

type FilterType = "all" | "quiz" | "card";

type ContentProps = {
  classId: string;
};

export type ActiveModal = "content" | "delete" | "review" | "edit" | null;

export const Content = ({ classId }: ContentProps) => {
  const content = useContentContext();
  const classesCtx = useClassesContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<FilterType>("all");
  const [filtered, setFiltered] = useState<ContentMeta[]>([]);
  const [selectedInfo, setSelectedInfo] = useState<ContentMeta | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const quizId = searchParams.get("quizId");

  useEffect(() => {
    if (quizId && content.contentById[classId]) {
      setActiveModal("content");
      setSelectedInfo(
        content.contentById[classId].find((d) => d.id === quizId) ?? null
      );
    }
  }, [quizId, content.contentById]);

  useEffect(() => {
    if (activeModal === "content") {
      if (selectedInfo?.type === "quiz")
        content.fetchQuizContent(selectedInfo.id);

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  useEffect(() => {
    const items = content.contentById[classId] ?? [];

    if (filter === "all") {
      setFiltered(items);
      return;
    }

    setFiltered(
      items.filter((p) => p.type === (filter === "card" ? "card" : "quiz"))
    );
  }, [filter, content.contentById, classId]);

  return (
    <div
      className={`${styles.contentWrapper} ${
        activeModal && styles.modalActive
      }`}
    >
      {activeModal === "content" && selectedInfo && (
        <ContentModal
          classId={classId}
          contentId={selectedInfo.id}
          setActiveModal={setActiveModal}
        />
      )}

      {activeModal == "delete" && selectedInfo && (
        <DeleteModal
          setSelectedInfo={setSelectedInfo}
          contentId={selectedInfo.id}
          classId={classId}
          setActiveModal={setActiveModal}
        />
      )}

      {activeModal === "review" && selectedInfo && (
        <ReviewModal
          setActiveModal={setActiveModal}
          contentId={selectedInfo.id}
        />
      )}

      {activeModal === "edit" && selectedInfo && (
        <EditModal
          setActiveModal={setActiveModal}
          contentId={selectedInfo.id}
        />
      )}

      <div style={{ width: "100%" }}>
        <div className={styles.contentTxtWrapper}>
          <div>
            <p className={styles.classTitle}>
              {classesCtx.classesById[classId]?.name}
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
                setActiveModal={setActiveModal}
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
