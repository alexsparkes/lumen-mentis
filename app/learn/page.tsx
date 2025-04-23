"use client";

import { useFile } from "../context/FileContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function LearnPage() {
  const { file } = useFile();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<
    { term: string; definition: string }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      router.push("/");
    }
  }, [file, router]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        parseMarkdown(content);
      };
      reader.readAsText(file);
    }
  }, [file]);

  const parseMarkdown = (content: string) => {
    const lines = content.split("\n");
    const parsedFlashcards: { term: string; definition: string }[] = [];

    let currentTerm = "";
    let currentDefinition = "";

    lines.forEach((line) => {
      if (line.startsWith("## ")) {
        if (currentTerm && currentDefinition) {
          parsedFlashcards.push({
            term: currentTerm,
            definition: currentDefinition.trim(),
          });
        }
        currentTerm = line.slice(3).trim();
        currentDefinition = "";
      } else if (line.trim() === "") {
        // Skip empty lines
      } else {
        currentDefinition += `${line.trim()}\n`;
      }
    });

    // Add the last flashcard if it exists
    if (currentTerm && currentDefinition) {
      parsedFlashcards.push({
        term: currentTerm,
        definition: currentDefinition.trim(),
      });
    }

    setFlashcards(parsedFlashcards);
    generateQuestion(parsedFlashcards, 0);
  };

  const generateQuestion = (
    flashcards: { term: string; definition: string }[],
    questionIndex: number
  ) => {
    if (flashcards.length < 2) return; // Need at least two flashcards for options

    const question = flashcards[questionIndex];

    const shuffledOptions = flashcards
      .filter((_, index) => index !== questionIndex) // Exclude the correct answer
      .map((fc) => fc.term)
      .sort(() => Math.random() - 0.5) // Shuffle the options
      .slice(0, 3); // Take 3 random incorrect options

    shuffledOptions.push(question.term); // Add the correct answer
    shuffledOptions.sort(() => Math.random() - 0.5); // Shuffle again

    setOptions(shuffledOptions);
    setFeedback(null); // Reset feedback for the new question
    setSelectedAnswer(null); // Reset selected answer
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

  const moveToNextQuestion = () => {
    if (currentQuestionIndex + 1 < flashcards.length) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);
      generateQuestion(flashcards, nextQuestionIndex);
    } else {
      setIsQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setIsQuizComplete(false);
    generateQuestion(flashcards, 0);
  };

  if (!file) {
    return null; // Prevent rendering while redirecting
  }

  if (isQuizComplete) {
    return (
      <main className="grid place-content-center h-screen w-screen">
        <div className="p-10 max-w-4xl w-full bg-neutral-900 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Quiz Complete!</h1>
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
      </main>
    );
  }

  if (flashcards.length === 0 || !flashcards[currentQuestionIndex]) {
    return <p>Loading flashcards...</p>;
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen">
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

        {feedback === "incorrect" && (
          <p className="text-red-500 text-lg mb-4">
            Incorrect answer! Try again.
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
                  ? "bg-red-500 text-white border-red-500"
                  : feedback
                  ? "bg-neutral-700 text-neutral-400 border-neutral-700 cursor-not-allowed"
                  : "border-[#6B00FF] text-white hover:bg-[#6B00FF] hover:text-white cursor-pointer"
              }`}
              disabled={!!feedback} // Disable buttons after feedback is shown
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-4xl w-full mt-6 flex flex-row items-center justify-between">
        <span className="text-white">dont know?</span>
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
