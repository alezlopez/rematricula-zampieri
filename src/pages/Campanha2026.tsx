import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { CalendarDays, Gift, Trophy, Users, CheckCircle, Star, Clock, Zap, Crown, Sparkles } from 'lucide-react';

const Campanha2026 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-amber-400/10 to-red-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative z-10">
            <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-lg px-8 py-3 mb-6 shadow-lg">
              <Crown className="w-5 h-5 mr-2" />
              Campanha de Rematrículas 2026
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500 bg-clip-text text-transparent leading-tight mb-6">
              Colégio Zampieri
            </h1>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-amber-50 px-8 py-4 rounded-2xl border border-amber-200 mb-8">
              <Sparkles className="w-6 h-6 text-amber-600" />
              <p className="text-xl font-semibold text-amber-800">
                46 anos de tradição e inovação
              </p>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
              Esta é a <strong className="text-emerald-700">maior campanha de rematrículas</strong> de nossa história
            </p>
            
            {/* Alert Box */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl max-w-3xl mx-auto shadow-xl mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Clock className="w-6 h-6" />
                <p className="text-lg font-bold">ATENÇÃO: OFERTA POR TEMPO LIMITADO!</p>
              </div>
              <p className="text-lg">
                Quanto <strong>mais cedo</strong> você fizer a rematrícula, <strong>maior o desconto</strong> e <strong>mais números da sorte</strong> para ganhar prêmios incríveis!
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-emerald-100 text-emerald-800 text-sm px-6 py-2 border border-emerald-200">
                <Zap className="w-4 h-4 mr-2" />
                Descontos até 60%
              </Badge>
              <Badge className="bg-amber-100 text-amber-800 text-sm px-6 py-2 border border-amber-200">
                <Gift className="w-4 h-4 mr-2" />
                Prêmios Exclusivos
              </Badge>
              <Badge className="bg-red-100 text-red-800 text-sm px-6 py-2 border border-red-200">
                <Trophy className="w-4 h-4 mr-2" />
                Ranking de Turmas
              </Badge>
            </div>
          </div>
        </section>

        {/* Why Guarantee Now */}
        <section className="text-center space-y-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
              Por que garantir agora?
            </h2>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-amber-50 p-8 rounded-3xl border border-emerald-100 max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed">
              Este é o momento para você garantir a vaga do seu filho com <strong className="text-emerald-700">descontos exclusivos</strong>, 
              <strong className="text-amber-700"> prêmios individuais</strong> e <strong className="text-red-600">coletivos</strong>. 
            </p>
            <p className="text-lg text-gray-600 mt-4">
              Quanto antes você se antecipar, <strong className="text-emerald-700">maiores serão os benefícios!</strong>
            </p>
          </div>
        </section>

        {/* Discounts Section */}
        <section className="space-y-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full">
              <CalendarDays className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent text-center">
              Descontos por Lotes
            </h2>
          </div>
          
          <div className="text-center mb-12">
            <p className="text-2xl font-bold text-gray-800 mb-4">
              🚀 Antecipe-se e conquiste os <span className="text-emerald-700">melhores benefícios!</span>
            </p>
            <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-200 p-6 rounded-2xl max-w-2xl mx-auto">
              <p className="text-lg font-semibold text-red-700">
                ⏰ Quanto mais cedo, MAIOR o desconto e MAIS números da sorte!
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* BEST OPTION - 60% */}
            <Card className="relative overflow-hidden border-4 border-emerald-500 shadow-2xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100">
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 text-sm font-bold rounded-bl-2xl shadow-lg">
                <Crown className="w-4 h-4 inline mr-1" />
                MELHOR OFERTA
              </div>
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full animate-pulse">
                URGENTE!
              </div>
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-3xl font-bold text-emerald-700 mb-2">60% OFF</CardTitle>
                <p className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">25/08 a 10/09</p>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">60%</div>
                <p className="text-lg font-semibold text-emerald-700">MAIOR DESCONTO</p>
                <Badge className="bg-amber-500 text-white text-sm px-4 py-2">
                  <Star className="w-4 h-4 mr-1" />
                  4 números da sorte
                </Badge>
                <div className="pt-2">
                  <p className="text-xs text-emerald-600 font-medium">🎯 Máximas chances de ganhar!</p>
                </div>
              </CardContent>
            </Card>

            {/* 50% OFF */}
            <Card className="relative overflow-hidden border-2 border-amber-400 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-amber-50 to-amber-100">
              <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 text-xs font-bold rounded-full">
                2ª MELHOR
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-amber-700">50% OFF</CardTitle>
                <p className="text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">11 a 20/09</p>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-5xl font-bold text-amber-600">50%</div>
                <p className="text-base font-semibold text-amber-700">Ainda muito bom!</p>
                <Badge className="bg-amber-400 text-white text-sm px-3 py-2">
                  + 3 números da sorte
                </Badge>
              </CardContent>
            </Card>

            {/* 40% OFF */}
            <Card className="hover:shadow-lg transition-shadow border border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-orange-700">40% OFF</CardTitle>
                <p className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">21 a 30/09</p>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-4xl font-bold text-orange-600">40%</div>
                <p className="text-sm text-orange-700">Boa oportunidade</p>
                <Badge className="bg-orange-400 text-white text-sm px-3 py-2">
                  + 2 números da sorte
                </Badge>
              </CardContent>
            </Card>

            {/* 30% OFF */}
            <Card className="hover:shadow-lg transition-shadow border border-red-300 bg-gradient-to-br from-red-50 to-red-100">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-red-700">30% OFF</CardTitle>
                <p className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full">Outubro (01 a 31/10)</p>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-4xl font-bold text-red-600">30%</div>
                <p className="text-sm text-red-700">Últimas chances</p>
                <Badge className="bg-red-400 text-white text-sm px-3 py-2">
                  + 1 número da sorte
                </Badge>
              </CardContent>
            </Card>

            {/* 25% OFF */}
            <Card className="hover:shadow-lg transition-shadow border border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 md:col-span-2 lg:col-span-1">
              <div className="absolute top-2 right-2 bg-gray-500 text-white px-3 py-1 text-xs font-bold rounded-full">
                ÚLTIMA CHANCE
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-700">25% OFF</CardTitle>
                <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Novembro</p>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-4xl font-bold text-gray-600">25%</div>
                <p className="text-sm text-gray-700">Menor desconto</p>
                <Badge className="bg-gray-400 text-white text-sm px-3 py-2">
                  + 1 número da sorte
                </Badge>
              </CardContent>
            </Card>
          </div>
          
          {/* Call to Action para a seção de descontos */}
          <div className="text-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4">🎯 Não perca a oportunidade!</h3>
            <p className="text-lg mb-6">
              Garante JÁ o <strong>maior desconto (60%)</strong> e <strong>4 números da sorte</strong> para concorrer aos prêmios incríveis!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge className="bg-white text-emerald-700 text-lg px-6 py-3 font-bold">
                ⏰ Oferta válida até 10/09
              </Badge>
              <Badge className="bg-amber-500 text-white text-lg px-6 py-3 font-bold">
                🏆 Mais números = Mais chances
              </Badge>
            </div>
          </div>
        </section>

        {/* Individual Prizes */}
        <section className="space-y-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Gift className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-center">Sorteios Individuais</h2>
          </div>
          <p className="text-center text-lg text-muted-foreground mb-8">
            Ao efetivar a rematrícula, você recebe <strong>números da sorte</strong> e participa automaticamente dos sorteios finais
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Kit Material Didático 2026</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Material completo para o ano letivo
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Kit Uniforme Oficial</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Uniforme completo do colégio
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Mochila Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mochila de alta qualidade
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center bg-accent/20 p-6 rounded-lg">
            <p className="text-lg font-semibold">
              Quanto antes você rematricular, <span className="text-primary">mais números acumula</span> e <span className="text-primary">mais chances tem de ganhar</span>!
            </p>
          </div>
        </section>

        {/* Class Ranking */}
        <section className="space-y-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Trophy className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-center">Ranking de Turmas</h2>
          </div>
          <p className="text-center text-lg text-muted-foreground mb-8">
            As turmas com mais alunos rematriculados de cada mês recebem <strong>prêmios exclusivos</strong>
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-yellow-500/10 rounded-full w-fit">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-xl text-yellow-600">Setembro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Bolsa Personalizada</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-gray-400/10 rounded-full w-fit">
                  <Trophy className="h-8 w-8 text-gray-600" />
                </div>
                <CardTitle className="text-xl text-gray-600">Outubro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Caderno e caneta personalizados</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-orange-500/10 rounded-full w-fit">
                  <Trophy className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-orange-600">Novembro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Garrafa Personalizada</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-4 bg-white/20 rounded-full">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">Como fazer a rematrícula?</h2>
            </div>
            <div className="space-y-6 mb-8">
              <p className="text-xl max-w-2xl mx-auto">
                É <strong>rápido</strong>, <strong>prático</strong> e <strong>100% on-line</strong>
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="font-bold text-lg mb-2">1. Acesse</h3>
                  <p className="text-sm opacity-90">Clique no botão abaixo</p>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="text-3xl mb-3">✏️</div>
                  <h3 className="font-bold text-lg mb-2">2. Preencha</h3>
                  <p className="text-sm opacity-90">Dados rápidos e simples</p>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="font-bold text-lg mb-2">3. Confirme</h3>
                  <p className="text-sm opacity-90">Garanta sua vaga!</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xl px-16 py-8 h-auto shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 border-2 border-amber-400"
                onClick={() => window.location.href = '/'}
              >
                <Zap className="w-6 h-6 mr-3" />
                🚀 GARANTIR REMATRÍCULA AGORA
              </Button>
              <p className="text-sm opacity-80">⚡ Processo 100% digital • Confirmação imediata</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="text-center py-16 bg-gradient-to-r from-emerald-50 via-white to-amber-50 rounded-3xl border border-emerald-100">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="h-8 w-8 text-amber-600" />
            <Sparkles className="h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-amber-600 bg-clip-text text-transparent mb-4">
            Colégio Zampieri
          </p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            <strong>46 anos de tradição, inovação e compromisso</strong> com o futuro do seu filho.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Campanha2026;