import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const RegulamentoCampanha2026 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="p-8 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
            Regulamento da campanha de rematrícula 2026
          </h1>

          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-6 pr-4">
              <section>
                <h2 className="text-xl font-bold mb-3 text-primary">REGULAMENTO DE APURAÇÃO</h2>
                <p className="text-lg font-semibold mb-4">Campanha de Rematrícula 2026 — Colégio Zampieri</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-3">1. Informações gerais</h3>
                <p className="mb-3">
                  A Campanha de Rematrícula 2026 iniciau-se em 25 de agosto de 2025 e termina em 30 de novembro de 2025, às 23h59.
                </p>
                <p className="mb-3">
                  Cada aluno que realiza a rematrícula recebe entre 1 e 4 números da sorte, conforme o lote em que realizou o processo. Os períodos e quantidades de números distribuídos estão publicados em:
                  <br />
                  <a href="/campanha2026" className="text-primary hover:underline">rematriculas.colegiozampieri.com.br/campanha2026</a>
                </p>
                <p className="mb-3">
                  Cada número da sorte possui 6 dígitos e nenhum número é repetido.
                </p>
                <p>
                  A apuração dos prêmios utilizará os resultados da Loteria Federal do dia 03/12, e a divulgação oficial ocorrerá no dia 04/12 na página da campanha, na página de transparência e no Instagram.
                </p>
              </section>

              <div className="border-t my-6" />

              <section>
                <h3 className="text-lg font-bold mb-3">2. Regras sobre participação e prêmios</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Um aluno pode ter até quatro números da sorte, mas só pode ganhar um prêmio.</li>
                  <li>Caso um dos números de um aluno já premiado seja identificado como vencedor de outro prêmio, esse número é desconsiderado, e o prêmio passa a ser definido pela regra de proximidade, entre os demais participantes.</li>
                  <li>Isso garante que os três prêmios serão distribuídos a alunos distintos, independentemente da quantidade de números sorteados.</li>
                </ol>
              </section>

              <div className="border-t my-6" />

              <section>
                <h3 className="text-lg font-bold mb-3">3. Premiação e extrações utilizadas</h3>
                <p className="mb-3">A determinação dos vencedores segue esta ordem:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li><strong>1º Prêmio — Kit de Material Didático SAE DIGITAL 2026</strong><br />Baseado no 1º prêmio da Loteria Federal.</li>
                  <li><strong>2º Prêmio — Kit de Uniforme Escolar</strong><br />Baseado no 2º prêmio da Loteria Federal.</li>
                  <li><strong>3º Prêmio — Mochila Premium Personalizada</strong><br />Baseado no 3º prêmio da Loteria Federal.</li>
                </ol>
                <p className="mt-3">
                  Após definido o vencedor do primeiro prêmio, seus demais números não participam dos critérios de decisão dos prêmios seguintes.
                </p>
              </section>

              <div className="border-t my-6" />

              <section>
                <h3 className="text-lg font-bold mb-3">4. Critérios oficiais de apuração</h3>
                <p className="mb-3 italic">(Usados nesta ordem — sempre)</p>

                <div className="mb-6">
                  <h4 className="font-bold mb-2">4.1. Primeiro critério — coincidência da centena (3 últimos dígitos)</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Consideramos os 3 últimos dígitos do número sorteado pela Loteria Federal.</li>
                    <li>Buscamos os números da sorte que terminam com esses mesmos 3 dígitos.</li>
                  </ul>
                  <p className="mt-3 mb-2 font-semibold">Resultados possíveis:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Se somente um número termina com esses 3 dígitos → ele vence.</li>
                    <li>Se mais de um número termina com esses 3 dígitos → aplicar o desempate (item 4.3).</li>
                    <li>Se o número vencedor pertencer ao aluno já premiado, ele é desconsiderado e aplicamos o critério de proximidade (item 4.2).</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold mb-2">4.2. Segundo critério — diferença absoluta (proximidade)</h4>
                  <p className="mb-2">Esse critério é aplicado:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>quando nenhum número da sorte tem centena idêntica;</li>
                    <li>ou quando o número vencedor pertencer a um aluno já premiado;</li>
                    <li>ou quando o aluno com centena idêntica não pode ganhar novamente.</li>
                  </ul>
                  <p className="mt-3 mb-2 font-semibold">Passos:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Calculamos a diferença absoluta entre a centena sorteada e a centena de cada número da sorte válido (ou seja, de alunos ainda não premiados).</li>
                    <li>Identificamos a menor diferença absoluta.</li>
                  </ol>
                  <p className="mt-3 mb-2 font-semibold">Resultados possíveis:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Se houver apenas um número com a menor diferença → ele é o vencedor.</li>
                    <li>Se houver mais de um número com a mesma menor diferença → aplicamos o desempate (item 4.3).</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold mb-2">4.3. Terceiro critério — desempate por comparação dígito a dígito</h4>
                  <p className="mb-2 italic">(da direita para a esquerda)</p>
                  <p className="mb-2">Se houver empate pela centena ou pela diferença absoluta:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Comparamos os números empatados dígito a dígito, começando pelo último (unidade).</li>
                    <li>Se iguais, comparamos o segundo dígito, e assim por diante.</li>
                    <li>O número que tiver o maior dígito na primeira posição onde houver diferença é declarado vencedor.</li>
                  </ol>
                </div>
              </section>

              <div className="border-t my-6" />

              <section>
                <h3 className="text-lg font-bold mb-3">5. Exemplos práticos</h3>
                <p className="mb-4 italic">(Usando como referência o 1º prêmio da Loteria Federal)</p>
                
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="font-semibold">Número sorteado (1º prêmio): 345876</p>
                  <p className="font-semibold">Centena sorteada: 876</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold mb-2">Exemplo A — centena idêntica com vencedor único</h4>
                    <p className="mb-2">Número da sorte: <span className="font-mono font-bold">122876</span></p>
                    <p className="mb-2">Termina com 876.</p>
                    <p className="mb-2"><strong>Vencedor: 122876</strong></p>
                    <p className="italic">Explicação simples: o número termina igual ao da Loteria.</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold mb-2">Exemplo B — dois números com centena idêntica</h4>
                    <p className="mb-2">Números da sorte:</p>
                    <ul className="list-disc list-inside ml-4 mb-2">
                      <li><span className="font-mono">321876</span></li>
                      <li><span className="font-mono">987876</span></li>
                    </ul>
                    <p className="mb-3">Ambos terminam com 876 → aplicar desempate.</p>
                    <p className="mb-2 font-semibold">Desempate:</p>
                    <ol className="list-decimal list-inside ml-4 mb-2">
                      <li>Último dígito: 6 e 6 → iguais</li>
                      <li>Penúltimo dígito: 7 e 7 → iguais</li>
                      <li>Terceiro dígito: 8 e 8 → iguais</li>
                      <li>Quarto dígito: 1 e 7 → 7 é maior</li>
                    </ol>
                    <p className="mb-2"><strong>Vencedor: 987876</strong></p>
                    <p className="italic">Explicação simples: comparamos os números de trás para frente até achar diferença.</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold mb-2">Exemplo C — nenhuma centena igual; vence a menor diferença absoluta</h4>
                    <p className="mb-2">Centena sorteada: 876</p>
                    <p className="mb-2">Participante: <span className="font-mono">094875</span></p>
                    <p className="mb-2">Diferença: |876 − 875| = 1</p>
                    <p className="mb-2"><strong>Vencedor: 094875</strong>, caso nenhum outro número possua diferença menor que 1.</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold mb-2">Exemplo D — empate na diferença absoluta</h4>
                    <p className="mb-2">Centena sorteada: 876</p>
                    <p className="mb-2">Participantes:</p>
                    <ul className="list-disc list-inside ml-4 mb-2">
                      <li><span className="font-mono">011875</span> → diferença = 1</li>
                      <li><span className="font-mono">222877</span> → diferença = 1</li>
                    </ul>
                    <p className="mb-2 font-semibold">Aplicando o desempate:</p>
                    <p className="mb-2">Último dígito: 5 e 7 → 7 é maior</p>
                    <p className="mb-2"><strong>Vencedor: 222877</strong></p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold mb-2">Exemplo E — número da centena igual pertence a aluno já premiado</h4>
                    <p className="mb-2">Suponha:</p>
                    <ol className="list-decimal list-inside ml-4 mb-2">
                      <li>Para o 1º prêmio, o aluno João venceu com o número <span className="font-mono">987876</span>.</li>
                      <li>João possui outro número: <span className="font-mono">555876</span>, que termina com 876.</li>
                      <li>O 2º prêmio da Loteria Federal é <span className="font-mono">128876</span> → centena 876.</li>
                      <li>João voltaria a vencer pela regra da centena.</li>
                    </ol>
                    <p className="mb-3">Como João já ganhou, esse número é desconsiderado.</p>
                    <p>Aplicamos então a regra da diferença absoluta entre os demais participantes, até que um vencedor válido seja encontrado.</p>
                  </div>
                </div>
              </section>

              <div className="border-t my-6" />

              <section>
                <h3 className="text-lg font-bold mb-3">6. Divulgação dos resultados</h3>
                <p className="mb-3">No dia 04/12, serão publicados:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                  <li>os números sorteados pela Loteria Federal (1º, 2º e 3º prêmios);</li>
                  <li>os vencedores;</li>
                  <li>a justificativa completa da apuração de cada prêmio;</li>
                  <li>a tabela de cálculos (centena, diferenças e desempates).</li>
                </ul>
                <p className="mb-2 font-semibold">Canais oficiais:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Página da campanha</li>
                  <li>Página de transparência</li>
                  <li>Instagram</li>
                  <li>Comunicação direta via WhatsApp para os vencedores</li>
                </ul>
              </section>
            </div>
          </ScrollArea>
        </Card>
      </main>
    </div>
  );
};

export default RegulamentoCampanha2026;
