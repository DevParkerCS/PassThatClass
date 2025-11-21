import { useNavigate } from "react-router-dom";
import { Nav } from "../../components/Nav/Nav";
import styles from "./ClassFolder.module.scss";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Ctas } from "./components/Ctas/Ctas";
import { Content } from "./components/Content/Content";

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

        <Ctas />

        <Content />
      </div>
    </div>
  );
};
