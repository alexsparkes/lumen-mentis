"use client";

import { useFile } from "../context/FileContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function LearnPage() {
  const { file, flashcards } = useFile();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!file) {
      router.push("/");
    } else {
      generateQuestion(flashcards, 0);
      const storedScores = localStorage.getItem(file.name);
      if (storedScores) {
        setScoreHistory(JSON.parse(storedScores));
      }
    }
  }, [file, flashcards, router]);

  const generateQuestion = (
    flashcards: { term: string; definition: string }[],
    questionIndex: number
  ) => {
    if (flashcards.length < 2) return;

    const question = flashcards[questionIndex];
    const shuffledOptions = flashcards
      .filter((_, index) => index !== questionIndex)
      .map((fc) => fc.term)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    shuffledOptions.push(question.term);
    shuffledOptions.sort(() => Math.random() - 0.5);

    setOptions(shuffledOptions);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const handleAnswer = (selectedTerm: string) => {
    const correctTerm = flashcards[currentQuestionIndex]?.term;
    setSelectedAnswer(selectedTerm);

    if (selectedTerm === correctTerm) {
      setScore((prev) => prev + 1);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  const handleDontKnow = () => {
    setSelectedAnswer(null);
    setFeedback("incorrect");
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex + 1 < flashcards.length) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);
      generateQuestion(flashcards, nextQuestionIndex);
    } else {
      setIsQuizComplete(true);

      if (file) {
        const updatedScores = [...scoreHistory, score];
        setScoreHistory(updatedScores);
        localStorage.setItem(file.name, JSON.stringify(updatedScores));
      }
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setIsQuizComplete(false);
    generateQuestion(flashcards, 0);
  };

  const chartData = {
    labels: scoreHistory.map((_, index) => `Attempt ${index + 1}`),
    datasets: [
      {
        label: "Percentage Correct",
        data: scoreHistory.map(
          (attemptScore) => (attemptScore / flashcards.length) * 100
        ),
        backgroundColor: "#6B00FF",
        borderColor: "#5800cc",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `${(context.raw as number).toFixed(2)}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (tickValue: string | number) {
            return `${tickValue}%`;
          },
        },
      },
    },
  };

  const stats = {
    attempts: scoreHistory.length,
    highest: Math.max(
      ...scoreHistory.map((s) => (s / flashcards.length) * 100),
      0
    ).toFixed(2),
    lowest: Math.min(
      ...scoreHistory.map((s) => (s / flashcards.length) * 100),
      100
    ).toFixed(2),
    average:
      scoreHistory.length > 0
        ? (
            scoreHistory.reduce(
              (sum, s) => sum + (s / flashcards.length) * 100,
              0
            ) / scoreHistory.length
          ).toFixed(2)
        : "0.00",
    recent:
      scoreHistory.length > 0
        ? (
            (scoreHistory[scoreHistory.length - 1] / flashcards.length) *
            100
          ).toFixed(2)
        : "0.00",
    totalCorrect: scoreHistory.reduce((sum, s) => sum + s, 0),
    totalQuestions: flashcards.length * scoreHistory.length,
    trend:
      scoreHistory.length > 1
        ? scoreHistory[scoreHistory.length - 1] >
          scoreHistory[scoreHistory.length - 2]
          ? "Improving"
          : scoreHistory[scoreHistory.length - 1] <
            scoreHistory[scoreHistory.length - 2]
          ? "Declining"
          : "Stable"
        : "N/A",
  };

  if (!file) {
    return null;
  }

  if (isQuizComplete) {
    return (
      <main className="grid place-content-center">
        <div>
          <div className="flex flex-row gap-10">
            <div className="p-10 max-w-4xl w-full bg-neutral-900 rounded-lg shadow-lg text-center">
              <h1 className="text-3xl font-bold text-white mb-6">
                Quiz Complete!
              </h1>
              <p className="text-xl text-white mb-6">
                You scored {score} out of {flashcards.length}.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={restartQuiz}
                  className="py-3 px-6 bg-[#6B00FF] text-white rounded-lg hover:bg-[#5800cc] transition-all duration-300"
                >
                  Restart Quiz
                </button>
                <Link
                  href="/"
                  className="py-3 px-6 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-all duration-300"
                >
                  Go Home
                </Link>
              </div>
            </div>
            <div className="p-10 max-w-4xl w-full bg-neutral-900 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-semibold text-white mb-4">
                Score History
              </h2>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-neutral-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Attempts</h3>
              <p className="text-xl text-white">{stats.attempts}</p>
            </div>
            <div className="p-4 bg-neutral-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Highest</h3>
              <p className="text-xl text-white">{stats.highest}%</p>
            </div>
            <div className="p-4 bg-neutral-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Lowest</h3>
              <p className="text-xl text-white">{stats.lowest}%</p>
            </div>
            <div className="p-4 bg-neutral-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Average</h3>
              <p className="text-xl text-white">{stats.average}%</p>
            </div>
            <div className="p-4 bg-neutral-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Most Recent</h3>
              <p className="text-xl text-white">{stats.recent}%</p>
            </div>
            <div className="p-4 bg-neutral-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white">
                Total Correct
              </h3>
              <p className="text-xl text-white">{stats.totalCorrect}</p>
            </div>
            <div className="p-4 bg-neutral-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white">
                Total Questions
              </h3>
              <p className="text-xl text-white">{stats.totalQuestions}</p>
            </div>
            <div className="p-4 bg-neutral-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Trend</h3>
              <p className="text-xl text-white">{stats.trend}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (flashcards.length === 0 || !flashcards[currentQuestionIndex]) {
    return <p>Loading flashcards...</p>;
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex justify-start w-full max-w-4xl mb-6">
        <Link href="/" className="flex items-center text-white hover:underline">
          <FaArrowLeft className="mr-2" />
          Go back
        </Link>
      </div>
      <div className="p-10 max-w-4xl w-full bg-neutral-900 rounded-lg shadow-lg relative">
        <span className="text-neutral-500 mb-6 text-lg float-end">
          {currentQuestionIndex + 1} / {flashcards.length}
        </span>
        <p className="text-xl text-white my-25">
          <span className="text-3xl font-semibold">
            {flashcards[currentQuestionIndex]?.definition || ""}
          </span>
        </p>

        {!feedback && (
          <p className="text-neutral-300 text-lg mb-4">Select your answer</p>
        )}
        {feedback === "incorrect" && (
          <p className="text-red-500 text-lg mb-4">
            Incorrect answer! The correct answer is highlighted.
          </p>
        )}
        {feedback === "correct" && (
          <p className="text-green-500 text-lg mb-4">Correct answer!</p>
        )}

        <div className="grid grid-cols-2 gap-6">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`py-3 px-6 rounded-lg border-2 transition-all ease-in-out duration-300 font-bold ${
                feedback && option === flashcards[currentQuestionIndex]?.term
                  ? "bg-green-500 text-black border-green-500"
                  : feedback && option === selectedAnswer
                  ? " text-red-500 border-red-500 border-dashed"
                  : feedback
                  ? "bg-neutral-700 text-neutral-400 border-neutral-700 cursor-not-allowed"
                  : "border-[#6B00FF] text-white hover:bg-[#6B00FF] hover:text-white cursor-pointer"
              }`}
              disabled={!!feedback}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-4xl w-full mt-6 flex flex-row items-center justify-between">
        <button
          onClick={handleDontKnow}
          className="py-3 px-6 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-all duration-300 cursor-pointer"
        >
          Don&apos;t know?
        </button>
        {feedback && (
          <button
            onClick={moveToNextQuestion}
            className="py-3 px-6 bg-[#6B00FF] text-white rounded-lg hover:bg-[#5800cc] transition-all duration-300 cursor-pointer"
          >
            Continue
          </button>
        )}
      </div>
    </main>
  );
}
