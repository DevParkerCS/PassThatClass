import { QuizQuestionType } from "./Pages/Quiz/components/Quiz/components/QuizQuestion/QuizQuestion";

export const MockQuiz: QuizQuestionType[] = [
  {
    id: "q_001",
    type: "multiple_choice_single_answer",
    question:
      "Which of the following best describes the main function of mitochondria in a eukaryotic cell?",
    options: [
      {
        id: "A",
        text: "They store genetic information and control cell division.",
      },
      {
        id: "B",
        text: "They synthesize proteins from amino acids.",
      },
      {
        id: "C",
        text: "They produce ATP through cellular respiration.",
      },
      {
        id: "D",
        text: "They package and transport proteins out of the cell.",
      },
    ],
    correct_index: 0,
    explanation:
      "Mitochondria generate ATP through cellular respiration, providing energy for the cell.",
  },
  {
    id: "q_002",
    type: "multiple_choice_single_answer",
    question:
      "In Big-O notation, what is the time complexity of a binary search on a sorted array?",
    options: [
      {
        id: "A",
        text: "O(1)",
      },
      {
        id: "B",
        text: "O(log n)",
      },
      {
        id: "C",
        text: "O(n)",
      },
      {
        id: "D",
        text: "O(n^2)",
      },
    ],
    correct_index: 0,
    explanation:
      "Binary search repeatedly halves the search space, resulting in O(log n) time.",
  },
  {
    id: "q_003",
    type: "multiple_choice_single_answer",
    question:
      "Which statement about working memory and studying is most accurate?",
    options: [
      {
        id: "A",
        text: "Working memory can store unlimited information for long periods.",
      },
      {
        id: "B",
        text: "Overloading working memory can make it harder to learn new material.",
      },
      {
        id: "C",
        text: "Working memory is not involved when you are reading your notes.",
      },
      {
        id: "D",
        text: "Working memory only matters for solving math problems, not for studying.",
      },
    ],
    correct_index: 0,
    explanation:
      "When too much information is held in working memory, it becomes harder to process and encode new material.",
  },
  {
    id: "q_004",
    type: "multiple_choice_single_answer",
    question:
      "Which of the following is an example of active recall while studying?",
    options: [
      {
        id: "A",
        text: "Re-reading your notes several times.",
      },
      {
        id: "B",
        text: "Highlighting important sentences in the textbook.",
      },
      {
        id: "C",
        text: "Closing your notes and trying to write down everything you remember.",
      },
      {
        id: "D",
        text: "Organizing your notes by changing the font colors.",
      },
    ],
    correct_index: 0,
    explanation:
      "Active recall means trying to retrieve information from memory without looking at the source.",
  },
  {
    id: "q_005",
    type: "multiple_choice_single_answer",
    question:
      "In a typical spaced repetition schedule, what happens to the spacing between reviews of a well-remembered card?",
    options: [
      {
        id: "A",
        text: "The spacing stays exactly the same for each review.",
      },
      {
        id: "B",
        text: "The spacing gradually increases after each successful review.",
      },
      {
        id: "C",
        text: "The spacing gradually decreases as you see the card more often.",
      },
      {
        id: "D",
        text: "Spaced repetition always reviews all cards every day.",
      },
    ],
    correct_index: 0,
    explanation:
      "Spaced repetition algorithms increase the interval between reviews when you answer correctly, to reinforce long-term memory.",
  },
  {
    id: "q_006",
    type: "multiple_choice_single_answer",
    question:
      "Which of the following best describes a hypothesis in the context of the scientific method?",
    options: [
      {
        id: "A",
        text: "A summary of all the data collected in an experiment.",
      },
      {
        id: "B",
        text: "An unchangeable fact that has been proven correct.",
      },
      {
        id: "C",
        text: "A testable prediction that explains a phenomenon.",
      },
      {
        id: "D",
        text: "A detailed list of experimental procedures.",
      },
    ],
    correct_index: 0,
    explanation:
      "A hypothesis is a testable statement or prediction that can be supported or refuted by data.",
  },
  {
    id: "q_007",
    type: "multiple_choice_single_answer",
    question:
      "In a relational database, which of the following is the primary purpose of a primary key?",
    options: [
      {
        id: "A",
        text: "To enforce alphabetical ordering of rows.",
      },
      {
        id: "B",
        text: "To uniquely identify each row in a table.",
      },
      {
        id: "C",
        text: "To store large binary files such as images.",
      },
      {
        id: "D",
        text: "To group rows by a common category.",
      },
    ],
    correct_index: 0,
    explanation:
      "A primary key uniquely identifies each row, ensuring there are no duplicate entries.",
  },
  {
    id: "q_008",
    type: "multiple_choice_single_answer",
    question:
      "Which study strategy is most aligned with the concept of interleaving?",
    options: [
      {
        id: "A",
        text: "Focusing on one topic for several hours before switching.",
      },
      {
        id: "B",
        text: "Doing only practice tests without reviewing notes.",
      },
      {
        id: "C",
        text: "Mixing different types of problems or topics within a single study session.",
      },
      {
        id: "D",
        text: "Listening to music while you study to stay focused.",
      },
    ],
    correct_index: 0,
    explanation:
      "Interleaving involves mixing different topics or problem types, which can improve learning and transfer.",
  },
  {
    id: "q_009",
    type: "multiple_choice_single_answer",
    question: "In statistics, what does a p-value represent?",
    options: [
      {
        id: "A",
        text: "The probability that the null hypothesis is true.",
      },
      {
        id: "B",
        text: "The probability of obtaining a result at least as extreme as the observed one, assuming the null hypothesis is true.",
      },
      {
        id: "C",
        text: "The probability that the alternative hypothesis is false.",
      },
      {
        id: "D",
        text: "The size of the effect in the population.",
      },
    ],
    correct_index: 0,
    explanation:
      "A p-value is the probability of observing results as extreme as those measured, given that the null hypothesis is true.",
  },
  {
    id: "q_010",
    type: "multiple_choice_single_answer",
    question:
      "When converting your lecture notes into better study material, which of the following is generally the most effective approach?",
    options: [
      {
        id: "A",
        text: "Typing your handwritten notes word-for-word into a document.",
      },
      {
        id: "B",
        text: "Creating summaries and questions in your own words based on the notes.",
      },
      {
        id: "C",
        text: "Adding more highlighting and underlining to the existing notes.",
      },
      {
        id: "D",
        text: "Reorganizing the notes into different font styles and colors.",
      },
    ],
    correct_index: 0,
    explanation:
      "Transforming notes into your own summaries and questions promotes deeper processing and better retention.",
  },
];
