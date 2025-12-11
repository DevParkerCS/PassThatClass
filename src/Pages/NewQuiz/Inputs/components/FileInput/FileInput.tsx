import { Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./FileInput.module.scss";
import shared from "../../../shared/styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faUpload, faX } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../../../../../context/AuthContext/AuthContext";

type FileInputProps = {
  setFiles: Dispatch<SetStateAction<File[]>>;
  files: File[];
};

const MAX_MB = 20;
const MAX_IMAGE_SIZE_BYTES = MAX_MB * 1024 * 1024;

export const FileInput = ({ setFiles, files }: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const authCtx = useAuthContext();

  // shared logic for both normal file input + drag-n-drop
  const processIncomingFiles = (incomingFiles: File[]) => {
    if (incomingFiles.length === 0 || !authCtx.profile) return;

    const valid = incomingFiles.filter(
      (file) => file.size <= MAX_IMAGE_SIZE_BYTES
    );
    const rejected = incomingFiles.filter(
      (file) => file.size > MAX_IMAGE_SIZE_BYTES
    );

    const curFiles = [...files, ...valid];
    const limited = curFiles.slice(0, authCtx.profile?.plan.image_limit);

    if (curFiles.length > authCtx.profile?.plan.image_limit) {
      console.log(
        `Too many files. Max for your subscription is ${authCtx.profile?.plan.image_limit}.`
      );
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
        <label className={shared.inputLabel}>Upload Images</label>
        <p className={shared.inputNote}>
          * Each page in a PDF counts as 1 image.
        </p>

        <div className={styles.filesInputBtn}>
          <FontAwesomeIcon icon={faUpload} />
          <p>Drop images here,</p>
          <p>or click to browse</p>
          <p>{`Max ${authCtx.profile?.plan.image_limit} Images`}</p>
        </div>

        <input
          ref={inputRef}
          className={styles.filesInput}
          type="file"
          accept=".jpg, .png, .jpeg, .pdf"
          multiple
          onChange={handleFilesChange}
        />
      </div>

      <div className={styles.previewGrid}>
        {files.map((file, i) => (
          <div key={i} className={styles.previewItem}>
            <div className={styles.delWrapper}>
              <FontAwesomeIcon
                className={styles.itemDel}
                onClick={() => handleClick(i)}
                icon={faX}
              />
            </div>
            {file.type === "application/pdf" ? (
              <div className={styles.pdfWrapper}>
                <FontAwesomeIcon className={styles.pdfIcon} icon={faFilePdf} />
                <p className={styles.pdfName}>{file.name}</p>
              </div>
            ) : (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className={styles.previewImg}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
