import { faXmark } from "@fortawesome/free-solid-svg-icons";
import shared from "../ContentModal.module.scss";
import styles from "./EditModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ActiveModal } from "../../../Content";
import {
  QuizMeta,
  QuizQuestionType,
} from "../../../../../../../context/DataContext/types";
import { useContentContext } from "../../../../../../../context/DataContext/ContentContext";
import { Spinner } from "../../../../../../../components/Spinner/Spinner";
import { AutoResizeTextarea } from "../../../../../../../components/AutoResizeTextArea/AutoResizeTextArea";

type EditModalProps = {
  contentId: string;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
};

export const EditModal = ({ contentId, setActiveModal }: EditModalProps) => {
  const contentCtx = useContentContext();
  const [editedMeta, setEditedMeta] = useState<QuizMeta>(
    contentCtx.quizMetaById[contentId]
  );
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setEditedMeta(contentCtx.quizMetaById[contentId]);
  }, [contentCtx.quizMetaById]);

  useEffect(() => {
    if (changed === true) return;

    setChanged(true);
  }, [editedMeta]);

  // useLayoutEffect(() => {
  //   console.log("CHANGING");
  //   if (questionRef.current) {
  //     setQuestionsHeight(questionRef.current.clientHeight);
  //   }
  // }, [activeIndex]);

  return (
    <div>
      <div
        className={shared.modalBackground}
        onClick={() => setActiveModal("content")}
      ></div>

      <div className={`${shared.modalWrapper} ${styles.editModalWrapper}`}>
        <div className={shared.outsideWrapper}>
          <div
            className={shared.exitBtn}
            onClick={() => setActiveModal("content")}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>

          <p className={shared.modalTitle}>Quick Edit</p>

          {!editedMeta ? (
            <div className={shared.loadingWrapper}>
              <Spinner size="l" />
            </div>
          ) : (
            <div className={styles.inputsWrapper}>
              <div className={styles.inputWrapper}>
                <label className={styles.inputLabel}>Title</label>
                <AutoResizeTextarea
                  value={editedMeta.title}
                  className={styles.input}
                  onChange={(e) =>
                    setEditedMeta((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div className={styles.inputWrapper}>
                {/* <label className={shared.inputLabel}>Questions</label> */}
                <div className={shared.contentWrapper}>
                  {/* <div className={shared.questionsWrapper}>
                    {editedContent.map((e, ei) => {
                      return (
                        <EditQuestion
                          key={ei}
                          editedContent={editedContent}
                          index={ei}
                          setEditedContent={setEditedContent}
                        />
                      );
                    })}
                  </div> */}

                  <div className={styles.editBtns}>
                    <button
                      className={`${styles.editBtn} ${styles.cnclBtn}`}
                      onClick={() => setActiveModal("content")}
                    >
                      Cancel
                    </button>
                    <button className={`${styles.editBtn} ${styles.fullBtn}`}>
                      Open Full Editor
                    </button>
                    <button className={`${styles.editBtn} ${styles.saveBtn}`}>
                      Save
                    </button>
                  </div>
                  {/* <div ref={questionRef} style={{ height: "fit-content" }}>
                    <div>
                      <p className={shared.inputLabel}>
                        Question {activeIndex + 1}
                      </p>
                      <AutoResizeTextarea
                        className={shared.input}
                        value={editedContent[activeIndex].question}
                        onChange={(e) =>
                          setEditedContent((prev) => {
                            if (!prev) return prev;
                            const next = [...prev];
                            next[activeIndex] = {
                              ...next[activeIndex],
                              question: e.target.value,
                            };
                            return next;
                          })
                        }
                      />
                    </div>

                    <div>
                      <EditQuestionOptions
                        editedContent={editedContent}
                        setEditedContent={setEditedContent}
                        setActiveIndex={setActiveIndex}
                        index={activeIndex}
                        activeIndex={activeIndex}
                      />
                      <div className={shared.explanationWrapper}>
                        <p className={shared.inputLabel}>Explanation</p>
                        <AutoResizeTextarea
                          className={shared.input}
                          value={editedContent[activeIndex].explanation}
                          onChange={(e) =>
                            setEditedContent((prev) => {
                              if (!prev) return prev;
                              const next = [...prev];
                              next[activeIndex] = {
                                ...next[activeIndex],
                                explanation: e.target.value,
                              };
                              return next;
                            })
                          }
                        />
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type EditQuestionProps = {
  index: number;
  editedContent: QuizQuestionType[];
  setEditedContent: Dispatch<SetStateAction<QuizQuestionType[] | undefined>>;
};

export const EditQuestion = ({
  index,
  editedContent,
  setEditedContent,
}: EditQuestionProps) => {
  return (
    <div className={`${shared.question}`}>
      <p className={shared.questionIndex}>{index + 1}</p>
      <AutoResizeTextarea
        className={shared.input}
        value={editedContent[index].question}
        onChange={(e) =>
          setEditedContent((prev) => {
            if (!prev) return prev;
            const next = [...prev];
            next[index] = {
              ...next[index],
              question: e.target.value,
            };
            return next;
          })
        }
      />
    </div>
  );
};

// export const EditQuestionOptions = ({
//   editedContent,
//   index,
//   setEditedContent,
// }: EditQuestionProps) => {
//   const [correctIndex, setCorrectIndex] = useState(
//     editedContent[activeIndex].correct_index
//   );
//   const [correctOption, setCorrectOption] = useState(
//     editedContent[activeIndex].options[correctIndex]
//   );

//   useEffect(() => {
//     setCorrectIndex(editedContent[activeIndex].correct_index);
//   }, [activeIndex, editedContent]);

//   useEffect(() => {
//     setCorrectOption(editedContent[activeIndex].options[correctIndex]);
//   }, [correctIndex]);

//   return (
//     <div>
//       <p className={shared.inputLabel}>Correct Option</p>

//       <AutoResizeTextarea
//         className={`${shared.option} ${shared.correct}`}
//         value={correctOption.text}
//         onChange={(e) =>
//           setEditedContent((prev) => {
//             if (!prev) return prev;

//             const newPrev = [...prev];
//             newPrev[index] = {
//               ...newPrev[index],
//               options: newPrev[index].options.map((opt, optIdx) =>
//                 optIdx === correctIndex ? { ...opt, text: e.target.value } : opt
//               ),
//             };
//             return newPrev;
//           })
//         }
//       />

//       <p className={shared.inputLabel}>Incorrect Options</p>
//       {editedContent[index].options.map((o, i) => {
//         if (i === correctIndex) return <div></div>;

//         return (
//           <AutoResizeTextarea
//             key={i}
//             className={`${shared.option} ${
//               i === editedContent[index].correct_index && shared.correct
//             }`}
//             value={o.text}
//             onChange={(e) =>
//               setEditedContent((prev) => {
//                 if (!prev) return prev;

//                 const newPrev = [...prev];
//                 newPrev[index] = {
//                   ...newPrev[index],
//                   options: newPrev[index].options.map((opt, optIdx) =>
//                     optIdx === i ? { ...opt, text: e.target.value } : opt
//                   ),
//                 };
//                 return newPrev;
//               })
//             }
//           />
//         );
//       })}
//     </div>
//   );
// };
