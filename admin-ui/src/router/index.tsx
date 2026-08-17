import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import { CardSkeleton } from "../components/ui/Skeleton";

const PersonalInfoPage = lazy(() => import("../pages/admin/PersonalInfoPage"));
const AboutPage = lazy(() => import("../pages/admin/AboutPage"));
const SkillsPage = lazy(() => import("../pages/admin/SkillsPage"));
const ProjectsPage = lazy(() => import("../pages/admin/ProjectsPage"));
const ProjectFormPage = lazy(() => import("../pages/admin/ProjectFormPage"));

const PageLoader = () => (
  <div className="space-y-4 p-6">
    <CardSkeleton />
    <CardSkeleton />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/personal" replace /> },
      {
        path: "personal",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PersonalInfoPage />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: "skills",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SkillsPage />
          </Suspense>
        ),
      },
      {
        path: "projects",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectsPage />
          </Suspense>
        ),
      },
      {
        path: "projects/new",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectFormPage />
          </Suspense>
        ),
      },
      {
        path: "projects/:id/edit",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectFormPage />
          </Suspense>
        ),
      },
    ],
  },
  { path: "*", element: <Navigate to="/admin" replace /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;
