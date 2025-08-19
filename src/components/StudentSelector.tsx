import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft } from "lucide-react";

interface Student {
  nome_aluno: string;
  curso_2025?: string;
  curso_2026?: string;
  cod_aluno?: string;
}

interface StudentSelectorProps {
  students: Student[];
  onSelectStudent: (studentData: any) => void;
  onBack: () => void;
}

const StudentSelector = ({ students, onSelectStudent, onBack }: StudentSelectorProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-soft">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2 text-primary">
          <Users className="w-5 h-5" />
          <span>Selecione o Aluno</span>
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Encontramos mais de um aluno vinculado a este CPF. Selecione o aluno para continuar:
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {students.map((student, index) => (
          <Card key={index} className="border border-border hover:border-primary transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-foreground">{student.nome_aluno}</h3>
                  <p className="text-sm text-muted-foreground">
                    {student.curso_2025 && `Curso 2025: ${student.curso_2025}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {student.curso_2026 && `Curso 2026: ${student.curso_2026}`}
                  </p>
                  {student.cod_aluno && (
                    <p className="text-xs text-muted-foreground">
                      Código: {student.cod_aluno}
                    </p>
                  )}
                </div>
                <Button 
                  onClick={() => onSelectStudent(students[index])}
                  variant="outline"
                  size="sm"
                >
                  Selecionar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="pt-4">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Busca
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentSelector;