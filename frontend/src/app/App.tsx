import { Button, Result, Spin } from "antd";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { usePortfolio } from "@/context/PortfolioContext";
import About from "@/features/about/About";
import Contact from "@/features/contact/Contact";
import Courses from "@/features/courses/Courses";
import Hero from "@/features/hero/Hero";
import Projects from "@/features/projects/Projects";
import Resume from "@/features/resume/Resume";
import Skills from "@/features/skills/Skills";

// Admin UI is only downloaded when someone opens the login form or signs in.
const AdminBar = lazy(() => import("@/features/admin/AdminBar"));
const EntityFormModal = lazy(() => import("@/features/admin/EntityFormModal"));
const LoginModal = lazy(() => import("@/features/admin/LoginModal"));

export default function App() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const { status, editor, reload } = usePortfolio();
  const [showLogin, setShowLogin] = useState(false);

  if (status === "loading") {
    return (
      <div className="grid min-h-svh place-items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="grid min-h-svh place-items-center">
        <Result
          status="error"
          title={t("common.serverDown")}
          extra={<Button type="primary" onClick={() => void reload()}>{t("common.retry")}</Button>}
        />
      </div>
    );
  }

  return (
    <>
      <Navbar onLogin={() => setShowLogin(true)} />
      <main>
        <Hero />
        <About />
        <Resume />
        <Skills />
        <Courses />
        <Projects />
        <Contact />
      </main>
      <Suspense fallback={null}>
        {isAdmin && <AdminBar />}
        {showLogin && !isAdmin && <LoginModal onClose={() => setShowLogin(false)} />}
        {editor && <EntityFormModal key={`${editor.kind}-${editor.item?.id ?? "new"}`} />}
      </Suspense>
    </>
  );
}
