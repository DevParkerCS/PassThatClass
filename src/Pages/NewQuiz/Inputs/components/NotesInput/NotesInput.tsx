import styles from "./NotesInput.module.scss";
import shared from "../../../shared/styles.module.scss";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useAuthContext } from "../../../../../context/AuthContext/AuthContext";

type NotesInputProps = {
  setInput: Dispatch<SetStateAction<string>>;
  input: string;
};

export const NotesInput = ({ setInput, input }: NotesInputProps) => {
  const authCtx = useAuthContext();
  const [maxChars, setMaxChars] = useState(
    authCtx.profile?.plan.char_limit || 5000
  );

  useEffect(() => {
    if (!authCtx.profile) return;

    setMaxChars(authCtx.profile.plan.char_limit);
  }, [authCtx]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxChars) {
      setInput(e.target.value);
    }
  };

  return (
    <div className={`${styles.notesWrapper}`}>
      <label className={shared.inputLabel} htmlFor="notes-paste">
        Paste Notes
      </label>
      <p className={shared.inputNote}>
        * We Will Use Up To The First {maxChars.toLocaleString()} Characters Of
        Notes
      </p>
      <textarea
        maxLength={maxChars}
        className={styles.notesInput}
        id="notes-paste"
        placeholder={`Paste Notes Here`}
        value={input}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
};
