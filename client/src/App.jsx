import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminMatches from '@/components/admin/AdminMatches';
import AdminPredictions from '@/components/admin/AdminPredictions';
import AdminCorrectPredictions from '@/components/admin/AdminCorrectPredictions';
import AdminTournaments from '@/components/admin/AdminTournaments';
import AdminUsers from '@/components/admin/AdminUsers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 1 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="predictions" element={<AdminPredictions />} />
            <Route path="predictions/correct" element={<AdminCorrectPredictions />} />
            <Route path="tournaments" element={<AdminTournaments />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
