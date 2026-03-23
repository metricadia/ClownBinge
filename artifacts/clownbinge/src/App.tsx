import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

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
import TagIndex from "@/pages/TagIndex";
import SubmitTip from "@/pages/SubmitTip";
import Advertise from "@/pages/Advertise";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
