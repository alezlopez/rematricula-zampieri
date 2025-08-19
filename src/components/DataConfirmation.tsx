
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Edit, User } from "lucide-react";

interface DataConfirmationProps {
  data: any;
  onConfirm: () => void;
  onUpdate: () => void;
}

const DataConfirmation = ({ data, onConfirm, onUpdate }: DataConfirmationProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-soft">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2 text-primary">
          <User className="w-5 h-5" />
          <span>Confirme seus Dados</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Status atual:</p>
          <Badge variant={data.status ? "default" : "secondary"}>
            {data.status || "Dados encontrados - Aguardando confirmação"}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Dados do Pai */}
          <div className="space-y-3">
            <h3 className="font-semibold text-primary flex items-center">
              <User className="w-4 h-4 mr-2" />
              Dados do Pai
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Nome:</span>
                <p className="font-medium">{data.nome_pai || "Não informado"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">CPF:</span>
                <p className="font-medium">{data.cpf_pai || "Não informado"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Telefone:</span>
                <p className="font-medium">{data.telefone_pai || "Não informado"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{data.email_pai || "Não informado"}</p>
              </div>
            </div>
          </div>

          {/* Dados da Mãe */}
          <div className="space-y-3">
            <h3 className="font-semibold text-primary flex items-center">
              <User className="w-4 h-4 mr-2" />
              Dados da Mãe
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Nome:</span>
                <p className="font-medium">{data.nome_mae || "Não informado"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">CPF:</span>
                <p className="font-medium">{data.cpf_mae || "Não informado"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Telefone:</span>
                <p className="font-medium">{data.telefone_mae || "Não informado"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{data.email_mae || "Não informado"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-3">
          <h3 className="font-semibold text-primary">Endereço</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">CEP:</span>
              <p className="font-medium">{data.cep || "Não informado"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Endereço:</span>
              <p className="font-medium">{data.endereco || "Não informado"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Número:</span>
              <p className="font-medium">{data.numero || "Não informado"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Bairro:</span>
              <p className="font-medium">{data.bairro || "Não informado"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Cidade:</span>
              <p className="font-medium">{data.cidade || "Não informado"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Estado:</span>
              <p className="font-medium">{data.estado || "Não informado"}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={onConfirm}
            className="flex-1 bg-gradient-primary hover:bg-primary-light transition-all duration-300"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Dados Corretos - Prosseguir
          </Button>
          <Button
            onClick={onUpdate}
            variant="outline"
            className="flex-1 border-coral text-coral hover:bg-coral hover:text-white transition-all duration-300"
          >
            <Edit className="w-4 h-4 mr-2" />
            Atualizar Dados
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataConfirmation;
