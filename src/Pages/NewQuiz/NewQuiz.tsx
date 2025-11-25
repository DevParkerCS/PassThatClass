import { useParams } from "react-router-dom";
import { Nav } from "../../components/Nav/Nav";
import styles from "./NewQuiz.module.scss";
import { useDataContext } from "../../context/DataContext/DataContext";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";
import { Dispatch, SetStateAction, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { GradeInput } from "./GradeInput/GradeInput";
import { FileInput } from "./FileInput/FileInput";
import { NumInput } from "./NumInput/NumInput";
import { NotesInput } from "./NotesInput/NotesInput";

export const NewQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const [numQuestions, setNumQuestions] = useState(10);
  const [chosenGrade, setChosenGrade] = useState("Select Grade");
  const [files, setFiles] = useState<File[]>([]);
  const data = useDataContext();

  if (!id || !data.classesById[id]) {
    return <div>Class Not Found</div>;
  }

  return (
    <div>
      <Nav />
      <div className={styles.contentWrapper}>
        <Breadcrumb />
        <p className={styles.title}>New Quiz</p>

        <div className={styles.infoWrapper}>
          <GradeInput
            setChosenGrade={setChosenGrade}
            chosenGrade={chosenGrade}
          />
          <NumInput
            numQuestions={numQuestions}
            setNumQuestions={setNumQuestions}
          />
          <FileInput files={files} setFiles={setFiles} />
          <NotesInput />
        </div>
      </div>
    </div>
  );
};
