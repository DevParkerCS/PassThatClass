import {
  faFolderOpen,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Dashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nav } from "../../components/Nav/Nav";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const classes = [
    "Biology 201",
    "CSCI 447",
    "CSCI 497",
    "ECON 206",
    "Biology 201",
    "CSCI 447",
    "CSCI 497",
    "ECON 206",
  ];

  return (
    <div>
      <Nav />

      <div>
        <h2 className={styles.dashboardTitle}>Dashboard</h2>
      </div>

      <div className={styles.searchWrapper}>
        <SearchBar p={"Search For Classes"} />
      </div>

      <div className={styles.classesWrapper}>
        <div className={styles.classesSizeWrapper}>
          {classes.map((n, i) => {
            return <Class name={n} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
};

type ClassProps = {
  name: string;
};

export const Class = ({ name }: ClassProps) => {
  const nav = useNavigate();

  return (
    <div className={styles.classWrapper} onClick={() => nav("/class")}>
      <div className={styles.classTxtWrapper}>
        <FontAwesomeIcon className={styles.classIcon} icon={faFolderOpen} />
        <p className={styles.className}>{name}</p>
      </div>
    </div>
  );
};
