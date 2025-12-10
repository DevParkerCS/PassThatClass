import { Nav } from "../../components/Nav/Nav";
import styles from "./LandingPage.module.scss";
import item from "../../assets/PTCQuizItem.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChartLine,
  faClipboardQuestion,
  faFolder,
  faListCheck,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { Hero } from "./components/Hero/Hero";
import { Upload } from "./components/Upload/Upload";
import { Works } from "./components/Works/Works";
import { Pricing } from "./components/Pricing/Pricing";
import { useEffect } from "react";

export const LandingPage = () => {
  useEffect(() => {
    document.title = "PassThatClass – Turn Your Notes Into AI Practice Quizzes";
  }, []);

  return (
    <div>
      <Nav />
      <div className={styles.contentWrapper}>
        <Hero />
        <div className={styles.sectionsWrapper}>
          <Upload />

          <Works />

          <Pricing />
        </div>
      </div>
    </div>
  );
};
