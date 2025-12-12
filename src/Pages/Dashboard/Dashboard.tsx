import {
  faEllipsisVertical,
  faFolderOpen,
  faPenToSquare,
  faPlus,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Dashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nav } from "../../components/Nav/Nav";
// import { SearchBar } from "../../components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClassAddModal } from "./components/ClassAddModal/ClassAddModal";
import { Spinner } from "../../components/Spinner/Spinner";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import { useClassesContext } from "../../context/DataContext/ClassesContext";
import { ClassEditModal } from "./components/ClassAddModal/ClassEditModal";

export const Dashboard = () => {
  const {
    classes,
    classesById,
    classesLoading,
    classesError,
    AddClass,
    callClasses,
  } = useClassesContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nav = useNavigate();
  const auth = useAuthContext();

  useEffect(() => {
    document.title = "Dashboard - PassThatClass";
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!auth.loading && !auth.session) {
      nav("/login");
    }
  }, [auth.session, auth.loading]);

  const handleAddClass = async (name: string) => {
    if (name.trim() === "" || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await AddClass(name);
      setIsModalOpen(false);
    } catch (e) {
      console.error("Error adding class", e);
      // you could surface a toast here later
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClassClick = (id: string) => {
    if (!id) return;
    const cls = classesById[id];
    if (!cls) return;
    nav(`/class/${cls.name}/${id}`);
  };

  const handleRetry = async () => {
    try {
      await callClasses();
    } catch (e) {
      console.error("Error refetching classes", e);
    }
  };

  const showEmpty = !classesLoading && !classesError && classes.length === 0;
  const showError = !classesLoading && !!classesError;
  const showList = !classesLoading && !classesError && classes.length > 0;
  const cantAdd =
    auth.profile?.plan.class_limit &&
    classes.length >= auth.profile?.plan.class_limit;

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isModalOpen]);

  return (
    <div className={styles.pageWrapper}>
      <Nav />

      {isModalOpen && (
        <ClassAddModal cb={handleAddClass} setModalOpen={setIsModalOpen} />
      )}

      <div>
        <h2 className={styles.dashboardTitle}>Dashboard</h2>
      </div>

      <div className={styles.headingWrapper}>
        <p className={styles.heading}>Your Classes</p>
      </div>

      {/* LOADING STATE */}
      {classesLoading && (
        <div className={styles.emptyWrapper}>
          <Spinner txt="Loading Classes..." size="l" />
        </div>
      )}

      {/* EMPTY STATE */}
      {showEmpty && (
        <div>
          <div className={styles.emptyWrapper}>
            <p className={styles.emptyTxt}>You don’t have any classes yet.</p>
            <p className={`${styles.emptyTxt} ${styles.secTxt}`}>
              Create your first class to start generating quizzes from your
              notes.
            </p>
          </div>

          <div className={styles.classesWrapper}>
            <div className={styles.classesSizeWrapper}>
              <ClassCard icon={faPlus} onClick={() => setIsModalOpen(true)} />
            </div>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {showError && (
        <div className={styles.emptyWrapper}>
          <p className={styles.emptyTxt}>
            There was an error loading your classes.
          </p>
          <button className={styles.retryBtn} onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {/* LIST STATE */}
      {showList && auth.profile && (
        <div className={styles.classesWrapper}>
          <div className={styles.classesSizeWrapper}>
            {classes.map((cls) => (
              <ClassCard
                key={cls.id}
                icon={faFolderOpen}
                classId={cls.id}
                onClick={() => handleClassClick(cls.id)}
              />
            ))}

            {!cantAdd ? (
              <ClassCard
                icon={faPlus}
                onClick={() => setIsModalOpen(true)}
                editable={false}
              />
            ) : (
              <UpgradeCard />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

type ClassCardProps = {
  icon: IconDefinition;
  onClick: () => void;
  editable?: boolean;
  classId?: string;
};

const ClassCard = ({
  icon,
  onClick,
  editable = true,
  classId,
}: ClassCardProps) => {
  const [editActive, setEditActive] = useState(false);
  const classesCtx = useClassesContext();

  useEffect(() => {
    document.body.style.overflow = editActive ? "hidden" : "";
  }, [editActive]);

  return (
    <div
      className={`${styles.cardWrapper} ${
        editable ? styles.classCard : styles.addCard
      }`}
    >
      {editable && editActive && classId && (
        <ClassEditModal classId={classId} setEditActive={setEditActive} />
      )}

      <div className={styles.classWrapper} onClick={onClick}>
        <div className={styles.classTxtWrapper}>
          <FontAwesomeIcon className={styles.classIcon} icon={icon} />
          <p className={styles.className}>
            {classId ? classesCtx.classesById[classId]?.name : "Add Class"}
          </p>
        </div>
        {editable && (
          <div
            className={styles.editWrapper}
            onClick={(e) => {
              e.stopPropagation();
              setEditActive(true);
            }}
          >
            <FontAwesomeIcon
              className={styles.editBtn}
              icon={faEllipsisVertical}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const UpgradeCard = () => {
  const nav = useNavigate();

  return (
    <div
      className={`${styles.cardWrapper} ${styles.addCard}`}
      onClick={() => nav("/#pricing")}
    >
      <div className={styles.classWrapper}>
        <div className={styles.classTxtWrapper}>
          <FontAwesomeIcon className={styles.classIcon} icon={faPlus} />
          <p className={styles.className}>Upgrade For More Classes</p>
        </div>
      </div>
    </div>
  );
};
