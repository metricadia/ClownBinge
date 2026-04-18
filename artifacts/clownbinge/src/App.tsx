import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminProvider } from "@/context/AdminContext";
import { AuthProvider } from "@/context/AuthContext";

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
import PublishWizard from "@/pages/PublishWizard";
import AdminGate from "@/pages/AdminGate";
import AdminVerify from "@/pages/AdminVerify";
import Subscribe from "@/pages/Subscribe";
import MyAccount from "@/pages/MyAccount";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import NotFound from "@/pages/not-found";
import ComingSoon from "@/pages/ComingSoon";

function HomeOrComingSoon() {
  const isAdmin =
    sessionStorage.getItem("metricadia_authenticated") === "true" ||
    sessionStorage.getItem("metricadia_token") !== null;

  if (isAdmin) {
    return <Home />;
  }
  return <ComingSoon />;
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    document.getElementById("root")?.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={HomeOrComingSoon} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/account" component={MyAccount} />
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
        <Route path="/admin-access/verify" component={AdminVerify} />
        <Route path="/admin-access" component={AdminGate} />
        <Route path="/Brain-Instance-:token/publish" component={PublishWizard} />
        <Route path="/Brain-Instance-:token/:postId" component={AdminEditorPage} />
        <Route path="/Brain-Instance-:token" component={AdminEditorPage} />
        <Route path="/subscribe" component={Subscribe} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AdminProvider>
            <TooltipProvider>
              <Router />
              <Toaster />
            </TooltipProvider>
          </AdminProvider>
        </QueryClientProvider>
      </AuthProvider>
    </WouterRouter>
  );
}

export default App;
