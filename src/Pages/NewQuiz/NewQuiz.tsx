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
import { useAuthContext } from "../../context/AuthContext/AuthContext";

type SubmitionState = "info" | "generating" | "finished";

export const NewQuiz = () => {
  const { classId } = useParams<{ classId: string }>();
  const [error, setError] = useState("");
  const [submitionState, setSubmitionState] = useState<SubmitionState>("info");
  const [runningOcr, setRunningOcr] = useState(false);
  const data = useDataContext();
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

  if (!classId || !data.classesById[classId]) {
    return <div>Class Not Found</div>;
  }

  // Runs when quiz form is submitted
  const handleSubmit = async (
    chosenGrade: string,
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

    setSubmitionState("generating");
    setRunningOcr(true);

    try {
      const qd = await data.AddNewQuiz({
        classId,
        chosenGrade,
        files,
        input,
        numQuestions,
        genExample,
      });

      setRunningOcr(false);

      // fix the URL: /class/:className/:classId
      const className = data.classesById[classId].name;
      nav(`/class/${encodeURIComponent(className)}/${classId}?quizId=${qd.id}`);
    } catch (e) {
      setRunningOcr(false);
      const error = e as AxiosError;
      console.error(error);
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
            <Spinner
              txt={`${runningOcr ? "Parsing Images..." : "Generating Quiz..."}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
