import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import OrderHallPage from './pages/OrderHallPage';
import OrderHallDetailPage from './pages/OrderHallDetailPage';
import CaseDetailPage from './pages/CaseDetailPage';
import CaseMaterialPage from './pages/CaseMaterialPage';
import ProfilePage from './pages/ProfilePage';
import InstitutionCertificationPage from './pages/InstitutionCertificationPage';
import BusinessScopePage from './pages/BusinessScopePage';
import LoginPage from './pages/LoginPage';
import { ProtectedRoute } from './auth/ProtectedRoute';

function LegacyOrderHallRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/reminders/${id}` : '/reminders'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/reminders" element={<OrderHallPage />} />
                <Route path="/reminders/:id" element={<OrderHallDetailPage />} />
                <Route path="/order-hall" element={<Navigate to="/reminders" replace />} />
                <Route path="/order-hall/:id" element={<LegacyOrderHallRedirect />} />
                <Route path="/notifications" element={<Navigate to="/reminders" replace />} />
                <Route path="/mine" element={<ProfilePage />} />
                <Route path="/mine/certification" element={<InstitutionCertificationPage />} />
                <Route path="/mine/scope" element={<BusinessScopePage />} />
                <Route path="/cases/:id" element={<CaseDetailPage />} />
                <Route path="/cases/:id/materials" element={<CaseMaterialPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
