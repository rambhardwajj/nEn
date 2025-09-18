import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import WorkflowPage from "./pages/WorkflowPage";
import CreateWorkflowPage from "./pages/CreateWorkflowPage";

function App() {
  return (
    <>
      <SidebarProvider>
        <Routes>
          <Route
            element={
              <>
                <AppSidebar />
                <Home />
              </>
            }
            path="/"
          />
          
          {/* Create new workflow route */}
          <Route
            element={
              <>
                <AppSidebar /> 
                <CreateWorkflowPage />
              </>
            }
            path="/create"
          />
          
          {/* View existing workflow route */}
          <Route
            element={
              <>
                <AppSidebar /> 
                <WorkflowPage />
              </>
            }
            path="/workflow/:workflowId"
          />

          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
        </Routes>
      </SidebarProvider>
    </>
  );
}

export default App;