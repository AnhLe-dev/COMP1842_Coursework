import React, { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import api from "../../lib/axios";
import { toast } from "sonner";

// ==========================================
// Utility: Shuffle array (Fisher-Yates)
// ==========================================
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ==========================================
// Sub-component: Result Screen
// ==========================================
const ResultScreen = ({ score, total, onRestart }) => {
  const percent = Math.round((score / total) * 100);
  const isPerfect = score === total;
  const isGood = percent >= 70;

  return (
    <Card className="max-w-lg mx-auto p-8 text-center border-0 bg-gradient-card shadow-custom-lg">
      <div className="mb-4">
        <Trophy
          className={`mx-auto size-16 mb-3 ${
            isPerfect
              ? "text-yellow-400"
              : isGood
              ? "text-blue-500"
              : "text-slate-400"
          }`}
        />
        <h2 className="text-2xl font-bold text-slate-800">
          {isPerfect ? "Perfect! 🎉" : isGood ? "Great job! 👍" : "Keep practicing! 💪"}
        </h2>
        <p className="text-slate-500 mt-1 text-sm">Your test results</p>
      </div>

      <div className="bg-white rounded-2xl py-6 px-8 shadow-sm border border-border/50 mb-6">
        <div className="text-5xl font-black text-primary mb-1">
          {score}/{total}
        </div>
        <div className="text-slate-400 text-sm">correct answers ({percent}%)</div>

        {/* Progress bar */}
        <div className="mt-4 h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${percent}%`,
              background:
                isPerfect
                  ? "linear-gradient(to right, #f59e0b, #f97316)"
                  : isGood
                  ? "linear-gradient(to right, #6366f1, #8b5cf6)"
                  : "linear-gradient(to right, #94a3b8, #64748b)",
            }}
          />
        </div>
      </div>

      <Button
        variant="gradient"
        size="xl"
        className="w-full flex items-center justify-center gap-2"
        onClick={onRestart}
      >
        <RefreshCw className="size-4" />
        Retake Quiz
      </Button>
    </Card>
  );
};

// ==========================================
// Main Component: QuizTest (True / False)
// ==========================================
const QuizTest = () => {
  const TOTAL_QUESTIONS = 10;

  const [allResponses, setAllResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [quizQueue, setQuizQueue] = useState([]); // List of shuffled questions
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(""); // responseText displayed (correct or incorrect)
  const [isCorrectPair, setIsCorrectPair] = useState(true); // Is the pair correct?
  const [selectedAnswer, setSelectedAnswer] = useState(null); // "true" | "false" | null
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // ==========================================
  // 1. Fetch data
  // ==========================================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/responses");
      const data = res.data.data || res.data;
      setAllResponses(data);
      if (data.length >= 2) {
        initQuiz(data);
      }
    } catch {
      toast.error("Unable to load quiz data.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 2. Initialize / reset quiz
  // ==========================================
  const initQuiz = useCallback((data = allResponses) => {
    // Shuffle questions, take up to TOTAL_QUESTIONS
    const shuffled = shuffle(data).slice(0, TOTAL_QUESTIONS);
    setQuizQueue(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setSelectedAnswer(null);
    // Prepare first question
    prepareQuestion(shuffled, 0, data);
  }, [allResponses]);

  // ==========================================
  // 3. Prepare question for current index
  // ==========================================
  const prepareQuestion = (queue, idx, pool = allResponses) => {
    setSelectedAnswer(null);
    const correctItem = queue[idx];

    // 50/50: show correct responseText or a random different one
    const showCorrect = Math.random() < 0.5;
    setIsCorrectPair(showCorrect);

    if (showCorrect) {
      setDisplayedText(correctItem.responseText);
    } else {
      // Pick a different item (wrong response)
      const others = pool.filter((r) => r._id !== correctItem._id);
      const wrongItem = others[Math.floor(Math.random() * others.length)];
      setDisplayedText(wrongItem ? wrongItem.responseText : correctItem.responseText);
      // Fallback if pool only has 1 item
      if (!wrongItem) setIsCorrectPair(true);
    }
  };

  // ==========================================
  // 4. Handle answer selection
  // ==========================================
  const handleAnswer = (answer) => {
    if (selectedAnswer) return; // Already selected
    setSelectedAnswer(answer);

    const isRight =
      (answer === "true" && isCorrectPair) ||
      (answer === "false" && !isCorrectPair);

    if (isRight) {
      setScore((s) => s + 1);
      toast.success("Correct! ✓");
    } else {
      toast.error(
        isCorrectPair
          ? "Incorrect! This is the CORRECT description for this code."
          : "Incorrect! This is NOT the correct description for this code."
      );
    }
  };

  // ==========================================
  // 5. Move to next question
  // ==========================================
  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= quizQueue.length) {
      setFinished(true);
    } else {
      setCurrentIndex(nextIdx);
      prepareQuestion(quizQueue, nextIdx);
    }
  };

  // ==========================================
  // 6. Render
  // ==========================================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
        <BrainCircuit className="size-5 animate-pulse" />
        Loading quiz...
      </div>
    );
  }

  if (allResponses.length < 2) {
    return (
      <Card className="p-8 text-center border-0 bg-gradient-card shadow-custom-md">
        <BrainCircuit className="mx-auto size-12 text-muted-foreground opacity-50 mb-3" />
        <h3 className="font-semibold text-slate-700">Insufficient Data</h3>
        <p className="text-sm text-slate-400 mt-1">
          At least <strong>2 responses</strong> are required to start the quiz.
        </p>
      </Card>
    );
  }

  if (finished) {
    return (
      <ResultScreen
        score={score}
        total={quizQueue.length}
        onRestart={() => initQuiz()}
      />
    );
  }

  const currentItem = quizQueue[currentIndex];
  if (!currentItem) return null;

  const progress = ((currentIndex) / quizQueue.length) * 100;

  // Button colors after selection
  const getTrueVariant = () => {
    if (!selectedAnswer) return "outline";
    if (isCorrectPair) return "default"; // Correct → Green
    if (selectedAnswer === "true") return "destructive"; // User picked wrong
    return "outline";
  };

  const getFalseVariant = () => {
    if (!selectedAnswer) return "outline";
    if (!isCorrectPair) return "default"; // Correct → Green
    if (selectedAnswer === "false") return "destructive"; // User picked wrong
    return "outline";
  };

  return (
    <Card className="border-0 bg-gradient-card shadow-custom-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-primary">
            <BrainCircuit className="size-5" />
            <span className="font-bold text-base">True / False Quiz</span>
          </div>
          <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-border/40">
            Score: <span className="text-primary font-bold text-sm">{score}</span>
            <span className="text-slate-300 mx-1">|</span>
            Question {currentIndex + 1}/{quizQueue.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="px-6 pb-2">
        {/* Issue Code */}
        <div className="mb-3">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-medium">
            Issue Code to Verify
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-lg px-4 py-2">
            <Lightbulb className="size-4 flex-shrink-0" />
            <span className="font-black text-lg tracking-wide">
              {currentItem.issueCode}
            </span>
          </div>
        </div>

        {/* Question */}
        <p className="text-xs text-slate-400 mb-2 font-medium">
          Is the following description <strong className="text-slate-600">CORRECT</strong> for the code above?
        </p>

        {/* Displayed ResponseText */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border/50 mb-5 min-h-[72px] flex items-center">
          <p className="text-sm text-slate-700 leading-relaxed italic">
            "{displayedText}"
          </p>
        </div>

        {/* True / False Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* TRUE Button */}
          <Button
            variant={getTrueVariant()}
            size="lg"
            className={`h-14 text-base font-semibold flex items-center justify-center gap-2 ${
              !selectedAnswer
                ? "hover:border-green-400 hover:bg-green-50 hover:text-green-700"
                : ""
            } ${
              selectedAnswer && isCorrectPair
                ? "bg-green-500 hover:bg-green-500 text-white border-green-500"
                : ""
            }`}
            onClick={() => handleAnswer("true")}
            disabled={!!selectedAnswer}
          >
            <CheckCircle2 className="size-5" />
            TRUE
          </Button>

          {/* FALSE Button */}
          <Button
            variant={getFalseVariant()}
            size="lg"
            className={`h-14 text-base font-semibold flex items-center justify-center gap-2 ${
              !selectedAnswer
                ? "hover:border-red-400 hover:bg-red-50 hover:text-red-700"
                : ""
            } ${
              selectedAnswer && !isCorrectPair
                ? "bg-green-500 hover:bg-green-500 text-white border-green-500"
                : ""
            }`}
            onClick={() => handleAnswer("false")}
            disabled={!!selectedAnswer}
          >
            <XCircle className="size-5" />
            FALSE
          </Button>
        </div>

        {/* Explanation after answering */}
        {selectedAnswer && (
          <div
            className={`rounded-xl px-4 py-3 text-sm mb-4 border flex items-start gap-2 ${
              (selectedAnswer === "true" && isCorrectPair) ||
              (selectedAnswer === "false" && !isCorrectPair)
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {(selectedAnswer === "true" && isCorrectPair) ||
            (selectedAnswer === "false" && !isCorrectPair) ? (
              <CheckCircle2 className="size-4 mt-0.5 flex-shrink-0 text-green-600" />
            ) : (
              <XCircle className="size-4 mt-0.5 flex-shrink-0 text-red-500" />
            )}
            <span>
              {isCorrectPair
                ? `This is the CORRECT description for code "${currentItem.issueCode}".`
                : `This is NOT the correct description for code "${currentItem.issueCode}".`}
            </span>
          </div>
        )}

        {/* Next Question Button */}
        {selectedAnswer && (
          <div className="flex justify-end pb-1">
            <Button
              variant="gradient"
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              {currentIndex + 1 >= quizQueue.length ? "View Results" : "Next Question"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuizTest;