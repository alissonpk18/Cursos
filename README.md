# Farol · Cursos de IA para pequenos negócios

Plataforma de e-learning **100% client-side** que ensina, do zero e sem termos técnicos,
um pequeno negócio a usar IA na gestão. São **6 cursos** independentes, **26 módulos** no
total — cinco cursos com 4 módulos e o último (automação) com 6. Arquitetura **MPA**
(Multi-Page Application): cada página é isolada e o progresso vive no `localStorage`.

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

A home e os arquivos compartilhados ficam na **raiz**; cada curso mora na sua **própria
pasta** (capa + módulos). Os caminhos abaixo são exatamente os que o catálogo `CURSOS` de
`farol-core.js` espera.

```
index.html                      App Shell / home — onboarding + trilha de cursos
farol-core.js                   Núcleo: estado (FSM), catálogo, navegação, tema, cabeçalho, certificados
farol.css                       Design system (dark-first glass) + componentes de conteúdo
aula1.html … aula5.html         Redirecionamentos da estrutura antiga → curso novo equivalente
limpar.js                       Utilitário de manutenção (substituição de jargão) — não faz parte do site

Base de Conhecimento/           Curso 1 · Organizar Dados com IA — montar um assistente que consulta seus dados
  curso1.html                     Capa do curso (mapa dos módulos)
  curso1-mod1.html … mod4.html    Os 4 módulos
Engenharia de Prompt/           Curso 2 · Como Falar com a IA — comandos que reduzem erros e "invenções"
Analisadores/                   Curso 3 · Análise de Vendas e Estoque — curva ABC (módulo 3 em 3D)
Integracao/                     Curso 4 · Rotina Diária Eficiente com IA — o ciclo diário de decisão
Especificacao/                  Curso 5 · Planejando seu Próprio Sistema — gerar a spec do projeto
Automacao Windows/              Curso 6 · Automatizar Tarefas no Computador — 6 módulos + certificado do programa
```

Cada pasta de curso segue o mesmo padrão: `cursoN.html` (capa com o mapa dos módulos) +
`cursoN-modM.html` (os módulos). As páginas internas referenciam os arquivos da raiz com
`../` (atributo `data-raiz="../"` no `<body>`), então **a estrutura de pastas é obrigatória**:
se os arquivos forem achatados na raiz, o CSS/JS e os links de navegação quebram.

## Navegação e papéis

| Página | Papel |
|---|---|
| `index.html` | **Home**: ação principal adaptativa ("Começar"/"Continuar"), "como funciona", trilha numerada, dúvidas e ajustes |
| `cursoN.html` | **Capa do curso**: objetivo, o que vai aprender, progresso e mapa dos módulos |
| `cursoN-modM.html` | **Módulo**: conteúdo didático + um critério de conclusão (leitura, quiz, checklist, 3D, gerador…) |

O cabeçalho (logo, % de progresso, tema claro/escuro) é injetado por `farol-core.js` em
todas as páginas, conforme o atributo `data-pagina` do `<body>`.

**Avanço sequencial**: dentro de um curso, um módulo só abre depois que o anterior é
concluído — caso contrário `farol-core.js` exibe um overlay de "Módulo Bloqueado". Entre
cursos diferentes a navegação é livre.

## Estado (FSM)

Chave `localStorage`: **`farol:estado:v2`**. Há migração automática do `v1` (estrutura
antiga de curso único) na primeira carga.

```jsonc
{
  "versao": 3,
  "aluno": { "nome": "", "cpf": "" },         // nome + CPF usados no certificado
  "cookieConsent": null,                       // "aceito" | "recusado" | null (banner LGPD)
  "progresso": {
    "curso1": {
      "modulosConcluidos": ["c1m1", "c1m2"],   // módulos concluídos
      "pontuacoes":        { "c2m4": 87.5 },    // notas de quiz (0–100)
      "flags":             { "notebooklm": true }
    }
    // … curso2 … curso6
  }
}
```

**Navegação por URL**: o aluno pode abrir qualquer curso/módulo direto pela URL; os
destaques ("Comece por aqui", "Continuar") são dicas de progresso. O avanço entre módulos
de um mesmo curso, porém, exige concluir o anterior. Para zerar tudo: botão **"Zerar meu
progresso"** na home (ou remova a chave `farol:estado:v2` no DevTools).

## Como estender

- **Adicionar/editar um curso ou módulo**: o catálogo é o array `CURSOS` no topo de
  `farol-core.js`. Cada módulo define `id`, `num`, `arquivo`, `titulo`, `subtitulo`,
  `criterio`, `tipo` e `tempo`; cada curso define `arquivo` (já com a pasta) e `cargaHoraria`.
  Crie o `.html` correspondente **dentro da pasta do curso** e use `data-raiz="../"`.
- **Marcar conclusão de um módulo**: chame `Farol.marcarModuloConcluido(cursoId, moduloId,
  pontuacao?)` no `<script>` do módulo (ver `Base de Conhecimento/curso1-mod1.html` como
  referência).
- **Modelos 3D reais (`.glb`)**: em `Analisadores/curso3-mod3.html`, troque a geometria
  procedural por `GLTFLoader`.
- **Certificados**: há um motor único em `farol-core.js` (`Farol.Certificado`). Cada página
  de curso emite o **certificado daquele curso** e `Automacao Windows/curso6-mod6.html`
  emite o **certificado do programa** (os 6 cursos). Para acoplar a um container:
  `Farol.Certificado.montar({ escopo: "curso" | "programa", cursoId, container })`. A
  validação é central (`Farol.Certificado.validarNome` + `validarCPF`): sem **nome válido**
  e **CPF válido**, e sem os módulos exigidos concluídos, nada é emitido. O certificado tem
  frente (nome/curso) e verso (ementa/registro), desenhados em Canvas (1200×849 @2×).

## Privacidade (LGPD)

Nenhum dado pessoal sai do navegador: nome, CPF, progresso e consentimento ficam apenas no
`localStorage` deste dispositivo — nada é enviado a servidores ou terceiros. Na primeira
visita aparece um banner de cookies com **Termos de Uso** e **Política de Privacidade**
(o conteúdo dos modais vive em `farol-core.js`).

## Acessibilidade e temas

Skip links, foco visível, `aria-live` nos feedbacks, navegação por teclado e respeito a
`prefers-reduced-motion` em todas as páginas. Tema claro/escuro com persistência e
anti-flash (aplicado antes da pintura). Tipografia e espaçamento fluidos com `clamp()`.

## Dependências

- **Fontes**: Inter (Google Fonts) na interface; Playfair Display nos certificados.
- **Three.js** `0.149.0` (build UMD, CDN unpkg) — só no módulo 3 do Curso 3.
- Nenhum framework, bundler ou backend.
