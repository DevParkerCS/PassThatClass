import { useState } from "react";
import { FileInput } from "./components/FileInput/FileInput";
import { GradeInput } from "./components/GradeInput/GradeInput";
import { NotesInput } from "./components/NotesInput/NotesInput";
import { NumInput } from "./components/NumInput/NumInput";
import styles from "./Inputs.module.scss";

type InputsProps = {
  submitCb: (
    chosenGrade: string,
    files: File[],
    input: string,
    numQuestions: number
  ) => Promise<void>;
};

export const Inputs = ({ submitCb }: InputsProps) => {
  const [numQuestions, setNumQuestions] = useState(10);
  const [chosenGrade, setChosenGrade] = useState("Select Grade");
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState<string>("");

  // Prevent Refresh and call cb function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitCb(chosenGrade, files, input, numQuestions);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.inputsWrapper}>
        <GradeInput setChosenGrade={setChosenGrade} chosenGrade={chosenGrade} />
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
  );
};
