import { useEffect, useState } from "react";
import { FileInput } from "./components/FileInput/FileInput";
import { GradeInput } from "./components/GradeInput/GradeInput";
import { NotesInput } from "./components/NotesInput/NotesInput";
import { NumInput } from "./components/NumInput/NumInput";
import styles from "./Inputs.module.scss";
import shared from "../shared/styles.module.scss";
import { ExamplesInput } from "./components/ExamplesInput/ExamplesInput";
import { Difficulty } from "../../../context/DataContext/types";
import { useSearchParams } from "react-router-dom";
import { useContentContext } from "../../../context/DataContext/ContentContext";

type InputsProps = {
  classId: string;
  submitCb: (
    newId: string,
    chosenGrade: Difficulty,
    files: File[],
    input: string,
    numQuestions: number,
    genExamples: boolean
  ) => Promise<void>;
};

export const Inputs = ({ submitCb, classId }: InputsProps) => {
  const [numQuestions, setNumQuestions] = useState(10);
  const [chosenGrade, setChosenGrade] = useState<Difficulty>("Select Grade");
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState<string>("");
  const [genExamples, setGenExamples] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [newId, setNewId] = useState(() => crypto.randomUUID());
  const contentId = searchParams.get("quizId");
  const contentCtx = useContentContext();

  useEffect(() => {
    if (!contentId) return;

    const content = contentCtx.contentById[classId];

    if (!content) return;

    const meta = content.find((c) => c.id === contentId);
    const inputs = contentCtx.lastUploaded[classId];

    if (meta) {
      setNumQuestions(meta.num_items);
      setChosenGrade(meta.difficulty);
    }

    if (inputs) {
      setFiles(inputs[0]);
      setInput(inputs[1]);
    }
  }, [contentId]);

  // Prevent Refresh and call cb function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitCb(newId, chosenGrade, files, input, numQuestions, genExamples);
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
