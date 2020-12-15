let textContent;
let listContent = "";

const wordRegex = /\w+/g;

document.querySelector("#file-input").onchange = readTextContents;
document.querySelector("#list-input").onchange = readFilterContents;
document.querySelector("#compute").onclick = computeWordFrequency;
let resultElement = document.getElementById("file-contents");


// Obtenção dos arquivos

function readTextContents() {
    let reader = new FileReader()
    reader.onload = function(e) { textContent = e.target.result; };

    let file = document.querySelector("#file-input").files[0];
    reader.readAsText(file);
    resultElement.innerHTML = "Arquivo do texto foi lido.";
}

function readFilterContents() {
    let reader = new FileReader()
    let listInput = document.querySelector("#list-input");
    if (listInput.files.length == 0) {
        console.log("Sem filtrar palavras.");
        listContent = "";
    } else {
        reader.onload = function(e) { listContent = e.target.result; };
        
        let file = listInput.files[0];
        reader.readAsText(file);
        resultElement.innerHTML = "Arquivo de palavras a serem filtradas foi lido.";
    }
}


// Processamento dos arquivos

// Função responsável por contar e filtrar as palavras
// Requisitos de entrada: um texto lido não-vazio
// Tarefas: analisar o texto afim de contar quantas vezes cada palavra apareceu;
// filtrar as palavras solicitadas pelo usuário; ordenar o resultado do mais
// frequente para o menos frequente e exibí-lo na tela.
function computeWordFrequency() {
    let text;
    let filterList;

    // Validação: Checa se há um texto lido
    if (!textContent) {
        resultElement.innerHTML = "Arquivo de texto n&atilde;o foi selecionado.";
        return;
    } else {
        text = textContent;
    }

    // Checa se há uma lista de palavras a serem filtradas
    if (!listContent) {
        filterList = []
    } else {
        filterList = listContent.split("\n")
    }

    // Conta as palavras
    let frequencyDict = countWords(textContent, filterList);

    // Ordena a contagem
    let sortedFrequencies = sortWordFrequencyDictionary(frequencyDict);

    // Mostra a contagem
    showWordFrequencyResult(sortedFrequencies);
}

// Contar as palavras do texto, ignorando as contidas no filtro de palavras
// Entrada: uma string e um filtro definido por uma lista de palavras
// Saída: dicionário onde as chaves são as palavras e os valores significam
// quantas vezes aquela palavra apareceu no texto.
function countWords(text, wordFilterList) {
    let frequencyDict = {};
    let matchResult;
    do {
        matchResult = wordRegex.exec(text);
        if (matchResult) { // Se há um match
            // Coloque a palavra em minúsculas
            let match = matchResult[0].toLowerCase();
            
            // Pule para outra palavra se o filtro tem a palavra atual
            if (wordFilterList.indexOf(match) >= 0) { continue; }
            
            if (frequencyDict[match]) { // Se a palavra já estiver sido contada
                // Incremente 1
                frequencyDict[match] = frequencyDict[match] + 1
            } else { // Senão
                frequencyDict[match] = 1 // Inicialize como 1
            }
        }
    } while (matchResult); // Faça enquanto houver uma match
    return frequencyDict;
}

// Ordenar as frequências contadas
// Entrada: dicionário onde as chaves são as palavras e os valores significam
// quantas vezes aquela palavra apareceu no texto.
// Saída: lista onde cada elemento contém uma palavra e quantas
// vezes ela apareceu no texto, em ordem decrescente.
function sortWordFrequencyDictionary(dict) {
    // Lista de palavras em ordem de mais frequente para menos frequente
    let orderedFreq = []
    for (let word in dict) {
        // Encontre a posição que faz com que a inserção ocorra de forma que
        // a ordem das palavras se mantenha decrescente
        let insertionIndex = 0;
        for (let i = 0; i < orderedFreq.length; i++) {
            if (orderedFreq[i][1] > dict[word]) {
                insertionIndex = i + 1;
            }
        }
        // Insira a tupla na posição determinada anteriormente
        orderedFreq.splice(insertionIndex, 0, [word, dict[word]])
    }
    return orderedFreq
}

// Mostrar o resultado da contagem de palavras na página
// Entrada: lista onde cada elemento contém uma palavra e quantas
// vezes ela apareceu no texto, em ordem decrescente.
function showWordFrequencyResult(frequencies) {
    let newShownContent = "";
    if (!listContent) {
        newShownContent = "Nenhuma palavra foi filtrada.\n\n"
    }
    for (let tuple of frequencies) {
        let fim = tuple[1] > 1 ? "vezes" : "vez";
        newShownContent += `<strong>${tuple[0]}</strong> ${tuple[1]} ${fim}\n`
    }
    resultElement.innerHTML = newShownContent;
}