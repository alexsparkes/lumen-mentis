"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFile } from "@/app/context/FileContext";
import { Button } from "@/components/ui/button";

interface Flashcard {
  term: string;
  definition: string;
}

export default function LearnPage() {
  const router = useRouter();
  const { uploadedFiles, recordQuizScore } = useFile();
  const [slug, setSlug] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  useEffect(() => {
    const pathSlug = decodeURIComponent(
      window.location.pathname.split("/").slice(-2, -1)[0]
    );
    setSlug(pathSlug);

    const file = uploadedFiles.find((f) => f.name === pathSlug);
    if (file) {
      setFlashcards(file.flashcards); // Use in-memory data from context
      generateQuestion(file.flashcards, 0); // Generate options for the first question
    }
  }, [uploadedFiles]);

  const generateQuestion = (flashcards: Flashcard[], questionIndex: number) => {
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
      setFeedback("correct");
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback("incorrect");
      setIncorrectCount((prev) => prev + 1);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex + 1 < flashcards.length) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);
      generateQuestion(flashcards, nextQuestionIndex);
    } else {
      setIsQuizComplete(true);
      recordQuizScore(slug!, correctCount); // Record the quiz score
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsQuizComplete(false);
    generateQuestion(flashcards, 0);
  };

  if (!slug) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
        <p>Loading flashcards...</p>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
        <p>No flashcards found for this project.</p>
      </div>
    );
  }

  if (isQuizComplete) {
    return (
      <div className="-full bg-neutral-950 text-white p-6 flex flex-col items-center justify-center">
        <div className="bg-neutral-900 p-6 rounded-lg shadow-lg text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
          <p className="text-lg mb-4">
            You answered <span className="text-green-500">{correctCount}</span>{" "}
            correctly and <span className="text-red-500">{incorrectCount}</span>{" "}
            incorrectly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={restartQuiz}
              className="py-2 px-4 bg-blue-600 text-white hover:bg-blue-500"
            >
              Restart Quiz
            </Button>
            <Button
              onClick={() => router.back()}
              className="py-2 px-4 bg-gray-600 text-white hover:bg-gray-500"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}

        {/* Flashcard Question */}
        <div className="bg-neutral-850 border border-neutral-700 p-6 rounded-lg text-left">
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

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`py-3 px-6 rounded-lg border-2 transition-all ease-in-out duration-300 font-bold ${
                  feedback && option === flashcards[currentQuestionIndex]?.term
                    ? "bg-green-500 text-black border-green-500"
                    : feedback && option === selectedAnswer
                    ? "text-red-500 border-red-500 border-dashed"
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

        {/* Navigation */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={moveToNextQuestion}
            disabled={!feedback}
            className={`py-2 px-4 ${
              feedback
                ? "bg-green-600 text-white hover:bg-green-500"
                : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
