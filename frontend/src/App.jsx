import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import StaffPage from "./pages/StaffPage";
import { Toaster } from "sonner";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Giả sử giá trị role trong DB của bạn là chữ thường "staff" và "admin" */}
          <Route element={<ProtectedRoute allowedRoles={["staff", "admin"]} />}>
            <Route path="/" element={<StaffPage />} />
          </Route>

          {/* Protected routes: CHỈ dành cho Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
