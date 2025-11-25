import { Dispatch, SetStateAction } from "react";
import styles from "./FileInput.module.scss";
import shared from "../shared/styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

type FileInputProps = {
  setFiles: Dispatch<SetStateAction<File[]>>;
  files: File[];
};

export const FileInput = ({ setFiles, files }: FileInputProps) => {
  const MAX_FILES = 5;

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = e.target.files ? Array.from(e.target.files) : [];
    const curFiles = [...files];
    curFiles.push(...incoming);
    const limited = curFiles.slice(0, MAX_FILES);

    if (curFiles.length > MAX_FILES) {
    }

    setFiles(limited);
    e.target.value = "";
  };

  const handleClick = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div className={`${shared.inputWrapper} ${styles.filesInputWrapper}`}>
        <label className={shared.inputLabel} htmlFor="notes-upload">
          Upload Notes
        </label>
        <label htmlFor="notes-upload" className={styles.filesInputBtn}>
          <FontAwesomeIcon icon={faUpload} />
          <p>Drop an Image,</p>
          <p>or click to browse</p>
          <p>(Max 5 Images)</p>
        </label>
        <input
          className={styles.filesInput}
          type="file"
          id="notes-upload"
          accept=".jpg, .png"
          multiple
          onChange={handleFilesChange}
        ></input>
      </div>

      <div className={styles.previewGrid}>
        {files.map((file, i) => (
          <div
            key={i}
            className={styles.previewItem}
            onClick={() => handleClick(i)}
          >
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className={styles.previewImg}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
