# 🎓 Rural Spark — LMS Web Frontend

> **Learning Management System** — एक Progressive Web App जो Government Events, Institute Management, Faculty, Students, Assignments, Quizzes और Offline Learning को एक platform पर manage करती है।

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Module Flow](#module-flow)
- [All Modules & Routes](#all-modules--routes)
- [Role-Based Access](#role-based-access-rbac)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [PWA & Offline Support](#pwa--offline-support)
- [Scripts](#scripts)

---

## 🌟 Overview

**Rural Spark** एक full-featured LMS (Learning Management System) frontend है जो निम्नलिखित users के लिए बनाई गई है:

| Role | Access Level |
|------|-------------|
| 🔑 **Admin** | Full system access — institutes, government events, roles & permissions |
| 🏫 **Institute** | Institute-level management — faculty, students, departments, events |
| 👨‍🏫 **Faculty** | Teaching tools — materials, assignments, quizzes, Q&A |
| 👨‍🎓 **Student** | Learning — view materials, submit assignments, attempt quizzes, Q&A |

---

## ✨ Features

### 🔐 Authentication
- JWT-based login/logout
- Protected routes with role-based redirect
- Auto-redirect to dashboard if already logged in

### 📊 Dashboard
- Overview page with analytics (ApexCharts)
- Student progress tracking
- Events feed (Government + Institute events combined)
- Online Library access

### 🏛️ Admin Management
- **Institute Master** — Create, list, edit institutes
- **Government Event Master** — Create, publish, manage government-level events

### ⚙️ Core Management
- **Role & Permission** — Define roles and assign granular permissions

### 🏫 Institute Management
- **Faculty** — Add/manage faculty members
- **Student** — Enroll/manage students
- **Department** — Create and organize departments
- **Institute Events** — Manage institute-level events/notices

### 👨‍🏫 Faculty Management
- **Materials** — Upload reading, lecture videos, audio, images, text content
- **Assignments** — Create assignments, view student submissions
- **Quiz** — Create quizzes with questions, view results
- **Student Progress** — Monitor individual student performance

### 👨‍🎓 Student Upload
- **Assignment Upload** — Submit assignments with file attachments
- **Quiz Attempt** — Attempt quizzes and view results
- **Study Materials** — Browse and download course materials

### 💬 Q&A System
- Students can ask questions to faculty
- Faculty can view all/answered/unanswered questions
- Rich text answers with Markdown support

### 🏖️ Leave Management
- Apply for leave (students/faculty)
- Leave approval workflow for admins/HODs
- Leave list and history

### 🎮 Gamification
- Achievements & Badges system
- Student engagement through rewards

### 📚 Offline Library
- Download materials for offline viewing
- IndexedDB-based local storage
- Service Worker background sync

### 🤖 Communication
- AI Chatbot integration

### 📱 PWA Features
- Installable as mobile/desktop app
- Offline support with service worker
- Background sync for data

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | TailwindCSS 4 + MUI (Material UI) |
| **Routing** | React Router DOM v7 |
| **State Management** | Jotai (atoms) + React Context |
| **Forms** | React Hook Form + Zod validation |
| **Rich Text Editor** | TipTap Editor |
| **Charts** | ApexCharts + React-ApexCharts |
| **Animations** | Framer Motion |
| **HTTP Client** | Axios + SWR (data fetching) |
| **Media Processing** | FFmpeg (in-browser video/audio processing) |
| **Offline Storage** | IndexedDB (idb library) |
| **PWA** | Workbox + vite-plugin-pwa |
| **i18n** | react-i18next |
| **Notifications** | Sonner (toast notifications) |
| **Icons** | React Icons + Lucide React |
| **Image** | Browser Image Compression + React Dropzone |
| **Markdown** | React Markdown + Rehype plugins |

---

## 📁 Project Structure

```
lms-web/
├── public/                    # Static assets
│   ├── ffmpeg/               # FFmpeg WASM binaries
│   ├── site.webmanifest      # PWA manifest
│   └── robots.txt
├── src/
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point + PWA setup
│   │
│   ├── auth/                 # Authentication pages
│   │   └── login/
│   │
│   ├── pages/                # Feature pages (lazy loaded)
│   │   └── dashboard/
│   │       ├── assignment-master/       # Assignment CRUD
│   │       ├── assignment-uploads/      # Student assignment submissions
│   │       ├── department-master/       # Department CRUD
│   │       ├── faculty-master/          # Faculty CRUD
│   │       ├── govt-event-master/       # Government events
│   │       ├── institute-event/         # Institute events
│   │       ├── institute-master/        # Institute CRUD
│   │       ├── institute-with-govt-event/ # Combined events view
│   │       ├── leave-master/            # Leave management
│   │       ├── lecture-management/      # Learning materials
│   │       ├── quiz/                    # Quiz management
│   │       ├── quiz-attempt/            # Student quiz attempts
│   │       ├── role-permission/         # RBAC management
│   │       ├── student-master/          # Student CRUD
│   │       └── student-query/           # Q&A system
│   │
│   ├── section/              # Layout sections
│   │   ├── Navbaar.tsx       # Top navigation bar
│   │   ├── Sidebar.tsx       # Side navigation
│   │   ├── overview.tsx      # Dashboard overview
│   │   ├── Progress.tsx      # Progress tracking
│   │   ├── Settings.tsx      # User settings
│   │   ├── ChatBot.tsx       # AI Chatbot
│   │   ├── Online-Library/   # Online library
│   │   ├── Student-management/  # Student-specific views
│   │   ├── Leave-management/    # Leave approval
│   │   ├── Student-upload/      # Student material viewer
│   │   ├── Gamifies/            # Gamification section
│   │   └── Offline-Downloaded-Materials/ # Offline library
│   │
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── common/           # Shared components (Skeletons, etc.)
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── assignments/      # Assignment components
│   │   ├── blocks/           # Hero/landing blocks
│   │   ├── hook-form/        # Form field components
│   │   ├── image-dropzon/    # Image upload dropzone
│   │   ├── markdown/         # Markdown renderer
│   │   ├── material/         # Material display components
│   │   ├── overview/         # Overview widgets
│   │   ├── tip-tap-editor/   # Rich text editor
│   │   ├── user-profile/     # User profile components
│   │   └── video-upload/     # Video upload with FFmpeg
│   │
│   ├── routers/
│   │   ├── routes.tsx        # All application routes
│   │   └── ModulePath.tsx    # Sidebar module definitions
│   │
│   ├── atoms/                # Jotai global state atoms
│   ├── store/                # State stores
│   ├── hooks/                # Custom React hooks
│   ├── context/              # React Context providers
│   ├── action/               # API action functions
│   ├── trpc/                 # API client configuration
│   ├── indexDB/              # IndexedDB helpers for offline
│   ├── lib/                  # Utility libraries
│   ├── utils/                # Helper functions
│   ├── types/                # TypeScript type definitions
│   ├── constants/            # App constants
│   └── theme/                # Theme provider (light/dark)
│
├── index.html                # HTML entry point
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json
```

---

## 🔄 Module Flow

### Application Flow

```
User visits URL
      │
      ▼
 Home Page (/)
      │
      ├── Not logged in → /login → JWT Auth → /dashboard
      │
      └── Logged in → /dashboard
                           │
              ┌────────────┴────────────────┐
              │                             │
         Sidebar                        Navbar
    (Module-based nav)            (Profile, Theme, etc.)
              │
    ┌─────────┼─────────────────────────┐
    │         │                         │
  Admin   Institute   Faculty      Student
 Module    Module     Module        Module
```

### Authentication Flow

```
POST /auth/login
      │
      ▼
  JWT Token received
      │
      ▼
  User atom updated (Jotai)
      │
      ▼
  Permissions loaded
      │
      ▼
  Sidebar filters routes based on permissions
      │
      ▼
  User sees only authorized modules
```

### Data Flow

```
Component
    │
    ▼
Action function (src/action/)
    │
    ▼
Axios instance (with JWT interceptor)
    │
    ▼
Backend API
    │
    ▼
SWR cache / Local state
    │
    ▼
UI re-renders
```

### Material Upload Flow

```
Faculty uploads file (Video/Audio/Image/PDF)
        │
        ▼
React Dropzone → File selected
        │
        ▼
FFmpeg (in-browser) → Compress/Process video/audio
        │
        ▼
Upload to API → File stored
        │
        ▼
IndexedDB caches for offline
        │
        ▼
Students can view/download
```

### Quiz Flow

```
Faculty creates Quiz
        │
        ▼
Add Questions (MCQ/Text)
        │
        ▼
Publish Quiz
        │
        ▼
Student attempts Quiz
        │
        ▼
Auto-graded / Submitted
        │
        ▼
Faculty views Results
        │
        ▼
Student Progress updated
```

---

## 📦 All Modules & Routes

### 🏠 Dashboard Module
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | Overview | Main dashboard with analytics |
| `/dashboard/overview` | Overview | Dashboard overview page |
| `/dashboard/progress` | Progress | Personal progress tracking |
| `/dashboard/events` | Events | Combined Govt + Institute events |
| `/dashboard/online-library` | OnlineLibrary | Browse online resources |
| `/dashboard/settings` | Settings | User profile settings |
| `/dashboard/chatbot` | ChatBot | AI assistant |
| `/dashboard/gamification` | Gamification | Badges & achievements |
| `/dashboard/offline-library/downloads` | OfflineMaterials | Offline downloaded materials |
| `/dashboard/profile` | Authprofile | Auth user profile |

---

### 🔑 Admin Management Module
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/admin/institute/new` | InstituteCreate | Create new institute |
| `/dashboard/admin/institute/list` | InstituteList | List all institutes |
| `/dashboard/admin/institute/:id/edit` | InstituteUpdate | Edit institute |
| `/dashboard/admin/govtEvent-master/new` | GovtEventCreate | Create government event |
| `/dashboard/admin/govtEvent-master/list` | GovtEventList | List government events |
| `/dashboard/admin/govtEvent-master/:id/edit` | GovtEventUpdate | Edit government event |

---

### ⚙️ Core Management Module
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/core-management/rolePermission/new` | RolePermissionCreate | Create new role |
| `/dashboard/core-management/rolePermission/list` | RolePermissionList | List all roles |
| `/dashboard/core-management/rolePermission/:id/edit` | RolePermissionUpdate | Edit role & permissions |

---

### 🏫 Institute Management Module
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/institute-management/faculty/new` | FacultyCreate | Add faculty |
| `/dashboard/institute-management/faculty/list` | FacultyList | List faculty |
| `/dashboard/institute-management/faculty/:id/edit` | FacultyUpdate | Edit faculty |
| `/dashboard/institute-management/student/new` | StudentCreate | Enroll student |
| `/dashboard/institute-management/student/list` | StudentList | List students |
| `/dashboard/institute-management/student/:id/edit` | StudentUpdate | Edit student |
| `/dashboard/institute-management/department/new` | DepartmentCreate | Create department |
| `/dashboard/institute-management/department/list` | DepartmentList | List departments |
| `/dashboard/institute-management/department/:id/edit` | DepartmentUpdate | Edit department |
| `/dashboard/institute-management/institute-event/new` | InstituteEventCreate | Create institute event |
| `/dashboard/institute-management/institute-event/list` | InstituteEventList | List institute events |
| `/dashboard/institute-management/institute-event/:id/edit` | InstituteEventUpdate | Edit institute event |

---

### 👨‍🏫 Faculty Management Module
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/faculty-management/material/new` | MaterialCreate | Upload new material |
| `/dashboard/faculty-management/material/list` | MaterialList | Browse materials |
| `/dashboard/faculty-management/material/list/reading` | ReadingList | Reading materials |
| `/dashboard/faculty-management/material/list/lectures` | LectureList | Video lectures |
| `/dashboard/faculty-management/material/list/audio` | AudioList | Audio materials |
| `/dashboard/faculty-management/material/list/text` | TextList | Text content |
| `/dashboard/faculty-management/material/list/image` | ImageList | Image materials |
| `/dashboard/faculty-management/material/:id/edit` | MaterialUpdate | Edit material |
| `/dashboard/faculty-management/material/:id/details` | MaterialDetaile | Material details |
| `/dashboard/faculty-management/assignment/new` | AssignmentCreate | Create assignment |
| `/dashboard/faculty-management/assignment/list` | AssignmentList | List assignments |
| `/dashboard/faculty-management/assignment/:id/edit` | AssignmentUpdate | Edit assignment |
| `/dashboard/faculty-management/assignment/submissions` | AssignmentSubmissions | View submissions |
| `/dashboard/faculty-management/quiz/new` | QuizCreate | Create quiz |
| `/dashboard/faculty-management/quiz/list` | QuizList | List quizzes |
| `/dashboard/faculty-management/quiz/:id/edit` | QuizEdit | Edit quiz |
| `/dashboard/faculty-management/quiz/:id/view` | QuizView | View quiz details |
| `/dashboard/faculty-management/progress` | StudentProgress | Track student progress |

---

### 👨‍🎓 Student Upload Module
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/student-upload/assignment-upload/upload` | AssignmentUploadCreate | Submit assignment |
| `/dashboard/student-upload/assignment-upload/list` | AssignmentUploadList | View submitted assignments |
| `/dashboard/student-upload/assignment-upload/:id/edit` | AssignmentUploadUpdate | Edit submission |
| `/dashboard/student-upload/quiz-attempt/new` | QuizAttemptCreate | Start quiz attempt |
| `/dashboard/student-upload/quiz-attempt/quiz/:quizId/attempt` | QuizAttempt | Take a quiz |
| `/dashboard/student-upload/quiz-attempt/list` | QuizAttemptList | View past attempts |
| `/dashboard/student-upload/quiz-attempt/:id/view` | QuizAttemptView | View attempt details |
| `/dashboard/student-upload/materials` | StudentMaterialList | Browse study materials |

---

### 💬 Q&A Module (Student)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/qna/questions` | StudentQueries | View all questions |
| `/dashboard/qna/ask` | AskQuestion | Ask a new question |

### 💬 Q&A Module (Teacher/Faculty)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/qna/teacher/questions` | StudentAllQueries | All student questions |
| `/dashboard/qna/teacher/answered` | StudentAnsweredQueries | Answered questions |
| `/dashboard/qna/teacher/unanswered` | StudentUnansweredQueries | Unanswered questions |

---

### 🏖️ Leave Management Module
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/leave-management/leave/new` | LeaveCreate | Apply for leave |
| `/dashboard/leave-management/leave/list` | LeaveList | View leave applications |
| `/dashboard/leave-management/leave/:id/edit` | LeaveEdit | Edit leave request |
| `/dashboard/leave-management/leave-approval` | LeaveApprovalDone | Approve/reject leaves |

---

## 🔒 Role-Based Access (RBAC)

Permissions are defined granularly per resource and action:

```
INSTITUTE_CREATE   → Create institutes
INSTITUTE_VIEW     → View institute details
INSTITUTE_LIST     → List all institutes

FACULTY_CREATE     → Add faculty members
FACULTY_VIEW       → View faculty profiles

STUDENT_CREATE     → Enroll students
STUDENT_VIEW       → View student profiles

LECTURE_CREATE     → Upload materials
LECTURE_VIEW       → View/download materials

ASSIGNMENT_CREATE  → Create assignments
ASSIGNMENT_VIEW    → View assignments & submissions

QUIZ_CREATE        → Create quizzes
QUIZ_ATTEMPT_CREATE → Attempt quizzes

LEAVE_CREATE       → Apply for leave
LEAVE_APPROVE_VIEW → Approve/reject leaves

GAMIFICATION_ACCESS  → Access achievements
OFFLINE_LIBRARY_ACCESS → Download materials offline
CHATBOT_ACCESS     → Use AI chatbot
```

Module-level access keys:
- `ADMIN_MANAGEMENT_ACCESS` — Full admin access
- `CORE_MANAGEMENT_ACCESS` — Role/permission management
- `INSTITUTE_MANAGEMENT_ACCESS` — Institute-level management
- `FACULTY_MANAGEMENT_ACCESS` — Faculty tools
- `STUDENT_UPLOAD_ACCESS` — Student submission tools
- `STUDENT_QUERY_ACCESS` — Q&A for faculty
- `STUDENT_QNA_ACCESS` — Q&A for students
- `LEAVE_MANAGEMENT_ACCESS` — Leave system access
- `DASHBOARD_ACCESS` — Basic dashboard access

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18+ और npm
- Running **Backend API** (lms-api)

### Local Setup

```bash
# Repository clone करें
git clone <repo-url>
cd lms-web

# Dependencies install करें
npm install

# Environment variables configure करें
cp .env.example .env
# .env में अपना backend URL डालें

# Development server start करें
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔧 Environment Variables

`.env` file में ये variables set करें:

```env
# Backend API URL (Required)
VITE_API_BASE_URL=http://localhost:3333

# App Environment
VITE_APP_ENV=development

# PWA Enable/Disable
VITE_PWA_ENABLED=true

# Sentry Error Tracking (Optional)
VITE_SENTRY_DSN=your-sentry-dsn
```

---

## 📱 PWA & Offline Support

यह app एक **Progressive Web App (PWA)** है:

| Feature | Implementation |
|---------|---------------|
| **Installable** | `site.webmanifest` + Vite PWA plugin |
| **Offline Cache** | Workbox service worker |
| **Offline Storage** | IndexedDB via `idb` library |
| **Background Sync** | Service worker background sync |
| **Media Processing** | FFmpeg WASM (in-browser video/audio processing) |

### Offline Flow:
1. User materials download करता है
2. Service Worker files cache करता है
3. IndexedDB में metadata store होता है
4. Network बंद होने पर भी materials accessible रहते हैं

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server start करें |
| `npm run build` | Production build |
| `npm run preview` | Production build preview |
| `npm run lint` | ESLint run करें |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run generate-sw` | Service Worker generate करें |

---

## 🗂️ Key Files Reference

| File | Purpose |
|------|---------|
| `src/routers/routes.tsx` | All application routes with lazy loading |
| `src/routers/ModulePath.tsx` | Sidebar modules with permission-based visibility |
| `src/main.tsx` | App entry point, PWA registration |
| `vite.config.ts` | Vite + PWA configuration |
| `src/utils/permission.ts` | Permission keys enum |

---

## 📞 API Integration

Frontend expects a RESTful backend (see `lms-api`):

```
Auth:
  POST   /auth/login              → JWT token
  POST   /auth/logout             → Session end

Institute:
  GET    /institutes              → List
  POST   /institutes              → Create
  PUT    /institutes/:id          → Update

Faculty / Student:
  GET    /users                   → List
  POST   /users                   → Create

Materials (Lectures):
  GET    /lectures                → List
  POST   /lectures                → Upload
  GET    /lectures/:id            → Details

Assignments:
  GET    /assignments             → List
  POST   /assignments             → Create
  GET    /assignment-uploads      → Submissions

Quiz:
  GET    /quizzes                 → List
  POST   /quizzes                 → Create
  POST   /quiz-attempts           → Submit attempt

Events:
  GET    /govt-events             → Govt events
  GET    /institute-events        → Institute events

Leave:
  GET    /leaves                  → List
  POST   /leaves                  → Apply
  PATCH  /leaves/:id/approve      → Approve

Q&A:
  GET    /student-queries         → All questions
  POST   /student-queries         → Ask question
  PATCH  /student-queries/:id     → Answer question
```

---

<div align="center">

**Rural Spark LMS** — Empowering Education

Made with React + TypeScript + Vite

</div>
