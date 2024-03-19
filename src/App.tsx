
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SignIn from './pages/auth/signIn';
import SignUp from './pages/auth/signUp';
import StudentDashboardPage from './pages/students/student_dashboard';
import LecturerDashboardPage from './pages/lecturer/lecturer_dashboard';
import AdminDashboardPage from './pages/admin/admin_dashboard';
import CoursesManagementPage from './pages/admin/courses_management';
import AddCourseForm from './pages/admin/components/add_course';
import StudCourseRegister from './pages/students/course_register';
import StudCoursesManagementPage from './pages/students/stud_course_management';
import LecturerCourseMgt from './pages/lecturer/lec_course_mgt';
import StudGradeView from './pages/students/student_marks_view';
import CourseMarkViewMgt from './pages/admin/marks_edit';
import ReportManagementPage from './pages/admin/admin_reports';
import PassListPage from './pages/admin/pass_lists';
import FailListPage from './pages/admin/fail_lists';
import SpecialsListPage from './pages/admin/specials_lists';
import MissingMarksListPage from './pages/admin/missing_marks';
import RetakeListPage from './pages/admin/retakes';
import SpecialExamReportPage from './pages/admin/special_exam_report';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/stud-dashboard" element={<StudentDashboardPage />} />
        <Route path="/lec-dashboard" element={<LecturerDashboardPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/course-mgt" element={<CoursesManagementPage/>} />
        <Route path="/add-course" element={<AddCourseForm/>} />
        <Route path="/stud-courses" element={<StudCoursesManagementPage/>} />
        <Route path="/course-register" element={<StudCourseRegister/>} />
        <Route path="/lec-course-view" element={<LecturerCourseMgt/>} />
        <Route path="/lec-dashboard" element={<LecturerDashboardPage/>} />
        <Route path="/grade-view" element={<StudGradeView/>} />
        <Route path="/mark-edit" element={<CourseMarkViewMgt/>}/>
        <Route path="/reports" element={<ReportManagementPage/>}/>
        <Route path="/passlists" element={<PassListPage/>}/>
        <Route path="/faillists" element={<FailListPage/>}/>
        <Route path="/specials" element={<SpecialsListPage/>}/>
        <Route path="/missing-marks" element={<MissingMarksListPage/>}/>
        <Route path="/retake" element={<RetakeListPage/>}/>
        <Route path="/specials-form" element={<SpecialExamReportPage/>}/>



      </Routes>

    </Router>
     
    </>
  )
}

export default App
