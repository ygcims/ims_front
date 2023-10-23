import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/navbar";
import Login from "./components/login";
import Dashboard from "./components/userDashboard";
import AdminDashboard from "./components/admin/dashboard";
import Users from "./components/admin/users";
import Data from "./components/admin/data";
import LeadForm from "./components/leadForm";
import NotFoundPage from "./components/notfound";
import BottomNav from "./components/bottomNav";
import ManageLeads from "./pages/manageLeads";
import TodayLeads from "./pages/todayLeads";
import ImportLeads from "./pages/importLeads";
import UpdateLeadForm from "./components/updateLeadForm";
import Report from "./components/report";
import NewLeads from "./pages/newLeads";
import Register from "./components/admin/addNewUser";
import LeadSummaryReport from "./components/reports/leadSummaryReport";
import CounselorLeadAnalysisReport from "./components/reports/counselorLeadAnalysisReport ";
import LeadSourceAnalysisReport from "./components/reports/leadSourceAnalysisReport";
import LeadCourseAnalysisReport from "./components/reports/leadCourseAnalysisReport";
import ProgressComparisonReport from "./components/reports/progressGrowthComparisonReport";
import ProfilePage from "./pages/profile";
import Roster from "./components/admin/roster";
import AddCourseForm from "./components/admin/dataManagement/course";
import AddStatusForm from "./components/admin/dataManagement/status";
import AddBatchForm from "./components/admin/dataManagement/batch";
import AddSourceForm from "./components/admin/dataManagement/source";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState(null); // {2 = manager}, {3 = counselor}
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Function to check user authorization status
  const checkAuthorization = () => {
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    if (storedUserData) {
      setIsAuthorized(true);
      setUserRole(storedUserData.roleid);
      setUserData(storedUserData);
    } else {
      setIsAuthorized(false);
      setUserRole(null);
    }
    setIsLoading(false); // Set isLoading to false once the authorization status is determined
  };

  useEffect(() => {
    checkAuthorization();
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthorized(false);
    setUserRole(null);
    window.location.href = "/";
  };

  const adminMenuLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "User Management" },
    { to: "/admin/data", label: "Data Management" },
    { to: "/reports", label: "Reports" },
  ];

  const managerMenuLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/leads", label: "Lead Management" },
    { to: "/reports", label: "Reports" },
  ];

  const counselorMenuLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/leads", label: "Lead Management" },
  ];

  // switch statement to determine the menu links based on the user role
  let menuLinks = [];
  switch (userRole) {
    case 1:
      menuLinks = adminMenuLinks;
      break;
    case 2:
      menuLinks = managerMenuLinks;
      break;
    case 3:
      menuLinks = counselorMenuLinks;
      break;
    default:
      menuLinks = [];
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const NotFoundRoute = () => {
    return <NotFoundPage />;
  };

  return (
    <>
      {isAuthorized && (
        <div className="fixed top-0 w-full z-10">
          <NavBar
            onLogout={handleLogout}
            menuLinks={menuLinks}
            userData={userData}
          />
        </div>
      )}
      <Router>
        <div className="mt-20"></div>
        <Routes>
          {isAuthorized && (
            <Route path="/profile" element={<ProfilePage user={userData} />} />
          )}
          {isAuthorized && userRole === 1 && (
            <>
              <Route
                path="/dashboard"
                element={<Navigate to="/admin/dashboard" />}
              />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/data" element={<Data />} />
              <Route path="/reports" element={<Report />} />
              <Route path="/admin/users/addNewUser" element={<Register />} />
              <Route
                path="/users/roster/:userID"
                element={<Roster userId={userData?.id} />}
              />
              <Route
                path="/reports/leadSummaryReport"
                element={<LeadSummaryReport />}
              />
              <Route
                path="/admin/data/addNewCourse"
                element={<AddCourseForm />}
              />
              <Route
                path="/data/addNewCourse/:id"
                element={<AddCourseForm />}
              />
              <Route
                path="/admin/data/addNewSource"
                element={<AddSourceForm />}
              />
              <Route
                path="/data/addNewSource/:id"
                element={<AddSourceForm />}
              />
              <Route
                path="/admin/data/addNewBatch"
                element={<AddBatchForm />}
              />
              <Route
                path="/data/addNewBatch/:codeId"
                element={<AddBatchForm />}
              />
              <Route
                path="/admin/data/addNewStatus"
                element={<AddStatusForm />}
              />
              <Route
                path="/data/addNewStatus/:id"
                element={<AddStatusForm />}
              />
              <Route
                path="/reports/counselorLeadAnalysisReport"
                element={<CounselorLeadAnalysisReport />}
              />
              <Route
                path="/reports/leadSourceAnalysisReport"
                element={<LeadSourceAnalysisReport />}
              />
              <Route
                path="/reports/leadCourseAnalysisReport"
                element={<LeadCourseAnalysisReport />}
              />
              <Route
                path="/reports/progressAndGrowthComparisonReport"
                element={<ProgressComparisonReport />}
              />
            </>
          )}
          {isAuthorized && userRole === 2 && (
            <>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route
                path="/leads"
                element={
                  <div>
                    <div>
                      <ManageLeads userRole={userRole} />
                    </div>
                    <BottomNav userRole={userRole} />
                  </div>
                }
              />

              <Route
                path="leads/imports"
                element={
                  <>
                    <ImportLeads userRole={userRole} userId={userData?.id} />
                    <BottomNav userRole={userRole} />
                  </>
                }
              />
              <Route
                path="leads/addNewLead"
                element={<LeadForm userRole={userRole} userId={userData?.id} />}
              />
              <Route
                path="leads/updateLead/:leadId"
                element={
                  <UpdateLeadForm userRole={userRole} userId={userData?.id} />
                }
              />
              <Route path="/reports" element={<Report />} />
              <Route
                path="/reports/leadSummaryReport"
                element={<LeadSummaryReport />}
              />
              <Route
                path="/reports/counselorLeadAnalysisReport"
                element={<CounselorLeadAnalysisReport />}
              />
              <Route
                path="/reports/leadSourceAnalysisReport"
                element={<LeadSourceAnalysisReport />}
              />
              <Route
                path="/reports/leadCourseAnalysisReport"
                element={<LeadCourseAnalysisReport />}
              />
              <Route
                path="/reports/progressAndGrowthComparisonReport"
                element={<ProgressComparisonReport />}
              />
            </>
          )}
          {isAuthorized && userRole === 3 && (
            <>
              <Route
                path="/dashboard"
                element={<Dashboard userId={userData?.id} />}
              />
              <Route
                path="/leads"
                element={
                  <>
                    <ManageLeads id={userData?.id} />
                    <BottomNav userRole={userRole} />
                  </>
                }
              />
              <Route
                path="leads/imports"
                element={
                  <>
                    <ImportLeads userRole={userRole} userId={userData?.id} />
                    <BottomNav userRole={userRole} />
                  </>
                }
              />
              <Route
                path="leads/new"
                element={
                  <>
                    <NewLeads id={userData?.id} />
                    <BottomNav userRole={userRole} />
                  </>
                }
              />
              <Route
                path="leads/today"
                element={
                  <>
                    <TodayLeads id={userData?.id} />
                    <BottomNav userRole={userRole} />
                  </>
                }
              />
              <Route
                path="leads/addNewLead"
                element={<LeadForm userRole={userRole} userId={userData?.id} />}
              />
              <Route
                path="leads/updateLead/:leadId"
                element={
                  <UpdateLeadForm userRole={userRole} userId={userData?.id} />
                }
              />
            </>
          )}
          <Route
            path="/"
            element={isAuthorized ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
