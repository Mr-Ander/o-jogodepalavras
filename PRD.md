# Jogo de Palavras

## PRD - Versao inicial

**Status:** rascunho para validacao
**Data:** 13 de outubro de 2026

## Resumo

Jogo casual para navegador, em portugues brasileiro, no qual adolescentes e adultos jovens podem descobrir palavras por pistas de letras ou por associacao de significado. O produto oferece desafios diarios, niveis de dificuldade, arquivo de desafios e partidas compartilhadas por link. O jogo sera gratuito, com anuncios discretos.

## Visao do produto

Oferecer partidas curtas e acessiveis que sejam faceis de iniciar, interessantes em diferentes niveis de habilidade e divertidas de comparar com amigos.

**Hipotese de diferencial:** combinar dois modos de descoberta de palavras em portugues brasileiro, com dificuldade ajustavel e desafios que podem ser enviados diretamente a amigos.

## Publico e plataforma

- Publico inicial: adolescentes e adultos jovens. A faixa etaria exata ainda precisa ser definida.
- Idioma: portugues brasileiro.
- Plataforma: navegador, com layout responsivo para celular e desktop.
- Conta: nao deve ser obrigatoria para iniciar uma partida. Progresso local no navegador e a opcao inicial.

## Objetivos

- Permitir que a pessoa comece a jogar sem cadastro e entenda as regras rapidamente.
- Oferecer dois modos distintos, com dificuldade adequada a diferentes niveis de vocabulario.
- Criar desafios diarios que possam ser retomados no arquivo e compartilhados por link.
- Permitir comparacao justa entre amigos que joguem o mesmo desafio.
- Manter o acesso gratuito sem interromper uma partida com anuncios.

## Fora do escopo inicial

- Aplicativos nativos para Android ou iOS.
- Partidas multiplayer em tempo real.
- Ranking global ou cadastro obrigatorio.
- Outros idiomas alem do portugues brasileiro.

## Modos de jogo

### Letras

Inspirado na mecanica de Termo: descobrir uma palavra de cinco letras em um numero limitado de tentativas.

- A dificuldade normal permite seis tentativas.
- A dificuldade facil permite oito tentativas e prioriza palavras comuns.
- A dificuldade dificil permite cinco tentativas e pode usar palavras menos comuns.
- Apos cada palpite, as letras indicam se estao na posicao correta, aparecem em outra posicao ou nao aparecem na resposta.
- A cor nunca sera o unico indicador: cada estado tambem tera um sinal textual ou visual acessivel.
- As regras para letras repetidas devem ser consistentes e explicadas na primeira partida.

#### Formatos compartilhados

- **Solo:** um tabuleiro e um alvo.
- **Dueto:** dois alvos simultaneos; cada palpite valido e aplicado aos dois tabuleiros e conta como uma unica tentativa compartilhada.
- **Quarteto:** quatro alvos simultaneos, com o mesmo sistema de palpites compartilhados.
- Quando um alvo e resolvido, seu tabuleiro fica marcado como concluido e deixa de receber novos palpites; os demais continuam ativos.
- O limite de tentativas varia por formato e dificuldade:

| Dificuldade | Solo | Dueto | Quarteto |
| --- | ---: | ---: | ---: |
| Facil | 8 | 9 | 10 |
| Normal | 6 | 7 | 9 |
| Dificil | 5 | 6 | 8 |

- A partida termina quando todos os alvos forem resolvidos ou quando as tentativas compartilhadas acabarem; nesse caso, as respostas restantes sao reveladas.

### Significados

Descobrir uma palavra secreta digitando palpites e recebendo um indicador numerico de proximidade semantica. As tentativas sao ilimitadas.

- A dificuldade varia conforme a familiaridade da resposta e a quantidade de dicas disponivel.
- Proposta inicial: facil oferece ate tres dicas, normal oferece uma e dificil nao oferece dicas.
- O jogo deve aceitar palavras em portugues brasileiro e explicar de forma breve o que o indicador de proximidade representa.
- A viabilidade e a qualidade do ranking semantico em portugues brasileiro precisam ser validadas antes da implementacao deste modo.

## Desafios, arquivo e compartilhamento

- Ha um desafio diario por modo, formato de tabuleiro e nivel de dificuldade. Quem escolher a mesma data e combinacao recebe as mesmas respostas.
- Escolher outro modo, formato ou nivel pode levar a um desafio diferente no mesmo dia.
- Um link de desafio deve preservar data, modo, formato e dificuldade para que amigos joguem a mesma partida.
- O link e a tela de compartilhamento nao podem revelar a resposta antes de o destinatario jogar.
- O arquivo permite selecionar desafios anteriores por data, modo e dificuldade.
- Partidas do arquivo e desafios recebidos por link nao alteram a sequencia diaria.
- Uma sequencia diaria e mantida separadamente por modo, formato e dificuldade.
- A comparacao compartilhada apresenta o resultado sem spoiler, incluindo tentativas usadas ou desempenho no ranking.

## Progressao e estatisticas

- Salvar localmente partidas concluidas, vitorias, distribuicao de tentativas e sequencias por modo, formato e dificuldade.
- Jogar um desafio antigo nao altera a sequencia atual.
- Abrir um desafio compartilhado permite comparar o resultado com o da pessoa que enviou o link.
- Limpar dados do navegador pode apagar o progresso local; essa limitacao deve ser comunicada antes do lancamento.

## Monetizacao e privacidade

- O jogo e gratuito.
- Anuncios devem ser discretos, nao interromper partidas e nao cobrir o teclado ou as pistas.
- Direcao inicial: anuncios contextuais ou nao personalizados, sem exigir cadastro para jogar.
- O publico inclui adolescentes; coleta de dados, publicidade e eventual personalizacao de anuncios devem passar por validacao de privacidade e requisitos legais antes do lancamento.
- Links de desafio devem carregar apenas os dados necessarios para reproduzir a partida, sem incluir informacoes pessoais.

## Acessibilidade e usabilidade

- Funcionar em telas pequenas e grandes, com interacao por toque e teclado.
- Oferecer texto, simbolos ou formas alem de cores para comunicar as pistas.
- Identificar estados das letras para leitores de tela e manter foco de teclado visivel.
- Manter contraste legivel e permitir que a partida seja retomada apos recarregar a pagina.
- Explicar as regras sem exigir que a pessoa consulte uma pagina externa.

## Requisitos funcionais e criterios de aceite

1. **Escolher modo e formato:** a pessoa consegue selecionar Letras ou Significados; em Letras, pode escolher Solo, Dueto ou Quarteto, alem da dificuldade.
2. **Validar palpites:** o modo Letras rejeita entradas que nao atendam ao comprimento ou ao vocabulario permitido e comunica o motivo sem perder uma tentativa.
3. **Revelar pistas:** cada palpite valido atualiza o tabuleiro ou todos os tabuleiros ativos e comunica os estados das letras por mais de uma modalidade visual.
4. **Concluir partidas:** vitoria ou derrota revela a resposta e oferece acesso ao resultado e ao compartilhamento.
5. **Reproduzir desafio compartilhado:** abrir um link carrega o mesmo desafio, modo, formato e dificuldade, sem expor as respostas antes do fim.
6. **Consultar arquivo:** a pessoa consegue abrir desafios anteriores por data, modo e dificuldade.
7. **Persistir progresso:** partidas e estatisticas permanecem disponiveis no mesmo navegador apos recarregar a pagina.
8. **Exibir anuncios:** anuncios nao interrompem a partida nem bloqueiam controles essenciais.

## Metricas iniciais

As metricas abaixo sao propostas para avaliacao, nao metas de desempenho ja validadas:

- Percentual de partidas iniciadas que chegam a um resultado.
- Taxa de vitoria por modo e dificuldade.
- Retorno ao desafio diario no dia seguinte e na semana seguinte.
- Quantidade de desafios compartilhados e proporcao de links que iniciam uma partida.
- Abandono por modo, dificuldade e etapa da partida.

Dados analiticos devem ser minimizados e avaliados com os requisitos de privacidade do publico-alvo. Benchmarks gerais de jogos mobile nao devem ser tratados como metas diretas para um jogo de navegador.

## Riscos e validacoes

- **Dicionario:** definir lista de respostas e lista de palpites aceitos; revisar acentos, flexoes, regionalismos e palavras potencialmente ofensivas.
- **Dificuldade:** testar se familiaridade das palavras e limites de tentativas produzem niveis realmente distintos sem frustrar iniciantes.
- **Dueto e Quarteto:** testar o equilibrio dos limites compartilhados, a legibilidade de dois e quatro tabuleiros e o congelamento correto de cada alvo resolvido.
- **Modo semantico:** validar ranking, cobertura lexical e explicabilidade para portugues brasileiro; o modo nao deve ser anunciado como pronto antes dessa validacao.
- **Desafios diarios:** garantir que a mesma combinacao de data, modo e dificuldade gere sempre a mesma partida, inclusive quando aberta por link.
- **Publicidade para adolescentes:** revisar faixa etaria, consentimento, coleta de dados e formatos de anuncio com orientacao juridica adequada.
- **Compartilhamento:** impedir spoilers e testar links em navegadores e dispositivos diferentes.

## Referencias de pesquisa

- New York Times Help Center, [Wordle](https://help.nytimes.com/24611727334932-Wordle): regras do formato classico.
- [Termo Dueto](https://term.ooo/2/) e [Termo Quarteto](https://term.ooo/4/): referencia de tabuleiros simultaneos com palpites compartilhados.
- Dixon et al., [Using “Wordle” to assess the effects of goal gradients and near-misses](https://doi.org/10.1038/s41598-024-74450-0), *Scientific Reports*, 2024: resposta emocional a pistas de aproximacao e resultados frustrantes.
- Andrew Deck, [World Wide Wordle: What it takes to bring the viral game into other languages](https://restofworld.org/2022/wordle-viral-turkish-japanese-tamil-portuguese/), *Rest of World*, 2022: desafios de adaptacao linguistica, incluindo acentos e conjugacoes em portugues.
- [Contexto](https://contexto.games/): exemplo de jogo semantico com ranking de proximidade, desafios diarios, modo ilimitado e arquivo.
- GameAnalytics, [Mobile gaming benchmarks for Q1 2024](https://www.gameanalytics.com/reports/mobile-games-benchmarks-q1-2024): referencia de retencao e sessoes em jogos mobile, com aplicabilidade limitada ao produto proposto.
- W3C, [WCAG 2.2 - Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html): informacao nao deve depender somente de cor.

## Decisoes ainda abertas

- Faixa etaria exata e requisitos de conta, consentimento e privacidade associados.
- Lista e fonte do vocabulario brasileiro para respostas e palpites.
- Quantidade final de dicas por dificuldade no modo Significados.
- Fonte/modelo semantico, desempenho e custo operacional do modo Significados.
- Posicionamento e frequencia dos anuncios.
- Se estatisticas serao exclusivamente locais ou sincronizadas entre dispositivos.
- Metas numericas para as metricas apos testes com jogadores.