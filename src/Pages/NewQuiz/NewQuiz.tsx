import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Nav } from "../../components/Nav/Nav";
import styles from "./NewQuiz.module.scss";
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";
import { ErrorModal } from "./ErrorModal/ErrorModal";
import axios, { AxiosError } from "axios";
import { Inputs } from "./Inputs/Inputs";
import { Spinner } from "../../components/Spinner/Spinner";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import { useContentContext } from "../../context/DataContext/ContentContext";
import { useClassesContext } from "../../context/DataContext/ClassesContext";
import { Difficulty } from "../../context/DataContext/types";

type SubmitionState = "info" | "generating" | "finished";

export const NewQuiz = () => {
  const { classId } = useParams<{ classId: string }>();
  const [error, setError] = useState("");
  const contentCtx = useContentContext();
  const classesCtx = useClassesContext();
  const auth = useAuthContext();
  const nav = useNavigate();

  // Sets Timeout For Error Message That Pops Up
  useEffect(() => {
    if (!error) return;

    // Hides error after 2 seconds
    const timeoutId = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  if (!classId || !classesCtx.classesById[classId]) {
    return <div>Class Not Found</div>;
  }

  // Runs when quiz form is submitted
  const handleSubmit = async (
    newId: string,
    existingQuiz: boolean,
    chosenGrade: Difficulty,
    files: File[],
    input: string,
    numQuestions: number,
    genExample: boolean
  ) => {
    // Ensure all fields are filled out
    if (chosenGrade === "Select Grade") {
      setError("Grade Isn't Chosen");
      return;
    } else if (files.length === 0 && input.length === 0) {
      setError("No Files Or Text Was Inputted");
      return;
    }

    try {
      contentCtx.callAddNewQuiz(
        newId,
        existingQuiz,
        classId,
        chosenGrade,
        files,
        input,
        numQuestions,
        genExample
      );

      const className = classesCtx.classesById[classId].name;
      nav(`/class/${encodeURIComponent(className)}/${classId}`);
    } catch (e) {
      const error = e as AxiosError;
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div>
      <Nav />
      <div className={styles.contentWrapper}>
        <div>
          <Breadcrumb />
          <p className={styles.title}>New Quiz</p>

          <div className={`${styles.infoWrapper} ${error && styles.error}`}>
            <ErrorModal error={error} isActive={!!error} />

            <Inputs classId={classId} submitCb={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};
