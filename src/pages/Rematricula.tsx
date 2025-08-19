
import { useState } from "react";
import Header from "@/components/Header";
import CPFSearchForm from "@/components/CPFSearchForm";
import DataConfirmation from "@/components/DataConfirmation";
import StatusFlow from "@/components/StatusFlow";
import StudentSelector from "@/components/StudentSelector";
import DataUpdateForm from "@/components/DataUpdateForm";
import FinancialResponsibleStep from "@/components/FinancialResponsibleStep";
import ExtraDataForm from "@/components/ExtraDataForm";
import StudentSummary from "@/components/StudentSummary";
import { Button } from "@/components/ui/button";

type Step = "search" | "selection" | "confirmation" | "update" | "financial" | "extraData" | "summary" | "status";

const Rematricula = () => {
  const [currentStep, setCurrentStep] = useState<Step>("search");
  const [studentData, setStudentData] = useState<any>(null);
  const [multipleStudents, setMultipleStudents] = useState<any[]>([]);
  const [extraData, setExtraData] = useState<any>(null);

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

  const handleMultipleResults = (results: any[]) => {
    setMultipleStudents(results);
    setCurrentStep("selection");
  };

  const handleStudentSelection = (selectedStudent: any) => {
    setStudentData(selectedStudent);
    if (!selectedStudent.status) {
      setCurrentStep("confirmation");
    } else {
      setCurrentStep("status");
    }
  };

  const handleDataConfirmation = () => {
    setCurrentStep("financial");
  };

  const handleFinancialSuccess = () => {
    // Ir para coleta de dados extras
    setCurrentStep("extraData");
  };

  const handleExtraDataSuccess = (data: any) => {
    console.log('=== handleExtraDataSuccess CHAMADO ===');
    console.log('Dados recebidos:', data);
    console.log('Estado atual:', currentStep);
    
    setExtraData(data);
    console.log('Mudando para step: summary');
    setCurrentStep("summary");
    
    console.log('Novo estado será:', "summary");
  };

  const handleSummaryConfirm = () => {
    // Aqui você pode processar os dados finais ou ir para próxima tela
    console.log('Dados extras coletados:', extraData);
    console.log('Dados do estudante:', studentData);
    handleBackToSearch();
  };

  const handleDataUpdate = () => {
    setCurrentStep("update");
  };

  const handleUpdateSuccess = (updatedData: any) => {
    setStudentData(updatedData);
    setCurrentStep("confirmation");
  };

  const handleBackToSearch = () => {
    setCurrentStep("search");
    setStudentData(null);
    setMultipleStudents([]);
    setExtraData(null);
  };

  const renderCurrentStep = () => {
    console.log('=== RENDERIZANDO STEP:', currentStep, '===');
    
    switch (currentStep) {
      case "search":
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <CPFSearchForm onSearchResult={handleSearchResult} onMultipleResults={handleMultipleResults} />
          </div>
        );
      
      case "selection":
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <StudentSelector 
              students={multipleStudents}
              onSelectStudent={handleStudentSelection}
              onBack={handleBackToSearch}
            />
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
      
      case "update":
        return (
          <div className="min-h-[60vh] flex items-center justify-center py-8">
            <DataUpdateForm
              data={studentData}
              onBack={() => setCurrentStep("confirmation")}
              onSuccess={handleUpdateSuccess}
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
      
      case "financial":
        return (
          <div className="min-h-[60vh] flex items-center justify-center py-8">
            <FinancialResponsibleStep
              data={studentData}
              onSuccess={handleFinancialSuccess}
              onBack={() => setCurrentStep("confirmation")}
            />
          </div>
        );
      
      case "extraData":
        return (
          <div className="min-h-[60vh] flex items-center justify-center py-8">
            <ExtraDataForm
              data={studentData}
              onSuccess={handleExtraDataSuccess}
              onBack={() => setCurrentStep("financial")}
            />
          </div>
        );
      
      case "summary":
        return (
          <div className="min-h-[60vh] flex items-center justify-center py-8">
            <StudentSummary
              data={studentData}
              extraData={extraData}
              onConfirm={handleSummaryConfirm}
              onBack={() => setCurrentStep("extraData")}
            />
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
