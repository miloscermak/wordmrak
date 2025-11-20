# 🎯 Wordmrak - Textové analýzy a AI

Sbírka webových aplikací pro analýzu textu a obrázků pomocí AI.

## 📦 Aplikace

### 📊 Analýza četnosti slov - Word Cloud
Jednoduchá webová aplikace pro analýzu četnosti výskytu slov v textu a vytvoření krásné vizualizace formou word cloudu.

### 😊 Analýza emocí z tváře
Aplikace využívající Claude AI pro analýzu emocí na základě výrazu tváře na fotografii.

## ✨ Funkce

### Word Cloud (index.html)
- **Analýza textu**: Zpracování textů až do 10 000 slov
- **Statistiky**: Zobrazení celkového počtu slov, unikátních slov a nejčastějšího slova
- **Word Cloud**: Interaktivní a estetická vizualizace četnosti slov
- **Tabulka četností**: Top 20 nejčastějších slov s přesnými statistikami
- **Filtrace stop-slov**: Automatické filtrování českých stop-slov (a, ale, být, atd.)
- **Responzivní design**: Funguje na desktopu i mobilních zařízeních

### Analýza emocí (emotion-analysis.html)
- **AI analýza emocí**: Použití Claude 3.5 Sonnet pro detekci emocí z tváře
- **Detailní zpráva**: Primární emoce, sekundární emoce a indikátory
- **Vizuální náhled**: Preview nahraného obrázku před analýzou
- **Drag & Drop**: Snadné nahrání fotografií přetažením
- **Bezpečné API**: API klíč uložen pouze lokálně v prohlížeči
- **Responzivní design**: Funguje na všech zařízeních

## 🚀 Jak používat

### Word Cloud
1. **Otevřete aplikaci**: Otevřete soubor `index.html` ve webovém prohlížeči
2. **Vložte text**: Do textového pole vložte text, který chcete analyzovat (až 10 000 slov)
3. **Analyzujte**: Klikněte na tlačítko "Analyzovat text"
4. **Prohlédněte si výsledky**:
   - Statistiky o textu
   - Interaktivní word cloud
   - Tabulka s top 20 nejčastějšími slovy

### Analýza emocí
1. **Otevřete aplikaci**: Otevřete soubor `emotion-analysis.html` ve webovém prohlížeči
2. **Zadejte API klíč**: Získejte Claude API klíč na [console.anthropic.com](https://console.anthropic.com/) a zadejte ho do formuláře
3. **Nahrajte fotografii**: Přetáhněte fotografii tváře do upload oblasti nebo klikněte pro výběr souboru
4. **Analyzujte**: Klikněte na tlačítko "Analyzovat emoce"
5. **Prohlédněte si výsledky**:
   - Primární emoce s úrovní jistoty
   - Detailní analýza výrazu tváře
   - Indikátory jednotlivých rysů (oči, ústa, obočí, atd.)

## 🎨 Funkce aplikace

### Automatická filtrace
- Odstraňuje běžná stop-slova (spojky, předložky, zájmena)
- Ignoruje slova kratší než 3 znaky
- Normalizuje text pro lepší analýzu

### Vizualizace
- Barevný word cloud s náhodnými barvami z paletky
- Velikost slov odpovídá jejich četnosti
- Responzivní zobrazení na všech zařízeních

### Statistiky
- Celkový počet slov v textu
- Počet unikátních slov
- Nejčastěji se vyskytující slovo
- Procentuální frekvence každého slova

## 🛠️ Technologie

### Word Cloud
- **HTML5**: Struktura aplikace
- **CSS3**: Moderní a responzivní design s gradientami a animacemi
- **JavaScript (ES6+)**: Logika aplikace a analýza textu
- **WordCloud2.js**: Knihovna pro generování word cloudů

### Analýza emocí
- **HTML5**: Struktura aplikace
- **CSS3**: Moderní a responzivní design
- **JavaScript (ES6+)**: Logika aplikace a komunikace s API
- **Claude API**: Anthropic Claude 3.5 Sonnet pro analýzu obrázků
- **Fetch API**: Asynchronní komunikace s Claude API

## 📋 Požadavky

### Word Cloud
- Moderní webový prohlížeč (Chrome, Firefox, Safari, Edge)
- Připojení k internetu (pro načtení WordCloud2.js knihovny)

### Analýza emocí
- Moderní webový prohlížeč s podporou Fetch API
- Připojení k internetu
- **Claude API klíč** (získejte na [console.anthropic.com](https://console.anthropic.com/))

## 🎯 Použití

### Word Cloud - ideální pro:
- Analýzu textových dokumentů
- Zjištění klíčových slov v textu
- Vizualizaci nejdůležitějších pojmů
- Studium frekvence slov v textech
- Vytvoření prezentačních materiálů

### Analýza emocí - ideální pro:
- Výzkum emocí a výrazů tváře
- Analýzu zákaznických reakcí
- Studium lidských emocí
- Testování AI schopností rozpoznávání emocí
- Vzdělávací účely v psychologii

## 📝 Příklad použití

### Word Cloud
1. Vložte například text článku nebo knihy
2. Klikněte na "Analyzovat text"
3. Prohlédněte si, která slova se vyskytují nejčastěji
4. Word cloud vám ukáže vizuální reprezentaci nejdůležitějších slov

### Analýza emocí
1. Získejte Claude API klíč na console.anthropic.com
2. Nahrajte fotografii tváře (ideálně přední pohled)
3. Klikněte na "Analyzovat emoce"
4. Claude AI vám poskytne detailní analýzu rozpoznaných emocí

## 🎨 Barevná paleta

Obě aplikace používají moderní gradientovou paletu:
- Primární barva: #667eea
- Sekundární barva: #764ba2
- Accent barvy: #f093fb, #4facfe, #43e97b, #fa709a, #fee140, #30cfd0

## 🔒 Bezpečnost a soukromí

### Analýza emocí
- **API klíč**: Váš Claude API klíč je uložen pouze v localStorage vašeho prohlížeče
- **Zpracování dat**: Fotografie se odesílají přímo do Anthropic API přes HTTPS
- **Bez ukládání**: Žádné fotografie ani data nejsou ukládány na server
- **Lokální běh**: Aplikace běží kompletně ve vašem prohlížeči

## 📄 Licence

Tento projekt je k dispozici pro volné použití.

## 🤝 Přispění

Máte nápad na vylepšení? Neváhejte vytvořit pull request nebo issue!

---

Vytvořeno s ❤️ pro analýzu textů
