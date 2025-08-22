import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { CalendarDays, Gift, Trophy, Users, CheckCircle, Star } from 'lucide-react';

const Campanha2026 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <Badge variant="secondary" className="text-lg px-6 py-2 mb-4">
            🎓 Campanha de Rematrículas 2026
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
            Colégio Zampieri
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>46 anos de tradição e inovação</strong> - Esta é a maior campanha de rematrículas de nossa história
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Badge className="text-sm px-4 py-2">Descontos Exclusivos</Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">Prêmios Individuais</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Ranking de Turmas</Badge>
          </div>
        </section>

        {/* Why Guarantee Now */}
        <section className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <CheckCircle className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Por que garantir agora?</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Este é o momento para você garantir a vaga do seu filho com <strong>descontos exclusivos, prêmios individuais e coletivos</strong>. 
            Quanto antes você se antecipar, maiores serão os benefícios!
          </p>
        </section>

        {/* Discounts Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <CalendarDays className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-center">Descontos por Lotes</h2>
          </div>
          <p className="text-center text-lg text-muted-foreground mb-8">
            Antecipe-se e conquiste os <strong>melhores benefícios</strong>
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden border-2 border-primary shadow-lg">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-bold">
                MELHOR
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-primary">60% OFF</CardTitle>
                <p className="text-sm text-muted-foreground">25/08 a 10/09</p>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-4xl font-bold text-primary">60%</div>
                <p className="text-sm">de desconto na taxa</p>
                <Badge variant="secondary" className="text-xs">
                  + 4 números da sorte
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">50% OFF</CardTitle>
                <p className="text-sm text-muted-foreground">11 a 20/09</p>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-4xl font-bold text-primary">50%</div>
                <p className="text-sm">de desconto na taxa</p>
                <Badge variant="secondary" className="text-xs">
                  + 3 números da sorte
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">40% OFF</CardTitle>
                <p className="text-sm text-muted-foreground">21 a 30/09</p>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-4xl font-bold text-primary">40%</div>
                <p className="text-sm">de desconto na taxa</p>
                <Badge variant="secondary" className="text-xs">
                  + 2 números da sorte
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">30% OFF</CardTitle>
                <p className="text-sm text-muted-foreground">Outubro (01 a 31/10)</p>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-4xl font-bold text-primary">30%</div>
                <p className="text-sm">de desconto na taxa</p>
                <Badge variant="secondary" className="text-xs">
                  + 1 número da sorte
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">25% OFF</CardTitle>
                <p className="text-sm text-muted-foreground">Novembro</p>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-4xl font-bold text-primary">25%</div>
                <p className="text-sm">de desconto na taxa</p>
                <Badge variant="secondary" className="text-xs">
                  + 1 número da sorte
                </Badge>
              </CardContent>
            </Card>
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
        <section className="text-center space-y-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-12 rounded-2xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Como fazer a rematrícula?</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            É rápido, prático e <strong>100% on-line</strong>
          </p>
          
          <Button 
            size="lg" 
            className="text-lg px-12 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
            onClick={() => window.location.href = '/'}
          >
            👉 Clique aqui para garantir agora
          </Button>
        </section>

        {/* Footer */}
        <section className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            ✨ <strong>Colégio Zampieri</strong> – 46 anos de tradição, inovação e compromisso com o futuro do seu filho.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Campanha2026;