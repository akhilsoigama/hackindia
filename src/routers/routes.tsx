import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, Suspense, lazy } from "react";
import Navbaar from "../section/Navbaar";
import Sidebar from "../section/Sidebar";

const Login = lazy(() => import("../auth/login/login"));
const Overview = lazy(() => import("../section/overview"));
const Progress = lazy(() => import("../section/Progress"));
const Events = lazy(() => import("../section/Events"));
const Quiz = lazy(() => import("../section/quiz"));
const Settings = lazy(() => import("../section/Settings"));
const ChatBot = lazy(() => import("../section/ChatBot"));

// Nabha Management
const InstituteCreate = lazy(() => import("../section/Nabha-management/institute-management/Institute-create"));
const InstituteList = lazy(() => import("../section/Nabha-management/institute-management/Institute-list"));
const GovtServeyCreate = lazy(() => import("../section/Nabha-management/servey-master/Govt-Servey-Create"));
const GovtServeyList = lazy(() => import("../section/Nabha-management/servey-master/Govt-Servey-List"));
const RolePermissionCreate = lazy(() => import("../section/Nabha-management/Role-permission/Role-Permission-Create"));
const RolePermissionList = lazy(() => import("../section/Nabha-management/Role-permission/Role-Permission-List"));

// ... continue with all other imports

// Institute Management - faculty & students
const FacultyCreate = lazy(() => import("../section/Institute-management/faculty/faculty-create"));
const FacultyList = lazy(() => import("../section/Institute-management/faculty/faculty-list"));
const StudentCreate = lazy(() => import("../section/Institute-management/students/student-create"));
const StudentList = lazy(() => import("../section/Institute-management/students/student-list"));
const InstituteSurveyCreate = lazy(() => import("../section/Institute-management/institure-serveys/servey-create"));
const InstituteSurveyList = lazy(() => import("../section/Institute-management/institure-serveys/servey-list"));
const DepartmentCreate = lazy(() => import("../section/Institute-management/department-master/department-create"));
const DepartmentList = lazy(() => import("../section/Institute-management/department-master/department-list"));

// Faculty / Student features
const AssignmentCreate = lazy(() => import("../section/Student-management/Assignment-master/assignment-create"));
const AssignmentList = lazy(() => import("../section/Student-management/Assignment-master/assignment-list"));
const MaterialList = lazy(() => import("../section/Student-management/Materials-management/materials-list"));
const ReadingList = lazy(() => import("../section/Student-management/Reading-Master/Reading-list"));
const LectureList = lazy(() => import("../section/Student-management/Lecture-master/Lecture-list"));
const QuizCreate = lazy(() => import("../section/Student-management/Quiz-master/quiz-create"));
const QuizList = lazy(() => import("../section/Student-management/Quiz-master/quiz-list"));
const StudentProgress = lazy(() => import("../section/Student-management/Student-Progress/Student-Progress"));

// Leave
const LeaveCreate = lazy(() => import("../section/Leave-management/Leave-master/leave-create"));
const LeaveList = lazy(() => import("../section/Leave-management/Leave-master/leave-list"));
const LeaveApprovalDone = lazy(() => import("../section/Leave-management/Leave-Approval-master/leave-approval-done"));

// Student Upload / Assignment Upload
const AssignmentUploadCreate = lazy(() => import("../section/Student-upload/Assignment-upload/assignment-upload-create"));
const AssignmentUploadList = lazy(() => import("../section/Student-upload/Assignment-upload/assignment-upload-list"));
const MaterialCreate = lazy(() => import("../section/Student-management/Materials-management/view/materials-create-view"));
const StudentMaterialList = lazy(() => import("../section/Student-upload/Material/Material-list"));

// Map lazy-loaded components to a single `pages` object used by the routes below
const pages = {
  Login,
  Overview,
  Progress,
  Events,
  Quiz,
  Settings,
  ChatBot,
  InstituteCreate,
  InstituteList,
  GovtServeyCreate,
  GovtServeyList,
  RolePermissionCreate,
  RolePermissionList,
  FacultyCreate,
  FacultyList,
  StudentCreate,
  StudentList,
  InstituteSurveyCreate,
  InstituteSurveyList,
  DepartmentCreate,
  DepartmentList,
  AssignmentCreate,
  AssignmentList,
  MaterialList,
  ReadingList,
  LectureList,
  QuizCreate,
  QuizList,
  StudentProgress,
  LeaveCreate,
  LeaveList,
  LeaveApprovalDone,
  AssignmentUploadCreate,
  AssignmentUploadList,
  MaterialCreate,
  StudentMaterialList,
  // other components referenced later in this file are expected to be
  // declared above (truncated here). Add them to this object as needed.
};

// Loader
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

type DashboardLayoutProps = {
  toggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
};

// ==== Dashboard Layout ====
const DashboardLayout = ({ toggleMobileSidebar , isMobileSidebarOpen} : DashboardLayoutProps) => (
  <div className="flex min-h-screen w-full">
    <Sidebar isMobileOpen={isMobileSidebarOpen} toggleMobileSidebar={toggleMobileSidebar} />
    <div className="flex-1 flex flex-col">
      <Navbaar toggleMobileSidebar={toggleMobileSidebar} />
      {/* <main className="flex-1">
        <Outlet />
      </main> */}
    </div>
  </div>
);

// ==== Route Wrapper ====
const Page = ({ component: Component } : any) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

// ==== Main Router ====
export default function Routers() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Page component={pages.Login} />} />

        <Route
          path="/dashboard"
          element={<DashboardLayout {...{ toggleMobileSidebar, isMobileSidebarOpen }} />}
        >
          {/* Core Dashboard */}
          <Route index element={<Page component={pages.Overview} />} />
          <Route path="overview" element={<Page component={pages.Overview} />} />
          <Route path="progress" element={<Page component={pages.Progress} />} />
          <Route path="events" element={<Page component={pages.Events} />} />
          <Route path="quiz" element={<Page component={pages.Quiz} />} />
          <Route path="settings" element={<Page component={pages.Settings} />} />
          <Route path="chatbot" element={<Page component={pages.ChatBot} />} />

          {/* Nabha */}
          <Route path="nabha-master/institute/create" element={<Page component={pages.InstituteCreate} />} />
          <Route path="nabha-master/institute/list" element={<Page component={pages.InstituteList} />} />
          <Route path="servey-master/create" element={<Page component={pages.GovtServeyCreate} />} />
          <Route path="servey-master/list" element={<Page component={pages.GovtServeyList} />} />
          <Route path="rolePermission/create" element={<Page component={pages.RolePermissionCreate} />} />
          <Route path="rolePermission/list" element={<Page component={pages.RolePermissionList} />} />

          {/* Institute Management */}
          <Route path="institute-management/faculty/create" element={<Page component={pages.FacultyCreate} />} />
          <Route path="institute-management/faculty/list" element={<Page component={pages.FacultyList} />} />
          <Route path="institute-management/student/create" element={<Page component={pages.StudentCreate} />} />
          <Route path="institute-management/student/list" element={<Page component={pages.StudentList} />} />
          <Route path="institute-management/institute-servey/create" element={<Page component={pages.InstituteSurveyCreate} />} />
          <Route path="institute-management/institute-servey/list" element={<Page component={pages.InstituteSurveyList} />} />
          <Route path="institute-management/department/create" element={<Page component={pages.DepartmentCreate} />} />
          <Route path="institute-management/department/list" element={<Page component={pages.DepartmentList} />} />

          {/* Faculty / Student */}
          <Route path="faculty-management/assignment/create" element={<Page component={pages.AssignmentCreate} />} />
          <Route path="faculty-management/assignment/list" element={<Page component={pages.AssignmentList} />} />
          <Route path="faculty-management/material/list" element={<Page component={pages.MaterialList} />} />
          <Route path="faculty-management/reading" element={<Page component={pages.ReadingList} />} />
          <Route path="faculty-management/lectures" element={<Page component={pages.LectureList} />} />
          <Route path="faculty-management/quiz/create" element={<Page component={pages.QuizCreate} />} />
          <Route path="faculty-management/quiz/list" element={<Page component={pages.QuizList} />} />
          <Route path="faculty-management/progress" element={<Page component={pages.StudentProgress} />} />

          {/* Leave */}
          <Route path="leave-management/leave/create" element={<Page component={pages.LeaveCreate} />} />
          <Route path="leave-management/leave/list" element={<Page component={pages.LeaveList} />} />
          <Route path="leave-management/leave-approval" element={<Page component={pages.LeaveApprovalDone} />} />

          {/* Student Upload */}
          <Route path="student-upload/assignment-upload/upload" element={<Page component={pages.AssignmentUploadCreate} />} />
          <Route path="student-upload/assignment-upload/list" element={<Page component={pages.AssignmentUploadList} />} />
          <Route path="faculty-management/material/create" element={<Page component={pages.MaterialCreate} />} />
          <Route path="student-upload/materials" element={<Page component={pages.StudentMaterialList} />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
