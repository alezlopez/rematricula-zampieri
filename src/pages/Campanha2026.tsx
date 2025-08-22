import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CalendarDays, 
  Gift, 
  Trophy, 
  CheckCircle, 
  Star, 
  Clock, 
  Zap, 
  Crown, 
  Sparkles,
  MessageSquare,
  Smartphone,
  Building2,
  QrCode,
  DollarSign,
  BookOpen
} from 'lucide-react';

const Campanha2026 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-16 space-y-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-400/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/0dd01042-2911-4a76-ab1e-e0e6d60e3f18.png" 
                alt="Colégio Zampieri" 
                className="h-32 md:h-40 object-contain drop-shadow-lg"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Rematrículas 2026
              <br />
              <span className="text-blue-600">Colégio Zampieri</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
              Descontos exclusivos, sorteios e prêmios para quem garante a vaga antecipada!
            </p>
            
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-6 h-auto shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              onClick={() => window.open('https://rematriculas.colegiozampieri.com.br', '_blank')}
            >
              <Zap className="w-6 h-6 mr-3" />
              Fazer minha rematrícula agora
            </Button>
          </div>
        </section>

        {/* Mensagem de Abertura */}
        <section className="text-center bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-3xl border border-blue-200">
          <p className="text-xl md:text-2xl text-gray-800 font-medium max-w-4xl mx-auto leading-relaxed">
            <strong className="text-blue-700">Obrigado pela confiança em 2025!</strong> Em 2026 seguimos juntos, com ensino de excelência, inovação e uma escola cada vez melhor para nossos alunos.
          </p>
        </section>

        {/* Compromisso com a Evolução */}
        <section className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nosso Compromisso com a <span className="text-blue-600">Evolução</span>
            </h2>
            <p className="text-lg text-gray-600">Inovação constante para oferecer o melhor ensino</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">✅ Agenda Digital</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  SAE Digital e Professus+ para acompanhamento completo
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">✅ Atendimento 24h</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  WhatsApp com IA para tirar suas dúvidas a qualquer hora
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">✅ Rematrícula Online</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Processo prático e seguro, 100% digital
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">✅ Estrutura Renovada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Reformas e melhorias contínuas na escola
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Períodos Promocionais */}
        <section className="space-y-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <CalendarDays className="w-10 h-10 inline mr-3 text-blue-600" />
              Períodos Promocionais
            </h2>
            <p className="text-lg text-gray-600">Quanto antes você rematricular, maiores os benefícios!</p>
          </div>
          
          <div className="space-y-6">
            {/* 1º Lote - Destaque */}
            <Card className="relative overflow-hidden border-4 border-yellow-500 shadow-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 transform hover:scale-102 transition-all">
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 text-lg font-bold rounded-bl-3xl shadow-lg">
                <Crown className="w-5 h-5 inline mr-2" />
                MELHOR OFERTA
              </div>
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-6 md:mb-0">
                    <div className="flex items-center gap-3 mb-4">
                      <Trophy className="w-8 h-8 text-yellow-600" />
                      <div>
                        <h3 className="text-2xl font-bold text-yellow-700">🏆 25/08 a 10/09</h3>
                        <p className="text-yellow-600">Primeiro lote - Máximo benefício</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-yellow-600 mb-2">60%</div>
                    <p className="text-xl font-bold text-yellow-700 mb-4">DE DESCONTO</p>
                    <Badge className="bg-yellow-500 text-white text-lg px-6 py-2">
                      <Star className="w-5 h-5 mr-2" />
                      4 números da sorte
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Outros lotes */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl font-bold text-blue-600">50%</div>
                  <CardTitle className="text-blue-700">🎯 11 a 20/09</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-blue-600 mb-2">50% de desconto</p>
                  <Badge className="bg-blue-500 text-white">3 números da sorte</Badge>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl font-bold text-green-600">40%</div>
                  <CardTitle className="text-green-700">⭐ 21 a 30/09</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-green-600 mb-2">40% de desconto</p>
                  <Badge className="bg-green-500 text-white">2 números da sorte</Badge>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl font-bold text-orange-600">35%</div>
                  <CardTitle className="text-orange-700">🍂 Outubro</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-orange-600 mb-2">35% de desconto</p>
                  <Badge className="bg-orange-500 text-white">1 número da sorte</Badge>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl font-bold text-red-600">30%</div>
                  <CardTitle className="text-red-700">🎉 Novembro</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-red-600 mb-2">30% de desconto</p>
                  <Badge className="bg-red-500 text-white">1 número da sorte</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Prêmios e Benefícios */}
        <section className="space-y-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <Gift className="w-10 h-10 inline mr-3 text-blue-600" />
              Prêmios e Benefícios Extras
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Sorteios Individuais */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">🎁 Sorteios Individuais</h3>
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-bold text-lg">Kit de material SAE Digital</h4>
                        <p className="text-gray-600">Material didático completo para 2026</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Sparkles className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-bold text-lg">Kit de uniformes</h4>
                        <p className="text-gray-600">Uniformes oficiais do colégio</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Star className="w-8 h-8 text-purple-600" />
                      <div>
                        <h4 className="font-bold text-lg">Mochila premium personalizada</h4>
                        <p className="text-gray-600">Mochila de alta qualidade</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Ranking das Turmas */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">🏆 Ranking das Turmas</h3>
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Trophy className="w-8 h-8 text-yellow-600" />
                      <div>
                        <h4 className="font-bold text-lg">Setembro → Bolsa personalizada</h4>
                        <p className="text-gray-600">Para a turma com mais rematrículas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Trophy className="w-8 h-8 text-orange-600" />
                      <div>
                        <h4 className="font-bold text-lg">Outubro → Caderno + Caneta personalizados</h4>
                        <p className="text-gray-600">Para a turma vencedora do mês</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Trophy className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-bold text-lg">Novembro → Garrafa personalizada</h4>
                        <p className="text-gray-600">Para a turma com mais engajamento</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Valores e Materiais */}
        <section className="text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            <DollarSign className="w-10 h-10 inline mr-3 text-blue-600" />
            Valores 2026
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-700">
                      <BookOpen className="w-6 h-6 inline mr-2" />
                      Mensalidades 2026
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Clique para ver os valores</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Valores de Mensalidade 2026</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="p-3 text-left font-semibold">Curso</th>
                          <th className="p-3 text-right font-semibold">Mensalidade*</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="p-3">Ed. Infantil</td>
                          <td className="p-3 text-right font-medium">R$730,00</td>
                        </tr>
                        <tr>
                          <td className="p-3">Ens. Fund. I – 1º Ano</td>
                          <td className="p-3 text-right font-medium">R$810,00</td>
                        </tr>
                        <tr>
                          <td className="p-3">Ens. Fund. I – 2º ao 5º Ano</td>
                          <td className="p-3 text-right font-medium">R$910,00</td>
                        </tr>
                        <tr>
                          <td className="p-3">Ens. Fund. I – 6º ao 9º Ano</td>
                          <td className="p-3 text-right font-medium">R$1.010,00</td>
                        </tr>
                        <tr>
                          <td className="p-3">Ensino Médio</td>
                          <td className="p-3 text-right font-medium">R$1.050,00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    *Se você faz parte de algum programa especial de bolsa de estudo, o seu percentual de desconto será aplicado no valor do curso acima.
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-700">
                      <Sparkles className="w-6 h-6 inline mr-2" />
                      Materiais SAE Digital
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Compra exclusiva online</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Materiais SAE Digital</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="p-3 text-left font-semibold">Curso</th>
                          <th className="p-3 text-right font-semibold">Valor – Parcelado em até 12x</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-sm">
                        <tr><td className="p-2">Pré</td><td className="p-2 text-right font-medium">R$ 959,00</td></tr>
                        <tr><td className="p-2">1º Ano</td><td className="p-2 text-right font-medium">R$ 1.199,00</td></tr>
                        <tr><td className="p-2">2º Ano</td><td className="p-2 text-right font-medium">R$ 1.239,00</td></tr>
                        <tr><td className="p-2">3º Ano</td><td className="p-2 text-right font-medium">R$ 1.309,00</td></tr>
                        <tr><td className="p-2">4º Ano</td><td className="p-2 text-right font-medium">R$ 1.439,00</td></tr>
                        <tr><td className="p-2">5º Ano</td><td className="p-2 text-right font-medium">R$ 1.659,00</td></tr>
                        <tr><td className="p-2">6º Ano</td><td className="p-2 text-right font-medium">R$ 1.909,00</td></tr>
                        <tr><td className="p-2">7º Ano</td><td className="p-2 text-right font-medium">R$ 1.909,00</td></tr>
                        <tr><td className="p-2">8º Ano</td><td className="p-2 text-right font-medium">R$ 1.929,00</td></tr>
                        <tr><td className="p-2">9º Ano</td><td className="p-2 text-right font-medium">R$ 1.989,00</td></tr>
                        <tr><td className="p-2">1º Médio</td><td className="p-2 text-right font-medium">R$ 2.399,00</td></tr>
                        <tr><td className="p-2">2º Médio</td><td className="p-2 text-right font-medium">R$ 2.399,00</td></tr>
                        <tr><td className="p-2">3º Médio</td><td className="p-2 text-right font-medium">R$ 2.399,00</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Links Úteis */}
        <section className="text-center space-y-6 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-3xl">
          <h3 className="text-2xl font-bold text-gray-800">Links Úteis</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => window.open('https://rematriculas.colegiozampieri.com.br/numerosdasorte', '_blank')}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Star className="w-4 h-4 mr-2" />
              Consultar Números da Sorte
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open('https://rematriculas.colegiozampieri.com.br/vencedores', '_blank')}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Lista de Vencedores
            </Button>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="text-center space-y-8 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Garanta sua vaga em 2026 em menos de 5 minutos
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Aproveite o <strong>maior desconto agora mesmo</strong> e concorra aos prêmios exclusivos!
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-6 h-auto shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                onClick={() => window.open('https://rematriculas.colegiozampieri.com.br', '_blank')}
              >
                <Crown className="w-6 h-6 mr-3" />
                Quero garantir minha vaga em 2026
              </Button>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                  <QrCode className="w-16 h-16 text-white" />
                </div>
                <p className="text-sm opacity-90">Escaneie para acessar</p>
              </div>
            </div>
            
            <p className="text-sm opacity-80 mt-6">
              ⚡ Processo 100% digital • Confirmação imediata • Suporte 24h
            </p>
          </div>
        </section>

        {/* Footer */}
        <section className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-6 w-6 text-blue-600" />
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-gray-800 mb-2">
            Colégio Zampieri
          </p>
          <p className="text-gray-600">
            Tradição, inovação e compromisso com o futuro do seu filho.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Campanha2026;