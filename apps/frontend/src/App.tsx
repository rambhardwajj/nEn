import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

function App() {
  return (
    <>
      <SidebarProvider>
        <Routes>
          <Route element={<><AppSidebar /><Home /></>} path="/" />

          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
        </Routes>
      </SidebarProvider>
    </>
  );
}

export default App;
