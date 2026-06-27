/* ============================================================================
   Farol · Sistema de Versionamento de Conteúdo
   farol-versao.js
   ----------------------------------------------------------------------------

   COMO FUNCIONA
   -------------
   Cada módulo tem um número de versão neste arquivo. Quando você atualiza o
   conteúdo de forma significativa, incremente o número. Na próxima vez que um
   aluno abrir qualquer página do site, o sistema detecta a diferença entre a
   versão que ele concluiu e a versão atual e remove a conclusão — ele precisará
   refazer o módulo para emitir o diploma novamente.

   QUANDO INCREMENTAR A VERSÃO
   ---------------------------
   ✓ Conteúdo principal foi reescrito ou atualizado
   ✓ Checklist, quiz ou critério de conclusão foi alterado
   ✓ A ferramenta ou processo ensinado mudou de forma relevante
   ✓ Um módulo novo foi inserido no meio da sequência

   ✗ NÃO incremente para: correção de typo, ajuste de cor/estilo, texto
     complementar que não muda o que o aluno precisa fazer para concluir.

   COMO INCREMENTAR
   ----------------
   Encontre o ID do módulo no objeto VERSOES abaixo e some 1 ao número atual.
   Exemplo:  "c1m3": 1  →  "c1m3": 2

   ADICIONANDO UM NOVO MÓDULO
   --------------------------
   1. Crie o arquivo HTML do módulo seguindo o padrão dos existentes.
   2. Adicione o módulo no array `modulos` do curso correspondente em
      farol-core.js (id, num, arquivo, titulo, subtitulo, criterio, tipo, tempo).
   3. Adicione a entrada aqui com versão inicial 1:
        "cXmY": 1   (X = número do curso, Y = número do módulo)

   ADICIONANDO UM NOVO CURSO
   -------------------------
   1. Crie os arquivos HTML do curso e seus módulos.
   2. Adicione o curso no array CURSOS em farol-core.js.
   3. Adicione uma entrada aqui para cada módulo, começando em 1.

   LOAD ORDER — OBRIGATÓRIO
   ------------------------
   Este arquivo DEVE ser carregado ANTES de farol-core.js em toda página HTML:

     <script src="../farol-versao.js"></script>   ← PRIMEIRO (subpastas)
     <script src="../farol-core.js"></script>      ← SEGUNDO

   Para páginas na raiz do site:
     <script src="farol-versao.js"></script>       ← PRIMEIRO (raiz)
     <script src="farol-core.js"></script>         ← SEGUNDO

   CHAVES DO LOCALSTORAGE
   ----------------------
   "farol:estado:v2"  — estado geral (gerenciado por farol-core.js)
   "farol:versoes:v1" — versões em que cada módulo foi concluído (este arquivo)

   ============================================================================ */

(function () {
  "use strict";

  /* ==========================================================================
     REGISTRO DE VERSÕES
     Formato: "idDoModulo": numeroDeVersao
     Versão inicial: 1. Incremente quando o conteúdo mudar significativamente.
     ========================================================================== */
  var VERSOES = {

    // ------------------------------------------------------------------
    // Curso 1 · Organizar Dados com IA
    // ------------------------------------------------------------------
    "c1m1": 1,  // O que é Assistente com Dados
    "c1m2": 1,  // Configurando o NotebookLM
    "c1m3": 1,  // Upload de Fontes
    "c1m4": 1,  // Validação do Assistente com Dados

    // ------------------------------------------------------------------
    // Curso 2 · Como Falar com a IA
    // ------------------------------------------------------------------
    "c2m1": 1,  // As 4 Regras de Ouro
    "c2m2": 1,  // Controlando a IA
    "c2m3": 1,  // Comandos na Prática
    "c2m4": 1,  // Desafio Final

    // ------------------------------------------------------------------
    // Curso 3 · Análise de Vendas e Estoque
    // ------------------------------------------------------------------
    "c3m1": 1,  // A Regra 80/20 das Vendas
    "c3m2": 1,  // Separando seus Produtos
    "c3m3": 1,  // Organização Visual em 3D
    "c3m4": 1,  // Decisões de Preço e Estoque

    // ------------------------------------------------------------------
    // Curso 4 · Rotina Diária Eficiente com IA
    // ------------------------------------------------------------------
    "c4m1": 1,  // Fechamento Diário
    "c4m2": 1,  // Conversa com o Assistente
    "c4m3": 1,  // Perguntas Inteligentes
    "c4m4": 1,  // Ação e Decisão

    // ------------------------------------------------------------------
    // Curso 5 · Planejando seu Próprio Sistema
    // ------------------------------------------------------------------
    "c5m1": 1,  // O Roteiro da Ideia
    "c5m2": 1,  // Descrevendo o Sistema
    "c5m3": 1,  // Revisão do Planejamento
    "c5m4": 1,  // Certificado de Planejamento

    // ------------------------------------------------------------------
    // Curso 6 · Automatizar Tarefas no Computador
    // ------------------------------------------------------------------
    "c6m1": 1,  // O que é Automatizar?
    "c6m2": 1,  // Pedindo Códigos para a IA
    "c6m3": 1,  // Criando um Limpador do Zero
    "c6m4": 1,  // Salvando seu Programa
    "c6m5": 1,  // Rodando no Computador
    "c6m6": 1   // Certificado de Automação

    // ------------------------------------------------------------------
    // Adicione novos módulos e cursos aqui seguindo o padrão acima.
    // ------------------------------------------------------------------
  };

  /* ==========================================================================
     CHAVES DO LOCALSTORAGE
     ========================================================================== */
  var CHAVE_ESTADO  = "farol:estado:v2";
  var CHAVE_VERSOES = "farol:versoes:v1";

  /* ==========================================================================
     ARMAZENAMENTO INTERNO
     ========================================================================== */
  function _lerVersoesSalvas() {
    try {
      var raw = localStorage.getItem(CHAVE_VERSOES);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function _gravarVersoesSalvas(obj) {
    try { localStorage.setItem(CHAVE_VERSOES, JSON.stringify(obj)); } catch (e) {}
  }

  /* ==========================================================================
     INVALIDAÇÃO
     Roda uma vez, de forma síncrona, antes de farol-core.js existir.
     Remove de modulosConcluidos qualquer módulo com versão desatualizada.
     ========================================================================== */
  function _invalidar() {
    try {
      var raw = localStorage.getItem(CHAVE_ESTADO);
      if (!raw) return;
      var estado = JSON.parse(raw);
      if (!estado || !estado.progresso) return;

      var versoesSalvas = _lerVersoesSalvas();
      var mudou = false;

      Object.keys(estado.progresso).forEach(function (cursoId) {
        var p = estado.progresso[cursoId];
        if (!p || !Array.isArray(p.modulosConcluidos)) return;

        p.modulosConcluidos = p.modulosConcluidos.filter(function (modId) {
          var versaoAtual = VERSOES[modId];

          // Módulo sem entrada no registro → não gerenciado, mantém conclusão
          if (versaoAtual === undefined) return true;

          var versaoSalva = versoesSalvas[modId];

          // Concluído antes de o versionamento existir + versão atual ainda é 1
          // → trata como concluído na v1 (não invalida)
          if (versaoSalva === undefined && versaoAtual === 1) return true;

          // Versão desatualizada → invalida
          if (versaoSalva === undefined || versaoSalva < versaoAtual) {
            delete versoesSalvas[modId];
            mudou = true;
            return false;
          }

          return true;
        });
      });

      if (mudou) {
        localStorage.setItem(CHAVE_ESTADO, JSON.stringify(estado));
        _gravarVersoesSalvas(versoesSalvas);
      }
    } catch (e) {}
  }

  /* ==========================================================================
     REGISTRO DE CONCLUSÃO
     Chamado por farol-core.js via hook ao marcar um módulo como concluído.
     Salva a versão atual do módulo para comparação futura.
     ========================================================================== */
  function _registrar(moduloId) {
    if (VERSOES[moduloId] === undefined) return;
    var v = _lerVersoesSalvas();
    v[moduloId] = VERSOES[moduloId];
    _gravarVersoesSalvas(v);
  }

  /* ==========================================================================
     EXECUÇÃO IMEDIATA
     A invalidação roda aqui, de forma síncrona, antes de farol-core.js existir.
     Isso garante que o localStorage esteja limpo quando farol-core.js começar
     a ler o progresso do aluno.
     ========================================================================== */
  _invalidar();

  /* ==========================================================================
     API PÚBLICA
     ========================================================================== */
  window.FarolVersao = {
    VERSOES:    VERSOES,
    _invalidar: _invalidar,
    _registrar: _registrar
  };

})();
