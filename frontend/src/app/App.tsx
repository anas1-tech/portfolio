import { lazy, Suspense, useState } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { usePortfolio } from "@/context/PortfolioContext";
import About from "@/features/about/About";
import Contact from "@/features/contact/Contact";
import Hero from "@/features/hero/Hero";
import Projects from "@/features/projects/Projects";
import Resume from "@/features/resume/Resume";
import Skills from "@/features/skills/Skills";
import { useLenis } from "@/hooks/useLenis";
import { useReveal } from "@/hooks/useReveal";

// The admin UI (and Ant Design with it) is only downloaded when someone opens the login form or signs in.
const AdminLayer = lazy(() => import("@/features/admin/AdminLayer"));
// The animated background is decoration, so it loads after the content and never delays first paint.
const PageBackground = lazy(() => import("@/components/ui/PageBackground"));

export default function App() {
  const { isAdmin } = useAuth();
  const { data, editor } = usePortfolio();
  const [showLogin, setShowLogin] = useState(false);
  useReveal(data);
  useLenis();

  return (
    <>
      <Suspense fallback={null}>
        <PageBackground />
      </Suspense>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Resume />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer onLogin={() => setShowLogin(true)} />
      {(isAdmin || showLogin || editor) && (
        <Suspense fallback={null}>
          <AdminLayer isAdmin={isAdmin} showLogin={showLogin} onCloseLogin={() => setShowLogin(false)} />
        </Suspense>
      )}
    </>
  );
}
