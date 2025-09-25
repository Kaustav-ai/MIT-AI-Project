import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Chatbot from "./pages/Chatbot";
import DoctorConnect from "./pages/DoctorConnect";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import QuizDashboard from "./pages/QuizDashboard";
import DailyQuiz from "./pages/DailyQuiz";
import CategoryQuiz from "./pages/CategoryQuiz";
import RewardsWallet from "./pages/RewardsWallet";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import AwarenessHub from "./pages/AwarenessHub";
import CommonSymptoms from "./pages/CommonSymptoms";
// import GoogleTranslate from "./components/googleTranslate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
            <Route path="/doctor" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctors" element={<ProtectedRoute><DoctorConnect /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute role="patient"><QuizDashboard /></ProtectedRoute>} />
            <Route path="/quiz/daily" element={<ProtectedRoute role="patient"><DailyQuiz /></ProtectedRoute>} />
            <Route path="/quiz/category/:category" element={<ProtectedRoute role="patient"><CategoryQuiz /></ProtectedRoute>} />
            <Route path="/rewards" element={<ProtectedRoute role="patient"><RewardsWallet /></ProtectedRoute>} />
            <Route path="/awareness" element={<ProtectedRoute role="patient"><AwarenessHub /></ProtectedRoute>} />
            <Route path="/symptoms" element={<ProtectedRoute role="patient"><CommonSymptoms /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
