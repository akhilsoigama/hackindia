// routers/ModulePath.ts
import {
  FaHome,
  FaPlus,
  FaList,
  FaChartBar,
  FaClipboardList,
  FaEnvelope,
  FaUsers,
  FaUserGraduate,
  FaClipboardCheck,
  FaBook,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUpload,
  FaUserShield,
  FaCog,
  FaDownload,
  FaMedal,
  FaBookOpen,
  FaGraduationCap,
  FaLanguage,
  FaDesktop,
  FaCode,
  FaLaptopCode,
  FaRoute,
  FaUniversity,
} from "react-icons/fa";
import { PermissionKeys } from "../utils/permission";
import { Module } from "../types/sidebar";

export const modules: Module[] = [
  {
    moduleName: "Admin Management",
    permissions: [PermissionKeys.ADMIN_MANAGEMENT_ACCESS],
    links: [
      {
        to: "/dashboard/admin/institute",
        label: "Institute",
        icon: <FaHome className="size-6" />,
        permissions: [
          PermissionKeys.INSTITUTE_VIEW,
          PermissionKeys.INSTITUTE_LIST,
        ],
        subLinks: [
          {
            to: "/dashboard/admin/institute/new",
            label: "Create Institute",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.INSTITUTE_CREATE],
          },
          {
            to: "/dashboard/admin/institute/list",
            label: "Institute List",
            icon: <FaList className="size-6" />,
            permissions: [
              PermissionKeys.INSTITUTE_LIST,
              PermissionKeys.INSTITUTE_VIEW,
            ],
          },
        ],
      },
      {
        to: "/dashboard/admin/govtEvent-master",
        label: "Govt. Event",
        icon: <FaChartBar className="size-6" />,
        permissions: [
          PermissionKeys.GOVT_SURVEY_VIEW,
          PermissionKeys.GOVT_SURVEY_LIST,
        ],
        subLinks: [
          {
            to: "/dashboard/admin/govtEvent-master/new",
            label: "Create Event",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.GOVT_SURVEY_CREATE],
          },
          {
            to: "/dashboard/admin/govtEvent-master/list",
            label: "Event List",
            icon: <FaList className="size-6" />,
            permissions: [
              PermissionKeys.GOVT_SURVEY_LIST,
              PermissionKeys.GOVT_SURVEY_VIEW,
            ],
          },
        ],
      },
    ],
  },
  {
    moduleName: "Core Management",
    permissions: [PermissionKeys.CORE_MANAGEMENT_ACCESS],
    links: [
      {
        to: "/dashboard/core-management/rolePermission",
        label: "Role & Permission",
        icon: <FaUserShield className="size-6" />,
        permissions: [PermissionKeys.ROLES_VIEW, PermissionKeys.ROLES_LIST],
        subLinks: [
          {
            to: "/dashboard/core-management/rolePermission/new",
            label: "Create Role",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.ROLES_CREATE],
          },
          {
            to: "/dashboard/core-management/rolePermission/list",
            label: "Role List",
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.ROLES_LIST, PermissionKeys.ROLES_VIEW],
          },
        ],
      },
    ],
  },
  {
    moduleName: "Institute Management",
    permissions: [PermissionKeys.INSTITUTE_MANAGEMENT_ACCESS],
    links: [
      {
        to: "/dashboard/institute-management/faculty",
        label: "Faculty",
        icon: <FaUsers className="size-6" />,
        permissions: [PermissionKeys.FACULTY_VIEW, PermissionKeys.FACULTY_LIST],
        subLinks: [
          {
            to: "/dashboard/institute-management/faculty/new",
            label: "Create Faculty",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.FACULTY_CREATE],
          },
          {
            to: "/dashboard/institute-management/faculty/list",
            label: "Faculty List",
            icon: <FaList className="size-6" />,
            permissions: [
              PermissionKeys.FACULTY_LIST,
              PermissionKeys.FACULTY_VIEW,
            ],
          },
        ],
      },
      {
        to: "/dashboard/institute-management/student",
        label: "Student",
        icon: <FaUserGraduate className="size-6" />,
        permissions: [PermissionKeys.STUDENT_VIEW, PermissionKeys.STUDENT_LIST],
        subLinks: [
          {
            to: "/dashboard/institute-management/student/new",
            label: "Create Student",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.STUDENT_CREATE],
          },
          {
            to: "/dashboard/institute-management/student/list",
            label: "Student List",
            icon: <FaList className="size-6" />,
            permissions: [
              PermissionKeys.STUDENT_LIST,
              PermissionKeys.STUDENT_VIEW,
            ],
          },
        ],
      },
      {
        to: "/dashboard/institute-management/department",
        label: "Department",
        icon: <FaUsers className="size-6" />,
        permissions: [PermissionKeys.DEPARTMENT_VIEW],
        subLinks: [
          {
            to: "/dashboard/institute-management/department/new",
            label: "Create Department",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.DEPARTMENT_CREATE],
          },
          {
            to: "/dashboard/institute-management/department/list",
            label: "Department List",
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.DEPARTMENT_VIEW],
          },
        ],
      },
      {
        to: "/dashboard/institute-management/institute-event",
        label: "Institute Event",
        icon: <FaClipboardList className="size-6" />,
        permissions: [
          PermissionKeys.INSTITUTE_SURVEY_VIEW,
          PermissionKeys.INSTITUTE_SURVEY_LIST,
        ],
        subLinks: [
          {
            to: "/dashboard/institute-management/institute-event/new",
            label: "Create Institute Event",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.INSTITUTE_SURVEY_CREATE],
          },
          {
            to: "/dashboard/institute-management/institute-event/list",
            label: "Institute Event List",
            icon: <FaList className="size-6" />,
            permissions: [
              PermissionKeys.INSTITUTE_SURVEY_LIST,
              PermissionKeys.INSTITUTE_SURVEY_VIEW,
            ],
          },
        ],
      },
    ],
  },
  {
    moduleName: "Faculty Management",
    permissions: [PermissionKeys.FACULTY_MANAGEMENT_ACCESS],
    links: [
      {
        to: "/dashboard/faculty-management/assignment",
        label: "Assignment",
        icon: <FaBook className="size-6" />,
        permissions: [
          PermissionKeys.ASSIGNMENT_VIEW,
          PermissionKeys.ASSIGNMENT_LIST,
        ],
        subLinks: [
          {
            to: "/dashboard/faculty-management/assignment/new",
            label: "Create Assignment",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.ASSIGNMENT_CREATE],
          },
          {
            to: "/dashboard/faculty-management/assignment/list",
            label: "Assignment List",
            icon: <FaList className="size-6" />,
            permissions: [
              PermissionKeys.ASSIGNMENT_LIST,
              PermissionKeys.ASSIGNMENT_VIEW,
            ],
          },
          {
            to: "/dashboard/faculty-management/assignment/submissions",
            label: "Submissions",
            icon: <FaClipboardCheck className="size-6" />,
            permissions: [PermissionKeys.ASSIGNMENT_VIEW],
          },
        ],
      },
      {
        to: "/dashboard/faculty-management/material",
        label: "Materials",
        icon: <FaBook className="size-6" />,
        permissions: [PermissionKeys.LECTURE_VIEW, PermissionKeys.LECTURE_LIST],
        subLinks: [
          {
            to: "/dashboard/faculty-management/material/new",
            label: "Create Material",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.LECTURE_CREATE],
          },
          {
            to: "/dashboard/faculty-management/material/list",
            label: "Material List",
            icon: <FaList className="size-6" />,
            permissions: [
              PermissionKeys.LECTURE_LIST,
              PermissionKeys.LECTURE_VIEW,
            ],
          },
        ],
      },
      {
        to: "/dashboard/faculty-management/quiz",
        label: "Quiz",
        icon: <FaBook className="size-6" />,
        permissions: [PermissionKeys.QUIZ_VIEW, PermissionKeys.QUIZ_LIST],
        subLinks: [
          {
            to: "/dashboard/faculty-management/quiz/new",
            label: "Create Quiz",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.QUIZ_CREATE],
          },
          {
            to: "/dashboard/faculty-management/quiz/list",
            label: "Quiz List",
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.QUIZ_LIST, PermissionKeys.QUIZ_VIEW],
          },
        ],
      },
      {
        to: "/dashboard/faculty-management/progress",
        label: "Student Progress",
        icon: <FaChartBar className="size-6" />,
        permissions: [PermissionKeys.FACULTY_STUDENT_PROGRESS_VIEW],
      },
    ],
  },
  {
    moduleName: "Student Query",
    permissions: [PermissionKeys.STUDENT_QUERY_ACCESS],
    links: [
      {
        to: "/dashboard/qna/teacher",
        label: "Student Q&A",
        icon: <FaQuestionCircle className="size-6" />,
        permissions: [
          PermissionKeys.FACULTY_ALL_QUESTIONS_QNA_VIEW,
          PermissionKeys.FACULTY_ANSWER_QNA_ACCESS,
          PermissionKeys.FACULTY_VIEW_QNA_ACCESS,
          PermissionKeys.FACULTY_UNANSWERED_QUESTIONS_QNA_VIEW,
        ],
        subLinks: [
          {
            to: "/dashboard/qna/teacher/questions",
            label: "All Questions",
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.FACULTY_ALL_QUESTIONS_QNA_VIEW],
          },
          {
            to: "/dashboard/qna/teacher/answered",
            label: "Answered",
            icon: <FaClipboardCheck className="size-6" />,
            permissions: [PermissionKeys.FACULTY_ANSWER_QNA_ACCESS],
          },
          {
            to: "/dashboard/qna/teacher/unanswered",
            label: "Unanswered",
            icon: <FaQuestionCircle className="size-6" />,
            permissions: [PermissionKeys.FACULTY_UNANSWERED_QUESTIONS_QNA_VIEW],
          },
        ],
      },
    ],
  },
  {
    moduleName: "Leave Management",
    permissions: [PermissionKeys.LEAVE_MANAGEMENT_ACCESS],
    links: [
      {
        to: "/dashboard/leave-management/leave",
        label: "Leave Management",
        icon: <FaSignOutAlt className="size-6" />,
        permissions: [PermissionKeys.LEAVE_LIST],
        subLinks: [
          {
            to: "/dashboard/leave-management/leave/new",
            label: "Apply Leave",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.LEAVE_CREATE],
          },
          {
            to: "/dashboard/leave-management/leave/list",
            label: "Leave List",
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.LEAVE_LIST],
          },
        ],
      },
      {
        to: "/dashboard/leave-management/leave-approval",
        label: "Leave Approval",
        icon: <FaClipboardCheck className="size-6" />,
        permissions: [PermissionKeys.LEAVE_APPROVE_VIEW],
      },
    ],
  },
  {
    moduleName: "Student Upload",
    permissions: [PermissionKeys.STUDENT_UPLOAD_ACCESS],
    links: [
      {
        to: "/dashboard/student-upload/assignment-upload",
        label: "Assignment Upload",
        icon: <FaUpload className="size-6" />,
        permissions: [
          PermissionKeys.ASSIGNMENT_UPLOAD_VIEW,
          PermissionKeys.ASSIGNMENT_UPLOAD_LIST,
        ],
        subLinks: [
          {
            to: "/dashboard/student-upload/assignment-upload/upload",
            label: "Upload Assignment",
            icon: <FaUpload className="size-6" />,
            permissions: [PermissionKeys.ASSIGNMENT_UPLOAD_CREATE],
          },
          {
            to: "/dashboard/student-upload/assignment-upload/list",
            label: "Uploaded List",
            icon: <FaList className="size-6" />,
            permissions: [
              PermissionKeys.ASSIGNMENT_UPLOAD_LIST,
              PermissionKeys.ASSIGNMENT_UPLOAD_VIEW,
            ],
          },
        ],
      },
      {
        to: "/dashboard/student-upload/quiz-attempt",
        label: "Quiz Attempt",
        icon: <FaQuestionCircle className="size-6" />,
        permissions: [
          PermissionKeys.QUIZ_ATTEMPT_VIEW,
          PermissionKeys.QUIZ_ATTEMPT_LIST,
        ],
        subLinks: [
          {
            to: "/dashboard/student-upload/quiz-attempt/new",
            label: "Create Attempt",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.QUIZ_ATTEMPT_CREATE],
          },
          {
            to: "/dashboard/student-upload/quiz-attempt/list",
            label: "Attempt List",
            icon: <FaList className="size-6" />,
            permissions: [
              PermissionKeys.QUIZ_ATTEMPT_LIST,
              PermissionKeys.QUIZ_ATTEMPT_VIEW,
            ],
          },
        ],
      },
      {
        to: "/dashboard/student-upload/materials",
        label: "Study Materials",
        icon: <FaBook className="size-6" />,
        permissions: [PermissionKeys.LECTURE_VIEW, PermissionKeys.LECTURE_LIST],
      },
    ],
  },
  {
    moduleName: "Skill Learning",
    permissions: [PermissionKeys.SKILL_LEARNING_ACCESS],
    links: [
      {
        to: "/dashboard/skills",
        label: "Skill Learning",
        icon: <FaGraduationCap className="size-6" />,
        permissions: [PermissionKeys.SKILL_LEARNING_ACCESS],
        subLinks: [
          {
            to: "/dashboard/skills/spoken-english",
            label: "Spoken English",
            icon: <FaLanguage className="size-6" />,
            permissions: [PermissionKeys.SKILL_SPOKEN_ENGLISH_VIEW],
          },
          {
            to: "/dashboard/skills/computer-basics",
            label: "Computer Basics",
            icon: <FaDesktop className="size-6" />,
            permissions: [PermissionKeys.SKILL_COMPUTER_VIEW],
          },
          {
            to: "/dashboard/skills/coding",
            label: "Coding",
            icon: <FaCode className="size-6" />,
            permissions: [PermissionKeys.SKILL_CODING_VIEW],
          },
          {
            to: "/dashboard/skills/digital-skills",
            label: "Digital Skills",
            icon: <FaLaptopCode className="size-6" />,
            permissions: [PermissionKeys.SKILL_DIGITAL_VIEW],
          },
          {
            to: "/dashboard/skills/career-roadmap",
            label: "Career Roadmap",
            icon: <FaRoute className="size-6" />,
            permissions: [PermissionKeys.SKILL_CAREER_VIEW],
          },
          {
            to: "/dashboard/skills/soft-skills",
            label: "Soft Skills",
            icon: <FaUsers className="size-6" />,
            permissions: [PermissionKeys.SKILL_SOFTSKILL_VIEW],
          },
          {
            to: "/dashboard/skills/government-exams",
            label: "Government Exams",
            icon: <FaUniversity className="size-6" />,
            permissions: [PermissionKeys.SKILL_GOVT_EXAM_VIEW],
          },
        ],
      },
    ],
  },
  {
    moduleName: "Dashboard",
    permissions: [PermissionKeys.DASHBOARD_ACCESS],
    links: [
      {
        to: "/dashboard/overview",
        label: "Overview",
        icon: <FaHome className="size-6" />,
        permissions: [PermissionKeys.DASHBOARD_OVERVIEW_VIEW],
      },
      {
        to: "/dashboard/online-library",
        label: "Online Library",
        icon: <FaBookOpen className="size-6" />,
        permissions: [PermissionKeys.DASHBOARD_ACCESS],
      },
      {
        to: "/dashboard/progress",
        label: "Progress",
        icon: <FaChartBar className="size-6" />,
        permissions: [PermissionKeys.STUDENT_PROGRESS_VIEW],
      },
      {
        to: "/dashboard/events",
        label: "Events",
        icon: <FaClipboardList className="size-6" />,
        permissions: [PermissionKeys.INSTITUTEWITHGOVT_EVENT_VIEW],
      },
      {
        to: "/dashboard/settings",
        label: "Settings",
        icon: <FaCog className="size-6" />,
        permissions: [PermissionKeys.SETTINGS_ACCESS],
      },
    ],
  },
  {
    moduleName: "Gamification",
    permissions: [PermissionKeys.GAMIFICATION_ACCESS],
    links: [
      {
        to: "/dashboard/gamification",
        label: "Achievements / Badges",
        icon: <FaMedal className="size-6" />,
        permissions: [PermissionKeys.GAMIFICATION_ACCESS],
      },
    ],
  },
  {
    moduleName: "Offline Library",
    permissions: [PermissionKeys.OFFLINE_LIBRARY_ACCESS],
    links: [
      {
        to: "/dashboard/offline-library/downloads",
        label: "Offline Library",
        icon: <FaDownload className="size-6" />,
        permissions: [PermissionKeys.OFFLINE_LIBRARY_ACCESS],
      },
    ],
  },
  {
    moduleName: "Communication",
    permissions: [PermissionKeys.COMMUNICATION_ACCESS],
    links: [
      {
        to: "/dashboard/chatbot",
        label: "Chatbot",
        icon: <FaEnvelope className="size-6" />,
        permissions: [PermissionKeys.CHATBOT_ACCESS],
      },
    ],
  },
  {
    moduleName: "Q&A",
    permissions: [PermissionKeys.STUDENT_QNA_ACCESS],
    links: [
      {
        to: "/dashboard/qna",
        label: "Q&A",
        icon: <FaQuestionCircle className="size-6" />,
        permissions: [
          PermissionKeys.STUDENT_ALL_QUESTIONS_QNA_VIEW,
          PermissionKeys.STUDENT_ASK_QNA_CREATE,
          PermissionKeys.STUDENT_ASK_QNA_UPDATE,
          PermissionKeys.STUDENT_ASK_QNA_DELETE,
        ],
        subLinks: [
          {
            to: "/dashboard/qna/questions",
            label: "All Questions",
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.STUDENT_ALL_QUESTIONS_QNA_VIEW],
          },
          {
            to: "/dashboard/qna/ask",
            label: "Ask Question",
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.STUDENT_ASK_QNA_CREATE],
          },
        ],
      },
    ],
  },
];
