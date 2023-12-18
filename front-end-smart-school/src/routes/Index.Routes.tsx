import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  SigninPage  from "../client/auth/SigninPage";
import { StudentPage } from "../client/student/StudentPage";
import DashboardPage from "../client/admin/dashboard/DashboardPage";
import { ClassroomPage } from "../client/classroom/ClassroomPage";
import Test from "../client/test/Test";
import StudentFormPage from "../client/student/StudentFormPage";
import StudentDetailPage from "../client/student/StudentDetailPage";

const IndexRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SigninPage />} />
                <Route path="/admin/dashboard" element={<DashboardPage />} />
                <Route path="/student" element={<StudentPage />} />
                <Route path="/student/form" element={<StudentFormPage />} />
                <Route path="/student/detail/:id" element={<StudentDetailPage />} />
                <Route path="/classroom" element={<ClassroomPage />} />
                <Route path="/test" element={<Test />} />
                
            </Routes>
        </Router>
    );
};

export default IndexRoutes;