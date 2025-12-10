export type SubjectSummary = {
  id: string;
  title: string;
  correct: number;
  total: number;
};

export type AnswerSummary = {
  number: number;
  answer: string; // "A" | "B" | "C" | "D" | "E" | "-"
  correct: boolean;
};

export type TestResult = {
  id: string;
  name: string;
  score: number;
  targetScore: number;
  percent: number;
  duration: string;
  date: string;
  analysis: string;
  subjects: SubjectSummary[];
  answers: AnswerSummary[];
};

export const TOTAL_QUESTIONS = 120;

export const TESTS: TestResult[] = [
  {
    id: "123",
    name: "Đề thi nền tảng số 6",
    score: 800,
    targetScore: 1100,
    percent: 75,
    duration: "60:00",
    date: "12.04.2025",
    analysis:
      "Bạn đã đạt mức điểm khá, đặc biệt là ở phần Tư duy khoa học. Vẫn còn một số câu sai ở phần Ngôn ngữ, chủ yếu liên quan đến từ vựng học thuật và suy luận ngữ cảnh.",
    subjects: [
      { id: "vietnamese", title: "Tiếng Việt", correct: 30, total: 30 },
      { id: "english", title: "Tiếng Anh", correct: 30, total: 30 },
      { id: "math", title: "Toán", correct: 30, total: 30 },
      { id: "logic", title: "Tư duy khoa học", correct: 30, total: 30 },
    ],
    answers: [
      { number: 1, answer: "A", correct: true },
      { number: 2, answer: "C", correct: true },
      { number: 3, answer: "E", correct: false },
      { number: 4, answer: "B", correct: true },
      { number: 5, answer: "A", correct: true },
      { number: 6, answer: "C", correct: true },
      { number: 7, answer: "D", correct: false },
    ],
  },
  {
    id: "test-5",
    name: "Đề thi nền tảng số 5",
    score: 800,
    targetScore: 1100,
    percent: 75,
    duration: "60:00",
    date: "12.04.2025",
    analysis:
      "Bạn đã đạt mức điểm khá, đặc biệt là ở phần Tư duy khoa học. Vẫn còn một số câu sai ở phần Ngôn ngữ, chủ yếu liên quan đến từ vựng học thuật và suy luận ngữ cảnh.",
    subjects: [
      { id: "vietnamese", title: "Tiếng Việt", correct: 30, total: 30 },
      { id: "english", title: "Tiếng Anh", correct: 30, total: 30 },
      { id: "math", title: "Toán", correct: 30, total: 30 },
      { id: "logic", title: "Tư duy khoa học", correct: 30, total: 30 },
    ],
    answers: [
      { number: 1, answer: "A", correct: true },
      { number: 2, answer: "C", correct: true },
      { number: 3, answer: "E", correct: false },
      { number: 4, answer: "B", correct: true },
      { number: 5, answer: "A", correct: true },
      { number: 6, answer: "C", correct: true },
      { number: 7, answer: "D", correct: false },
    ],
  },
  {
    id: "test-4",
    name: "Đề thi nền tảng số 4",
    score: 800,
    targetScore: 1100,
    percent: 75,
    duration: "60:00",
    date: "12.04.2025",
    analysis:
      "Bạn đã đạt mức điểm khá, đặc biệt là ở phần Tư duy khoa học. Vẫn còn một số câu sai ở phần Ngôn ngữ, chủ yếu liên quan đến từ vựng học thuật và suy luận ngữ cảnh.",
    subjects: [
      { id: "vietnamese", title: "Tiếng Việt", correct: 30, total: 30 },
      { id: "english", title: "Tiếng Anh", correct: 30, total: 30 },
      { id: "math", title: "Toán", correct: 30, total: 30 },
      { id: "logic", title: "Tư duy khoa học", correct: 30, total: 30 },
    ],
    answers: [
      { number: 1, answer: "A", correct: true },
      { number: 2, answer: "C", correct: true },
      { number: 3, answer: "E", correct: false },
      { number: 4, answer: "B", correct: true },
      { number: 5, answer: "A", correct: true },
      { number: 6, answer: "C", correct: true },
      { number: 7, answer: "D", correct: false },
    ],
  },
  {
    id: "test-3",
    name: "Đề thi nền tảng số 3",
    score: 750,
    targetScore: 1100,
    percent: 68,
    duration: "120:00",
    date: "03.03.2025",
    analysis:
      "Kết quả cho thấy phần Toán còn khá nhiều câu sai ở dạng bài đọc biểu đồ và bài toán suy luận. Ngôn ngữ và Tư duy khoa học ở mức ổn định.",
    subjects: [
      { id: "vietnamese", title: "Tiếng Việt", correct: 28, total: 30 },
      { id: "english", title: "Tiếng Anh", correct: 27, total: 30 },
      { id: "math", title: "Toán", correct: 25, total: 30 },
      { id: "logic", title: "Tư duy khoa học", correct: 26, total: 30 },
    ],
    answers: [
      { number: 1, answer: "B", correct: false },
      { number: 2, answer: "C", correct: true },
      { number: 3, answer: "D", correct: true },
      { number: 4, answer: "A", correct: true },
      { number: 5, answer: "E", correct: false },
      { number: 6, answer: "B", correct: true },
      { number: 7, answer: "C", correct: true },
    ],
  },
  {
    id: "test-2",
    name: "Đề thi nền tảng số 2",
    score: 900,
    targetScore: 1100,
    percent: 82,
    duration: "90:00",
    date: "20.02.2025",
    analysis:
      "Đây là một trong những bài có kết quả tốt nhất, đặc biệt là phần Ngôn ngữ. Tuy nhiên vẫn còn một số câu khó ở Tư duy khoa học.",
    subjects: [
      { id: "vietnamese", title: "Tiếng Việt", correct: 29, total: 30 },
      { id: "english", title: "Tiếng Anh", correct: 30, total: 30 },
      { id: "math", title: "Toán", correct: 29, total: 30 },
      { id: "logic", title: "Tư duy khoa học", correct: 28, total: 30 },
    ],
    answers: [
      { number: 1, answer: "A", correct: true },
      { number: 2, answer: "B", correct: true },
      { number: 3, answer: "C", correct: true },
      { number: 4, answer: "D", correct: true },
      { number: 5, answer: "E", correct: true },
      { number: 6, answer: "A", correct: true },
      { number: 7, answer: "B", correct: false },
    ],
  },
  {
    id: "test-1",
    name: "Đề thi nền tảng số 1",
    score: 850,
    targetScore: 1100,
    percent: 77,
    duration: "120:00",
    date: "01.02.2025",
    analysis:
      "Bài thi đầu tiên cho thấy nền tảng tương đối tốt. Các sai sót chủ yếu đến từ việc quản lý thời gian và đọc chưa kỹ đề.",
    subjects: [
      { id: "vietnamese", title: "Tiếng Việt", correct: 27, total: 30 },
      { id: "english", title: "Tiếng Anh", correct: 28, total: 30 },
      { id: "math", title: "Toán", correct: 27, total: 30 },
      { id: "logic", title: "Tư duy khoa học", correct: 26, total: 30 },
    ],
    answers: [
      { number: 1, answer: "C", correct: true },
      { number: 2, answer: "D", correct: true },
      { number: 3, answer: "E", correct: true },
      { number: 4, answer: "B", correct: false },
      { number: 5, answer: "A", correct: true },
      { number: 6, answer: "C", correct: true },
      { number: 7, answer: "D", correct: true },
    ],
  },
];
