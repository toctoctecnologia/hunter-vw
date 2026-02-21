import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { LoadingFull } from '@/shared/components/loading-full';
import { ErrorBoundary } from '@/shared/components/error-boundary';
import { NavigationGuard } from '@/shared/components/navigation-guard';
import { DashboardLayout } from '@/shared/components/layout/dashboard-layout';
import { SadmDashboardLayout } from '@/shared/components/layout/sadm-dashboard-layout';
import { PublicLayout } from '@/shared/components/layout/public-layout';

// Auth pages
const LoginPage = lazy(() => import('@/app/(auth)/page'));
const RegisterPage = lazy(() => import('@/app/(auth)/auth/register/page'));
const ForgotPasswordPage = lazy(() => import('@/app/(auth)/auth/forgot-password/page'));
const FinishRegisterPage = lazy(() => import('@/app/(auth)/auth/finish-register/page'));
const ErrorPage = lazy(() => import('@/app/(auth)/auth/error/page'));
const ResetPasswordPage = lazy(() => import('@/app/(auth)/auth/reset-password/page'));
const ConfirmInformationsPage = lazy(() => import('@/app/(auth)/auth/confirm-informations/page'));
const SignUpSuccessPage = lazy(() => import('@/app/(auth)/auth/sign-up-success/page'));
const MobileConfirmPage = lazy(() => import('@/app/(auth)/auth/mobile/confirm/page'));
const AuthConfirmPage = lazy(() => import('@/app/(auth)/auth/confirm/page'));
const MobileSuccessPage = lazy(() => import('@/app/(auth)/auth/mobile/success/page'));

// Dashboard pages
const DashboardPage = lazy(() => import('@/app/(protected)/dashboard/page'));
const SalesPage = lazy(() => import('@/app/(protected)/dashboard/sales/page'));
const SaleDetailsPage = lazy(() => import('@/app/(protected)/dashboard/sales/[uuid]/details/page'));
const CalendarPage = lazy(() => import('@/app/(protected)/dashboard/calendar/page'));
const PropertiesPage = lazy(() => import('@/app/(protected)/dashboard/properties/page'));
const PropertyDetailPage = lazy(() => import('@/app/(protected)/dashboard/properties/[uuid]/detail/page'));
const PropertyUpdatePage = lazy(() => import('@/app/(protected)/dashboard/properties/[uuid]/update/page'));
const UsersPage = lazy(() => import('@/app/(protected)/dashboard/users/page'));
const UserDetailPage = lazy(() => import('@/app/(protected)/dashboard/users/[uuid]/page'));
const DistributionPage = lazy(() => import('@/app/(protected)/dashboard/distribution/page'));
const QueueDetailPage = lazy(() => import('@/app/(protected)/dashboard/distribution/queue/[queueId]/page'));
const SaleActionPage = lazy(() => import('@/app/(protected)/dashboard/distribution/sale-action/[actionId]/page'));
const AccessControlPage = lazy(() => import('@/app/(protected)/dashboard/access-control/page'));
const ManageRotaryLeadsPage = lazy(() => import('@/app/(protected)/dashboard/manage-rotary-leads/page'));
const ManageApiPage = lazy(() => import('@/app/(protected)/dashboard/manage-api/page'));
const PaymentsPage = lazy(() => import('@/app/(protected)/dashboard/payments/page'));
const ManageReportsPage = lazy(() => import('@/app/(protected)/dashboard/manage-reports/page'));
const ManageReportsFilesPage = lazy(() => import('@/app/(protected)/dashboard/manage-reports/files/page'));
const ManagePropertiesPage = lazy(() => import('@/app/(protected)/dashboard/manage-properties/page'));
const ManageCondominiumsPage = lazy(() => import('@/app/(protected)/dashboard/manage-condominiums/page'));
const CondominiumDetailPage = lazy(() => import('@/app/(protected)/dashboard/manage-condominiums/condominium/[uuid]/page'));
const ManageLeadsPage = lazy(() => import('@/app/(protected)/dashboard/manage-leads/page'));
const NotificationsPage = lazy(() => import('@/app/(protected)/dashboard/notifications/page'));
const ProfilePage = lazy(() => import('@/app/(protected)/dashboard/profile/page'));
const WhatsappSetupPage = lazy(() => import('@/app/(protected)/dashboard/whatsapp/setup/page'));

// Sadm Dashboard pages
const SadmDashboardPage = lazy(() => import('@/app/(protected)/sadm-dashboard/page'));
const SadmClientsPage = lazy(() => import('@/app/(protected)/sadm-dashboard/clients/page'));
const SadmAccessControlPage = lazy(() => import('@/app/(protected)/sadm-dashboard/access-control/page'));
const SadmPlansControlPage = lazy(() => import('@/app/(protected)/sadm-dashboard/plans-control/page'));
const SadmManageNotificationsPage = lazy(() => import('@/app/(protected)/sadm-dashboard/manage-notifications/page'));
const SadmNotificationRemindersPage = lazy(() => import('@/app/(protected)/sadm-dashboard/notification-reminders/page'));
const SadmNotificationsPage = lazy(() => import('@/app/(protected)/sadm-dashboard/notifications/page'));
const SadmProfilePage = lazy(() => import('@/app/(protected)/sadm-dashboard/profile/page'));

// Public pages
const CheckInPage = lazy(() => import('@/app/(public)/public/check-in/page'));
const RemoveAccountPage = lazy(() => import('@/app/(public)/public/remove-account/page'));

// Other pages
const PrivacyPolicyPage = lazy(() => import('@/app/privacy-policy/page'));
const UnauthorizedPage = lazy(() => import('@/app/unauthorized/page'));
const NotFoundPage = lazy(() => import('@/app/not-found'));
const StatusPage = lazy(() => import('@/app/status/page'));

// Payment & OAuth
const PaymentConfirmPage = lazy(() => import('@/app/(protected)/payment/confirm/page'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingFull title="Carregando..." />}>{children}</Suspense>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <SuspenseWrapper>
        <NavigationGuard>
          <Routes>
          {/* Auth routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/finish-register" element={<FinishRegisterPage />} />
          <Route path="/auth/error" element={<ErrorPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/confirm-informations" element={<ConfirmInformationsPage />} />
          <Route path="/auth/confirm" element={<AuthConfirmPage />} />
          <Route path="/auth/callback" element={<AuthConfirmPage />} />
          <Route path="/auth/sign-up-success" element={<SignUpSuccessPage />} />
          <Route path="/auth/mobile/confirm" element={<MobileConfirmPage />} />
          <Route path="/auth/mobile/success" element={<MobileSuccessPage />} />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="sales/:uuid/details" element={<SaleDetailsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="properties/:uuid/detail" element={<PropertyDetailPage />} />
            <Route path="properties/:uuid/update" element={<PropertyUpdatePage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:uuid" element={<UserDetailPage />} />
            <Route path="distribution" element={<DistributionPage />} />
            <Route path="distribution/queue/:queueId" element={<QueueDetailPage />} />
            <Route path="distribution/sale-action/:actionId" element={<SaleActionPage />} />
            <Route path="access-control" element={<AccessControlPage />} />
            <Route path="manage-rotary-leads" element={<ManageRotaryLeadsPage />} />
            <Route path="manage-api" element={<ManageApiPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="manage-reports" element={<ManageReportsPage />} />
            <Route path="manage-reports/files" element={<ManageReportsFilesPage />} />
            <Route path="manage-properties" element={<ManagePropertiesPage />} />
            <Route path="manage-condominiums" element={<ManageCondominiumsPage />} />
            <Route path="manage-condominiums/condominium/:uuid" element={<CondominiumDetailPage />} />
            <Route path="manage-leads" element={<ManageLeadsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="whatsapp/setup" element={<WhatsappSetupPage />} />
          </Route>

          {/* Sadm Dashboard routes */}
          <Route path="/sadm-dashboard" element={<SadmDashboardLayout />}>
            <Route index element={<SadmDashboardPage />} />
            <Route path="clients" element={<SadmClientsPage />} />
            <Route path="access-control" element={<SadmAccessControlPage />} />
            <Route path="plans-control" element={<SadmPlansControlPage />} />
            <Route path="manage-notifications" element={<SadmManageNotificationsPage />} />
            <Route path="notification-reminders" element={<SadmNotificationRemindersPage />} />
            <Route path="notifications" element={<SadmNotificationsPage />} />
            <Route path="profile" element={<SadmProfilePage />} />
          </Route>

          {/* Public routes */}
          <Route path="/public" element={<PublicLayout />}>
            <Route path="check-in" element={<CheckInPage />} />
            <Route path="remove-account" element={<RemoveAccountPage />} />
          </Route>

          {/* Payment */}
          <Route path="/payment/confirm" element={<PaymentConfirmPage />} />

          {/* Health routes */}
          <Route path="/status" element={<StatusPage />} />

          {/* Other */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NavigationGuard>
      </SuspenseWrapper>
    </ErrorBoundary>
  );
}
