import { useNavigate, useParams } from "react-router-dom";
import { Nav } from "../../components/Nav/Nav";
import styles from "./ClassFolder.module.scss";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";
import { Ctas } from "./components/Ctas/Ctas";
import { Content } from "./components/Content/Content";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import { Spinner } from "../../components/Spinner/Spinner";
import { useContentContext } from "../../context/DataContext/ContentContext";
import { useClassesContext } from "../../context/DataContext/ClassesContext";

export const ClassFolder = () => {
  const { classId, className } = useParams<{
    classId: string;
    className: string;
  }>();
  const content = useContentContext();
  const classesCtx = useClassesContext();
  const auth = useAuthContext();
  const nav = useNavigate();

  useEffect(() => {
    document.title = `${className} - PassThatClass`;
  }, []);

  useEffect(() => {
    if (!classId) return;

    if (!auth.loading && !auth.session) {
      nav("/login");
      return;
    }

    if (!auth.loading && auth.session && !content.contentLoadStatus[classId]) {
      // first load
      getContent(classId);
    }

    if (!auth.loading && auth.session && content.contentLoadStatus[classId]) {
      // only start polling once; startPolling will keep going while needed
      if (
        content.contentById[classId]?.some((c) => c.status === "generating")
      ) {
        content.startPolling(classId);
      }
    }
  }, [auth.loading, auth.session, classId, content]);

  const getContent = async (classId: string) => {
    try {
      await content.loadContent(classId);
    } catch (e) {
      console.log(e);
    }
  };

  if (!classId) {
    return <div>Class not found</div>;
  }

  return (
    <div>
      <Nav />
      <div className={styles.folderWrapper}>
        <Breadcrumb />

        {auth.loading || !content.contentLoadStatus[classId] ? (
          <div>
            <Spinner size="l" txt="Loading Quizzes..." />
          </div>
        ) : (
          <Content classId={classId || ""} />
        )}
      </div>
    </div>
  );
};
