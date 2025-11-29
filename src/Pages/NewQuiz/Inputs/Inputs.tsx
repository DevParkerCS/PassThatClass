import { useState } from "react";
import { FileInput } from "./components/FileInput/FileInput";
import { GradeInput } from "./components/GradeInput/GradeInput";
import { NotesInput } from "./components/NotesInput/NotesInput";
import { NumInput } from "./components/NumInput/NumInput";
import styles from "./Inputs.module.scss";
import shared from "../shared/styles.module.scss";
import { ExamplesInput } from "./components/ExamplesInput/ExamplesInput";

type InputsProps = {
  submitCb: (
    chosenGrade: string,
    files: File[],
    input: string,
    numQuestions: number,
    genExamples: boolean
  ) => Promise<void>;
};

export const Inputs = ({ submitCb }: InputsProps) => {
  const [numQuestions, setNumQuestions] = useState(10);
  const [chosenGrade, setChosenGrade] = useState("Select Grade");
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState<string>("");
  const [genExamples, setGenExamples] = useState(false);

  // Prevent Refresh and call cb function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitCb(chosenGrade, files, input, numQuestions, genExamples);
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

        <ExamplesInput
          genExamples={genExamples}
          setGenExamples={setGenExamples}
        />

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
