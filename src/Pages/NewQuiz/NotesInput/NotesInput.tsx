import styles from "./NotesInput.module.scss";
import shared from "../shared/styles.module.scss";
import { Dispatch, SetStateAction } from "react";

type NotesInputProps = {
  setInput: Dispatch<SetStateAction<string>>;
  input: string;
};

export const NotesInput = ({ setInput, input }: NotesInputProps) => {
  return (
    <div className={`${styles.notesWrapper}`}>
      <label className={shared.inputLabel} htmlFor="notes-paste">
        Paste Notes
      </label>
      <p className={styles.characterNote}>
        * We Will Use Up To The First 10,000 Characters Of Notes
      </p>
      <textarea
        maxLength={10000}
        className={styles.notesInput}
        id="notes-paste"
        placeholder="Paste Notes Here"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};
