# Farol · Curso de IA para pequenos negócios

Plataforma de e-learning **100% client-side** que ensina, do zero e sem termos técnicos,
um pequeno negócio a usar IA na gestão. São **5 cursos** independentes, cada um com **4
módulos** curtos. Arquitetura **MPA** (Multi-Page Application) — cada página é isolada; o
progresso vive no `localStorage`.

## Como rodar

Abra **`index.html`** no navegador (dois cliques). Não há build, npm nem servidor — nem
para o jogo 3D, que usa um `<script>` clássico do Three.js (funciona via `file://`).

> A única dependência externa é o **Three.js**, carregado via CDN **apenas no módulo 3 do
> Curso 3** (o desafio 3D da curva ABC). Essa página precisa de internet na primeira carga;
> se faltar conexão ou WebGL, ela cai num modo alternativo que não trava o curso. Todo o
> resto funciona 100% offline.

## Para quem é

Donos e gestores de pequenos e médios negócios que querem usar IA de forma útil, **sem
saber programar** e sem instalar nada. A linguagem é do dia a dia e o caminho é guiado:
a home aponta sempre o próximo passo.

## Estrutura de arquivos

```
index.html                      App Shell / home — onboarding + trilha de cursos
farol-core.js                   Núcleo: estado (FSM), catálogo de cursos, navegação, tema, cabeçalho
farol.css                       Design system (dark-first glass) + componentes de conteúdo

Base de Conhecimento/           Curso 1 — montar um RAG no NotebookLM
  curso1.html                     Página do curso (mapa dos 4 módulos)
  curso1-mod1.html … mod4.html    Os 4 módulos
Engenharia de Prompt/           Curso 2 — system prompts que reduzem alucinação
Analisadores/                   Curso 3 — curva ABC e precificação (módulo 3 em 3D)
Integracao/                     Curso 4 — o ciclo diário de decisão com IA
Especificacao/                  Curso 5 — gerar a Spec + emitir certificado

aula1.html … aula5.html         Redirecionamentos da estrutura antiga → curso novo equivalente
```

Cada pasta de curso segue o mesmo padrão: `cursoN.html` (capa com o mapa dos módulos) +
`cursoN-modM.html` (os 4 módulos).

## Navegação e papéis

| Página | Papel |
|---|---|
| `index.html` | **Home**: ação principal adaptativa ("Começar"/"Continuar"), "como funciona", trilha numerada, dúvidas e ajustes |
| `cursoN.html` | **Capa do curso**: objetivo, o que vai aprender, progresso e mapa dos 4 módulos |
| `cursoN-modM.html` | **Módulo**: conteúdo didático + um critério de conclusão (leitura, quiz, checklist, 3D, gerador…) |

O cabeçalho (logo, % de progresso, tema claro/escuro) é injetado por `farol-core.js` em
todas as páginas, conforme o atributo `data-pagina` do `<body>`.

## Estado (FSM)

Chave `localStorage`: **`farol:estado:v2`** (versionada para migração futura). Há migração
automática do `v1` (estrutura antiga de curso único) na primeira carga.

```jsonc
{
  "versao": 2,
  "aluno": { "nome": "" },
  "progresso": {
    "curso1": {
      "modulosConcluidos": ["c1m1", "c1m2"],   // módulos concluídos
      "pontuacoes":        { "c2m4": 87.5 },    // notas de quiz (0–100)
      "flags":             { "notebooklm": true }
    }
    // … curso2 … curso5
  }
}
```

**Navegação permissiva**: a FSM é um sistema de *tracking* e sugestão, não uma trava. O
aluno pode abrir qualquer curso/módulo direto pela URL; os destaques ("Comece por aqui",
"Continuar") são só dicas. Para zerar tudo: botão **"Zerar meu progresso"** na home (ou
remova a chave `farol:estado:v2` no DevTools).

## Como estender

- **Adicionar/editar um curso ou módulo**: o catálogo é o array `CURSOS` no topo de
  `farol-core.js`. Cada módulo define `id`, `num`, `arquivo`, `titulo`, `subtitulo`,
  `criterio`, `tipo` e `tempo`. Crie o `.html` correspondente na pasta do curso.
- **Marcar conclusão de um módulo**: chame `Farol.marcarModuloConcluido(cursoId, moduloId,
  pontuacao?)` no `<script>` do módulo (ver `curso1-mod1.html` como referência).
- **Modelos 3D reais (`.glb`)**: em `Analisadores/curso3-mod3.html`, troque a geometria
  procedural por `GLTFLoader`.
- **Certificados**: há um motor único em `farol-core.js` (`Farol.Certificado`). Cada
  página de curso emite o **certificado daquele curso** e `Especificacao/curso5-mod4.html`
  emite o **certificado do programa** (os 5 cursos). Para acoplar a um container:
  `Farol.Certificado.montar({ escopo: "curso" | "programa", cursoId, container })`. A
  validação é central (`Farol.Certificado.validarNome`): sem nome válido **e** sem os
  módulos exigidos concluídos, nada é emitido. Para arte própria, ajuste a função de
  desenho em `Farol.Certificado` (Canvas, 1200×849 @2×).

## Acessibilidade e temas

Skip links, foco visível, `aria-live` nos feedbacks, navegação por teclado e respeito a
`prefers-reduced-motion` em todas as páginas. Tema claro/escuro com persistência e
anti-flash (aplicado antes da pintura). Tipografia e espaçamento fluidos com `clamp()`.

## Dependências

- **Fontes**: Inter (Google Fonts).
- **Three.js** `0.149.0` (build UMD, CDN unpkg) — só no módulo 3 do Curso 3.
- Nenhum framework, bundler ou backend.
