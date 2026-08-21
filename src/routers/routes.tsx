// routes.tsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState, Suspense, useEffect, ElementType } from "react";
import Skeletons from '../components/common/Skeletons';
import { useUser } from "../atoms/userAtom";
import { useTheme } from "@/theme/AppThemeProvider.tsx";
import { lazyPreload, preloadAllChunks } from "@/utils/lazyload";

// ✅ Lazy imports with preload
const Navbaar = lazyPreload(() => import("../section/Navbaar"), "Navbaar");
const Sidebar = lazyPreload(() => import("../section/Sidebar"), "Sidebar");

// ✅ All pages with lazy preload
const pages = {
  Login: lazyPreload(() => import("../auth/login/login"), "Login"),
  Authprofile: lazyPreload(() => import("../section/authprofile"), "Authprofile"),
  Overview: lazyPreload(() => import("../section/overview"), "Overview"),
  Progress: lazyPreload(() => import("../section/Progress"), "Progress"),
  OnlineLibrary: lazyPreload(() => import("../section/Online-Library/Online-Library"), "OnlineLibrary"),
  Events: lazyPreload(() => import("../pages/dashboard/institute-with-govt-event/institute-with-govt-event-list"), "Events"),
  Settings: lazyPreload(() => import("../section/Settings"), "Settings"),
  ChatBot: lazyPreload(() => import("../section/ChatBot"), "ChatBot"),
  InstituteCreate: lazyPreload(() => import("../pages/dashboard/institute-master/new"), "InstituteCreate"),
  InstituteList: lazyPreload(() => import("../pages/dashboard/institute-master/list"), "InstituteList"),
  InstituteUpdate: lazyPreload(() => import("../pages/dashboard/institute-master/edit"), "InstituteUpdate"),
  GovtEventCreate: lazyPreload(() => import("../pages/dashboard/govt-event-master/new"), "GovtEventCreate"),
  GovtEventList: lazyPreload(() => import("../pages/dashboard/govt-event-master/list"), "GovtEventList"),
  GovtEventUpdate: lazyPreload(() => import("../pages/dashboard/govt-event-master/edit"), "GovtEventUpdate"),
  RolePermissionCreate: lazyPreload(() => import("../pages/dashboard/role-permission/new"), "RolePermissionCreate"),
  RolePermissionList: lazyPreload(() => import("../pages/dashboard/role-permission/list"), "RolePermissionList"),
  RolePermissionUpdate: lazyPreload(() => import("../pages/dashboard/role-permission/edit"), "RolePermissionUpdate"),
  FacultyCreate: lazyPreload(() => import("../pages/dashboard/faculty-master/new"), "FacultyCreate"),
  FacultyUpdate: lazyPreload(() => import("../pages/dashboard/faculty-master/edit"), "FacultyUpdate"),
  FacultyList: lazyPreload(() => import("../pages/dashboard/faculty-master/list"), "FacultyList"),
  StudentCreate: lazyPreload(() => import("../pages/dashboard/student-master/new"), "StudentCreate"),
  StudentList: lazyPreload(() => import("../pages/dashboard/student-master/list"), "StudentList"),
  StudentUpdate: lazyPreload(() => import("../pages/dashboard/student-master/edit"), "StudentUpdate"),
  InstituteEventCreate: lazyPreload(() => import("../pages/dashboard/institute-event/new"), "InstituteEventCreate"),
  InstituteEventList: lazyPreload(() => import("../pages/dashboard/institute-event/list"), "InstituteEventList"),
  InstituteEventUpdate: lazyPreload(() => import("../pages/dashboard/institute-event/edit"), "InstituteEventUpdate"),
  DepartmentCreate: lazyPreload(() => import("../pages/dashboard/department-master/new"), "DepartmentCreate"),
  DepartmentUpdate: lazyPreload(() => import("../pages/dashboard/department-master/edit"), "DepartmentUpdate"),
  DepartmentList: lazyPreload(() => import("../pages/dashboard/department-master/list"), "DepartmentList"),
  MaterialCreate: lazyPreload(() => import("../pages/dashboard/lecture-management/new"), "MaterialCreate"),
  MaterialList: lazyPreload(() => import("../pages/dashboard/lecture-management/list"), "MaterialList"),
  MaterialUpdate: lazyPreload(() => import("../pages/dashboard/lecture-management/edit"), "MaterialUpdate"),
  MaterialDetaile: lazyPreload(() => import("../pages/dashboard/lecture-management/details"), "MaterialDetaile"),
  AssignmentCreate: lazyPreload(() => import("../pages/dashboard/assignment-master/new"), "AssignmentCreate"),
  AssignmentList: lazyPreload(() => import("../pages/dashboard/assignment-master/list"), "AssignmentList"),
  AssignmentUpdate: lazyPreload(() => import("../pages/dashboard/assignment-master/edit"), "AssignmentUpdate"),
  AssignmentSubmissions: lazyPreload(() => import("../pages/dashboard/assignment-master/submissions"), "AssignmentSubmissions"),
  AudioList: lazyPreload(() => import("../section/Student-management/Audio-master/Audio-list"), "AudioList"),
  LectureList: lazyPreload(() => import("../section/Student-management/Lecture-master/Lecture-list"), "LectureList"),
  ReadingList: lazyPreload(() => import("../section/Student-management/Reading-Master/Reading-list"), "ReadingList"),
  TextList: lazyPreload(() => import("../section/Student-management/Text-master/Text-list"), "TextList"),
  ImageList: lazyPreload(() => import("../section/Student-management/Image-master/Image-list"), "ImageList"),
  QuizCreate: lazyPreload(() => import("../pages/dashboard/quiz/new"), "QuizCreate"),
  QuizList: lazyPreload(() => import("../pages/dashboard/quiz/list"), "QuizList"),
  QuizEdit: lazyPreload(() => import("../pages/dashboard/quiz/edit"), "QuizEdit"),
  QuizView: lazyPreload(() => import("../pages/dashboard/quiz/view"), "QuizView"),
  QuizAttemptCreate: lazyPreload(() => import("../pages/dashboard/quiz-attempt/new"), "QuizAttemptCreate"),
  QuizAttempt: lazyPreload(() => import("../pages/dashboard/quiz-attempt/attempt"), "QuizAttempt"),
  QuizAttemptList: lazyPreload(() => import("../pages/dashboard/quiz-attempt/list"), "QuizAttemptList"),
  QuizAttemptEdit: lazyPreload(() => import("../pages/dashboard/quiz-attempt/edit"), "QuizAttemptEdit"),
  QuizAttemptView: lazyPreload(() => import("../pages/dashboard/quiz-attempt/view"), "QuizAttemptView"),
  StudentProgress: lazyPreload(() => import("../section/Student-management/Student-Progress/Student-Progress"), "StudentProgress"),
  StudentAllQueries: lazyPreload(() => import("../pages/dashboard/student-query/teacher-list"), "StudentAllQueries"),
  StudentAnsweredQueries: lazyPreload(() => import("../pages/dashboard/student-query/teacher-answered"), "StudentAnsweredQueries"),
  StudentUnansweredQueries: lazyPreload(() => import("../pages/dashboard/student-query/teacher-unanswered"), "StudentUnansweredQueries"),
  LeaveCreate: lazyPreload(() => import("../pages/dashboard/leave-master/new"), "LeaveCreate"),
  LeaveList: lazyPreload(() => import("../pages/dashboard/leave-master/list"), "LeaveList"),
  LeaveEdit: lazyPreload(() => import("../pages/dashboard/leave-master/edit"), "LeaveEdit"),
  LeaveApprovalDone: lazyPreload(() => import("../section/Leave-management/Leave-Approval-master/leave-approval-done"), "LeaveApprovalDone"),
  AssignmentUploadCreate: lazyPreload(() => import("../pages/dashboard/assignment-uploads/new"), "AssignmentUploadCreate"),
  AssignmentUploadList: lazyPreload(() => import("../pages/dashboard/assignment-uploads/list"), "AssignmentUploadList"),
  AssignmentUploadUpdate: lazyPreload(() => import("../pages/dashboard/assignment-uploads/edit"), "AssignmentUploadUpdate"),
  StudentMaterialList: lazyPreload(() => import("../section/Student-upload/Material/Material-list"), "StudentMaterialList"),
  StudentQueries: lazyPreload(() => import("../pages/dashboard/student-query/list"), "StudentQueries"),
  AskQuestion: lazyPreload(() => import("../pages/dashboard/student-query/new"), "AskQuestion"),
  GamifiedSeciton: lazyPreload(() => import("../section/Gamifies/Gamified"), "GamifiedSeciton"),
  OfflineMaterials: lazyPreload(() => import("../section/Offline-Downloaded-Materials/Offline-Materials"), "OfflineMaterials"),
  Home: lazyPreload(() => import("../components/blocks/hero-section-1").then(m => ({ default: m.HeroSection1 })), "Home"),
  SpokenEnglish: lazyPreload(() => import("../section/Skill-learning/spoken-english/spoken-english-list"), "SpokenEnglish"),
  ComputerBasic: lazyPreload(() => import("../section/Skill-learning/computer-basic/computer-basic-list"), "ComputerBasci"),
  Coding: lazyPreload(() => import("../section/Skill-learning/coding/codind-list"), "Coding"),
  GovernmentExams: lazyPreload(() => import("../section/Skill-learning/government-exams/government-exams-list"), "GovernmentExams"),
  DigitalSkill: lazyPreload(() => import("../section/Skill-learning/digital-skill/digital-skill-list"), "DigitalSkill"),
  CareerRoadmap: lazyPreload(() => import("../section/Skill-learning/career-roadmap/career-roadmap-list"), "CareerRoadmap"),
  softSkill: lazyPreload(() => import("../section/Skill-learning/soft-skill/soft-skill-list"), "softSkill"),
};

// ✅ Preload all chunks when app loads
const allImports = Object.values(pages).reduce((acc, page) => {
  if (page && (page as any).preload) {
    acc[(page as any).name] = (page as any).preload;
  }
  return acc;
}, {} as Record<string, () => Promise<any>>);

// ✅ Preload in background
if (typeof window !== 'undefined') {
  setTimeout(() => {
    preloadAllChunks(allImports);
  }, 1000);
}

// ✅ Protected Route
const ProtectedRoute = () => {
  const { user, isLoading } = useUser();
  if (isLoading) return <Skeletons.Page />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// ✅ Login Route
const LoginRoute = () => {
  const { user, isLoading } = useUser();
  if (isLoading) return <Skeletons.Form />;
  return user ? <Navigate to="/dashboard" replace /> : <Page component={pages.Login} type="form" />;
};


// OR agar children bhi chahiye toh:
type DashboardLayoutProps = {
  toggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  children?: React.ReactNode;
};
// ✅ Dashboard Layout
const DashboardLayout = ({ toggleMobileSidebar, isMobileSidebarOpen }: DashboardLayoutProps) => {
  const { mode } = useTheme?.() || { mode: 'light' };
  const isDark = mode === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
      }}
      className={`transition-colors duration-300 ${isDark ? 'bg-slate-950/70' : 'bg-gray-50'}`}
    >
      <Suspense fallback={<div style={{ width: '260px', flexShrink: 0, height: '100vh' }} aria-busy="true" />}>
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          toggleMobileSidebar={toggleMobileSidebar}
          useUiSidebar={true}
        />
      </Suspense>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          width: 0,
        }}
      >
        <Suspense fallback={<div style={{ height: '56px', width: '100%', flexShrink: 0 }} aria-busy="true" />}>
          <Navbaar toggleMobileSidebar={toggleMobileSidebar} />
        </Suspense>
      </div>
    </div>
  );
};

type PageType = "form" | "list" | "table" | "dashboard" | "page";
type PageComponent = ElementType;

// ✅ Page component with Suspense
const Page = ({ component: Component, type = "page", showSkeleton = true }: {
  component: PageComponent;
  type?: PageType;
  showSkeleton?: boolean;
}) => {
  useEffect(() => {
    // ✅ Preload chunks when visibility changes
    if (typeof document === "undefined") return;

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        // Preload all chunks when user comes back
        preloadAllChunks(allImports);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const getSkeleton = () => {
    if (!showSkeleton) return null;

    switch (type) {
      case "form": return <Skeletons.Form />;
      case "list": return <Skeletons.List />;
      case "table": return <Skeletons.Table />;
      case "dashboard": return <Skeletons.Dashboard />;
      default: return <Skeletons.Page />;
    }
  };

  return (
    <Suspense fallback={getSkeleton()}>
      <Component />
    </Suspense>
  );
};

export default function Routers() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

  return (
    <Routes>
      <Route path="/" element={<Page component={pages.Home} type="page" showSkeleton={false} />} />
      <Route path="/online-library" element={<Page component={pages.OnlineLibrary} type="page" showSkeleton={false} />} />
      <Route path="/login" element={<LoginRoute />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"
          element={<DashboardLayout {...{ toggleMobileSidebar, isMobileSidebarOpen }} />}
        >
          <Route path="profile" element={<Page component={pages.Authprofile} type="form" />} />
          <Route index element={<Page component={pages.Overview} type="dashboard" />} />
          <Route path="overview" element={<Page component={pages.Overview} type="dashboard" />} />
          <Route path="online-library" element={<Page component={pages.OnlineLibrary} type="page" />} />
          <Route path="progress" element={<Page component={pages.Progress} type="dashboard" />} />
          <Route path="events" element={<Page component={pages.Events} type="list" />} />
          <Route path="settings" element={<Page component={pages.Settings} type="form" />} />
          <Route path="chatbot" element={<Page component={pages.ChatBot} type="page" />} />
          <Route path="admin/institute/new" element={<Page component={pages.InstituteCreate} type="form" />} />
          <Route path="admin/institute/list" element={<Page component={pages.InstituteList} type="table" />} />
          <Route path="admin/institute/:id/edit" element={<Page component={pages.InstituteUpdate} type="form" />} />

          <Route path="admin/govtEvent-master/new" element={<Page component={pages.GovtEventCreate} type="form" />} />
          <Route path="admin/govtEvent-master/list" element={<Page component={pages.GovtEventList} type="table" />} />
          <Route path="admin/govtEvent-master/:id/edit" element={<Page component={pages.GovtEventUpdate} type="form" />} />

          <Route path="core-management/rolePermission/new" element={<Page component={pages.RolePermissionCreate} type="form" />} />
          <Route path="core-management/rolePermission/list" element={<Page component={pages.RolePermissionList} type="table" />} />
          <Route path="core-management/rolePermission/:id/edit" element={<Page component={pages.RolePermissionUpdate} type="form" />} />

          <Route path="institute-management/faculty/new" element={<Page component={pages.FacultyCreate} type="form" />} />
          <Route path="institute-management/faculty/list" element={<Page component={pages.FacultyList} type="table" />} />
          <Route path="institute-management/faculty/:id/edit" element={<Page component={pages.FacultyUpdate} type="form" />} />

          <Route path="institute-management/student/new" element={<Page component={pages.StudentCreate} type="form" />} />
          <Route path="institute-management/student/list" element={<Page component={pages.StudentList} type="table" />} />
          <Route path="institute-management/student/:id/edit" element={<Page component={pages.StudentUpdate} type="form" />} />

          <Route path="institute-management/institute-event/new" element={<Page component={pages.InstituteEventCreate} type="form" />} />
          <Route path="institute-management/institute-event/list" element={<Page component={pages.InstituteEventList} type="table" />} />
          <Route path="institute-management/institute-event/:id/edit" element={<Page component={pages.InstituteEventUpdate} type="form" />} />

          <Route path="institute-management/department/new" element={<Page component={pages.DepartmentCreate} type="form" />} />
          <Route path="institute-management/department/:id/edit" element={<Page component={pages.DepartmentUpdate} type="form" />} />
          <Route path="institute-management/department/list" element={<Page component={pages.DepartmentList} type="table" />} />

          <Route path="faculty-management/assignment/new" element={<Page component={pages.AssignmentCreate} type="form" />} />
          <Route path="faculty-management/assignment/list" element={<Page component={pages.AssignmentList} type="table" />} />
          <Route path="faculty-management/assignment/:id/edit" element={<Page component={pages.AssignmentUpdate} type="form" />} />
          <Route path="faculty-management/assignment/submissions" element={<Page component={pages.AssignmentSubmissions} type="table" />} />

          <Route path="faculty-management/material/new" element={<Page component={pages.MaterialCreate} type="form" />} />
          <Route path="faculty-management/material/:id/edit" element={<Page component={pages.MaterialUpdate} type="form" />} />
          <Route path="faculty-management/material/:id/details" element={<Page component={pages.MaterialDetaile} type="table" />} />
          <Route path="faculty-management/material/list" element={<Page component={pages.MaterialList} type="list" />}>
            <Route index element={<Navigate to="reading" replace />} />
            <Route path="reading" element={<Page component={pages.ReadingList} type="list" />} />
            <Route path="lectures" element={<Page component={pages.LectureList} type="list" />} />
            <Route path="audio" element={<Page component={pages.AudioList} type="list" />} />
            <Route path="text" element={<Page component={pages.TextList} type="list" />} />
            <Route path="image" element={<Page component={pages.ImageList} type="list" />} />
          </Route>

          <Route path="faculty-management/quiz/new" element={<Page component={pages.QuizCreate} type="form" />} />
          <Route path="faculty-management/quiz/list" element={<Page component={pages.QuizList} type="table" />} />
          <Route path="faculty-management/quiz/:id/edit" element={<Page component={pages.QuizEdit} type="form" />} />
          <Route path="faculty-management/quiz/:id/view" element={<Page component={pages.QuizView} type="table" />} />

          <Route path="faculty-management/progress" element={<Page component={pages.StudentProgress} type="dashboard" />} />

          <Route path="qna/teacher/questions" element={<Page component={pages.StudentAllQueries} type="list" />} />
          <Route path="qna/teacher/answered" element={<Page component={pages.StudentAnsweredQueries} type="list" />} />
          <Route path="qna/teacher/unanswered" element={<Page component={pages.StudentUnansweredQueries} type="list" />} />

          <Route path="leave-management/leave/new" element={<Page component={pages.LeaveCreate} type="form" />} />
          <Route path="leave-management/leave/list" element={<Page component={pages.LeaveList} type="table" />} />
          <Route path="leave-management/leave/:id/edit" element={<Page component={pages.LeaveEdit} type="form" />} />
          <Route path="leave-management/leave-approval" element={<Page component={pages.LeaveApprovalDone} type="list" />} />

          <Route path="student-upload/assignment-upload/upload" element={<Page component={pages.AssignmentUploadCreate} type="form" />} />
          <Route path="student-upload/assignment-upload/list" element={<Page component={pages.AssignmentUploadList} type="list" />} />
          <Route path="student-upload/assignment-upload/:id/edit" element={<Page component={pages.AssignmentUploadUpdate} type="form" />} />

          <Route path="student-upload/quiz-attempt/new" element={<Page component={pages.QuizAttemptCreate} type="form" />} />
          <Route path="student-upload/quiz-attempt/quiz/:quizId/attempt" element={<Page component={pages.QuizAttempt} type="form" />} />
          <Route path="student-upload/quiz-attempt/list" element={<Page component={pages.QuizAttemptList} type="table" />} />
          <Route path="student-upload/quiz-attempt/:id/edit" element={<Page component={pages.QuizAttemptEdit} type="form" />} />
          <Route path="student-upload/quiz-attempt/:id/view" element={<Page component={pages.QuizAttemptView} type="table" />} />

          <Route path="student-upload/materials" element={<Page component={pages.StudentMaterialList} type="list" />} />
          <Route path="qna/questions" element={<Page component={pages.StudentQueries} type="list" />} />
          <Route path="qna/ask" element={<Page component={pages.AskQuestion} type="form" />} />
          <Route path="gamification" element={<Page component={pages.GamifiedSeciton} type="page" />} />
          <Route path="offline-library/downloads" element={<Page component={pages.OfflineMaterials} type="list" />} />
          <Route path="skills/spoken-english" element={<Page component={pages.SpokenEnglish} type="list" />}></Route>
          <Route path="skills/computer-basics" element={<Page component={pages.ComputerBasic} type="list" />}></Route>
          <Route path="skills/coding" element={<Page component={pages.Coding} type="list" />}></Route>
          <Route path="skills/government-exams" element={<Page component={pages.GovernmentExams} type="list" />}></Route>
          <Route path="skills/digital-skills" element={<Page component={pages.DigitalSkill} type="page" />} />
          <Route path="skills/career-roadmap" element={<Page component={pages.CareerRoadmap} type="page" />} />
          <Route path="skills/soft-skills" element={<Page component={pages.softSkill} type="page" />} />
        </Route>
      </Route>
    </Routes>
  );
}