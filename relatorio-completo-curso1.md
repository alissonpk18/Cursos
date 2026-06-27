# Relatório Completo — Curso 1: Organizar Dados com IA

**Plataforma:** Farol · IA para Pequenos Negócios
**Pasta:** `Base de Conhecimento/`
**Data do relatório:** 27 de junho de 2026
**Escopo:** Visão completa do curso — estrutura, conteúdo, mecânica de progressão, implementação técnica e avaliação pedagógica.

---

## 1. Identificação

| Campo | Valor |
|---|---|
| ID interno | `curso1` |
| Título | Organizar Dados com IA |
| Subtítulo | Crie um assistente inteligente com as informações do seu negócio |
| Ícone / cor | 📚 · `#4f7cff` |
| Carga horária declarada | 4 horas |
| Nº de módulos | 4 |
| Ferramenta ensinada | NotebookLM (Google) — gratuita |
| Pré-requisitos | Nenhum (curso de entrada da trilha) |
| Conceito central | Assistente com Dados (RAG — *Retrieval-Augmented Generation*) |

---

## 2. Objetivo e público-alvo

**Objetivo:** levar um iniciante absoluto do conceito até a prática de criar um assistente de IA que responde com base nos documentos do próprio negócio.

**Público-alvo:** dono(a) ou gestor(a) de pequeno/médio negócio, sem conhecimento técnico, que quer:
1. Carregar documentos da empresa como fonte para a IA
2. Fazer perguntas sobre esses documentos
3. (Desejável) criar conteúdo e gerar áudio/podcast com o Estúdio do NotebookLM

**Entregável final do aluno:** um caderno no NotebookLM, alimentado com 3–10 documentos reais, validado e registrado na plataforma.

---

## 3. Estrutura dos módulos

| # | ID | Título | Tipo | Tempo | Critério de conclusão |
|---|----|--------|------|-------|------------------------|
| 1 | `c1m1` | Seu Assistente Inteligente | leitura | 6 min | Ler e marcar como lido |
| 2 | `c1m2` | Primeiros Passos na Ferramenta | leitura | 8 min | Completar o passo a passo (marcar) |
| 3 | `c1m3` | Enviando seus Arquivos | checklist | 7 min | Marcar os 5 itens do checklist |
| 4 | `c1m4` | Testando o Assistente | validação | 6 min | Colar um link válido do NotebookLM |

Progressão **sequencial e bloqueada**: cada módulo só abre depois que o anterior é concluído (overlay de “Módulo Bloqueado” caso o aluno tente pular).

---

## 4. Detalhamento por módulo

### Módulo 1 — O que é Assistente com Dados (leitura · 6 min)
- **Conteúdo:** gancho (“IA dá resposta genérica porque não conhece seu negócio”); analogia do *consultor com uma pasta de documentos*; comparativo lado a lado (IA sem dados × com dados); explicação dos 3 passos do RAG (buscar → juntar → responder); benefícios; mito comum (“não deixa a IA mais inteligente, mas mais informada”); resumão e FAQ.
- **Mecânica:** botão “Marcar como lido ✓” → `Farol.marcarModuloConcluido("curso1","c1m1")`. Reabertura mostra estado “Concluído”.
- **Qualidade:** linguagem excelente, zero jargão, analogia memorável.

### Módulo 2 — Configurando o NotebookLM (leitura/prática · 8 min)
- **Conteúdo:** o que é o NotebookLM e por que difere do ChatGPT comum; pré-requisitos (conta Google); passo a passo de criação do caderno (4 passos); dica “um caderno por assunto”; erros comuns; resumão e FAQ.
- **Mecânica:** botão “Marcar como concluído ✓” (mesma mecânica do módulo 1).
- **Observação pedagógica:** não antecipa que o NotebookLM gera briefings/áudio (oportunidade de melhoria — ver §8).

### Módulo 3 — Upload de Fontes (checklist · 7 min)
- **Conteúdo:** princípio “documento bom entra, resposta boa sai”; que documentos subir (vendas, preços, contratos, financeiro); formatos aceitos (PDF, Google/Word, planilhas, texto colado, sites); passo a passo de upload; boas práticas (faça/evite).
- **Mecânica (a mais rica do curso):** checklist interativo de **5 itens** persistido individualmente via `Farol.definirFlag("curso1","ck_ckN", ...)`. O botão concluir só habilita quando os 5 estão marcados. Estado restaurado ao reabrir.
- **Qualidade:** melhor elemento de engajamento — transforma leitura em ação no produto real.

### Módulo 4 — Validação do Assistente (validação · 6 min · conclui o curso)
- **Conteúdo:** por que testar; “teste das 3 perguntas” (cita fonte? é específico? admite quando não sabe?); exemplos de perguntas, incluindo uma “pegadinha” para checar alucinação; sinais de OK × alerta; registro do link do NotebookLM; bloco de parabéns + ponte para o Curso 2.
- **Mecânica:** validação por **regex** do link — `^https?://notebooklm\.google\.com/notebook/[A-Za-z0-9_-]+`. Mensagens diferenciadas (domínio certo mas sem `/notebook/`, link inválido). Ao validar: grava flag `notebooklm`, conclui `c1m4`, revela seção “Parabéns”.
- **Qualidade:** exigir um link real é um filtro honesto de conclusão (evita “concluir sem fazer”).

---

## 5. Mecânica de progressão, versionamento e certificado

- **Bloqueio sequencial:** `farol-core.js` verifica, ao abrir `curso1-modN`, se `c1m(N-1)` está concluído; se não, exibe overlay de bloqueio.
- **Botão “próximo módulo inteligente”:** fica oculto/desabilitado até o módulo atual ser concluído, e vira “Revisar Módulo X” se o próximo já foi feito.
- **Versionamento de conteúdo (`farol-versao.js`):** cada módulo tem versão (todos em `1`). Se o conteúdo for atualizado e a versão incrementada, a conclusão do aluno é invalidada e ele precisa refazer — garante que o certificado reflita o conteúdo atual.
- **Certificado do curso:** disponível na página `curso1.html` quando os 4 módulos estão concluídos. Gerado 100% no navegador (Canvas), com nome, CPF (validado), data, código de verificação determinístico, frente e verso (ementa). Exige nome (≥2 letras) e **CPF válido** (dígitos verificadores conferidos).
- **Progresso:** persistido em `localStorage` (`farol:estado:v2`), por curso e global, refletido nas barras do índice e da página do curso.

---

## 6. Implementação técnica

| Item | Detalhe |
|---|---|
| Arquivos | `Base de Conhecimento/curso1.html` (landing) + `curso1-mod1..4.html` |
| Dependências de runtime | `farol-versao.js` (1º) e `farol-core.js` (2º) em toda página |
| Fontes externas | Google Fonts (Inter; Playfair Display no certificado) |
| Armazenamento | `localStorage` — `farol:estado:v2`, `farol:versoes:v1`, `farol:tema` |
| Acessibilidade | `aria-live` nos feedbacks, “Pular para o conteúdo”, respeito a `prefers-reduced-motion`, contraste e tema claro/escuro |
| Privacidade | Nenhum dado sai do navegador (LGPD); banner de cookies e modais de Termos/Privacidade |
| Dados pessoais | Nome e CPF coletados apenas na emissão do certificado, localmente |

---

## 7. Verificação técnica (estado atual)

Revisão de código recente do Curso 1 e do núcleo da plataforma:

- ✅ **Sem bugs abertos no Curso 1.** Os 4 módulos carregam e concluem corretamente.
- ✅ **Certificado do Curso 1 funciona:** `curso1` não possui módulo do tipo “certificado”, então não era afetado pelo *deadlock* de certificados corrigido recentemente em `farol-core.js`.
- ✅ Correções gerais já aplicadas e publicadas em `main` (PR #8): erro de sintaxe no Curso 3, deadlock dos certificados (Curso 5/programa), contagens fixas, CPF inválido no verso do certificado, self-XSS no Curso 4 e blindagem do `limpar.js`.
- ℹ️ A landing `curso1.html` traz fallback estático “Curso 1 de 6” (corrigido) e é ajustada dinamicamente pelo JS.

---

## 8. Avaliação pedagógica

**Nota geral: 7,5 / 10** (consolidada do relatório de avaliação SME).

### Pontos fortes
- **Linguagem e acessibilidade — excelente.** RAG explicado por analogia; tom direto, sem condescendência.
- **Onboarding prático — muito bom.** Criação de conta guiada (M2), checklist executável no produto (M3), validação por link real (M4).
- **Expectativas alinhadas.** “Documento bom entra, resposta boa sai” aparece cedo e é reforçado.
- **Segurança/privacidade.** FAQ responde às 3 objeções típicas de PME (custo, dados, cadastro).

### Lacunas (frente ao público-alvo)
1. **Estúdio do NotebookLM — não coberto.** Geração de briefings, FAQs, guias de estudo. *Impacto alto.*
2. **Áudio/Podcast (Audio Overview) — não coberto.** Recurso de maior “efeito uau”. *Impacto alto.*
3. **Apresentações (PPTX/Slides) — não listadas** entre os formatos do M3. *Impacto médio.*
4. **Ciclo de criação de conteúdo incompleto.** O curso para em “fazer perguntas”, antes de “criar entregáveis”.

---

## 9. Recomendações priorizadas

1. **Adicionar Módulo 5 (ou expandir o M4): “Criando com o Estúdio”** — briefing/FAQ/guia a partir das fontes.
2. **Trecho no M4: “Gerando seu Podcast”** — Audio Overview, com o momento de encantamento.
3. **Atualizar formatos no M3** — incluir “Apresentações (PowerPoint / Google Slides)”.
4. **Plantar expectativa no M2** — citar que o NotebookLM também gera documentos e áudio.

### Manter como está
- A analogia do “consultor com pasta” (M1).
- O checklist obrigatório (M3) — melhor elemento de engajamento.
- A validação por link real (M4).
- A FAQ de segurança/privacidade na landing.

---

## 10. Conclusão

O Curso 1 cumpre muito bem seu papel de porta de entrada: conduz um iniciante absoluto, em linguagem clara e com exigência honesta de conclusão, até montar e validar um assistente de IA com os dados do próprio negócio. Está **tecnicamente saudável** (sem bugs abertos, certificado funcional, privacidade local).

A principal alavanca de evolução é **cobrir o ciclo completo do NotebookLM** (Estúdio + Áudio + apresentações), que é exatamente onde o público-alvo passa a enxergar valor concreto — sem necessidade de desenvolver nada novo, apenas ensinando recursos que já existem na ferramenta.
