import { useParams } from "react-router-dom";
import { Nav } from "../../components/Nav/Nav";
import styles from "./NewQuiz.module.scss";
import { useDataContext } from "../../context/DataContext/DataContext";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { GradeInput } from "./GradeInput/GradeInput";
import { FileInput } from "./FileInput/FileInput";
import { NumInput } from "./NumInput/NumInput";
import { NotesInput } from "./NotesInput/NotesInput";
import { ErrorModal } from "./ErrorModal/ErrorModal";
import axios from "axios";

export const NewQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const [numQuestions, setNumQuestions] = useState(10);
  const [chosenGrade, setChosenGrade] = useState("Select Grade");
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const data = useDataContext();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (chosenGrade === "Select Grade") {
      setError("Grade Isn't Chosen");
      return;
    } else if (files.length === 0 && input.length === 0) {
      setError("No Files Or Text Was Inputted");
      return;
    }

    const formData = new FormData();
    formData.append("notesText", input);
    formData.append("gradeLevel", chosenGrade);
    formData.append("numQuestions", String(numQuestions));

    files.forEach((file) => {
      formData.append("images", file);
    });

    console.log("SENDING");

    const res = await axios.post(
      "http://localhost:8000/quiz/from-notes",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log(res.data);
  };

  useEffect(() => {
    if (!error) return;

    const timeoutId = setTimeout(() => {
      setError("");
      console.log("DONE");
    }, 2000);

    return () => clearTimeout(timeoutId); // clean up if error changes/unmounts
  }, [error]);

  if (!id || !data.classesById[id]) {
    return <div>Class Not Found</div>;
  }

  return (
    <div>
      <Nav />
      <div className={styles.contentWrapper}>
        <Breadcrumb />
        <p className={styles.title}>New Quiz</p>

        <div className={`${styles.infoWrapper} ${error && styles.error}`}>
          <ErrorModal error={error} isActive={!!error} />

          <form onSubmit={handleSubmit} className={styles.inputsWrapper}>
            <GradeInput
              setChosenGrade={setChosenGrade}
              chosenGrade={chosenGrade}
            />
            <NumInput
              numQuestions={numQuestions}
              setNumQuestions={setNumQuestions}
            />
            <FileInput files={files} setFiles={setFiles} />
            <NotesInput setInput={setInput} input={input} />

            <div className={styles.submitWrapper}>
              <p className={styles.genInfo}>
                <span>1 Generation </span>&bull;{" "}
                <span>7 Generations Left This Month</span>
              </p>
              <button className={styles.submitBtn} type="submit">
                Generate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
