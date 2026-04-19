# 📁 Quiz Master - Organized Directory Structure

## Directory Tree

```
src/pages/
├── public/
│   └── HomePage.jsx
├── auth/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── ForgotPasswordPage.jsx
├── admin/
│   ├── AdminLayout.jsx (Layout wrapper)
│   ├── dashboard/
│   │   ├── AdminOverview.jsx         (Dashboard home with stats)
│   │   └── AdminSummary.jsx          (Summary/reports)
│   ├── content/
│   │   ├── ExamTypesPage.jsx         (Create/edit exam types)
│   │   ├── ManageSubjects.jsx        (Subject management)
│   │   ├── ChaptersPage.jsx          (Chapter management)
│   │   ├── ManageQuestions.jsx       (Question bank)
│   │   └── BulkImportQuestionsPage.jsx (CSV/Excel import)
│   ├── quiz/
│   │   ├── ManageQuizzes.jsx         (Quiz CRUD)
│   │   ├── QuizBuilderPage.jsx       (Drag & drop builder)
│   │   ├── QuizPreviewPage.jsx       (Student view preview)
│   │   ├── QuizAssignmentsPage.jsx   (Assign to students/batches)
│   │   └── GenerateQuestionPaper.jsx (Question paper generation)
│   ├── users/
│   │   ├── BatchesPage.jsx           (Batch management)
│   │   ├── StudentsPage.jsx          (Students list)
│   │   └── StudentDetailPage.jsx     (Individual student profile)
│   ├── analytics/
│   │   ├── QuizAnalyticsPage.jsx     (Per-quiz analytics)
│   │   ├── StudentAnalyticsPage.jsx  (Student performance)
│   │   └── LeaderboardPage.jsx       (Rankings)
│   └── settings/
│       ├── SettingsPage.jsx          (Platform config)
│       └── AdminProfilePage.jsx      (Admin profile)
└── user/
    ├── QuizTaking.jsx                (Legacy - backward compatibility)
    ├── UserScores.jsx                (Legacy - backward compatibility)
    ├── dashboard/
    │   ├── UserDashboard.jsx         (Student home)
    │   ├── AllQuizzesPage.jsx        (Browse all quizzes)
    │   └── MyAssignmentsPage.jsx     (Assigned quizzes)
    ├── quiz/
    │   ├── QuizDetailPage.jsx        (Quiz info & instructions)
    │   └── QuizAttemptWindow.jsx     (NTA-style attempt - FULLY IMPLEMENTED)
    ├── results/
    │   ├── QuizResultPage.jsx        (Score & breakdown)
    │   ├── SolutionReviewPage.jsx    (Q&A review)
    │   └── AttemptHistoryPage.jsx    (Past attempts)
    ├── analytics/
    │   ├── UserAnalyticsPage.jsx     (Performance trends)
    │   └── StudentLeaderboardPage.jsx (Rankings)
    └── profile/
        └── StudentProfilePage.jsx    (Profile & settings)
```

---

## 📊 Page Categories Breakdown

### 🔐 Authentication (3 pages)
```
/login              → LoginPage
/register           → RegisterPage
/forgot-password    → ForgotPasswordPage
```

### 👨‍💼 Admin Dashboard (2 pages)
```
/admin              → AdminOverview
/admin/summary      → AdminSummary
```

### 📚 Content Management (5 pages)
```
/admin/exam-types      → ExamTypesPage
/admin/subjects        → ManageSubjects
/admin/chapters        → ChaptersPage
/admin/questions/:id   → ManageQuestions
/admin/bulk-import     → BulkImportQuestionsPage
```

### 🎯 Quiz Management (5 pages)
```
/admin/quizzes           → ManageQuizzes
/admin/quiz-builder      → QuizBuilderPage
/admin/quiz-preview      → QuizPreviewPage
/admin/quiz-assignments  → QuizAssignmentsPage
/admin/question-paper    → GenerateQuestionPaper
```

### 👥 User & Batch Management (3 pages)
```
/admin/batches        → BatchesPage
/admin/students       → StudentsPage
/admin/students/:id   → StudentDetailPage
```

### 📈 Analytics (3 pages)
```
/admin/quiz-analytics     → QuizAnalyticsPage
/admin/student-analytics  → StudentAnalyticsPage
/admin/leaderboard        → LeaderboardPage
```

### ⚙️ Settings (2 pages)
```
/admin/settings  → SettingsPage
/admin/profile   → AdminProfilePage
```

---

## 🎓 Student Side Pages

### 📊 Dashboard (3 pages)
```
/student/dashboard       → UserDashboard
/student/all-quizzes     → AllQuizzesPage
/student/my-assignments  → MyAssignmentsPage
```

### 📝 Quiz Attempt (2 pages)
```
/student/quiz/:id          → QuizDetailPage
/student/attempt/:id       → QuizAttemptWindow ⭐ (NTA-STYLE)
```

### 📋 Results & Review (3 pages)
```
/student/result/:id    → QuizResultPage
/student/review/:id    → SolutionReviewPage
/student/attempts      → AttemptHistoryPage
```

### 📊 Performance Analytics (2 pages)
```
/student/analytics     → UserAnalyticsPage
/student/leaderboard   → StudentLeaderboardPage
```

### 👤 Profile (1 page)
```
/student/profile       → StudentProfilePage
```

---

## ✨ Special Features

### ⭐ NTA-Style Quiz Attempt Window (FULLY IMPLEMENTED)
**Location:** `/src/pages/user/quiz/QuizAttemptWindow.jsx`

**Features:**
- ✅ Professional NTA exam interface
- ✅ Instructions screen
- ✅ Three-panel layout:
  - Left: Section tabs with progress
  - Center: Question display with options
  - Right: Question palette with status indicators
- ✅ Real-time timer (HH:MM:SS)
- ✅ Metadata display (answered count, marked count)
- ✅ MCQ selection with color coding
- ✅ Section switching with confirmation modal
- ✅ Submit confirmation with validation
- ✅ Previous/Next navigation
- ✅ Auto-save indicator (30s interval)
- ✅ Tab switch logging
- ✅ Responsive design

---

## 🔧 Code Organization Benefits

### 1. **Better Code Reviews**
   - Grouping related pages makes review scope clearer
   - Easier to track related feature changes
   - Clear separation of concerns

### 2. **Improved Maintainability**
   - Logical grouping of functionality
   - Easier to find related files
   - Better for team navigation

### 3. **Scalability**
   - Easy to add new pages to existing categories
   - Clear patterns for future development
   - Reduced naming conflicts

### 4. **CI/CD Integration**
   - Can create specific test/lint jobs per module
   - Easier to identify what changed
   - Better code ownership assignment

---

## 📦 Total Pages Count

| Category | Count | Status |
|----------|-------|--------|
| Auth | 3 | ✅ Ready |
| Admin Dashboard | 2 | ✅ Ready |
| Admin Content | 5 | ✅ Ready |
| Admin Quiz | 5 | ✅ Ready |
| Admin Users | 3 | ✅ Ready |
| Admin Analytics | 3 | ✅ Ready |
| Admin Settings | 2 | ✅ Ready |
| **Admin Total** | **23** | ✅ **READY** |
| Student Dashboard | 3 | ✅ Ready |
| Student Quiz | 2 | ✅ Ready (1 Fully Implemented) |
| Student Results | 3 | ✅ Ready |
| Student Analytics | 2 | ✅ Ready |
| Student Profile | 1 | ✅ Ready |
| **Student Total** | **11** | ✅ **READY** |
| **Grand Total** | **37** | ✅ **READY** |

---

## 🚀 Next Steps

### For Each Page:
1. [ ] Connect to backend APIs
2. [ ] Implement business logic
3. [ ] Add data validation
4. [ ] Add error handling
5. [ ] Style with design system
6. [ ] Add loading states
7. [ ] Write unit tests
8. [ ] Write integration tests

### Priority Implementation Order:
1. **Auth Module** (LoginPage, RegisterPage)
2. **Admin Dashboard** (AdminOverview with stats)
3. **Student Dashboard** (UserDashboard, AllQuizzesPage)
4. **Quiz Management** (ManageQuizzes, QuizBuilderPage)
5. **Quiz Attempt** (QuizAttemptWindow - already fully styled)
6. **Results & Analytics** (QuizResultPage, Analytics)
7. **Content Management** (ManageQuestions, ManageSubjects)
8. **Advanced Features** (BulkImport, Leaderboard)

---

Last Updated: April 20, 2026
Directory Structure: ✅ Organized & Ready for Development
