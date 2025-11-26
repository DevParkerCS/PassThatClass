import { useNavigate, useParams } from "react-router-dom";
import { Nav } from "../../components/Nav/Nav";
import styles from "./ClassFolder.module.scss";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";
import { Ctas } from "./components/Ctas/Ctas";
import { Content } from "./components/Content/Content";
import { useEffect, useState } from "react";
import { useDataContext } from "../../context/DataContext/DataContext";

export const ClassFolder = () => {
  const { id } = useParams<{ id: string }>();
  const data = useDataContext();

  useEffect(() => {
    if (!id || data.contentById[id]) {
      console.log("no call");
      return;
    }

    data.loadContent(id);
  }, []);

  if (!id) {
    return <div>Class not found</div>;
  }

  return (
    <div>
      <Nav />
      <div className={styles.folderWrapper}>
        <p className={styles.classTitle}>{data.classesById[id]?.name}</p>

        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb />
        </div>

        {/* <div className={styles.searchWrapper}>
          <SearchBar p="Search Quizzes and Flashcards" />
        </div> */}
        <Content classId={id || ""} />
      </div>
    </div>
  );
};
