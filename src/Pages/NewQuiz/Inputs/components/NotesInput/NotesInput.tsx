import styles from "./NotesInput.module.scss";
import shared from "../../../shared/styles.module.scss";
import { Dispatch, SetStateAction } from "react";

type NotesInputProps = {
  setInput: Dispatch<SetStateAction<string>>;
  input: string;
};

const MAX_CHARS = 20000;

export const NotesInput = ({ setInput, input }: NotesInputProps) => {
  return (
    <div className={`${styles.notesWrapper}`}>
      <label className={shared.inputLabel} htmlFor="notes-paste">
        Paste Notes
      </label>
      <p className={shared.inputNote}>
        * We Will Use Up To The First 20,000 Characters Of Notes
      </p>
      <textarea
        maxLength={20000}
        className={styles.notesInput}
        id="notes-paste"
        placeholder={`Paste Notes Here Or Ask For Specific Content (ex: "Generate A Quiz About Dogs")"`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};
