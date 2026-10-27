# Bateria de testes do jogo de palavras

## Objetivo

A suíte de testes foi criada para validar as regras centrais do mecanismo de jogo em [src/game-logic.js](../../src/game-logic.js) e evitar regressões em comportamentos como:

- normalização de palavras com acentos e caracteres especiais;
- avaliação das pistas de letras;
- limites de tentativas por dificuldade e formato;
- geração de desafios diários determinísticos;
- validação de palpites aceitos e rejeitados;
- regras de conclusão do desafio em modo dueto/quarteto.

## Arquivo de testes

Os testes estão em [tests/game-logic.test.js](../../tests/game-logic.test.js).

## Cobertura da bateria

### 1. Normalização de entradas

Valida que a função de normalização:

- converte letras para maiúsculas;
- remove acentos e símbolos extras;
- elimina espaços e outros caracteres irrelevantes;
- preserva o formato esperado para uso interno no jogo.

Exemplos cobertos:

- `Café` → `CAFE`
- `Água` → `AGUA`
- `música!!!` → `MUSICA`

### 2. Avaliação de letras

Confirma que a lógica de pistas distingue corretamente:

- letras corretas na posição certa;
- letras presentes em outra posição;
- letras ausentes da resposta.

Também cobre o caso de letras repetidas, que é um ponto crítico para evitar um comportamento inconsistente e falso positivo na interface.

### 3. Limites de tentativas

Verifica que o número de tentativas varia conforme:

- modo de jogo (`letters` ou `meaning`);
- formato (`solo`, `duet`, `quarteto`);
- dificuldade (`easy`, `normal`, `hard`).

Esse teste assegura que a regra de configuração não seja alterada por acidente ao evoluir a lógica do jogo.

### 4. Desafio diário

Assegura que o desafio gerado para uma data específica:

- é determinístico;
- mantém a mesma data e configuração;
- usa o modo e formato esperados;
- expõe uma lista de respostas possíveis;
- define palavras de cinco letras e limites adequados.

### 5. Validação de palpites

Valida o comportamento de `isAllowedGuess`, incluindo:

- palavras aceitas quando fazem parte do dicionário;
- palavras rejeitadas quando têm tamanho incorreto;
- entradas inválidas com pontuação, símbolos ou caracteres estranhos;
- palavras fora do vocabulário permitido.

Esse conjunto é importante porque o jogo precisa impedir entradas inválidas sem desperdiçar uma tentativa de forma injusta.

### 6. Pool de respostas e dicas

Confere que:

- o conjunto de respostas está disponível para o jogo;
- o dicionário carregado contém valores válidos;
- a quantidade de dicas por dificuldade segue a regra esperada.

### 7. Conclusão do desafio

Garante que o progresso do jogo seja calculado corretamente em cenários de múltiplos alvos, como dueto e quarteto:

- uma palavra resolvida conta como concluída;
- o desafio só termina quando todos os alvos forem resolvidos;
- um conjunto vazio ou incompleto de palpites não pode ser tratado como vitorioso.

## Como executar

No terminal, dentro da pasta do projeto, execute:

```bash
npm test -- --test-reporter=spec
```

## Evidência de validação

A bateria foi executada com sucesso e o resultado foi:

- 8 testes encontrados;
- 8 testes aprovados;
- 0 falhas.

Isso confirma que a lógica principal do jogo está estável e que a correção de validação de palpites foi reforçada por um teste automatizado.

## Benefícios

A presença dessa bateria melhora a manutenção do projeto ao:

- detectar regressões rapidamente;
- proteger a lógica de regras do jogo;
- facilitar a evolução do sistema com mais segurança;
- documentar o comportamento esperado em código executável.
