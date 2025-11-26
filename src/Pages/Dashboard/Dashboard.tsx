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
import axios from "axios";
import { useDataContext } from "../../context/DataContext/DataContext";

export type ClassUIType = {
  id: string;
  name: string;
};

export const Dashboard = () => {
  const data = useDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nav = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAddClass = async (name: string) => {
    if (name.trim() === "" || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await data.AddClass(name);
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
    }

    setIsSubmitting(false);
  };

  const handleClick = (id: string) => {
    if (id === "") {
      return;
    }

    nav(`/class/${id}`);
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

      {/* <div className={styles.searchWrapper}>
        <SearchBar p={"Search For Classes"} />
      </div> */}

      <div className={styles.classesWrapper}>
        <div className={styles.classesSizeWrapper}>
          {data.classes.map((n, i) => {
            return (
              <Class
                name={n.name}
                key={i}
                id={n.id}
                icon={faFolderOpen}
                cb={handleClick}
              />
            );
          })}
          <Class
            id={""}
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
  id: string;
  cb: (id: string) => void;
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
