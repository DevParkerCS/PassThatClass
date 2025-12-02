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

export const ClassFolder = () => {
  const { classId } = useParams<{ classId: string }>();
  const content = useContentContext();
  const auth = useAuthContext();
  const nav = useNavigate();

  const hasContentForClass = !!(classId && content.contentById[classId]);

  useEffect(() => {
    if (!classId) return;

    // 1) Auth redirect
    if (!auth.loading && !auth.session) {
      nav("/login");
      return;
    }

    // 2) Load content once per class (only when authenticated and not yet loaded)
    if (!auth.loading && auth.session && !hasContentForClass) {
      content.loadContent(classId);
    }
  }, [
    auth.loading,
    auth.session,
    classId,
    hasContentForClass,
    content.loadContent,
    nav,
  ]);

  if (!classId) {
    return <div>Class not found</div>;
  }

  return (
    <div>
      <Nav />
      <div className={styles.folderWrapper}>
        <Breadcrumb />

        {auth.loading || !content.contentById[classId] ? (
          <div>
            <Spinner size="l" />
          </div>
        ) : (
          <Content classId={classId || ""} />
        )}
      </div>
    </div>
  );
};
