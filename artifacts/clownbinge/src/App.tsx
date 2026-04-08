import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminProvider } from "@/context/AdminContext";
import { ClerkProvider, SignIn, SignUp, useClerk } from "@clerk/react";

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
import Subscribe from "@/pages/Subscribe";
import MyAccount from "@/pages/MyAccount";
import NotFound from "@/pages/not-found";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL || undefined;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    document.getElementById("root")?.scrollTo(0, 0);
  }, [location]);
  return null;
}

const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      // Sync member record when a new user signs in
      if (userId && prevUserIdRef.current !== userId && user) {
        const email = user.primaryEmailAddress?.emailAddress ?? "";
        if (email) {
          fetch(`${apiBase}/api/members/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clerkId: userId,
              email,
              name: user.fullName || user.username || null,
              avatarUrl: user.imageUrl || null,
            }),
          }).catch(() => {});
        }
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function SignInPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#192e7a" }}
    >
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        fallbackRedirectUrl={`${basePath}/`}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#192e7a" }}
    >
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        fallbackRedirectUrl={`${basePath}/`}
      />
    </div>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
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
        <Route path="/Kemet8/:postId?" component={AdminEditorPage} />
        <Route path="/Kemet8" component={AdminEditorPage} />
        <Route path="/subscribe" component={Subscribe} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey || ""}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <AdminProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AdminProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
