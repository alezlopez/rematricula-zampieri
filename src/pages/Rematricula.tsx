
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
import PaymentSelection from "@/components/PaymentSelection";
import { Button } from "@/components/ui/button";

type Step = "search" | "selection" | "confirmation" | "update" | "financial" | "extraData" | "summary" | "status" | "payment";

const Rematricula = () => {
  const [currentStep, setCurrentStep] = useState<Step>("search");
  const [studentData, setStudentData] = useState<any>(null);
  const [multipleStudents, setMultipleStudents] = useState<any[]>([]);
  const [extraData, setExtraData] = useState<any>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleSearchResult = (data: any) => {
    try {
      console.log('=== HANDLE SEARCH RESULT ===');
      console.log('Data recebida:', data);
      console.log('User agent:', navigator.userAgent);
      
      setGlobalError(null); // Limpar erros anteriores
      setStudentData(data);
      
      // Verificar status e direcionar para o fluxo correto
      if (!data.status) {
        console.log('Status nulo - indo para confirmation');
        setCurrentStep("confirmation");
      } else {
        console.log('Status existente:', data.status, '- indo para status');
        setCurrentStep("status");
      }
      
      console.log('=== FIM HANDLE SEARCH RESULT ===');
    } catch (error) {
      console.error('Erro em handleSearchResult:', error);
      setGlobalError('Erro ao processar dados do aluno');
    }
  };

  const handleMultipleResults = (results: any[]) => {
    try {
      console.log('=== HANDLE MULTIPLE RESULTS ===');
      console.log('Resultados:', results.length);
      
      setGlobalError(null);
      setMultipleStudents(results);
      setCurrentStep("selection");
      
      console.log('=== FIM HANDLE MULTIPLE RESULTS ===');
    } catch (error) {
      console.error('Erro em handleMultipleResults:', error);
      setGlobalError('Erro ao processar múltiplos alunos');
    }
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
    
    // Scroll para o topo após mudança de step
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    console.log('Novo estado será:', "summary");
  };

  const handleSummaryConfirm = () => {
    // Aqui você pode processar os dados finais ou ir para próxima tela
    console.log('Dados extras coletados:', extraData);
    console.log('Dados do estudante:', studentData);
    handleBackToSearch();
  };

  const handleGoToPayment = () => {
    setCurrentStep("payment");
  };

  const handlePaymentComplete = () => {
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
    console.log('=== VOLTANDO PARA BUSCA ===');
    setCurrentStep("search");
    setStudentData(null);
    setMultipleStudents([]);
    setExtraData(null);
    setGlobalError(null);
  };

  const renderCurrentStep = () => {
    console.log('=== RENDERIZANDO STEP:', currentStep, '===');
    console.log('Global Error:', globalError);
    console.log('Student Data:', !!studentData);
    console.log('Multiple Students:', multipleStudents.length);
    
    // Se houver erro global, mostrar mensagem de erro
    if (globalError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-600 text-lg">{globalError}</p>
            <Button onClick={handleBackToSearch} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </div>
      );
    }
    
    try {
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
              onGoToPayment={handleGoToPayment}
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
              onGoToPayment={handleGoToPayment}
            />
          </div>
        );
      
      case "payment":
        return (
          <div className="min-h-[60vh] flex items-center justify-center py-8">
            <PaymentSelection
              data={studentData}
              onBack={() => setCurrentStep("summary")}
              onComplete={handlePaymentComplete}
            />
          </div>
        );
      
      default:
        console.error('=== STEP DESCONHECIDO:', currentStep, '===');
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-red-600 text-lg">Erro interno: Estado inválido</p>
              <Button onClick={handleBackToSearch} variant="outline">
                Voltar ao Início
              </Button>
            </div>
          </div>
        );
    }
    } catch (error) {
      console.error('Erro ao renderizar step:', currentStep, error);
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-600 text-lg">Erro ao carregar página</p>
            <Button onClick={handleBackToSearch} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </div>
      );
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
