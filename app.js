// Seznam českých stop-slov (slova, která chceme ignorovat)
const czechStopWords = new Set([
    'a', 'aby', 'ale', 'ani', 'aniž', 'ano', 'asi', 'až', 'bez', 'bude', 'budem',
    'budeme', 'budeš', 'budete', 'budou', 'budu', 'byl', 'byla', 'byli', 'bylo',
    'byly', 'být', 'co', 'což', 'čím', 'čímž', 'či', 'do', 'ho', 'i', 'já', 'jak',
    'jaké', 'jako', 'je', 'jej', 'její', 'jejich', 'jemu', 'jen', 'jenž', 'jestli',
    'jestliže', 'ještě', 'jež', 'ji', 'jinak', 'jsem', 'jsi', 'jsme', 'jsou', 'jste',
    'k', 'kam', 'kde', 'kdo', 'kdy', 'když', 'ke', 'která', 'které', 'kterou', 'který',
    'kteří', 'ku', 'má', 'máte', 'mě', 'mezi', 'mí', 'mít', 'mně', 'mnou', 'mohl',
    'mohou', 'moje', 'moji', 'možná', 'můj', 'může', 'my', 'na', 'nad', 'nám', 'námi',
    'nás', 'naše', 'naši', 'ne', 'ně', 'nebo', 'neboť', 'nemají', 'než', 'nic', 'ním',
    'nimi', 'nižádná', 'nižádné', 'nižádný', 'no', 'o', 'od', 'ode', 'on', 'ona', 'oni',
    'ono', 'ony', 'pak', 'po', 'pod', 'podle', 'pokud', 'pouze', 'právě', 'pro', 'proč',
    'proto', 'protože', 'před', 'přede', 'přes', 'při', 's', 'se', 'si', 'sice', 'snad',
    'svá', 'své', 'svého', 'svém', 'svému', 'svých', 'svým', 'svými', 'svůj', 'ta', 'tady',
    'tak', 'takhle', 'taky', 'takže', 'tam', 'tato', 'te', 'tě', 'tebe', 'tebou', 'ten',
    'ti', 'tím', 'tímto', 'to', 'tobě', 'tohle', 'toto', 'tu', 'tvá', 'tvé', 'tvého',
    'tvém', 'tvému', 'tvých', 'tvým', 'tvými', 'tvůj', 'ty', 'určitě', 'už', 'v', 've',
    'však', 'vám', 'vámi', 'vás', 'vaše', 'vaši', 'více', 'vlastně', 'všechno', 'vy',
    'z', 'za', 'zda', 'zde', 'ze', 'zpět', 'že'
]);

// DOM elementy
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const wordCountDisplay = document.getElementById('wordCount');
const resultsSection = document.getElementById('resultsSection');
const totalWordsDisplay = document.getElementById('totalWords');
const uniqueWordsDisplay = document.getElementById('uniqueWords');
const mostCommonDisplay = document.getElementById('mostCommon');
const frequencyTableBody = document.getElementById('frequencyTableBody');
const wordcloudCanvas = document.getElementById('wordcloud');

// Event listenery
textInput.addEventListener('input', updateWordCount);
analyzeBtn.addEventListener('click', analyzeText);
clearBtn.addEventListener('click', clearAll);

// Funkce pro počítání slov v textovém poli
function updateWordCount() {
    const text = textInput.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    wordCountDisplay.textContent = `Počet slov: ${words}`;

    if (words > 10000) {
        wordCountDisplay.style.color = '#e53e3e';
        wordCountDisplay.textContent = `Počet slov: ${words} (maximum je 10 000 slov)`;
    } else {
        wordCountDisplay.style.color = '#718096';
    }
}

// Hlavní funkce pro analýzu textu
function analyzeText() {
    const text = textInput.value.trim();

    if (!text) {
        alert('Prosím, vložte nějaký text pro analýzu.');
        return;
    }

    // Normalizace textu a rozdělení na slova
    const words = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Odstranění diakritiky pro porovnávání
        .match(/\b[\wáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+\b/g) || [];

    if (words.length === 0) {
        alert('V textu nebyly nalezeny žádná slova.');
        return;
    }

    if (words.length > 10000) {
        alert('Text obsahuje více než 10 000 slov. Prosím, zkraťte text.');
        return;
    }

    // Počítání četnosti slov
    const wordFrequency = {};
    let totalWords = 0;

    words.forEach(word => {
        // Filtrujeme stop-slova a velmi krátká slova
        if (word.length > 2 && !czechStopWords.has(word)) {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
            totalWords++;
        }
    });

    // Seřazení podle četnosti
    const sortedWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1]);

    if (sortedWords.length === 0) {
        alert('Po filtrování stop-slov nezbyla žádná slova k analýze.');
        return;
    }

    // Zobrazení statistik
    displayStatistics(totalWords, sortedWords);

    // Vytvoření tabulky četností
    displayFrequencyTable(sortedWords, totalWords);

    // Vytvoření word cloudu
    createWordCloud(sortedWords);

    // Zobrazení sekce výsledků
    resultsSection.style.display = 'block';

    // Plynulý scroll k výsledkům
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Zobrazení základních statistik
function displayStatistics(totalWords, sortedWords) {
    totalWordsDisplay.textContent = totalWords;
    uniqueWordsDisplay.textContent = sortedWords.length;

    if (sortedWords.length > 0) {
        mostCommonDisplay.textContent = `${sortedWords[0][0]} (${sortedWords[0][1]}×)`;
    }
}

// Zobrazení tabulky četností
function displayFrequencyTable(sortedWords, totalWords) {
    frequencyTableBody.innerHTML = '';

    // Zobrazíme top 20 slov
    const topWords = sortedWords.slice(0, 20);

    topWords.forEach(([word, count], index) => {
        const percentage = ((count / totalWords) * 100).toFixed(2);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${word}</td>
            <td>${count}</td>
            <td>${percentage}%</td>
        `;
        frequencyTableBody.appendChild(row);
    });
}

// Vytvoření word cloudu
function createWordCloud(sortedWords) {
    // Příprava dat pro wordcloud2.js
    // Formát: [[slovo, váha], [slovo, váha], ...]
    const wordCloudData = sortedWords.map(([word, count]) => [word, count]);

    // Získání maximalní četnosti pro škálování
    const maxCount = sortedWords[0][1];

    // Konfigurace word cloudu
    const options = {
        list: wordCloudData,
        gridSize: Math.round(16 * wordcloudCanvas.width / 1024),
        weightFactor: function(size) {
            // Škálování velikosti písma podle četnosti
            return Math.pow(size / maxCount, 0.5) * wordcloudCanvas.width / 10;
        },
        fontFamily: 'Segoe UI, Arial, sans-serif',
        color: function() {
            // Náhodné barvy z barevné palety
            const colors = [
                '#667eea', '#764ba2', '#f093fb', '#4facfe',
                '#43e97b', '#fa709a', '#fee140', '#30cfd0'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        rotateRatio: 0.3,
        rotationSteps: 2,
        backgroundColor: '#ffffff',
        drawOutOfBound: false,
        shrinkToFit: true,
        minSize: 10
    };

    // Vymazání předchozího word cloudu
    const context = wordcloudCanvas.getContext('2d');
    context.clearRect(0, 0, wordcloudCanvas.width, wordcloudCanvas.height);

    // Vytvoření nového word cloudu
    try {
        WordCloud(wordcloudCanvas, options);
    } catch (error) {
        console.error('Chyba při vytváření word cloudu:', error);
        alert('Došlo k chybě při vytváření word cloudu. Zkuste to prosím znovu.');
    }
}

// Vymazání všeho
function clearAll() {
    textInput.value = '';
    updateWordCount();
    resultsSection.style.display = 'none';

    // Vymazání canvasu
    const context = wordcloudCanvas.getContext('2d');
    context.clearRect(0, 0, wordcloudCanvas.width, wordcloudCanvas.height);
}

// Inicializace
updateWordCount();
