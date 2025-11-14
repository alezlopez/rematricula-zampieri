import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rematricula from "./pages/Rematricula";
import Sucesso from "./pages/Sucesso";
import NumerosdasSorte from "./pages/NumerosdasSorte";
import Campanha2026 from "./pages/Campanha2026";
import Adm from "./pages/Adm";
import Auth from "./pages/Auth";
import ListaVip from "./pages/ListaVip";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rematricula" element={<Rematricula />} />
          <Route path="/sucesso" element={<Sucesso />} />
          <Route path="/numerosdasorte" element={<NumerosdasSorte />} />
          <Route path="/campanha2026" element={<Campanha2026 />} />
          <Route path="/adm" element={<Adm />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/listavip" element={<ListaVip />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
