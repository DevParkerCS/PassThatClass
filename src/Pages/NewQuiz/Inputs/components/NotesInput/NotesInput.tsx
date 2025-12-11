import styles from "./NotesInput.module.scss";
import shared from "../../../shared/styles.module.scss";
import { Dispatch, SetStateAction } from "react";
import { useAuthContext } from "../../../../../context/AuthContext/AuthContext";

type NotesInputProps = {
  setInput: Dispatch<SetStateAction<string>>;
  input: string;
};

const MAX_CHARS = 20000;

export const NotesInput = ({ setInput, input }: NotesInputProps) => {
  const authCtx = useAuthContext();

  return (
    <div className={`${styles.notesWrapper}`}>
      <label className={shared.inputLabel} htmlFor="notes-paste">
        Paste Notes
      </label>
      <p className={shared.inputNote}>
        * We Will Use Up To The First{" "}
        {authCtx.profile?.plan.char_limit.toLocaleString()} Characters Of Notes
      </p>
      <textarea
        maxLength={authCtx.profile?.plan.char_limit || 5000}
        className={styles.notesInput}
        id="notes-paste"
        placeholder={`Paste Notes Here`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};
