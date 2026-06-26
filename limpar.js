const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const replacements = {
    '\\bRAG\\b': 'Assistente com Dados',
    'Manual de Instruções da IA': 'Manual de Instruções da IA',
    'Manual de Instruções da IA': 'Manual de Instruções da IA',
    'manual de instruções da IA': 'manual de instruções da IA',
    'Invenção de Respostas': 'Invenção de Respostas',
    'invenção de respostas': 'invenção de respostas',
    'Análise de Lucratividade': 'Análise de Lucratividade',
    'Regra do 80/20': 'Regra do 80/20',
    'Gráficos 3D': 'Gráficos 3D',
    '\\bSpec\\b': 'Roteiro do Sistema',
    'Ferramenta de Comandos do Windows': 'Ferramenta de Comandos do Windows'
};

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.html') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(baseDir);
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    for (const [pattern, replacement] of Object.entries(replacements)) {
        const regex = new RegExp(pattern, 'g');
        newContent = newContent.replace(regex, replacement);
    }
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
    }
});
console.log('Jargon replacement complete.');
