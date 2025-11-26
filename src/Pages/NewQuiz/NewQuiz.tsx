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

  // Sets Timeout For Error Message That Pops Up
  useEffect(() => {
    if (!error) return;

    // Hides error after 2 seconds
    const timeoutId = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  if (!classId || !data.classesById[classId]) {
    return <div>Class Not Found</div>;
  }

  // Runs when quiz form is submitted
  const handleSubmit = async (
    chosenGrade: string,
    files: File[],
    input: string,
    numQuestions: number
  ) => {
    // Ensure all fields are filled out
    if (chosenGrade === "Select Grade") {
      setError("Grade Isn't Chosen");
      return;
    } else if (files.length === 0 && input.length === 0) {
      setError("No Files Or Text Was Inputted");
      return;
    }
    setSubmitionState("generating");

    // Load data in FormData to pass to API
    const formData = new FormData();
    formData.append("notesText", input);
    formData.append("gradeLevel", chosenGrade);
    formData.append("numQuestions", String(numQuestions));
    formData.append("classId", classId);

    // Add files
    files.forEach((file) => {
      formData.append("images", file);
    });

    console.log("SENDING");

    try {
      // Call API to add generate new quiz
      const qd: QuizMeta = await data.AddNewQuiz(formData, classId);

      // Navigate to class folder with new modal open
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
