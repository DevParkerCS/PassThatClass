import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./ContentModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ActiveModal } from "../../Content";
import {
  QuizMeta,
  QuizQuestionType,
} from "../../../../../../context/DataContext/types";
import { useContentContext } from "../../../../../../context/DataContext/ContentContext";
import { Spinner } from "../../../../../../components/Spinner/Spinner";
import { AutoResizeTextarea } from "../../../../../../components/AutoResizeTextArea/AutoResizeTextArea";

type EditModalProps = {
  contentId: string;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
};

export const EditModal = ({ contentId, setActiveModal }: EditModalProps) => {
  const contentCtx = useContentContext();
  const [editedContent, setEditedContent] = useState<
    QuizQuestionType[] | undefined
  >(contentCtx.questionsById[contentId]);
  const [editedMeta, setEditedMeta] = useState<QuizMeta>(
    contentCtx.quizMetaById[contentId]
  );
  const [loading, setLoading] = useState(editedContent !== undefined);
  const [changed, setChanged] = useState(false);
  const [questionsHeight, setQuestionsHeight] = useState(0);
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedContent(contentCtx.questionsById[contentId]);
    setEditedMeta(contentCtx.quizMetaById[contentId]);
  }, [contentCtx.contentById, contentCtx.quizMetaById]);

  useEffect(() => {
    if (changed === true) return;

    setChanged(true);
  }, [editedContent, editedMeta]);

  // useLayoutEffect(() => {
  //   console.log("CHANGING");
  //   if (questionRef.current) {
  //     setQuestionsHeight(questionRef.current.clientHeight);
  //   }
  // }, [activeIndex]);

  return (
    <div>
      <div
        className={styles.modalBackground}
        onClick={() => setActiveModal("content")}
      ></div>

      <div className={styles.modalWrapper}>
        <div className={styles.outsideWrapper}>
          <div
            className={styles.exitBtn}
            onClick={() => setActiveModal("content")}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>

          <p className={styles.modalTitle}>Quick Edit</p>

          {!editedContent ? (
            <div className={styles.loadingWrapper}>
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
                <label className={styles.inputLabel}>Questions</label>
                <div className={styles.contentWrapper}>
                  <div className={styles.questionsWrapper}>
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
                  </div>

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
                      <p className={styles.inputLabel}>
                        Question {activeIndex + 1}
                      </p>
                      <AutoResizeTextarea
                        className={styles.input}
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
                      <div className={styles.explanationWrapper}>
                        <p className={styles.inputLabel}>Explanation</p>
                        <AutoResizeTextarea
                          className={styles.input}
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
    <div className={`${styles.question}`}>
      <p className={styles.questionIndex}>{index + 1}</p>
      <AutoResizeTextarea
        className={styles.input}
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
//       <p className={styles.inputLabel}>Correct Option</p>

//       <AutoResizeTextarea
//         className={`${styles.option} ${styles.correct}`}
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

//       <p className={styles.inputLabel}>Incorrect Options</p>
//       {editedContent[index].options.map((o, i) => {
//         if (i === correctIndex) return <div></div>;

//         return (
//           <AutoResizeTextarea
//             key={i}
//             className={`${styles.option} ${
//               i === editedContent[index].correct_index && styles.correct
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
