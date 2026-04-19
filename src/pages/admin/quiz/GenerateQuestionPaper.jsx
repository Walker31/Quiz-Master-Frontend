import { useState, useEffect } from "react";
import { quizService } from "@/services/quizService";
import { contentService } from "@/services/contentService";
import QuestionPaperPreview from "@/components/QuestionPaperPreview";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon
} from "@mui/icons-material";

function GenerateQuestionPaper() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [totalMarks, setTotalMarks] = useState(100);
  const [paperName, setPaperName] = useState("JEE Mains Practice Paper");
  const [showPreview, setShowPreview] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, cRes, qRes, quizRes] = await Promise.all([
        contentService.getSubjects(),
        contentService.getChapters(),
        contentService.getQuestions(),
        quizService.getQuizzes(),
      ]);
      setSubjects(sRes.data);
      setChapters(cRes.data);
      
      // Normalize questions to have correct field names
      const normalizedQuestions = (qRes.data || []).map(normalizeQuestion);
      setQuestions(normalizedQuestions);
      setQuizzes(quizRes.data || []);
      
      // Debug: Log fetched questions
      console.log('Fetched questions count:', normalizedQuestions.length);
      if (normalizedQuestions.length > 0) {
        console.log('First question keys:', Object.keys(normalizedQuestions[0]));
        console.log('Full first question:', JSON.stringify(normalizedQuestions[0], null, 2));
        console.log('Has options?', !!normalizedQuestions[0].options);
        console.log('Has text?', !!normalizedQuestions[0].text);
        console.log('Has type?', !!normalizedQuestions[0].type);
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Map backend question fields to frontend expected fields
  const normalizeQuestion = (q) => {
    // Handle options: backend now returns array of {id, text} objects
    let optionsArray = [];
    
    if (q.options && Array.isArray(q.options)) {
      // Backend format: [{id: 1, text: "35"}, {id: 2, text: "30"}, ...]
      optionsArray = q.options.map(opt => opt.text || opt);
    } else if (q.option_1 && q.option_2 && q.option_3 && q.option_4) {
      // Fallback: individual option fields
      optionsArray = [q.option_1, q.option_2, q.option_3, q.option_4];
    }

    return {
      ...q,
      id: q.id,
      text: q.text || q.question_statement || "",
      type: q.type || "mcq",  // Default to MCQ if not specified
      marks: q.marks || q.mark || 1,
      difficulty: q.difficulty || q.difficulty_level || 5,
      options: optionsArray,
      quiz: q.quiz_id || q.quiz || null,
      chapter: q.chapter_id || q.chapter || null,
      subject: q.subject_id || q.subject || null,
    };
  };

  const getDifficultyFromRating = (rating) => {
    if (rating <= 3) return "easy";
    if (rating <= 6) return "medium";
    return "hard";
  };

  const getAvailableChapters = () => {
    if (selectedSubjects.length === 0) return chapters;
    return chapters.filter((ch) => selectedSubjects.includes(ch.subject));
  };

  const handleSubjectToggle = (subjectId) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
      setSelectedChapters(
        selectedChapters.filter((id) => {
          const ch = chapters.find((c) => c.id === id);
          return ch && !selectedSubjects.includes(ch.subject);
        })
      );
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const handleChapterToggle = (chapterId) => {
    if (selectedChapters.includes(chapterId)) {
      setSelectedChapters(selectedChapters.filter((id) => id !== chapterId));
    } else {
      setSelectedChapters([...selectedChapters, chapterId]);
    }
  };

  const handleDifficultyToggle = (difficulty) => {
    if (selectedDifficulty.includes(difficulty)) {
      setSelectedDifficulty(selectedDifficulty.filter((d) => d !== difficulty));
    } else {
      setSelectedDifficulty([...selectedDifficulty, difficulty]);
    }
  };

  const handleQuizToggle = (quizId) => {
    if (selectedQuizzes.includes(quizId)) {
      setSelectedQuizzes(selectedQuizzes.filter((id) => id !== quizId));
    } else {
      setSelectedQuizzes([...selectedQuizzes, quizId]);
    }
  };

  const generatePaper = () => {
    let filtered = questions;

    // If quizzes are selected, use only those quiz questions
    if (selectedQuizzes.length > 0) {
      filtered = filtered.filter((q) => selectedQuizzes.includes(q.quiz));
    } else {
      // Filter by chapters
      if (selectedChapters.length > 0) {
        filtered = filtered.filter((q) => selectedChapters.includes(q.chapter));
      } else if (selectedSubjects.length > 0) {
        // If no specific chapters, include all chapters of selected subjects
        const subjectChapters = chapters
          .filter((ch) => selectedSubjects.includes(ch.subject))
          .map((ch) => ch.id);
        filtered = filtered.filter((q) => subjectChapters.includes(q.chapter));
      }

      // Filter by difficulty
      if (selectedDifficulty.length > 0) {
        filtered = filtered.filter((q) => {
          const diff = getDifficultyFromRating(q.difficulty || 5);
          return selectedDifficulty.includes(diff);
        });
      }
    }

    // Shuffle and limit to total marks
    filtered = filtered.sort(() => Math.random() - 0.5);
    let totalMarksCount = 0;
    const selected = [];

    for (const q of filtered) {
      if (totalMarksCount + (q.marks || 1) <= totalMarks) {
        selected.push(q);
        totalMarksCount += q.marks || 1;
      }
      if (totalMarksCount >= totalMarks) break;
    }

    setGeneratedQuestions(selected);
    setShowPreview(true);
  };

  const handleClear = () => {
    setSelectedSubjects([]);
    setSelectedChapters([]);
    setSelectedQuizzes([]);
    setSelectedDifficulty([]);
    setTotalMarks(100);
    setPaperName("JEE Mains Practice Paper");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-accent) border-t-transparent animate-spin" />
          <p className="theme-text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <QuestionPaperPreview
        questions={generatedQuestions}
        paperName={paperName}
        totalMarks={totalMarks}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="theme-heading text-3xl font-bold mb-2">Generate Question Paper</h1>
        <p className="theme-text-muted text-base">Create custom question papers in JEE Mains format</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Paper Name */}
          <div className="theme-card p-6">
            <label className="theme-text-secondary text-sm font-semibold mb-3 block">Paper Name</label>
            <input
              type="text"
              value={paperName}
              onChange={(e) => setPaperName(e.target.value)}
              className="theme-input w-full px-4 py-2.5 text-sm rounded-lg border border-(--color-border)"
            />
          </div>

          {/* Total Marks */}
          <div className="theme-card p-6">
            <label className="theme-text-secondary text-sm font-semibold mb-3 block">Total Marks</label>
            <input
              type="number"
              min="10"
              max="500"
              value={totalMarks}
              onChange={(e) => setTotalMarks(parseInt(e.target.value) || 100)}
              className="theme-input w-full px-4 py-2.5 text-sm rounded-lg border border-(--color-border)"
            />
          </div>

          {/* Action Buttons */}
          <div className="theme-card p-6 space-y-3">
            <button
              onClick={generatePaper}
              disabled={selectedSubjects.length === 0 && selectedChapters.length === 0 && selectedQuizzes.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-(--color-accent) text-white rounded-lg hover:bg-(--color-accent-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
            >
              <PreviewIcon fontSize="small" /> Preview Paper
            </button>
            <button
              onClick={handleClear}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 theme-text-secondary hover:bg-(--color-bg-tertiary) rounded-lg transition-colors font-semibold text-sm"
            >
              <ClearIcon fontSize="small" /> Clear Filters
            </button>
          </div>

          {/* Selection Summary */}
          {(selectedSubjects.length > 0 || selectedChapters.length > 0 || selectedQuizzes.length > 0 || selectedDifficulty.length > 0) && (
            <div className="theme-card p-6 bg-(--color-bg-secondary) border border-(--color-border)">
              <p className="text-xs font-semibold theme-text-secondary mb-3">Selection Summary</p>
              <div className="space-y-2 text-sm">
                {selectedQuizzes.length > 0 && (
                  <p>
                    <span className="theme-text-muted">Quizzes:</span>
                    <span className="ml-2 font-semibold theme-heading">{selectedQuizzes.length}</span>
                  </p>
                )}
                {selectedSubjects.length > 0 && (
                  <p>
                    <span className="theme-text-muted">Subjects:</span>
                    <span className="ml-2 font-semibold theme-heading">{selectedSubjects.length}</span>
                  </p>
                )}
                {selectedChapters.length > 0 && (
                  <p>
                    <span className="theme-text-muted">Chapters:</span>
                    <span className="ml-2 font-semibold theme-heading">{selectedChapters.length}</span>
                  </p>
                )}
                {selectedDifficulty.length > 0 && (
                  <p>
                    <span className="theme-text-muted">Difficulty:</span>
                    <span className="ml-2 font-semibold theme-heading">
                      {selectedDifficulty.join(", ")}
                    </span>
                  </p>
                )}
                <p>
                  <span className="theme-text-muted">Available Questions:</span>
                  <span className="ml-2 font-semibold theme-heading">
                    {questions.filter((q) => {
                      let match = true;
                      if (selectedQuizzes.length > 0) {
                        match = selectedQuizzes.includes(q.quiz);
                      } else if (selectedChapters.length > 0) {
                        match = selectedChapters.includes(q.chapter);
                      } else if (selectedSubjects.length > 0) {
                        const chaps = chapters
                          .filter((ch) => selectedSubjects.includes(ch.subject))
                          .map((ch) => ch.id);
                        match = chaps.includes(q.chapter);
                      }
                      if (selectedDifficulty.length > 0 && match && selectedQuizzes.length === 0) {
                        const diff = getDifficultyFromRating(q.difficulty || 5);
                        match = selectedDifficulty.includes(diff);
                      }
                      return match;
                    }).length}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quiz Selection */}
          <div className="theme-card p-6">
            <h3 className="theme-heading text-lg font-bold mb-4">Select Quizzes (Optional)</h3>
            <p className="theme-text-muted text-sm mb-4">Select quizzes to include all their questions directly</p>
            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => {
                  const quizQuestions = questions.filter((q) => q.quiz === quiz.id);
                  const chapterName = chapters.find((c) => c.id === quiz.chapter)?.name || "Unknown";
                  return (
                    <button
                      key={quiz.id}
                      onClick={() => handleQuizToggle(quiz.id)}
                      className={`p-4 rounded-lg transition-all border-2 text-left ${
                        selectedQuizzes.includes(quiz.id)
                          ? "border-(--color-accent) bg-(--color-accent-light)"
                          : "border-(--color-border) hover:border-(--color-accent-light)"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded border-2 border-(--color-accent) flex items-center justify-center">
                          {selectedQuizzes.includes(quiz.id) && (
                            <CheckCircleIcon style={{ fontSize: 16, color: "var(--color-accent)" }} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="theme-heading font-semibold text-sm">{quiz.quiz_title}</p>
                          <p className="theme-text-muted text-xs">
                            {chapterName} • {quizQuestions.length} questions • {quiz.time_duration} mins
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="theme-text-muted text-sm text-center py-4">No quizzes available</p>
              )}
            </div>
          </div>

          {/* Divider - Show when quizzes selected */}
          {selectedQuizzes.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-(--color-border)" />
              <p className="theme-text-muted text-xs font-semibold uppercase">OR</p>
              <div className="flex-1 h-px bg-(--color-border)" />
            </div>
          )}

          {/* Difficulty Filter - Hide when quizzes selected */}
          {selectedQuizzes.length === 0 && (
            <div className="theme-card p-6">
              <h3 className="theme-heading text-lg font-bold mb-4">Filter by Difficulty</h3>
              <div className="flex gap-3">
                {["easy", "medium", "hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultyToggle(diff)}
                    className={`flex-1 px-4 py-3 rounded-lg transition-all border-2 font-semibold text-sm ${
                      selectedDifficulty.includes(diff)
                        ? "border-(--color-accent) bg-(--color-accent-light)"
                        : "border-(--color-border) hover:border-(--color-accent-light)"
                    }`}
                  >
                    {selectedDifficulty.includes(diff) && <CheckCircleIcon style={{ fontSize: 14 }} className="mr-1" />}
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subjects Selection - Hide when quizzes selected */}
          {selectedQuizzes.length === 0 && (
            <div className="theme-card p-6">
              <h3 className="theme-heading text-lg font-bold mb-4">Select Subjects</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectToggle(subject.id)}
                    className={`p-4 rounded-lg transition-all border-2 text-left ${
                      selectedSubjects.includes(subject.id)
                        ? "border-(--color-accent) bg-(--color-accent-light)"
                        : "border-(--color-border) hover:border-(--color-accent-light)"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border-2 border-(--color-accent) flex items-center justify-center">
                        {selectedSubjects.includes(subject.id) && (
                          <CheckCircleIcon style={{ fontSize: 16, color: "var(--color-accent)" }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="theme-heading font-semibold text-sm">{subject.name}</p>
                        <p className="theme-text-muted text-xs">
                          {chapters.filter((ch) => ch.subject === subject.id).length} chapters
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chapters Selection - Hide when quizzes selected */}
          {selectedQuizzes.length === 0 && selectedSubjects.length > 0 && (
            <div className="theme-card p-6">
              <h3 className="theme-heading text-lg font-bold mb-4">Select Chapters</h3>
              <p className="theme-text-muted text-sm mb-4">Leave empty to select all chapters from chosen subjects</p>
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {getAvailableChapters().map((chapter) => {
                  const chapterQuestions = questions.filter((q) => q.chapter === chapter.id);
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterToggle(chapter.id)}
                      className={`p-4 rounded-lg transition-all border-2 text-left ${
                        selectedChapters.includes(chapter.id)
                          ? "border-(--color-accent) bg-(--color-accent-light)"
                          : "border-(--color-border) hover:border-(--color-accent-light)"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded border-2 border-(--color-accent) flex items-center justify-center">
                          {selectedChapters.includes(chapter.id) && (
                            <CheckCircleIcon style={{ fontSize: 16, color: "var(--color-accent)" }} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="theme-heading font-semibold text-sm">{chapter.name}</p>
                          <p className="theme-text-muted text-xs">{chapterQuestions.length} questions available</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerateQuestionPaper;
