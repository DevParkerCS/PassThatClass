import { useNavigate } from "react-router-dom";
import { Nav } from "../../components/Nav/Nav";
import styles from "./ClassFolder.module.scss";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";

export const ClassFolder = () => {
  const nav = useNavigate();

  return (
    <div>
      <Nav />
      <div className={styles.folderWrapper}>
        <p className={styles.classTitle}>Biology 201</p>

        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb />
        </div>

        <div className={styles.searchWrapper}>
          <SearchBar p="Search Quizzes and Flashcards" />
        </div>
      </div>
    </div>
  );
};

type ClassContentProps = {};

const ClassContent = () => {
  return <div className={styles.classContentWrapper}></div>;
};
