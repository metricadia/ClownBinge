import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminProvider } from "@/context/AdminContext";
import { useAuth } from "@workspace/replit-auth-web";
import { LoginWall } from "@/components/LoginWall";

// Pages
import Home from "@/pages/Home";
import PostDetail from "@/pages/PostDetail";
import Store from "@/pages/Store";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Ethics from "@/pages/Ethics";
import VerifyNews from "@/pages/VerifyNews";
import ComprehensiveReport from "@/pages/ComprehensiveReport";
import Support from "@/pages/Support";
import TagIndex from "@/pages/TagIndex";
import SubmitTip from "@/pages/SubmitTip";
import Advertise from "@/pages/Advertise";
import FixMe from "@/pages/FixMe";
import Bookstore from "@/pages/Bookstore";
import CategoryHub from "@/pages/CategoryHub";
import Methodology from "@/pages/Methodology";
import Corrections from "@/pages/Corrections";
import AdminEditorPage from "@/pages/AdminEditorPage";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/case/:slug" component={PostDetail} />
        <Route path="/store" component={Store} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/ethics" component={Ethics} />
        <Route path="/clowncheck" component={VerifyNews} />
        <Route path="/reports" component={ComprehensiveReport} />
        <Route path="/tags/:tag" component={TagIndex} />
        <Route path="/submit" component={SubmitTip} />
        <Route path="/advertise" component={Advertise} />
        <Route path="/invest-in-us" component={Support} />
        <Route path="/FixMe" component={FixMe} />
        <Route path="/bookstore" component={Bookstore} />
        <Route path="/category/:slug" component={CategoryHub} />
        <Route path="/methodology" component={Methodology} />
        <Route path="/corrections" component={Corrections} />
        <Route path="/Kemet8/:postId?" component={AdminEditorPage} />
        <Route path="/Kemet8" component={AdminEditorPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, login } = useAuth();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0a0f" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"
          />
          <p className="text-stone-600 text-xs tracking-widest uppercase">
            ClownBinge
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginWall login={login} />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AuthGate>
              <Router />
            </AuthGate>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AdminProvider>
    </QueryClientProvider>
  );
}

export default App;
