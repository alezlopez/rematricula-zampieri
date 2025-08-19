import { useState } from "react";
import Header from "@/components/Header";
import CPFSearchForm from "@/components/CPFSearchForm";
import DataConfirmation from "@/components/DataConfirmation";
import StatusFlow from "@/components/StatusFlow";
import { Button } from "@/components/ui/button";

type Step = "search" | "confirmation" | "update" | "financial" | "status";

const Rematricula = () => {
  const [currentStep, setCurrentStep] = useState<Step>("search");
  const [studentData, setStudentData] = useState<any>(null);

  const handleSearchResult = (data: any) => {
    setStudentData(data);
    
    // Verificar status e direcionar para o fluxo correto
    if (!data.status) {
      // Status nulo - mostrar dados para confirmação
      setCurrentStep("confirmation");
    } else {
      // Status existente - mostrar fluxo específico do status
      setCurrentStep("status");
    }
  };

  const handleDataConfirmation = () => {
    setCurrentStep("financial");
  };

  const handleDataUpdate = () => {
    setCurrentStep("update");
  };

  const handleBackToSearch = () => {
    setCurrentStep("search");
    setStudentData(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "search":
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <CPFSearchForm onSearchResult={handleSearchResult} />
          </div>
        );
      
      case "confirmation":
        return (
          <div className="min-h-[60vh] flex items-center justify-center py-8">
            <DataConfirmation
              data={studentData}
              onConfirm={handleDataConfirmation}
              onUpdate={handleDataUpdate}
            />
          </div>
        );
      
      case "status":
        return (
          <div className="min-h-[60vh] flex items-center justify-center py-8">
            <StatusFlow
              status={studentData?.status}
              data={studentData}
              onBackToSearch={handleBackToSearch}
            />
          </div>
        );
      
      case "update":
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-xl font-semibold text-primary mb-4">
                Formulário de Atualização
              </h2>
              <p className="text-muted-foreground mb-4">
                Em desenvolvimento...
              </p>
              <Button onClick={handleBackToSearch} variant="outline">
                Voltar à Busca
              </Button>
            </div>
          </div>
        );
      
      case "financial":
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-xl font-semibold text-primary mb-4">
                Escolha do Responsável Financeiro
              </h2>
              <p className="text-muted-foreground mb-4">
                Em desenvolvimento...
              </p>
              <Button onClick={handleBackToSearch} variant="outline">
                Voltar à Busca
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderCurrentStep()}
      </main>
    </div>
  );
};

export default Rematricula;