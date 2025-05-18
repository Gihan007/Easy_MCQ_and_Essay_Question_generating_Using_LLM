import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import McqPage from "./pages/McqPage";
import EssayPage from "./pages/EssayPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubscriptionForm from "./pages/SubscriptionForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/mcqPage" element={<McqPage />} />
      <Route path="/essayPage" element={<EssayPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/subscriptionForm" element={<SubscriptionForm />} />
    </Routes>
  );
}

export default App;
