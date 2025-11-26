import { useNavigate, useParams } from "react-router-dom";
import { Nav } from "../../components/Nav/Nav";
import styles from "./NewQuiz.module.scss";
import { useDataContext } from "../../context/DataContext/DataContext";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";
import { ErrorModal } from "./ErrorModal/ErrorModal";
import axios, { AxiosError } from "axios";
import { Inputs } from "./Inputs/Inputs";
import { Spinner } from "../../components/Spinner/Spinner";
import { ContentList } from "../ClassFolder/components/Content/components/ContentModal/ContentModal";
import { QuizMeta } from "../../context/DataContext/types";

type SubmitionState = "info" | "generating" | "finished";

export const NewQuiz = () => {
  const { id: classId } = useParams<{ id: string }>();
  const [error, setError] = useState("");
  const [submitionState, setSubmitionState] = useState<SubmitionState>("info");
  const data = useDataContext();
  const nav = useNavigate();

  useEffect(() => {
    if (!error) return;

    const timeoutId = setTimeout(() => {
      setError("");
      console.log("DONE");
    }, 2000);

    return () => clearTimeout(timeoutId); // clean up if error changes/unmounts
  }, [error]);

  if (!classId || !data.classesById[classId]) {
    return <div>Class Not Found</div>;
  }

  const handleSubmit = async (
    chosenGrade: string,
    files: File[],
    input: string,
    numQuestions: number
  ) => {
    if (chosenGrade === "Select Grade") {
      setError("Grade Isn't Chosen");
      return;
    } else if (files.length === 0 && input.length === 0) {
      setError("No Files Or Text Was Inputted");
      return;
    }
    setSubmitionState("generating");

    const formData = new FormData();
    formData.append("notesText", input);
    formData.append("gradeLevel", chosenGrade);
    formData.append("numQuestions", String(numQuestions));
    formData.append("classId", classId);

    files.forEach((file) => {
      formData.append("images", file);
    });

    console.log("SENDING");

    try {
      const qd: QuizMeta = await data.AddNewQuiz(formData, classId);
      console.log(qd);
      nav(`/class/${classId}?quizId=${qd.id}`);
    } catch (e) {
      const error = e as AxiosError;
      setSubmitionState("info");
      setError(error.message);
    }
  };

  return (
    <div>
      <Nav />
      <div className={styles.contentWrapper}>
        {submitionState === "info" && (
          <div>
            <Breadcrumb />
            <p className={styles.title}>New Quiz</p>

            <div className={`${styles.infoWrapper} ${error && styles.error}`}>
              <ErrorModal error={error} isActive={!!error} />

              <Inputs submitCb={handleSubmit} />
            </div>
          </div>
        )}

        {submitionState === "generating" && (
          <div>
            <Spinner txt="Parsing information and generating quiz..." />
          </div>
        )}
      </div>
    </div>
  );
};
