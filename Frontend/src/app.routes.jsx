import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ChangePassword from "./features/auth/pages/ChangePassword";
import EditProfile from "./features/auth/pages/EditProfile";
import DeleteAccount from "./features/auth/pages/DeleteAccount";
import MyReports from "./features/interview/pages/MyReports";
import ResetPassword from "./features/auth/pages/ResetPassword";
import LandingPage from "./features/landing/pages/LandingPage";
import PrivacyPolicy from "./features/landing/pages/PrivacyPolicy";
import TermsOfService from "./features/landing/pages/TermsOfService";
import Contact from "./features/landing/pages/Contact";
import NotFound from "./components/NotFound";
import Analytics from "./features/interview/pages/Analytics";



/**
 * App-wide route table. Routes wrapped in <Protected> require an
 * authenticated user and redirect to /login otherwise (see Protected.jsx).
 * The catch-all "*" route at the end renders the 404 page for any unmatched path.
 */
export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
   {
    path: "/forgot-password",
    element: <ForgotPassword />
},
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/privacy",
        element: <PrivacyPolicy />
    },
    {
        path: "/terms",
        element: <TermsOfService />
    },
    {
        path: "/contact",
        element: <Contact />
    },
    {
        path: "/dashboard",
        element: <Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/change-password",
        element: <Protected><ChangePassword /></Protected>
    },
    {
        path: "/edit-profile",
        element: <Protected><EditProfile /></Protected>
    },
    {
        path: "/delete-account",
        element: <Protected><DeleteAccount /></Protected>
    },
    {
        path: "/reports",
        element: <Protected><MyReports /></Protected>
    },
    {
        path: "/reset-password",
        element: <ResetPassword />
    },
    {
        path: "*",
        element: <NotFound />
    },
    {
        path: "/analytics",
        element: <Protected><Analytics /></Protected>
    }
])