/* ============================================================================
   limpar.js · Substituição de jargão técnico no conteúdo visível
   ----------------------------------------------------------------------------
   ATENÇÃO: este script SÓ altera o TEXTO visível das páginas .html.
   Ele NUNCA toca em:
     - arquivos .js (evita corromper identificadores como WebGLRenderer);
     - blocos <script> e <style> dentro do HTML;
     - comentários HTML (<!-- ... -->);
     - atributos de tags (id, class, href, etc.).

   Histórico: uma versão anterior aplicava as substituições direto em .js e
   dentro de <script>, o que transformou `THREE.WebGLRenderer` em
   `THREE.Gráficos 3DRenderer` (erro de sintaxe). O tokenizador abaixo impede
   que isso volte a acontecer.
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

// pattern (regex string) -> replacement. Mantenha apenas substituições que
// devem aparecer no texto lido pelo aluno.
const replacements = {
    '\\bRAG\\b': 'Assistente com Dados',
    '\\bSpec\\b': 'Roteiro do Sistema'
};

// Tokens que devem permanecer intocados: script, style, comentários e tags.
const PROTECTED = /<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->|<[^>]+>/gi;

function applyToText(text) {
    let out = text;
    for (const [pattern, replacement] of Object.entries(replacements)) {
        out = out.replace(new RegExp(pattern, 'g'), replacement);
    }
    return out;
}

// Aplica as substituições apenas nas porções de texto entre as tags.
function transformHtml(html) {
    let out = '';
    let last = 0;
    let m;
    PROTECTED.lastIndex = 0;
    while ((m = PROTECTED.exec(html)) !== null) {
        out += applyToText(html.slice(last, m.index)); // texto antes do token
        out += m[0];                                   // token preservado
        last = PROTECTED.lastIndex;
    }
    out += applyToText(html.slice(last));              // texto após o último token
    return out;
}

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.html')) { // SÓ .html — nunca .js
            results.push(file);
        }
    });
    return results;
}

const files = walk(baseDir);
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = transformHtml(content);
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
    }
});
console.log('Jargon replacement complete.');
