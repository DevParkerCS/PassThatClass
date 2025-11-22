import {
  faFolderOpen,
  faPlus,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Dashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nav } from "../../components/Nav/Nav";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClassAddModal } from "./components/ClassAddModal/ClassAddModal";

export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nav = useNavigate();

  const [classes, setClasses] = useState([
    "Biology 201",
    "CSCI 447",
    "CSCI 497",
    "ECON 206",
  ]);

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

  const handleAddClass = (name: string) => {
    setClasses([...classes, name]);
    setIsModalOpen(false);
  };

  const handleClick = (id: number) => {
    if (id === -1) {
      return;
    }

    nav("/class");
  };

  return (
    <div>
      <Nav />

      {isModalOpen && (
        <ClassAddModal cb={handleAddClass} setModalOpen={setIsModalOpen} />
      )}

      <div>
        <h2 className={styles.dashboardTitle}>Dashboard</h2>
      </div>

      <div className={styles.searchWrapper}>
        <SearchBar p={"Search For Classes"} />
      </div>

      <div className={styles.classesWrapper}>
        <div className={styles.classesSizeWrapper}>
          {classes.map((n, i) => {
            return (
              <Class
                name={n}
                key={i}
                id={i}
                icon={faFolderOpen}
                cb={handleClick}
              />
            );
          })}
          <Class
            id={-1}
            name="Add Class"
            icon={faPlus}
            cb={() => setIsModalOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};

type ClassProps = {
  name: string;
  icon: IconDefinition;
  id: number;
  cb: (id: number) => void;
};

export const Class = ({ name, icon, id, cb }: ClassProps) => {
  return (
    <div className={styles.classWrapper} onClick={() => cb(id)}>
      <div className={styles.classTxtWrapper}>
        <FontAwesomeIcon className={styles.classIcon} icon={icon} />
        <p className={styles.className}>{name}</p>
      </div>
    </div>
  );
};
