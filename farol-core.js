/* ============================================================================
   Farol · Núcleo compartilhado (FSM + navegação + UI)
   ----------------------------------------------------------------------------
   Reestruturado: agora suporta MÚLTIPLOS CURSOS, cada um com 4 módulos.
   O estado é compartilhado pelo localStorage.
   Expõe a API global `window.Farol`.
   ========================================================================== */
(function () {
  "use strict";

  var CHAVE = "farol:estado:v2";

  /* -------------------------------------------------------------------------
     Catálogo de cursos. Cada curso tem 4 módulos.
     Cada módulo define: id, num, arquivo, titulo, subtitulo, criterio, conclui.
     ------------------------------------------------------------------------- */
  var CURSOS = [
    {
      id: "curso1",
      titulo: "Organizar Dados com IA",
      subtitulo: "Crie um assistente inteligente com as informações do seu negócio",
      icone: "📚",
      cor: "#4f7cff",
      arquivo: "Base de Conhecimento/curso1.html",
      cargaHoraria: "4 horas",
      modulos: [
        {
          id: "c1m1", num: 1, arquivo: "curso1-mod1.html",
          titulo: "Seu Assistente Inteligente",
          subtitulo: "Como a IA consulta seus dados sem complicações",
          criterio: "Ler o conteúdo e marcar como lido",
          tipo: "leitura", tempo: "6 min"
        },
        {
          id: "c1m2", num: 2, arquivo: "curso1-mod2.html",
          titulo: "Primeiros Passos na Ferramenta",
          subtitulo: "Criando sua conta e iniciando seu primeiro projeto",
          criterio: "Completar o passo a passo",
          tipo: "leitura", tempo: "8 min"
        },
        {
          id: "c1m3", num: 3, arquivo: "curso1-mod3.html",
          titulo: "Enviando seus Arquivos",
          subtitulo: "Como escolher e subir tabelas, PDFs e relatórios",
          criterio: "Completar o checklist de fontes",
          tipo: "checklist", tempo: "7 min"
        },
        {
          id: "c1m4", num: 4, arquivo: "curso1-mod4.html",
          titulo: "Testando o Assistente",
          subtitulo: "Como conferir se ele responde com base nos seus dados",
          criterio: "Validar o link do seu NotebookLM",
          tipo: "validacao", tempo: "6 min"
        }
      ]
    },
    {
      id: "curso2",
      titulo: "Como Falar com a IA",
      subtitulo: "Crie comandos perfeitos para obter respostas exatas e evitar erros",
      icone: "🎯",
      cor: "#e85d75",
      arquivo: "Engenharia de Prompt/curso2.html",
      cargaHoraria: "4 horas",
      modulos: [
        {
          id: "c2m1", num: 1, arquivo: "curso2-mod1.html",
          titulo: "As 4 Regras de Ouro",
          subtitulo: "Como definir papel, fontes, limites e formato da IA",
          criterio: "Ler o conteúdo e marcar como lido",
          tipo: "leitura"
        },
        {
          id: "c2m2", num: 2, arquivo: "curso2-mod2.html",
          titulo: "Controlando a IA",
          subtitulo: "Ajustando o foco para respostas mais exatas ou criativas",
          criterio: "Completar o exercício de temperatura",
          tipo: "leitura"
        },
        {
          id: "c2m3", num: 3, arquivo: "curso2-mod3.html",
          titulo: "Comandos na Prática",
          subtitulo: "Escrevendo instruções reais para o dia a dia da sua empresa",
          criterio: "Criar e salvar seu manual de instruções da IA",
          tipo: "pratica"
        },
        {
          id: "c2m4", num: 4, arquivo: "curso2-mod4.html",
          titulo: "Desafio Final",
          subtitulo: "Um teste rápido para avaliar o que você aprendeu",
          criterio: "Acertar pelo menos 70% do quiz",
          tipo: "quiz"
        }
      ]
    },
    {
      id: "curso3",
      titulo: "Análise de Vendas e Estoque",
      subtitulo: "Descubra seus produtos mais lucrativos e organize suas vendas em 3D",
      icone: "📊",
      cor: "#3ddc97",
      arquivo: "Analisadores/curso3.html",
      cargaHoraria: "4 horas",
      modulos: [
        {
          id: "c3m1", num: 1, arquivo: "curso3-mod1.html",
          titulo: "A Regra 80/20 das Vendas",
          subtitulo: "Como descobrir os produtos que sustentam o seu faturamento",
          criterio: "Ler o conteúdo e marcar como lido",
          tipo: "leitura"
        },
        {
          id: "c3m2", num: 2, arquivo: "curso3-mod2.html",
          titulo: "Separando seus Produtos",
          subtitulo: "Classifique seu catálogo entre mais e menos importantes",
          criterio: "Completar a classificação",
          tipo: "leitura"
        },
        {
          id: "c3m3", num: 3, arquivo: "curso3-mod3.html",
          titulo: "Organização Visual em 3D",
          subtitulo: "Um jogo interativo em 3D para ordenar seus produtos",
          criterio: "Concluir o desafio 3D na ordem correta",
          tipo: "3d"
        },
        {
          id: "c3m4", num: 4, arquivo: "curso3-mod4.html",
          titulo: "Decisões de Preço e Estoque",
          subtitulo: "Como usar a classificação para evitar estoque parado",
          criterio: "Responder o quiz de análise",
          tipo: "quiz"
        }
      ]
    },
    {
      id: "curso4",
      titulo: "Rotina Diária Eficiente com IA",
      subtitulo: "Crie o hábito de consultar a IA para tomar melhores decisões de negócio",
      icone: "🔄",
      cor: "#f0a500",
      arquivo: "Integracao/curso4.html",
      cargaHoraria: "4 horas",
      modulos: [
        {
          id: "c4m1", num: 1, arquivo: "curso4-mod1.html",
          titulo: "Fechamento Diário",
          subtitulo: "O ponto de partida com os resultados da empresa",
          criterio: "Informar o faturamento do dia",
          tipo: "input"
        },
        {
          id: "c4m2", num: 2, arquivo: "curso4-mod2.html",
          titulo: "Conversa com o Assistente",
          subtitulo: "Como enviar suas informações diárias de forma simples",
          criterio: "Selecionar o canal de conversa",
          tipo: "escolha"
        },
        {
          id: "c4m3", num: 3, arquivo: "curso4-mod3.html",
          titulo: "Perguntas Inteligentes",
          subtitulo: "Como fazer perguntas estratégicas para seu assistente de IA",
          criterio: "Formular a pergunta do dia",
          tipo: "input"
        },
        {
          id: "c4m4", num: 4, arquivo: "curso4-mod4.html",
          titulo: "Ação e Decisão",
          subtitulo: "Transformando as sugestões da IA em melhorias reais",
          criterio: "Completar o ciclo Caixa → Bot → Assistente com Dados → Decisão",
          tipo: "ciclo"
        }
      ]
    },
    {
      id: "curso5",
      titulo: "Planejando seu Próprio Sistema",
      subtitulo: "Escreva o roteiro da sua ideia de forma clara para um programador ou IA criar",
      icone: "📝",
      cor: "#a855f7",
      arquivo: "Especificacao/curso5.html",
      cargaHoraria: "4 horas",
      modulos: [
        {
          id: "c5m1", num: 1, arquivo: "curso5-mod1.html",
          titulo: "O Roteiro da Ideia",
          subtitulo: "Como estruturar o projeto que resolve o seu problema",
          criterio: "Ler o conteúdo e marcar como lido",
          tipo: "leitura"
        },
        {
          id: "c5m2", num: 2, arquivo: "curso5-mod2.html",
          titulo: "Descrevendo o Sistema",
          subtitulo: "Definindo o objetivo e as funções principais do sistema",
          criterio: "Gerar a spec do seu projeto",
          tipo: "gerador"
        },
        {
          id: "c5m3", num: 3, arquivo: "curso5-mod3.html",
          titulo: "Revisão do Planejamento",
          subtitulo: "Como conferir se a descrição está fácil de entender",
          criterio: "Completar o checklist de revisão",
          tipo: "checklist"
        },
        {
          id: "c5m4", num: 4, arquivo: "curso5-mod4.html",
          titulo: "Certificado de Planejamento",
          subtitulo: "Emita seu certificado desta etapa essencial do projeto",
          criterio: "Emitir o certificado do curso",
          tipo: "certificado"
        }
      ]
    },
    {
      id: "curso6",
      titulo: "Automatizar Tarefas no Computador",
      subtitulo: "Crie ferramentas automáticas com ajuda da IA para otimizar e limpar o Windows",
      icone: "⚙️",
      cor: "#0078d4",
      arquivo: "Automacao Windows/curso6.html",
      cargaHoraria: "6 horas",
      modulos: [
        {
          id: "c6m1", num: 1, arquivo: "curso6-mod1.html",
          titulo: "O que é Automatizar?",
          subtitulo: "Como comandar o Windows para fazer tarefas por você",
          criterio: "Ler o conteúdo e marcar como lido",
          tipo: "leitura", tempo: "5 min"
        },
        {
          id: "c6m2", num: 2, arquivo: "curso6-mod2.html",
          titulo: "Pedindo Códigos para a IA",
          subtitulo: "Como montar instruções seguras para a IA gerar o código",
          criterio: "Ler o conteúdo e marcar como lido",
          tipo: "leitura", tempo: "6 min"
        },
        {
          id: "c6m3", num: 3, arquivo: "curso6-mod3.html",
          titulo: "Criando um Limpador do zero",
          subtitulo: "Escrevendo a instrução para apagar arquivos pesados",
          criterio: "Copiar e testar o prompt de limpeza",
          tipo: "pratica", tempo: "8 min"
        },
        {
          id: "c6m4", num: 4, arquivo: "curso6-mod4.html",
          titulo: "Salvando seu Programa",
          subtitulo: "Como usar o Bloco de Notas para criar o arquivo do programa",
          criterio: "Ler o passo a passo de salvamento",
          tipo: "leitura", tempo: "7 min"
        },
        {
          id: "c6m5", num: 5, arquivo: "curso6-mod5.html",
          titulo: "Rodando no Computador",
          subtitulo: "Como executar seu novo programa e resolver eventuais erros",
          criterio: "Completar a execução e testes",
          tipo: "validacao", tempo: "8 min"
        },
        {
          id: "c6m6", num: 6, arquivo: "curso6-mod6.html",
          titulo: "Certificado de Automação",
          subtitulo: "Emita seu certificado de conclusão final do programa",
          criterio: "Emitir o certificado de conclusão",
          tipo: "certificado", tempo: "5 min"
        }
      ]
    }
  ];

  /* -------------------------------------------------------------------------
     Estado: leitura segura, schema default e persistência.
     ------------------------------------------------------------------------- */
  function estadoVazio() {
    var e = { versao: 3, aluno: { nome: "", cpf: "" }, progresso: {}, cookieConsent: null };
    CURSOS.forEach(function (curso) {
      e.progresso[curso.id] = { modulosConcluidos: [], pontuacoes: {}, flags: {} };
    });
    return e;
  }

  function carregar() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (!bruto) return estadoVazio();
      var e = JSON.parse(bruto);
      if (!e || typeof e !== "object") return estadoVazio();
      if (!e.aluno) e.aluno = { nome: "", cpf: "" };
      if (e.aluno.cpf === undefined) e.aluno.cpf = "";
      if (e.cookieConsent === undefined) e.cookieConsent = null;
      if (!e.progresso) e.progresso = {};
      CURSOS.forEach(function (curso) {
        if (!e.progresso[curso.id]) e.progresso[curso.id] = { modulosConcluidos: [], pontuacoes: {}, flags: {} };
        var p = e.progresso[curso.id];
        p.modulosConcluidos = p.modulosConcluidos || [];
        p.pontuacoes = p.pontuacoes || {};
        p.flags = p.flags || {};
      });
      return e;
    } catch (err) {
      return estadoVazio();
    }
  }

  function salvar(e) {
    try { localStorage.setItem(CHAVE, JSON.stringify(e)); }
    catch (err) {}
  }

  function mutar(fn) {
    var e = carregar();
    fn(e);
    salvar(e);
    return e;
  }

  /* -------------------------------------------------------------------------
     API de domínio
     ------------------------------------------------------------------------- */

  // Marca um módulo como concluído dentro de um curso
  function marcarModuloConcluido(cursoId, moduloId, pontuacao) {
    mutar(function (e) {
      var p = e.progresso[cursoId];
      if (!p) return;
      if (p.modulosConcluidos.indexOf(moduloId) === -1) {
        p.modulosConcluidos.push(moduloId);
      }
      if (typeof pontuacao === "number") {
        p.pontuacoes[moduloId] = pontuacao;
      }
    });
    if (window.FarolVersao) FarolVersao._registrar(moduloId);
    // Ativa o botão do próximo módulo que estava bloqueado
    var pendentes = document.querySelectorAll("[data-proximo-modulo]");
    for (var pi = 0; pi < pendentes.length; pi++) {
      var elPend = pendentes[pi];
      if (elPend.dataset.hrefOriginal) {
        elPend.setAttribute("href", elPend.dataset.hrefOriginal);
      }
      elPend.classList.remove("botao-fantasma");
      elPend.removeAttribute("aria-disabled");
      elPend.removeAttribute("title");
      elPend.style.cursor = "";
      elPend.style.pointerEvents = "";
    }
  }

  function estaModuloConcluido(cursoId, moduloId) {
    var e = carregar();
    var p = e.progresso[cursoId];
    return p ? p.modulosConcluidos.indexOf(moduloId) !== -1 : false;
  }

  function definirFlag(cursoId, chave, valor) {
    mutar(function (e) {
      var p = e.progresso[cursoId];
      if (p) p.flags[chave] = valor;
    });
  }

  function flag(cursoId, chave) {
    var e = carregar();
    var p = e.progresso[cursoId];
    return p ? p.flags[chave] : undefined;
  }

  function pontuacao(cursoId, moduloId) {
    var e = carregar();
    var p = e.progresso[cursoId];
    if (!p) return null;
    var v = p.pontuacoes[moduloId];
    return typeof v === "number" ? v : null;
  }

  function definirNome(nome) {
    mutar(function (e) { e.aluno.nome = String(nome || "").trim().slice(0, 60); });
  }

  function nome() { return carregar().aluno.nome || ""; }

  function definirCpf(cpf) {
    mutar(function (e) { e.aluno.cpf = String(cpf || "").trim().slice(0, 14); });
  }

  function cpf() { return carregar().aluno.cpf || ""; }

  // Progresso de um curso específico (quantos dos 4 módulos foram concluídos)
  function progressoCurso(cursoId) {
    var curso = CURSOS.filter(function (c) { return c.id === cursoId; })[0];
    if (!curso) return { concluidos: 0, total: 0, percentual: 0 };
    var e = carregar();
    var p = e.progresso[cursoId];
    var concluidos = 0;
    curso.modulos.forEach(function (mod) {
      if (p && p.modulosConcluidos.indexOf(mod.id) !== -1) concluidos++;
    });
    return {
      concluidos: concluidos,
      total: curso.modulos.length,
      percentual: Math.round((concluidos / curso.modulos.length) * 100)
    };
  }

  // Progresso geral (todos os cursos, todos os módulos)
  function progressoGeral() {
    var totalModulos = 0;
    var totalConcluidos = 0;
    CURSOS.forEach(function (curso) {
      var p = progressoCurso(curso.id);
      totalModulos += p.total;
      totalConcluidos += p.concluidos;
    });
    return {
      concluidos: totalConcluidos,
      total: totalModulos,
      percentual: totalModulos > 0 ? Math.round((totalConcluidos / totalModulos) * 100) : 0
    };
  }

  // Próximo módulo não concluído dentro de um curso
  function proximoModulo(cursoId) {
    var curso = CURSOS.filter(function (c) { return c.id === cursoId; })[0];
    if (!curso) return null;
    for (var i = 0; i < curso.modulos.length; i++) {
      if (!estaModuloConcluido(cursoId, curso.modulos[i].id)) return curso.modulos[i];
    }
    return null;
  }

  function resetar() {
    try { localStorage.removeItem(CHAVE); } catch (err) {}
  }

  // Retrocompatibilidade: tenta migrar do v1 para v2
  function migrarV1() {
    try {
      var bruto = localStorage.getItem("farol:estado:v1");
      if (!bruto) return;
      var v1 = JSON.parse(bruto);
      if (!v1 || !v1.cursos || !v1.cursos["farol-ia-pme"]) return;
      var antigo = v1.cursos["farol-ia-pme"];
      var e = estadoVazio();
      if (v1.aluno && v1.aluno.nome) e.aluno.nome = v1.aluno.nome;
      // Mapeia aulas antigas para os módulos finais de cada curso
      var mapa = {
        "aula1": { curso: "curso1", modulo: "c1m4" },
        "aula2": { curso: "curso2", modulo: "c2m4" },
        "aula3": { curso: "curso3", modulo: "c3m3" },
        "aula4": { curso: "curso4", modulo: "c4m4" },
        "aula5": { curso: "curso5", modulo: "c5m4" }
      };
      if (antigo.nosConcluidos) {
        antigo.nosConcluidos.forEach(function (nId) {
          var m = mapa[nId];
          if (m) {
            var p = e.progresso[m.curso];
            if (p.modulosConcluidos.indexOf(m.modulo) === -1) {
              p.modulosConcluidos.push(m.modulo);
            }
          }
        });
      }
      if (antigo.flags && antigo.flags.notebooklm) {
        e.progresso["curso1"].flags.notebooklm = true;
      }
      if (antigo.pontuacoes && antigo.pontuacoes.aula2) {
        e.progresso["curso2"].pontuacoes["c2m4"] = antigo.pontuacoes.aula2;
      }
      salvar(e);
    } catch (err) {}
  }

  /* -------------------------------------------------------------------------
     Tema (claro/escuro)
     ------------------------------------------------------------------------- */
  function alternarTema() {
    var html = document.documentElement;
    var novo = html.dataset.tema === "escuro" ? "claro" : "escuro";
    html.dataset.tema = novo;
    try { localStorage.setItem("farol:tema", novo); } catch (err) {}
  }

  /* -------------------------------------------------------------------------
     UI compartilhada: cabeçalho
     ------------------------------------------------------------------------- */
  var SVG_LOGO =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 2v4M9 22h6M10 22l1-12h2l1 12M7 9l5-3 5 3M5 13l7-4 7 4"/></svg>';
  var SVG_LUA =
    '<svg class="icone-lua" viewBox="0 0 24 24" width="20" height="20" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var SVG_SOL =
    '<svg class="icone-sol" viewBox="0 0 24 24" width="20" height="20" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 ' +
    '1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function injetarCabecalho(voltarHref, voltarTexto) {
    var prefixo = document.body.getAttribute("data-raiz") || "";
    var prog = progressoGeral();
    var voltar = voltarHref ?
      '<a class="topo-voltar" href="' + prefixo + voltarHref + '" aria-label="' + voltarTexto + '">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M19 12H5M12 19l-7-7 7-7"/></svg> ' + voltarTexto + '</a>' : "";

    var header = document.createElement("header");
    header.className = "topo";
    header.innerHTML =
      '<div class="topo-area">' +
        '<a class="marca" href="' + prefixo + 'index.html">' + SVG_LOGO + '<span>Farol</span></a>' +
        voltar +
      '</div>' +
      '<div class="topo-area">' +
        '<div class="topo-progresso" title="' + prog.concluidos + ' de ' + prog.total + ' módulos">' +
          '<div class="barra-mini"><i style="inline-size:' + prog.percentual + '%"></i></div>' +
          '<span>' + prog.percentual + '%</span>' +
        '</div>' +
        '<button id="farol-tema" class="btn-icone" aria-label="Alternar tema claro/escuro">' +
          SVG_LUA + SVG_SOL +
        '</button>' +
      '</div>';
    document.body.insertBefore(header, document.body.firstChild);

    var btn = document.getElementById("farol-tema");
    if (btn) btn.addEventListener("click", alternarTema);
  }

  function iniciar() {
    // Migra dados antigos se existirem
    if (!localStorage.getItem(CHAVE) && localStorage.getItem("farol:estado:v1")) {
      migrarV1();
    }

    var pagina = document.body.getAttribute("data-pagina");
    if (pagina === "index") {
      injetarCabecalho(null, null);
    } else if (pagina && pagina.indexOf("curso") === 0 && pagina.indexOf("-") === -1) {
      // Página de curso (ex: curso1)
      injetarCabecalho("index.html", "Cursos");
    } else if (pagina && pagina.indexOf("-mod") !== -1) {
      // Página de módulo (ex: curso1-mod1)
      var cursoId = pagina.split("-")[0];
      var partes = pagina.split("-mod");
      var modNum = parseInt(partes[1]);
      if (modNum > 1) {
        var prevModId = "c" + cursoId.replace("curso", "") + "m" + (modNum - 1);
        if (!estaModuloConcluido(cursoId, prevModId)) {
          bloquearPagina(cursoId, modNum);
          return;
        }
      }

      var curso = CURSOS.filter(function (c) { return c.id === cursoId; })[0];
      if(!curso) {
         injetarCabecalho("index.html", "Voltar");
      } else {
         // Módulo e curso estão na mesma pasta — link direto pelo nome do arquivo, sem prefixo.
         var hrefCurso = curso.arquivo.split('/').pop();
         // Passamos o href SEM usar o prefixo do injetarCabecalho.
         // Para isso, injetaremos o link manualmente.
         var prefixo = document.body.getAttribute("data-raiz") || "";
         injetarCabecalho(null, null);
         // Substitui o header: adiciona o link de volta ao curso E o link ao index
         var header = document.querySelector(".topo");
         if (header) {
           var area = header.querySelector(".topo-area");
           if (area) {
             var voltarLink = document.createElement("a");
             voltarLink.className = "topo-voltar";
             voltarLink.href = hrefCurso;
             voltarLink.setAttribute("aria-label", curso.titulo);
             voltarLink.innerHTML =
               '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
               'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
               '<path d="M19 12H5M12 19l-7-7 7-7"/></svg> ' + curso.titulo;
             area.appendChild(voltarLink);
           }
         }
      }

      // Botão inteligente do próximo módulo: reflete o estado real do aluno
      var modAtualId = "c" + cursoId.replace("curso", "") + "m" + modNum;
      var modAtualConcluido = estaModuloConcluido(cursoId, modAtualId);
      var cursoDados = CURSOS.filter(function (c) { return c.id === cursoId; })[0];
      var navMod = document.querySelector("nav.flex");
      if (navMod && cursoDados) {
        var nextMod = null;
        for (var ni = 0; ni < cursoDados.modulos.length; ni++) {
          if (cursoDados.modulos[ni].num === modNum + 1) { nextMod = cursoDados.modulos[ni]; break; }
        }
        var linksProximos = navMod.querySelectorAll("a.botao:not(.botao-fantasma)");
        for (var li = 0; li < linksProximos.length; li++) {
          var linkEl = linksProximos[li];
          linkEl.dataset.proximoModulo = "1";
          linkEl.dataset.hrefOriginal = linkEl.getAttribute("href") || "";
          if (!modAtualConcluido) {
            // Módulo não concluído: botão visível mas bloqueado
            linkEl.classList.add("botao-fantasma");
            linkEl.removeAttribute("href");
            linkEl.setAttribute("aria-disabled", "true");
            linkEl.title = "Conclua este módulo para avançar";
            linkEl.style.cursor = "not-allowed";
            linkEl.style.pointerEvents = "none";
          } else if (nextMod && estaModuloConcluido(cursoId, nextMod.id)) {
            // Próximo módulo já foi visitado/concluído: indica revisão
            linkEl.textContent = "Revisar Módulo " + nextMod.num + " →";
          }
        }
      }
    } else {
      injetarCabecalho("index.html", "Painel");
    }
    atualizarRodape();
    verificarCookieBanner();
  }

  function bloquearPagina(cursoId, modNum) {
    var overlay = document.createElement("div");
    overlay.className = "vidro flex pilha";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "99999";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.textAlign = "center";
    overlay.style.padding = "2rem";
    overlay.style.backdropFilter = "blur(12px)";
    overlay.style.backgroundColor = "rgba(12, 20, 36, 0.95)";

    var curso = CURSOS.filter(function (c) { return c.id === cursoId; })[0];
    var cursoTitulo = curso ? curso.titulo : ("Curso " + cursoId.replace("curso", ""));
    var prevNum = modNum - 1;
    var prevHref = curso ? (curso.arquivo.split("/").pop().replace(".html", "-mod" + prevNum + ".html")) : "index.html";

    overlay.innerHTML =
      '<div class="cartao pilha" style="max-width: 480px; border: 1px solid rgba(232, 93, 117, 0.4); box-shadow: 0 8px 32px rgba(232, 93, 117, 0.15);">' +
        '<span style="font-size: 3rem; margin-bottom: 1rem;">🔒</span>' +
        '<h2 style="color: #e85d75; margin-top: 0;">Módulo Bloqueado</h2>' +
        '<p style="line-height: 1.6; margin-bottom: 1.5rem;">' +
          'Você está tentando acessar o <strong>Módulo ' + modNum + '</strong> do curso <em>' + cursoTitulo + '</em> sem concluir o ' +
          '<strong>Módulo ' + prevNum + '</strong> anterior. O avanço é controlado para garantir o aprendizado real.' +
        '</p>' +
        '<div class="flex" style="justify-content: center; gap: 1rem;">' +
          '<a class="botao" href="' + prevHref + '">Ir para o Módulo ' + prevNum + '</a>' +
          '<a class="botao botao-fantasma" href="../index.html">Painel Principal</a>' +
        '</div>' +
      '</div>';

    document.documentElement.style.overflow = "hidden";
    document.body.appendChild(overlay);
  }

  function verificarCookieBanner() {
    var consent = carregar().cookieConsent;
    if (consent !== null) return;

    var banner = document.createElement("div");
    banner.className = "vidro flex";
    banner.style.position = "fixed";
    banner.style.bottom = "20px";
    banner.style.left = "50%";
    banner.style.transform = "translateX(-50%)";
    banner.style.width = "calc(100% - 40px)";
    banner.style.maxWidth = "760px";
    banner.style.zIndex = "99998";
    banner.style.padding = "1.25rem 2rem";
    banner.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4)";
    banner.style.border = "1px solid rgba(255, 255, 255, 0.08)";
    banner.style.flexDirection = "row";
    banner.style.alignItems = "center";
    banner.style.justifyContent = "space-between";
    banner.style.gap = "1.5rem";
    banner.style.borderRadius = "12px";

    banner.innerHTML =
      '<div class="pilha" style="gap: 0.5rem; text-align: left;">' +
        '<strong style="color: #ffffff; font-size: 1.1rem;">🍪 Uso de Cookies e Privacidade</strong>' +
        '<p style="margin: 0; font-size: 0.9rem; line-height: 1.5; color: #aebfd6;">' +
          'Esta plataforma utiliza o armazenamento local (`localStorage`) apenas para guardar seu progresso nos cursos e nome/CPF no certificado. ' +
          'Nenhum dado pessoal é transmitido a servidores ou terceiros (LGPD Compliant). Ao continuar, você aceita o uso destes cookies essenciais. ' +
          'Leia nossos <a href="#" id="farol-cookies-termos" style="text-decoration: underline; color: #4f7cff;">Termos de Uso</a> e ' +
          '<a href="#" id="farol-cookies-privacidade" style="text-decoration: underline; color: #4f7cff;">Política de Privacidade</a>.' +
        '</p>' +
      '</div>' +
      '<div class="flex" style="gap: 0.75rem; flex-shrink: 0;">' +
        '<button class="botao" id="farol-cookies-aceitar" style="padding: 0.5rem 1.5rem;">Aceitar</button>' +
        '<button class="botao botao-fantasma" id="farol-cookies-recusar" style="padding: 0.5rem 1rem; color: #ff6b6b;">Recusar</button>' +
      '</div>';

    document.body.appendChild(banner);

    document.getElementById("farol-cookies-aceitar").addEventListener("click", function() {
      mutar(function(e) { e.cookieConsent = "aceito"; });
      banner.remove();
    });

    document.getElementById("farol-cookies-recusar").addEventListener("click", function() {
      mutar(function(e) { e.cookieConsent = "recusado"; });
      banner.remove();
    });

    document.getElementById("farol-cookies-termos").addEventListener("click", function(e) {
      e.preventDefault();
      abrirModalTermos();
    });

    document.getElementById("farol-cookies-privacidade").addEventListener("click", function(e) {
      e.preventDefault();
      abrirModalPrivacidade();
    });
  }

  function abrirModal(titulo, htmlConteudo) {
    var oldModal = document.getElementById("farol-modal-dinamico");
    if (oldModal) oldModal.remove();

    var modal = document.createElement("div");
    modal.id = "farol-modal-dinamico";
    modal.className = "flex";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.zIndex = "100000";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.backgroundColor = "rgba(12, 20, 36, 0.85)";
    modal.style.backdropFilter = "blur(8px)";
    modal.style.padding = "1rem";

    modal.innerHTML =
      '<div class="cartao pilha" style="max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto; position: relative; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 12px 40px rgba(0,0,0,0.5);">' +
        '<button id="farol-modal-fechar" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #aebfd6; font-size: 1.5rem; cursor: pointer; line-height: 1;">&times;</button>' +
        '<h2 style="margin-top: 0; padding-right: 2rem;">' + titulo + '</h2>' +
        '<div style="text-align: left; line-height: 1.6; color: #aebfd6; font-size: 0.95rem;">' + htmlConteudo + '</div>' +
        '<div class="flex" style="justify-content: flex-end; margin-top: 1.5rem;">' +
          '<button class="botao" id="farol-modal-ok">Fechar</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    var fechar = function() { modal.remove(); };
    document.getElementById("farol-modal-fechar").addEventListener("click", fechar);
    document.getElementById("farol-modal-ok").addEventListener("click", fechar);
    modal.addEventListener("click", function(e) {
      if (e.target === modal) fechar();
    });
  }

  function abrirModalTermos() {
    var content =
      '<h3>1. Sobre a Plataforma</h3>' +
      '<p>A Farol é uma plataforma educacional gratuita de qualificação profissional, criada com o objetivo de facilitar o acesso ao conhecimento sobre Inteligência Artificial para pequenos negócios. Não cobramos mensalidades, inscrições ou taxas de emissão de certificados.</p>' +
      '<h3>2. Propriedade Intelectual e Uso Aceitável</h3>' +
      '<p>Todo o conteúdo das aulas, códigos-fonte e materiais são livres para estudo e aplicação comercial em seu próprio negócio. É proibido redistribuir o conteúdo de forma paga ou reivindicar a autoria intelectual da plataforma.</p>' +
      '<h3>3. Emissão de Certificados</h3>' +
      '<p>Os certificados emitidos são da categoria de <strong>Cursos Livres de Qualificação Profissional</strong> (Lei nº 9.394/96, art. 67 e 87, e Decreto nº 5.154/04). O aluno assume total responsabilidade pela veracidade do seu nome e CPF fornecidos para fins de verificação acadêmica.</p>' +
      '<h3>4. Doações e Contato</h3>' +
      '<p>Caso queira apoiar o projeto ou entrar em contato para feedbacks e parcerias, fale conosco pelo telefone/WhatsApp <strong>(71) 9 9264-1845</strong>. Toda doação é voluntária e destinada à manutenção e melhoria contínua dos servidores.</p>';
    abrirModal("Termos de Uso e Condições", content);
  }

  function abrirModalPrivacidade() {
    var content =
      '<h3>1. Princípio da Minimização de Dados (LGPD)</h3>' +
      '<p>Em total conformidade com a Lei Geral de Proteção de Dados (LGPD), a Farol adota uma política de minimização estrita. Coletamos e processamos apenas o mínimo necessário para as finalidades do serviço:</p>' +
      '<ul>' +
        '<li><strong>Nome e CPF:</strong> Solicitados unicamente no momento de emissão do certificado, garantindo a rastreabilidade e validade do documento emitido.</li>' +
        '<li><strong>Dados de Progresso:</strong> Registro das aulas visualizadas e pontuações de questionários para liberação dos módulos e emissão do certificado.</li>' +
      '</ul>' +
      '<h3>2. Armazenamento Exclusivamente Local</h3>' +
      '<p><strong>Nenhum dado pessoal seu é transmitido a servidores ou compartilhado com terceiros.</strong> Todos os dados de progresso, nome, CPF e consentimentos de privacidade são armazenados localmente no seu próprio navegador via `localStorage`. Você tem controle absoluto e pode apagar esses dados a qualquer momento limpando os cookies/dados de navegação ou usando o botão "Reiniciar Progresso" no painel.</p>' +
      '<h3>3. Direitos do Usuário</h3>' +
      '<p>Você tem o direito de retificar seu nome/CPF diretamente na interface de emissão do certificado e de excluir todas as informações da plataforma a qualquer momento. Em caso de dúvidas, entre em contato pelo telefone/WhatsApp <strong>(71) 9 9264-1845</strong>.</p>';
    abrirModal("Política de Privacidade", content);
  }

  function atualizarRodape() {
    var footer = document.querySelector("footer") || document.querySelector(".rodape");
    if (!footer) {
      footer = document.createElement("footer");
      footer.className = "rodape container mt-4";
      document.body.appendChild(footer);
    }

    footer.style.borderTop = "1px solid rgba(255, 255, 255, 0.08)";
    footer.style.padding = "2rem 0";
    footer.style.marginTop = "3rem";
    footer.style.textAlign = "center";
    footer.style.fontSize = "0.9rem";
    footer.style.color = "#8093ad";

    footer.innerHTML =
      '<div class="pilha" style="gap: 1rem;">' +
        '<div style="line-height: 1.6;">' +
          '<p style="margin: 0 0 0.5rem 0; font-weight: 500; color: #ffffff;">' +
            '💡 A Farol é uma plataforma educacional 100% gratuita. Apoie nossa missão se desejar. ' +
            'Contato & Doações: <a href="tel:+5571992641845" style="color: #4f7cff; font-weight: 600; text-decoration: none;">(71) 9 9264-1845</a>' +
          '</p>' +
          '<p style="margin: 0; font-size: 0.85rem; opacity: 0.8;">' +
            'Curso Livre de Qualificação Profissional, amparado pela Lei nº 9.394/96 e Decreto nº 5.154/04.' +
          '</p>' +
        '</div>' +
        '<div class="flex" style="justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin-top: 0.5rem;">' +
          '<a href="#" id="farol-footer-termos" style="color: #aebfd6; text-decoration: none; border-bottom: 1px dotted rgba(255,255,255,0.3);">Termos de Uso</a>' +
          '<a href="#" id="farol-footer-privacidade" style="color: #aebfd6; text-decoration: none; border-bottom: 1px dotted rgba(255,255,255,0.3);">Política de Privacidade</a>' +
        '</div>' +
        '<p style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.6;">' +
          '&copy; ' + new Date().getFullYear() + ' Farol IA para Pequenos Negócios. Todos os direitos reservados.' +
        '</p>' +
      '</div>';

    var btnTermos = footer.querySelector("#farol-footer-termos");
    if (btnTermos) {
      btnTermos.addEventListener("click", function (e) {
        e.preventDefault();
        abrirModalTermos();
      });
    }

    var btnPrivacidade = footer.querySelector("#farol-footer-privacidade");
    if (btnPrivacidade) {
      btnPrivacidade.addEventListener("click", function (e) {
        e.preventDefault();
        abrirModalPrivacidade();
      });
    }
  }

  // Helper de reveal (usado por todas as páginas)
  function initReveal() {
    var reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var alvos = document.querySelectorAll(".revela");
    if (reduzido) {
      alvos.forEach(function (el) { el.classList.add("visivel"); });
    } else {
      var obs = new IntersectionObserver(function (xs) {
        xs.forEach(function (x) {
          if (x.isIntersecting) { x.target.classList.add("visivel"); obs.unobserve(x.target); }
        });
      }, { threshold: 0.1 });
      alvos.forEach(function (el) { obs.observe(el); });
    }
  }

  /* -------------------------------------------------------------------------
     Certificado — renderizador profissional (Canvas) + UI reutilizável.
     Centraliza a VALIDAÇÃO: sem nome válido OU sem os módulos exigidos
     concluídos, nenhum certificado é emitido. Cada curso tem o seu certificado,
     e há o certificado final do programa (todos os 6 cursos).
     ------------------------------------------------------------------------- */
  var Certificado = (function () {
    var FONTE_TITULO = '"Playfair Display", Georgia, "Times New Roman", serif';
    var FONTE_CORPO  = 'Inter, system-ui, sans-serif';
    var fonteInjetada = false;

    function porId(id) { for (var i = 0; i < CURSOS.length; i++) if (CURSOS[i].id === id) return CURSOS[i]; return null; }
    function pasta(curso) { var p = curso.arquivo.split("/"); p.pop(); return p.length ? p.join("/") + "/" : ""; }
    function dataHoje() { return new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }); }

    // --- Validação central do nome: precisa de >=2 caracteres e ao menos 1 letra.
    function validarNome(valor) {
      var n = (valor == null ? "" : String(valor)).replace(/\s+/g, " ").trim();
      if (n.length < 2) return null;
      if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(n)) return null;
      return n;
    }

    function validarCPF(cpf) {
      var c = String(cpf).replace(/\D/g, "");
      if (c.length !== 11) return false;
      if (/^(\d)\1{10}$/.test(c)) return false;
      var soma = 0, resto;
      for (var i = 1; i <= 9; i++) soma += parseInt(c.substring(i-1, i)) * (11 - i);
      resto = (soma * 10) % 11;
      if ((resto === 10) || (resto === 11)) resto = 0;
      if (resto !== parseInt(c.substring(9, 10))) return false;
      soma = 0;
      for (var i = 1; i <= 10; i++) soma += parseInt(c.substring(i-1, i)) * (12 - i);
      resto = (soma * 10) % 11;
      if ((resto === 10) || (resto === 11)) resto = 0;
      if (resto !== parseInt(c.substring(10, 11))) return false;
      return true;
    }

    function formatarCPF(v) {
      v = v.replace(/\D/g, "");
      if (v.length <= 3) return v;
      if (v.length <= 6) return v.slice(0, 3) + "." + v.slice(3);
      if (v.length <= 9) return v.slice(0, 3) + "." + v.slice(3, 6) + "." + v.slice(6);
      return v.slice(0, 3) + "." + v.slice(3, 6) + "." + v.slice(6, 9) + "-" + v.slice(9, 11);
    }

    // --- Código de verificação determinístico (parece oficial, sem servidor).
    function codigo(nm, escopo) {
      var base = (escopo + "|" + nm).toUpperCase();
      var h = 5381;
      for (var i = 0; i < base.length; i++) { h = (((h << 5) + h) + base.charCodeAt(i)) >>> 0; }
      return "FAROL-" + escopo + "-" + ("00000" + h.toString(36).toUpperCase()).slice(-5);
    }

    /* ---- Fontes (Playfair Display para o ar formal) ---- */
    function injetarFonte() {
      if (fonteInjetada) return;
      fonteInjetada = true;
      try {
        var l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,500;1,600&display=swap";
        document.head.appendChild(l);
      } catch (e) {}
    }
    function comFontes(cb) {
      injetarFonte();
      var feito = false;
      function ir() { if (!feito) { feito = true; cb(); } }
      if (!document.fonts || !document.fonts.load) { ir(); return; }
      try {
        Promise.all([
          document.fonts.load('800 62px "Playfair Display"'),
          document.fonts.load('italic 600 56px "Playfair Display"'),
          document.fonts.load('400 24px Inter'),
          document.fonts.load('700 30px Inter')
        ]).then(ir, ir);
      } catch (e) { ir(); }
      setTimeout(ir, 2500); // não trava se a fonte não carregar (ex.: offline)
    }

    /* ---- Utilidades de desenho ---- */
    function hexA(hex, a) {
      var h = String(hex).replace("#", "");
      if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
      var r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
    function rRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x+r, y);
      ctx.arcTo(x+w, y, x+w, y+h, r);
      ctx.arcTo(x+w, y+h, x, y+h, r);
      ctx.arcTo(x, y+h, x, y, r);
      ctx.arcTo(x, y, x+w, y, r);
      ctx.closePath();
    }
    function diamante(ctx, cx, cy, r, cor) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI/4);
      ctx.fillStyle = cor; ctx.fillRect(-r, -r, 2*r, 2*r); ctx.restore();
    }
    function divisor(ctx, cx, y, meia, cor) {
      ctx.strokeStyle = hexA(cor, 0.85); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx-meia, y); ctx.lineTo(cx-13, y);
      ctx.moveTo(cx+13, y); ctx.lineTo(cx+meia, y); ctx.stroke();
      diamante(ctx, cx, y, 4, hexA(cor, 0.9));
    }
    function textoEspacado(ctx, txt, x, y, esp) {
      var larguras = [], total = 0, i;
      for (i = 0; i < txt.length; i++) {
        var w = ctx.measureText(txt[i]).width;
        larguras.push(w); total += w + (i < txt.length-1 ? esp : 0);
      }
      var prev = ctx.textAlign; ctx.textAlign = "left";
      var cur = x - total/2;
      for (i = 0; i < txt.length; i++) { ctx.fillText(txt[i], cur, y); cur += larguras[i] + esp; }
      ctx.textAlign = prev;
    }
    function estrela(ctx, cx, cy, pontas, rOut, rIn, fill) {
      ctx.beginPath();
      for (var i = 0; i < pontas*2; i++) {
        var r = i % 2 === 0 ? rOut : rIn;
        var a = (i/(pontas*2))*Math.PI*2 - Math.PI/2;
        var x = cx + Math.cos(a)*r, y = cy + Math.sin(a)*r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    }
    function selo(ctx, cx, cy, r, cor) {
      ctx.fillStyle = hexA(cor, 0.85);
      ctx.beginPath();
      ctx.moveTo(cx-15, cy+r-8); ctx.lineTo(cx-30, cy+r+34); ctx.lineTo(cx-13, cy+r+25);
      ctx.lineTo(cx-3, cy+r+40); ctx.lineTo(cx-3, cy+r-4); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx+15, cy+r-8); ctx.lineTo(cx+30, cy+r+34); ctx.lineTo(cx+13, cy+r+25);
      ctx.lineTo(cx+3, cy+r+40); ctx.lineTo(cx+3, cy+r-4); ctx.closePath(); ctx.fill();
      var dg = ctx.createLinearGradient(cx, cy-r, cx, cy+r);
      dg.addColorStop(0, hexA(cor, 1)); dg.addColorStop(1, hexA(cor, 0.7));
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fillStyle = dg; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, r-7, 0, Math.PI*2);
      ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 2; ctx.stroke();
      var n = 30;
      for (var i = 0; i < n; i++) {
        var a = (i/n)*Math.PI*2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a)*(r-3.5), cy + Math.sin(a)*(r-3.5), 1, 0, Math.PI*2);
        ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fill();
      }
      estrela(ctx, cx, cy, 5, r-19, (r-19)/2.3, "#ffffff");
    }

    var EMBLEMA = "M12 2v4M9 22h6M10 22l1-12h2l1 12M7 9l5-3 5 3M5 13l7-4 7 4";

    function desenhar(canvas, d, lado) {
      lado = lado || "frente";
      var W = 1200, H = 849, dpr = 2;
      canvas.width = W*dpr; canvas.height = H*dpr;
      var ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cor = d.cor || "#4f7cff";

      // Fundo + halo de cor
      var bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0c1424"); bg.addColorStop(1, "#111d33");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var glow = ctx.createRadialGradient(W/2, 30, 10, W/2, 30, 640);
      glow.addColorStop(0, hexA(cor, 0.20)); glow.addColorStop(1, hexA(cor, 0));
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

      // Bordas + losangos de canto
      rRect(ctx, 30, 30, W-60, H-60, 16);
      ctx.lineWidth = 2.5; ctx.strokeStyle = hexA(cor, 0.9); ctx.stroke();
      rRect(ctx, 47, 47, W-94, H-94, 10);
      ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,0.16)"; ctx.stroke();
      diamante(ctx, 47, 47, 5, hexA(cor, 0.9));
      diamante(ctx, W-47, 47, 5, hexA(cor, 0.9));
      diamante(ctx, 47, H-47, 5, hexA(cor, 0.9));
      diamante(ctx, W-47, H-47, 5, hexA(cor, 0.9));

      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";

      if (lado === "frente") {
        // Emblema do farol
        try {
          var p = new Path2D(EMBLEMA);
          ctx.save();
          var es = 1.8;
          ctx.translate(W/2 - 12*es, 74);
          ctx.scale(es, es);
          ctx.strokeStyle = hexA(cor, 0.95);
          ctx.lineWidth = 1.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
          ctx.stroke(p);
          ctx.restore();
        } catch (e) {}

        // Kicker
        ctx.fillStyle = hexA(cor, 0.95);
        ctx.font = '700 17px ' + FONTE_CORPO;
        textoEspacado(ctx, "FAROL · IA PARA PEQUENOS NEGÓCIOS", W/2, 152, 4);

        // Título + divisor ornamental
        ctx.fillStyle = "#ffffff";
        ctx.font = '800 62px ' + FONTE_TITULO;
        ctx.fillText(d.titulo, W/2, 232);
        divisor(ctx, W/2, 262, 130, cor);

        ctx.fillStyle = "#aebfd6";
        ctx.font = '400 24px ' + FONTE_CORPO;
        ctx.fillText("Este certificado é orgulhosamente conferido a", W/2, 328);

        // Nome (com auto-redução se for muito largo)
        var fs = 56, maxL = W - 320;
        ctx.font = 'italic 600 ' + fs + 'px ' + FONTE_TITULO;
        while (fs > 30 && ctx.measureText(d.nome).width > maxL) { fs -= 2; ctx.font = 'italic 600 ' + fs + 'px ' + FONTE_TITULO; }
        ctx.fillStyle = "#ffffff";
        ctx.fillText(d.nome, W/2, 396);

        // CPF do aluno
        ctx.fillStyle = "#c7d4ea";
        ctx.font = '600 18px ' + FONTE_CORPO;
        ctx.fillText("CPF: " + d.cpf, W/2, 432);

        var larg = Math.min(ctx.measureText(d.nome).width + 90, W - 230);
        var ul = ctx.createLinearGradient((W-larg)/2, 0, (W+larg)/2, 0);
        ul.addColorStop(0, hexA(cor, 0)); ul.addColorStop(0.5, hexA(cor, 0.95)); ul.addColorStop(1, hexA(cor, 0));
        ctx.strokeStyle = ul; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo((W-larg)/2, 452); ctx.lineTo((W+larg)/2, 452); ctx.stroke();

        // Corpo
        ctx.fillStyle = "#aebfd6"; ctx.font = '400 23px ' + FONTE_CORPO;
        ctx.fillText(d.escopoTexto, W/2, 502);
        ctx.fillStyle = "#ffffff"; ctx.font = '700 30px ' + FONTE_CORPO;
        ctx.fillText(d.foco, W/2, 542);
        ctx.fillStyle = "#c7d4ea"; ctx.font = '500 20px ' + FONTE_CORPO;
        ctx.fillText(d.detalhe + " · Carga Horária: " + d.cargaHoraria, W/2, 580);

        // Selo / medalha
        selo(ctx, W/2, 662, 46, cor);

        // Assinaturas
        ctx.fillStyle = "#dce6f5"; ctx.font = '600 20px ' + FONTE_CORPO;
        ctx.fillText(d.data, 300, 768);
        ctx.font = 'italic 600 24px ' + FONTE_TITULO;
        ctx.fillText("Equipe Farol", W-300, 770);
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(180, 782); ctx.lineTo(420, 782);
        ctx.moveTo(W-420, 782); ctx.lineTo(W-180, 782); ctx.stroke();
        ctx.fillStyle = "#8093ad"; ctx.font = '600 12px ' + FONTE_CORPO;
        textoEspacado(ctx, "DATA DE EMISSÃO", 300, 802, 2);
        textoEspacado(ctx, "COORDENAÇÃO", W-300, 802, 2);

        // Legal support text at the very bottom
        ctx.fillStyle = "#8093ad";
        ctx.font = '400 11px ' + FONTE_CORPO;
        ctx.fillText("Curso Livre de Qualificação Profissional, amparado pela Lei nº 9.394/96 e Decreto nº 5.154/04", W/2, 822);

        // Código de verificação (vertical, na borda esquerda)
        ctx.save();
        ctx.translate(68, H/2); ctx.rotate(-Math.PI/2);
        ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.32)";
        ctx.font = '600 12px ' + FONTE_CORPO;
        textoEspacado(ctx, "CÓDIGO DE VERIFICAÇÃO · " + d.codigo, 0, 0, 1.5);
        ctx.restore();
      } else {
        // Lado VERSO (Syllabus + Coordinator Info)
        ctx.fillStyle = hexA(cor, 0.95);
        ctx.font = '700 17px ' + FONTE_CORPO;
        textoEspacado(ctx, "REGISTRO ACADÊMICO · CONTEÚDO PROGRAMÁTICO", W/2, 120, 3);

        ctx.fillStyle = "#ffffff";
        ctx.font = '800 38px ' + FONTE_TITULO;
        ctx.fillText(d.foco, W/2, 180);
        divisor(ctx, W/2, 210, 100, cor);

        ctx.fillStyle = "#aebfd6";
        ctx.font = '700 20px ' + FONTE_CORPO;
        ctx.fillText("Módulos concluídos pelo aluno:", W/2, 260);

        // List modules
        ctx.fillStyle = "#ffffff";
        ctx.font = '400 18px ' + FONTE_CORPO;
        var startY = 310;
        if (d.ementa && d.ementa.length) {
          d.ementa.forEach(function (mText, index) {
            ctx.fillText(mText, W/2, startY + index * 38);
          });
        }

        // Coordenação e CPF do Coordenador
        ctx.fillStyle = "#dce6f5";
        ctx.font = 'italic 600 24px ' + FONTE_TITULO;
        ctx.fillText("Equipe Farol", W/2, 630);
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(W/2 - 120, 642); ctx.lineTo(W/2 + 120, 642); ctx.stroke();
        
        ctx.fillStyle = "#8093ad";
        ctx.font = '600 12px ' + FONTE_CORPO;
        textoEspacado(ctx, "COORDENAÇÃO PEDAGÓGICA · CPF 86.082.026/543", W/2, 662, 2);

        // Legal support
        ctx.fillStyle = "#8093ad";
        ctx.font = '400 13px ' + FONTE_CORPO;
        ctx.fillText("Curso Livre de Qualificação Profissional, amparado pela Lei nº 9.394/96 e Decreto nº 5.154/04", W/2, 720);
        ctx.fillText("Válido em todo o território nacional. Registro sob código: " + d.codigo, W/2, 745);
      }
    }

    /* ---- Requisitos (módulos que faltam) ---- */
    function requisitosCurso(cursoId) {
      var c = porId(cursoId); if (!c) return [];
      var out = [];
      c.modulos.forEach(function (m) {
        if (!estaModuloConcluido(cursoId, m.id))
          out.push({ rotulo: "Módulo " + m.num + " · " + m.titulo, href: m.arquivo, criterio: m.criterio });
      });
      return out;
    }
    function requisitosPrograma() {
      var out = [];
      CURSOS.forEach(function (c) {
        c.modulos.forEach(function (m) {
          if (c.id === "curso6" && m.id === "c6m6") return; // o próprio certificado
          if (!estaModuloConcluido(c.id, m.id))
            out.push({ rotulo: c.titulo + " → " + m.titulo, href: "../" + pasta(c) + m.arquivo });
        });
      });
      return out;
    }

    /* ---- Dados do certificado por escopo ---- */
    function dadosCurso(cursoId, nm, cpfVal) {
      var c = porId(cursoId);
      var ementa = c ? c.modulos.map(function(m) { return "Módulo " + m.num + ": " + m.titulo + " (" + (m.tempo || "6 min") + ")"; }) : [];
      return {
        cor: c ? c.cor : "#4f7cff",
        titulo: "Certificado de Conclusão",
        escopoTexto: "por concluir com êxito o curso",
        foco: c ? c.titulo : "",
        detalhe: (c ? c.modulos.length : 4) + " módulos · " + (c ? c.subtitulo : ""),
        nome: nm,
        cpf: cpfVal,
        cargaHoraria: c ? (c.cargaHoraria || "4 horas") : "4 horas",
        ementa: ementa,
        data: dataHoje(),
        codigo: codigo(nm + "|" + cpfVal, "C" + String(cursoId).replace("curso", ""))
      };
    }
    function dadosPrograma(nm, cpfVal) {
      var ementa = CURSOS.map(function(c, idx) { return "Curso " + (idx+1) + ": " + c.titulo + " (" + c.modulos.length + " módulos)"; });
      return {
        cor: "#e3b341",
        titulo: "Certificado de Conclusão",
        escopoTexto: "por concluir com êxito o programa completo",
        foco: "Farol · IA para Pequenos Negócios",
        detalhe: CURSOS.length + " cursos · " + CURSOS.reduce(function(s,c){return s+c.modulos.length;},0) + " módulos",
        nome: nm,
        cpf: cpfVal,
        cargaHoraria: "26 horas",
        ementa: ementa,
        data: dataHoje(),
        codigo: codigo(nm + "|" + cpfVal, "PRG")
      };
    }

    /* ---- Monta a UI de emissão dentro de um container ---- */
    function montar(opts) {
      opts = opts || {};
      var escopo = opts.escopo === "programa" ? "programa" : "curso";
      var cursoId = opts.cursoId || null;
      var container = opts.container;
      if (!container) return;

      var c = escopo === "curso" ? porId(cursoId) : null;
      var cor = escopo === "curso" ? (c ? c.cor : "#4f7cff") : "#e3b341";
      var ident = cursoId || "programa";
      var titulo = escopo === "curso" ? "Certificado do curso" : "Certificado de conclusão do programa";
      var descricao = escopo === "curso"
        ? "Conclua os " + (c ? c.modulos.length : 4) + " módulos deste curso e emita um certificado com o seu nome — gerado aqui no navegador."
        : "Conclua todos os " + CURSOS.length + " cursos e emita o certificado final do programa Farol, com o seu nome.";
      var arquivo = escopo === "curso" ? "certificado-" + ident + "-frente.png" : "certificado-farol-frente.png";

      container.innerHTML =
        '<div class="vidro cartao pilha cert-painel">' +
          '<div class="cert-cabecalho">' +
            '<span class="cert-tag">🎓 Certificado</span>' +
            '<h2 class="mt-0">' + titulo + '</h2>' +
            '<p class="suave" style="margin:0">' + descricao + '</p>' +
          '</div>' +
          '<div class="cert-bloqueio feedback erro" role="status"></div>' +
          '<div class="cert-campos" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1rem">' +
            '<div class="campo">' +
              '<label for="cert-nome-' + ident + '">Nome completo</label>' +
              '<input class="entrada cert-nome" id="cert-nome-' + ident + '" type="text" placeholder="Maria Silva" maxlength="60" autocomplete="name">' +
              '<small class="suave">Como vai aparecer no certificado.</small>' +
            '</div>' +
            '<div class="campo">' +
              '<label for="cert-cpf-' + ident + '">CPF (obrigatório)</label>' +
              '<input class="entrada cert-cpf" id="cert-cpf-' + ident + '" type="text" placeholder="000.000.000-00" maxlength="14">' +
              '<small class="suave">Para a rastreabilidade e validade do certificado.</small>' +
            '</div>' +
          '</div>' +
          '<div class="cert-msg feedback" role="status"></div>' +
          '<div class="flex" style="gap:1rem;flex-wrap:wrap">' +
            '<button class="botao cert-gerar" type="button">Gerar certificado</button>' +
            '<button class="botao botao-fantasma cert-toggle-lado esconder" type="button">🔄 Ver Verso</button>' +
            '<a class="botao botao-fantasma cert-baixar esconder" download="' + arquivo + '">⬇ Baixar Frente</a>' +
          '</div>' +
          '<div class="cert-moldura esconder"><canvas class="cert-canvas" aria-label="Pré-visualização do certificado"></canvas></div>' +
        '</div>';

      var painel = container.querySelector(".cert-painel");
      var inputNome = container.querySelector(".cert-nome");
      var inputCpf = container.querySelector(".cert-cpf");
      var btn = container.querySelector(".cert-gerar");
      var btnToggleLado = container.querySelector(".cert-toggle-lado");
      var baixar = container.querySelector(".cert-baixar");
      var bloqueio = container.querySelector(".cert-bloqueio");
      var msg = container.querySelector(".cert-msg");
      var moldura = container.querySelector(".cert-moldura");
      var canvas = container.querySelector(".cert-canvas");
      painel.style.setProperty("--cor-acento", cor);

      var faltando = escopo === "curso" ? requisitosCurso(cursoId) : requisitosPrograma();

      if (faltando.length) {
        bloqueio.classList.add("mostrar");
        var itens = faltando.slice(0, 6).map(function (f) {
          return '<a href="' + f.href + '">' + f.rotulo + '</a>';
        }).join(" · ");
        bloqueio.innerHTML = "🔒 Para liberar este certificado, conclua: " + itens +
          (faltando.length > 6 ? " e mais " + (faltando.length - 6) : "") + "." +
          '<span style="display:block;margin-top:0.45rem;font-weight:400;opacity:0.85">' +
          "Cada módulo só conta quando você cumpre o critério dele (ler e marcar, completar a " +
          "checklist, validar o link…) — não basta abrir a página.</span>";
      } else {
        msg.className = "cert-msg feedback ok mostrar";
        msg.innerHTML = "✅ " + (escopo === "curso" ? "Curso concluído!" : "Tudo concluído!") +
          " Preencha o seu nome, seu CPF e toque em <strong>“Gerar certificado”</strong> para emitir.";
      }

      function pronto() {
        return faltando.length === 0 && !!validarNome(inputNome.value) && validarCPF(inputCpf.value);
      }
      function refletir() { btn.classList.toggle("cert-indisponivel", !pronto()); }

      inputNome.value = nome();
      inputCpf.value = formatarCPF(cpf());

      inputNome.addEventListener("input", function () {
        definirNome(inputNome.value);
        if (/\berro\b/.test(msg.className)) { msg.className = "cert-msg feedback"; }
        refletir();
      });

      inputCpf.addEventListener("input", function () {
        var formatted = formatarCPF(inputCpf.value);
        inputCpf.value = formatted;
        definirCpf(formatted);
        if (/\berro\b/.test(msg.className)) { msg.className = "cert-msg feedback"; }
        refletir();
      });

      var ladoAtivo = "frente";

      btnToggleLado.addEventListener("click", function() {
        ladoAtivo = ladoAtivo === "frente" ? "verso" : "frente";
        var nm = validarNome(inputNome.value);
        var cpfVal = inputCpf.value;
        var dados = escopo === "curso" ? dadosCurso(cursoId, nm, cpfVal) : dadosPrograma(nm, cpfVal);
        desenhar(canvas, dados, ladoAtivo);
        baixar.href = canvas.toDataURL("image/png");
        baixar.download = ladoAtivo === "frente" ? "certificado-" + ident + "-frente.png" : "certificado-" + ident + "-verso.png";
        baixar.textContent = ladoAtivo === "frente" ? "⬇ Baixar Frente" : "⬇ Baixar Verso";
        btnToggleLado.textContent = ladoAtivo === "frente" ? "🔄 Ver Verso" : "🔄 Ver Frente";
      });

      btn.addEventListener("click", function () {
        if (faltando.length) {
          msg.className = "cert-msg feedback erro mostrar";
          msg.textContent = "Conclua os módulos pendentes acima antes de emitir o certificado.";
          return;
        }
        var nm = validarNome(inputNome.value);
        if (!nm) {
          inputNome.focus();
          msg.className = "cert-msg feedback erro mostrar";
          msg.textContent = "Digite o seu nome (mínimo 2 letras) para emitir o certificado.";
          return;
        }
        if (!validarCPF(inputCpf.value)) {
          inputCpf.focus();
          msg.className = "cert-msg feedback erro mostrar";
          msg.textContent = "Por favor, digite um CPF válido para registro do seu certificado.";
          return;
        }
        definirNome(nm);
        var cpfVal = inputCpf.value;
        definirCpf(cpfVal);

        var dados = escopo === "curso" ? dadosCurso(cursoId, nm, cpfVal) : dadosPrograma(nm, cpfVal);
        btn.classList.add("cert-indisponivel");
        msg.className = "cert-msg feedback mostrar"; msg.textContent = "Gerando seu certificado…";
        comFontes(function () {
          ladoAtivo = "frente";
          desenhar(canvas, dados, ladoAtivo);
          moldura.classList.remove("esconder");
          try {
            baixar.href = canvas.toDataURL("image/png");
            baixar.download = "certificado-" + ident + "-frente.png";
            baixar.textContent = "⬇ Baixar Frente";
          } catch (e) {}
          baixar.classList.remove("esconder");
          btnToggleLado.classList.remove("esconder");
          btnToggleLado.textContent = "🔄 Ver Verso";

          if (escopo === "programa") marcarModuloConcluido("curso6", "c6m6");
          else {
            definirFlag(cursoId, "certificadoEmitido", true);
            if (cursoId === "curso5") marcarModuloConcluido("curso5", "c5m4");
          }
          msg.className = "cert-msg feedback ok mostrar";
          msg.textContent = "Certificado emitido com sucesso! 🎉 Use o botão 'Ver Verso' para ver a ementa/registro, e baixe os dois lados se desejar.";
          btn.textContent = "Gerar novamente";
          btn.classList.remove("cert-indisponivel");
          try { moldura.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) {}
        });
      });

      refletir();
    }

    return { montar: montar, desenhar: desenhar, validarNome: validarNome };
  })();

  // Expõe a API pública.
  window.Farol = {
    CURSOS: CURSOS,
    carregar: carregar,
    marcarModuloConcluido: marcarModuloConcluido,
    estaModuloConcluido: estaModuloConcluido,
    definirFlag: definirFlag,
    flag: flag,
    pontuacao: pontuacao,
    definirNome: definirNome,
    nome: nome,
    definirCpf: definirCpf,
    cpf: cpf,
    progressoCurso: progressoCurso,
    progressoGeral: progressoGeral,
    proximoModulo: proximoModulo,
    resetar: resetar,
    alternarTema: alternarTema,
    initReveal: initReveal,
    Certificado: Certificado
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
