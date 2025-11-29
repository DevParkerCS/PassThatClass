import { Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./FileInput.module.scss";
import shared from "../../../shared/styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

type FileInputProps = {
  setFiles: Dispatch<SetStateAction<File[]>>;
  files: File[];
};

export const FileInput = ({ setFiles, files }: FileInputProps) => {
  const MAX_FILES = 5;
  const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // shared logic for both normal file input + drag-n-drop
  const processIncomingFiles = (incomingFiles: File[]) => {
    if (incomingFiles.length === 0) return;

    const valid = incomingFiles.filter(
      (file) => file.size <= MAX_IMAGE_SIZE_BYTES
    );
    const rejected = incomingFiles.filter(
      (file) => file.size > MAX_IMAGE_SIZE_BYTES
    );

    const curFiles = [...files, ...valid];
    const limited = curFiles.slice(0, MAX_FILES);

    if (curFiles.length > MAX_FILES) {
      // TODO: surface this to user
      console.log(`Too many files. Max is ${MAX_FILES}.`);
    } else if (rejected.length > 0) {
      console.log("Some files were too big. Max size is 10MB.");
    }

    setFiles(limited);
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = e.target.files ? Array.from(e.target.files) : [];
    processIncomingFiles(incoming);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const incoming = Array.from(e.dataTransfer.files || []);
    // only keep images
    const imageFiles = incoming.filter((f) => f.type.startsWith("image/"));
    processIncomingFiles(imageFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClick = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div
        className={`${shared.inputWrapper} ${styles.filesInputWrapper} ${
          isDragging ? styles.dragging : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <label className={shared.inputLabel}>Upload Notes</label>

        <div className={styles.filesInputBtn}>
          <FontAwesomeIcon icon={faUpload} />
          <p>Drop images here,</p>
          <p>or click to browse</p>
          <p>(Max 5 Images)</p>
        </div>

        {/* Hidden actual input – still handles normal file selection */}
        <input
          ref={inputRef}
          className={styles.filesInput}
          type="file"
          accept=".jpg, .png, .jpeg"
          multiple
          onChange={handleFilesChange}
          // you can keep this visually hidden via CSS as you had before
        />
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
