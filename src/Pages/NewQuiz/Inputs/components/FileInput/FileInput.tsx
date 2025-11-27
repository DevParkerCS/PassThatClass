import { Dispatch, SetStateAction } from "react";
import styles from "./FileInput.module.scss";
import shared from "../../../shared/styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

type FileInputProps = {
  setFiles: Dispatch<SetStateAction<File[]>>;
  files: File[];
};

export const FileInput = ({ setFiles, files }: FileInputProps) => {
  // Input File config
  const MAX_FILES = 5;
  const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

  // Runs whenever new files are updated
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the files from the input
    const incoming = e.target.files ? Array.from(e.target.files) : [];
    // Filter out the files that are too big
    const valid = incoming.filter((file) => file.size <= MAX_IMAGE_SIZE_BYTES);
    const rejected = incoming.filter(
      (file) => file.size > MAX_IMAGE_SIZE_BYTES
    );

    // Push all the old files and new files into one array
    const curFiles = [...files];
    curFiles.push(...valid);
    // Only keep MAX_FILES files
    const limited = curFiles.slice(0, MAX_FILES);

    // Display message to user too many files uploaded
    if (curFiles.length > MAX_FILES) {
    } else if (rejected.length > 0) {
      console.log("Some Files Were Too Big.  Max Size is 10MB");
    }

    setFiles(limited);
    e.target.value = "";
  };

  // Delete image from list on click
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
          accept=".jpg, .png, .jpeg"
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
