import {
  FaHome,
  FaPlus,
  FaList,
  FaChartBar,
  FaClipboardList,
  FaCalendarAlt,
  FaEnvelope,
  FaCog,
  FaUsers,
  FaUserGraduate,
  FaClipboardCheck,
  FaBook,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUpload,
  FaDownload,
  FaMedal,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import { PermissionKeys } from '../utils/permission';

export const modules: any = [
  {
    moduleName: "Nabha Management",
    permissions: [PermissionKeys.SUPER_ADMIN], // ONLY for super admin
    links: [
      {
        to: '/dashboard/nabha-master/institute',
        label: 'Institute',
        icon: <FaHome className="size-6" />,
        permissions: [PermissionKeys.INSTITUTE_VIEW],
        subLinks: [
          {
            to: '/dashboard/nabha-master/institute/create',
            label: 'Create',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.INSTITUTE_CREATE],
          },
          {
            to: '/dashboard/nabha-master/institute/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.INSTITUTE_VIEW],
          },
        ],
      },
      {
        to: '/dashboard/servey-master',
        label: 'Govt. Survey',
        icon: <FaChartBar className="size-6" />,
        permissions: [PermissionKeys.SURVEY_VIEW],
        subLinks: [
          {
            to: '/dashboard/servey-master/create',
            label: 'Create',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.SURVEY_CREATE],
          },
          {
            to: '/dashboard/servey-master/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.SURVEY_VIEW],
          },
        ],
      },
    ],
  },
  {
    moduleName: "Role Permission",
    permissions: [
      PermissionKeys.ROLES_VIEW,
      PermissionKeys.ROLES_CREATE,
      PermissionKeys.PERMISSIONS_VIEW
    ],
    links: [
      {
        to: '/dashboard/rolePermission',
        label: 'Role Permission',
        icon: <FaClipboardCheck className="size-6" />,
        permissions: [PermissionKeys.ROLES_VIEW],
        subLinks: [
          {
            to: '/dashboard/rolePermission/create',
            label: 'Create',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.ROLES_CREATE],
          },
          {
            to: '/dashboard/rolePermission/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.ROLES_VIEW],
          },
        ],
      },
    ],
  },
  {
    moduleName: "Institute Management",
    permissions: [
      PermissionKeys.FACULTY_VIEW,
      PermissionKeys.STUDENT_VIEW,
      PermissionKeys.DEPARTMENT_VIEW,
      PermissionKeys.INSTITUTE_SURVEY_VIEW
    ],
    links: [
      {
        to: '/dashboard/institute-management',
        label: 'Faculty',
        icon: <FaUsers className="size-6" />,
        permissions: [PermissionKeys.FACULTY_VIEW],
        subLinks: [
          {
            to: '/dashboard/institute-management/faculty/create',
            label: 'Create',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.FACULTY_CREATE],
          },
          {
            to: '/dashboard/institute-management/faculty/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.FACULTY_VIEW],
          },
        ],
      },
      {
        to: '/dashboard/institute-management/student',
        label: 'Student',
        icon: <FaUserGraduate className="size-6" />,
        permissions: [PermissionKeys.STUDENT_VIEW],
        subLinks: [
          {
            to: '/dashboard/institute-management/student/create',
            label: 'Create',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.STUDENT_CREATE],
          },
          {
            to: '/dashboard/institute-management/student/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.STUDENT_VIEW],
          },
        ],
      },
      {
        to: '/dashboard/institute-management/department',
        label: 'Department',
        icon: <FaUsers className="size-6" />,
        permissions: [PermissionKeys.DEPARTMENT_VIEW],
        subLinks: [
          {
            to: '/dashboard/institute-management/department/create',
            label: 'Create',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.DEPARTMENT_CREATE],
          },
          {
            to: '/dashboard/institute-management/department/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.DEPARTMENT_VIEW],
          },
        ],
      },
      {
        to: '/dashboard/institute-management/institute-servey',
        label: 'Institute Survey',
        icon: <FaClipboardList className="size-6" />,
        permissions: [PermissionKeys.INSTITUTE_SURVEY_VIEW],
        subLinks: [
          {
            to: '/dashboard/institute-management/institute-servey/create',
            label: 'Create',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.INSTITUTE_SURVEY_CREATE],
          },
          {
            to: '/dashboard/institute-management/institute-servey/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.INSTITUTE_SURVEY_VIEW],
          },
        ],
      },
    ],
  },
  {
    moduleName: "Faculty Management",
    permissions: [
      PermissionKeys.ASSIGNMENT_VIEW,
      PermissionKeys.LESSON_VIEW,
      PermissionKeys.QUIZ_VIEW,
      PermissionKeys.PROGRESS_VIEW
    ],
    links: [
      {
        to: '/dashboard/faculty-management/assignment',
        label: 'Assignment',
        icon: <FaBook className="size-6" />,
        permissions: [PermissionKeys.ASSIGNMENT_VIEW],
        subLinks: [
          {
            to: '/dashboard/faculty-management/assignment/create',
            label: 'Create',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.ASSIGNMENT_CREATE],
          },
          {
            to: '/dashboard/faculty-management/assignment/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.ASSIGNMENT_VIEW],
          },
        ]
      },
      {
        to: '/dashboard/faculty-management/material',
        label: 'Student Material',
        icon: <FaBook className="size-6" />,
        permissions: [PermissionKeys.LESSON_VIEW],
        subLinks: [
          {
            to: '/dashboard/faculty-management/material/create',
            label: 'Create',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.LESSON_CREATE],
          },
          {
            to: '/dashboard/faculty-management/material/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.LESSON_VIEW],
          },
        ]
      },
      {
        to: '/dashboard/faculty-management/quiz',
        label: 'Quiz',
        icon: <FaBook className="size-6" />,
        permissions: [PermissionKeys.QUIZ_VIEW],
        subLinks: [
          {
            to: '/dashboard/faculty-management/quiz/create',
            label: 'Create',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.QUIZ_CREATE],
          },
          {
            to: '/dashboard/faculty-management/quiz/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.QUIZ_VIEW],
          },
        ]
      },
      {
        to: '/dashboard/faculty-management/progress',
        label: 'Progress Tracking',
        icon: <FaChartBar className="size-6" />,
        permissions: [PermissionKeys.PROGRESS_VIEW],
      },
    ],
  },
  {
    moduleName: "Student Query",
    permissions: [
      PermissionKeys.REPORTS_VIEW,
      PermissionKeys.MESSAGING_SEND
    ],
    links: [
      {
        to: '/dashboard/qna/teacher',
        label: 'Student Q&A',
        icon: <FaQuestionCircle className="size-6" />,
        permissions: [PermissionKeys.REPORTS_VIEW],
        subLinks: [
          {
            to: '/dashboard/qna/teacher/questions',
            label: 'All Questions',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.REPORTS_VIEW],
          },
          {
            to: '/dashboard/qna/teacher/answered',
            label: 'Answered',
            icon: <FaCheck className="size-6" />,
            permissions: [PermissionKeys.REPORTS_VIEW],
          },
          {
            to: '/dashboard/qna/teacher/unanswered',
            label: 'Unanswered',
            icon: <FaTimes className="size-6" />,
            permissions: [PermissionKeys.REPORTS_VIEW],
          },
        ],
      },
    ],
  },
  {
    moduleName: "Leave Management",
    permissions: [
      PermissionKeys.LEAVE_VIEW,
      PermissionKeys.LEAVE_CREATE
    ],
    links: [
      {
        to: '/dashboard/leave-management/leave',
        label: 'Leave',
        icon: <FaSignOutAlt className="size-6" />,
        permissions: [PermissionKeys.LEAVE_VIEW],
        subLinks: [
          {
            to: '/dashboard/leave-management/leave/create',
            label: 'Create',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.LEAVE_CREATE],
          },
          {
            to: '/dashboard/leave-management/leave/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.LEAVE_VIEW],
          },
        ],
      },
      {
        to: '/dashboard/leave-management/leave-approval',
        label: 'Leave Approval',
        icon: <FaClipboardCheck className="size-6" />,
        permissions: [PermissionKeys.LEAVE_APPROVE],
      },
    ],
  },
  {
    moduleName: "Student Upload",
    permissions: [
      PermissionKeys.ASSIGNMENT_UPLOAD_VIEW,
      PermissionKeys.LESSON_UPLOAD_VIEW
    ],
    links: [
      {
        to: '/dashboard/student-upload/assignment-upload',
        label: 'Assignment Upload',
        icon: <FaUpload className="size-6" />,
        permissions: [PermissionKeys.ASSIGNMENT_UPLOAD_VIEW],
        subLinks: [
          {
            to: '/dashboard/student-upload/assignment-upload/upload',
            label: 'Upload',
            icon: <FaUpload className="size-6" />,
            permissions: [PermissionKeys.ASSIGNMENT_UPLOAD_CREATE],
          },
          {
            to: '/dashboard/student-upload/assignment-upload/list',
            label: 'List',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.ASSIGNMENT_UPLOAD_VIEW],
          },
        ],
      },
      {
        to: '/dashboard/student-upload/materials',
        label: 'Materials',
        icon: <FaBook className="size-6" />,
        permissions: [PermissionKeys.LESSON_UPLOAD_VIEW],
      },
    ],
  },
  {
    moduleName: "Dashboard",
    permissions: [
      PermissionKeys.DASHBOARD_OVERVIEW,
      PermissionKeys.PROGRESS_VIEW
    ],
    links: [
      {
        to: '/dashboard/overview',
        label: 'Overview',
        icon: <FaHome className="size-6" />,
        permissions: [PermissionKeys.DASHBOARD_OVERVIEW],
      },
      {
        to: '/dashboard/progress',
        label: 'Progress',
        icon: <FaChartBar className="size-6" />,
        permissions: [PermissionKeys.PROGRESS_VIEW],
      },
      {
        to: '/dashboard/events',
        label: 'Events',
        icon: <FaCalendarAlt className="size-6" />,
        permissions: [PermissionKeys.DASHBOARD_EVENTS],
      },
      {
        to: '/dashboard/quiz',
        label: 'Quiz',
        icon: <FaQuestionCircle className="size-6" />,
        permissions: [PermissionKeys.QUIZ_VIEW],
      }
    ],
  },
  {
    moduleName: "Gamification",
    permissions: [
      PermissionKeys.PROGRESS_VIEW,
      PermissionKeys.REPORTS_VIEW
    ],
    links: [
      {
        to: '/dashboard/gamification',
        label: 'Achievements / Badges',
        icon: <FaMedal className="size-6" />,
        permissions: [PermissionKeys.PROGRESS_VIEW],
      },
    ],
  },
  {
    moduleName: "Offline Library",
    permissions: [
      PermissionKeys.LESSON_VIEW,
      PermissionKeys.LECTURE_VIEW
    ],
    links: [
      {
        to: '/dashboard/offline-library',
        label: 'Offline Library',
        icon: <FaDownload className="size-6" />,
        permissions: [PermissionKeys.LESSON_VIEW],
        subLinks: [
          {
            to: '/dashboard/offline-library/lessons',
            label: 'Lessons',
            icon: <FaBook className="size-6" />,
            permissions: [PermissionKeys.LESSON_VIEW],
          },
          {
            to: '/dashboard/offline-library/videos',
            label: 'Videos',
            icon: <FaBook className="size-6" />,
            permissions: [PermissionKeys.LECTURE_VIEW],
          },
          {
            to: '/dashboard/offline-library/audio',
            label: 'Audio Lessons',
            icon: <FaBook className="size-6" />,
            permissions: [PermissionKeys.LECTURE_VIEW],
          },
          {
            to: '/dashboard/offline-library/downloads',
            label: 'Downloaded Files',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.LESSON_VIEW],
          },
        ],
      },
    ],
  },
  {
    moduleName: "Communication",
    permissions: [
      PermissionKeys.CHATBOT_ACCESS,
      PermissionKeys.MESSAGING_SEND
    ],
    links: [
      {
        to: '/dashboard/chatbot',
        label: 'Chatbot',
        icon: <FaEnvelope className="size-6" />,
        permissions: [PermissionKeys.CHATBOT_ACCESS],
      },
    ],
  },
  {
    moduleName: "Issue/Discussion",
    permissions: [
      PermissionKeys.MESSAGING_SEND,
      PermissionKeys.MESSAGING_RECEIVE
    ],
    links: [
      {
        to: '/dashboard/qna',
        label: 'Q&A',
        icon: <FaQuestionCircle className="size-6" />,
        permissions: [PermissionKeys.MESSAGING_SEND],
        subLinks: [
          {
            to: '/dashboard/qna/questions',
            label: 'All Questions',
            icon: <FaList className="size-6" />,
            permissions: [PermissionKeys.MESSAGING_RECEIVE],
          },
          {
            to: '/dashboard/qna/ask',
            label: 'Ask Question',
            icon: <FaPlus className="size-6" />,
            permissions: [PermissionKeys.MESSAGING_SEND],
          },
        ],
      },
    ],
  },
  {
    moduleName: "Settings",
    permissions: [PermissionKeys.SETTINGS_VIEW],
    links: [
      {
        to: '/dashboard/settings',
        label: 'Settings',
        icon: <FaCog className="size-6" />,
        permissions: [PermissionKeys.SETTINGS_VIEW],
      },
    ],
  },
];  