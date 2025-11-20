// DOM elementy
const apiKeyInput = document.getElementById('apiKey');
const toggleApiKeyBtn = document.getElementById('toggleApiKey');
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const primaryEmotionDisplay = document.getElementById('primaryEmotion');
const detailedAnalysisDisplay = document.getElementById('detailedAnalysis');
const emotionIndicatorsDisplay = document.getElementById('emotionIndicators');

// Globální proměnné
let selectedImageBase64 = null;
let selectedImageType = null;

// Lokální úložiště API klíče
const API_KEY_STORAGE = 'claude_api_key';

// Načtení API klíče z localStorage při startu
window.addEventListener('DOMContentLoaded', () => {
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
});

// Uložení API klíče do localStorage
apiKeyInput.addEventListener('change', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem(API_KEY_STORAGE, apiKey);
    }
    checkFormValidity();
});

// Zobrazit/skrýt API klíč
toggleApiKeyBtn.addEventListener('click', () => {
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleApiKeyBtn.textContent = '🙈';
    } else {
        apiKeyInput.type = 'password';
        toggleApiKeyBtn.textContent = '👁️';
    }
});

// Upload area - kliknutí
uploadArea.addEventListener('click', () => {
    imageInput.click();
});

// Upload area - drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImageFile(files[0]);
    }
});

// Input změna
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
    }
});

// Odstranění obrázku
removeImageBtn.addEventListener('click', () => {
    clearImage();
});

// Tlačítko pro analýzu
analyzeBtn.addEventListener('click', () => {
    analyzeEmotion();
});

// Zpracování souboru s obrázkem
function handleImageFile(file) {
    // Kontrola typu
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Nepodporovaný formát. Použijte JPG, PNG nebo WEBP.');
        return;
    }

    // Kontrola velikosti (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        alert('Soubor je příliš velký. Maximum je 5MB.');
        return;
    }

    // Načtení a zobrazení náhledu
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64Data = e.target.result;
        selectedImageBase64 = base64Data.split(',')[1]; // Odstranění data:image/jpeg;base64, prefixu
        selectedImageType = file.type;

        // Zobrazení náhledu
        previewImage.src = base64Data;
        uploadArea.style.display = 'none';
        imagePreview.style.display = 'flex';

        checkFormValidity();
    };

    reader.onerror = () => {
        alert('Chyba při načítání souboru.');
    };

    reader.readAsDataURL(file);
}

// Vymazání obrázku
function clearImage() {
    selectedImageBase64 = null;
    selectedImageType = null;
    previewImage.src = '';
    imageInput.value = '';
    uploadArea.style.display = 'flex';
    imagePreview.style.display = 'none';
    resultsSection.style.display = 'none';
    checkFormValidity();
}

// Kontrola validity formuláře
function checkFormValidity() {
    const hasApiKey = apiKeyInput.value.trim().length > 0;
    const hasImage = selectedImageBase64 !== null;

    analyzeBtn.disabled = !(hasApiKey && hasImage);
}

// Hlavní funkce pro analýzu emoce
async function analyzeEmotion() {
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        alert('Prosím, zadejte API klíč.');
        return;
    }

    if (!selectedImageBase64) {
        alert('Prosím, nahrajte fotografii.');
        return;
    }

    // Zobrazení loading stavu
    loadingSection.style.display = 'block';
    resultsSection.style.display = 'none';
    analyzeBtn.disabled = true;

    try {
        // Volání Claude API
        const result = await callClaudeAPI(apiKey, selectedImageBase64, selectedImageType);

        // Zobrazení výsledků
        displayResults(result);

        // Scroll k výsledkům
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

    } catch (error) {
        console.error('Chyba při analýze:', error);
        alert(`Chyba při analýze: ${error.message}`);
    } finally {
        loadingSection.style.display = 'none';
        analyzeBtn.disabled = false;
    }
}

// Volání Claude API
async function callClaudeAPI(apiKey, imageBase64, imageType) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: imageType,
                                data: imageBase64
                            }
                        },
                        {
                            type: 'text',
                            text: `Analyzuj tuto fotografii tváře a urči emoce, které osoba vyjadřuje.

Proveď detailní analýzu a poskytni odpověď v následujícím formátu JSON:

{
  "primary_emotion": "název primární emoce (např. radost, smutek, vztek, strach, překvapení, znechucení, neutrální)",
  "confidence": "vysoká/střední/nízká",
  "detailed_analysis": "Podrobný popis výrazu tváře a pozorovaných emočních signálů (2-3 věty v češtině)",
  "indicators": [
    {
      "feature": "název rysu (např. oči, ústa, obočí, celková tvář)",
      "description": "popis tohoto rysu v češtině",
      "emotion_signal": "jakou emoci tento rys signalizuje"
    }
  ],
  "secondary_emotions": ["seznam dalších možných emocí, pokud jsou přítomny"],
  "notes": "další poznámky nebo kontext (volitelné, v češtině)"
}

Odpověz POUZE validním JSON objektem bez dalšího textu.`
                        }
                    ]
                }
            ]
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API chyba: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Extrakce textu z odpovědi
    const textContent = data.content.find(c => c.type === 'text')?.text || '';

    // Parsování JSON z odpovědi
    try {
        // Pokus o extrakci JSON z odpovědi (Claude může přidat markdown formátování)
        let jsonText = textContent.trim();

        // Odstranění markdown kódu, pokud existuje
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        }

        const result = JSON.parse(jsonText);
        return result;
    } catch (error) {
        console.error('Chyba při parsování JSON:', error);
        console.log('Odpověď:', textContent);
        throw new Error('Claude nevrátil validní JSON. Zkuste to prosím znovu.');
    }
}

// Zobrazení výsledků
function displayResults(result) {
    // Primární emoce
    const emotionEmojis = {
        'radost': '😊',
        'štěstí': '😄',
        'smutek': '😢',
        'vztek': '😠',
        'strach': '😨',
        'překvapení': '😲',
        'znechucení': '🤢',
        'neutrální': '😐',
        'zamyšlení': '🤔',
        'úzkost': '😰',
        'zklamání': '😞'
    };

    const emoji = emotionEmojis[result.primary_emotion.toLowerCase()] || '😶';
    primaryEmotionDisplay.innerHTML = `
        <div class="emotion-badge ${result.confidence}">
            <span class="emotion-emoji">${emoji}</span>
            <span class="emotion-name">${result.primary_emotion}</span>
            <span class="confidence-badge">Jistota: ${result.confidence}</span>
        </div>
    `;

    // Detailní analýza
    detailedAnalysisDisplay.innerHTML = `
        <p>${result.detailed_analysis}</p>
        ${result.secondary_emotions && result.secondary_emotions.length > 0 ? `
            <div class="secondary-emotions">
                <strong>Sekundární emoce:</strong>
                ${result.secondary_emotions.map(e => `<span class="emotion-tag">${e}</span>`).join('')}
            </div>
        ` : ''}
        ${result.notes ? `<p class="notes"><em>${result.notes}</em></p>` : ''}
    `;

    // Indikátory emocí
    if (result.indicators && result.indicators.length > 0) {
        emotionIndicatorsDisplay.innerHTML = result.indicators.map(indicator => `
            <div class="indicator-card">
                <h4>${indicator.feature}</h4>
                <p>${indicator.description}</p>
                <span class="emotion-signal">→ ${indicator.emotion_signal}</span>
            </div>
        `).join('');
    } else {
        emotionIndicatorsDisplay.innerHTML = '<p>Žádné specifické indikátory nebyly identifikovány.</p>';
    }

    // Zobrazení sekce výsledků
    resultsSection.style.display = 'block';
}

// Inicializace
checkFormValidity();
