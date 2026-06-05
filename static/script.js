// --- UTILITIES ---

// Simple HTML escaping to prevent XSS in the history table
function escapeHTML(str) {
    if (!str) return 'N/A';
    return String(str).replace(/[&<>'"]/g, match => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[match] || match));
}

function formatColor(hexString) {
    return hexString.replace('#', '').toUpperCase() + 'FF';
}

function getSwatchCell(colorCode, colourName = '') {
    if (!colorCode || colorCode === 'N/A') return '';
    const swatchColor = '#' + colorCode.substring(0, 6);
    return `<span class="color-swatch" title="${swatchColor}" style="background-color: ${swatchColor};">${escapeHTML(colourName)}</span>`;
}

// --- GLOBAL VARIABLES ---

const inputs = document.querySelectorAll('input, select');
const outputDisplay = document.getElementById('outputCode');
const copyBtn = document.getElementById('copyBtn');
const notLimitedDinosaurs = ['Omniraptor'];

// --- INITIALIZATION ---

window.addEventListener('load', () => {
    updateMeta();

    const lastCode = localStorage.getItem('lastSkinCode');
    if (lastCode) {
        document.getElementById('importInput').value = lastCode;
        importCode();
    }

    renderHistoryTable();
    generateCode(false); // Initialize output without saving to storage immediately
});

// --- CORE FUNCTIONS ---

function updateMeta() {
    fetch('manifest.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('title').textContent = `SKIN CODE GENERATOR - Version ${data.version}`;
            document.getElementById('gameInfo').textContent = `Developed for ${data.game.latest_tested_version} (${data.game.developed_for_game_branch})`;
        })
        .catch(error => {
            console.warn('Manifest not found or failed to load. Continuing with defaults.', error);
        });
}

function updateOmniraptorOnlySettings() {
    const isNotLimited = notLimitedDinosaurs.includes(document.getElementById('species').value);

    ['color6', 'color7', 'color8'].forEach(id => {
        const input = document.getElementById(id);
        const group = input.closest('.form-group');

        input.disabled = !isNotLimited;
        group.classList.toggle('disabled-setting', !isNotLimited);
        group.style.display = isNotLimited ? 'flex' : 'none'; // Ideally move this to CSS via class
    });
}

function ensureSpeciesOption(species) {
    const speciesSelect = document.getElementById('species');

    // Unspecified species should reset the selector to the built-in "None" option.
    if (!species) {
        speciesSelect.value = '';
        return;
    }

    const hasOption = Array.from(speciesSelect.options).some(option => option.value === species);

    if (!hasOption) {
        const option = document.createElement('option');
        option.value = species;
        option.textContent = species;
        speciesSelect.appendChild(option);
    }
    speciesSelect.value = species;
}

function generateCode(saveToStorage = true) {
    const species = document.getElementById('species').value;
    updateOmniraptorOnlySettings();

    // Optional: Clamp values here if users manually type > 9
    const pattern = document.getElementById('pattern').value;
    const variation = document.getElementById('variation').value;
    const theme = document.getElementById('theme').value;

    const c1 = formatColor(document.getElementById('color1').value); // Male Display
    const c2 = formatColor(document.getElementById('color2').value); // Markings
    const c3 = formatColor(document.getElementById('color3').value); // Flank
    const c4 = formatColor(document.getElementById('color4').value); // Body
    const c5 = formatColor(document.getElementById('color5').value); // Underbelly

    let c6 = '', c7 = '', c8 = '';

    if (species === 'Omniraptor') {
        c6 = formatColor(document.getElementById('color6').value); // Teeth
        c7 = formatColor(document.getElementById('color7').value); // Mouth
        c8 = formatColor(document.getElementById('color8').value); // Claws
    }

    const finalCode = `${species}${pattern}${variation}${theme}${c8}${c7}${c6}${c5}${c4}${c3}${c2}${c1}`;
    outputDisplay.textContent = finalCode;
    copyBtn.textContent = "Copy Code to Clipboard";

    if (saveToStorage) {
        localStorage.setItem('lastSkinCode', finalCode);
    }
}

function copyCode() {
    navigator.clipboard.writeText(outputDisplay.textContent).then(() => {
        copyBtn.textContent = "Copied!";
    });
}

function importCode() {
    const importInput = document.getElementById('importInput');
    const code = importInput.value.trim();

    if (!code) {
        alert("Please paste a skin code to import.");
        return;
    }

    const speciesOptions = Array.from(document.getElementById('species').options)
        .map(option => option.value)
        .filter(value => value);

    const matchingSpecies = speciesOptions
        .filter(species => code.startsWith(species))
        .sort((a, b) => b.length - a.length)[0];

    const species = matchingSpecies !== undefined
        ? matchingSpecies
        : (code.charAt(0) && !/\d/.test(code.charAt(0)) ? code.substring(0, code.search(/\d/)) : '');

    const L = code.length;
    const baseIndex = species.length;
    const metadataLength = 3;
    const remainingLength = L - baseIndex - metadataLength;

    if (L < baseIndex + metadataLength + 40) {
        alert("Invalid skin code. The code is too short.");
        return;
    }

    const pattern = code.charAt(baseIndex);
    const variation = code.charAt(baseIndex + 1);
    const theme = code.charAt(baseIndex + 2);

    if (isNaN(pattern) || isNaN(variation) || isNaN(theme)) {
        alert("Invalid skin code. Pattern, variation, and theme must be numeric digits.");
        return;
    }

    const hexRegex = /^[0-9A-F]{8}$/i;
    let c1 = '', c2 = '', c3 = '', c4 = '', c5 = '', c6 = '', c7 = '', c8 = '';

    if (remainingLength === 40) {
        c5 = code.substring(L - 40, L - 32);
        c4 = code.substring(L - 32, L - 24);
        c3 = code.substring(L - 24, L - 16);
        c2 = code.substring(L - 16, L - 8);
        c1 = code.substring(L - 8, L);
    } else if (remainingLength === 64) {
        c8 = code.substring(L - 64, L - 56);
        c7 = code.substring(L - 56, L - 48);
        c6 = code.substring(L - 48, L - 40);
        c5 = code.substring(L - 40, L - 32);
        c4 = code.substring(L - 32, L - 24);
        c3 = code.substring(L - 24, L - 16);
        c2 = code.substring(L - 16, L - 8);
        c1 = code.substring(L - 8, L);
    } else {
        alert("Invalid skin code. Color segments are malformed.");
        return;
    }

    if (!hexRegex.test(c5) || !hexRegex.test(c4) || !hexRegex.test(c3) || !hexRegex.test(c2) || !hexRegex.test(c1) ||
        (remainingLength === 64 && (!hexRegex.test(c8) || !hexRegex.test(c7) || !hexRegex.test(c6)))) {
        alert("Invalid skin code. Color segments contain invalid hex characters.");
        return;
    }

    ensureSpeciesOption(species);
    document.getElementById('pattern').value = pattern;
    document.getElementById('variation').value = variation;
    document.getElementById('theme').value = theme;

    document.getElementById('color1').value = '#' + c1.substring(0, 6);
    document.getElementById('color2').value = '#' + c2.substring(0, 6);
    document.getElementById('color3').value = '#' + c3.substring(0, 6);
    document.getElementById('color4').value = '#' + c4.substring(0, 6);
    document.getElementById('color5').value = '#' + c5.substring(0, 6);
    document.getElementById('color6').value = remainingLength === 64 ? '#' + c6.substring(0, 6) : '#FFFFFF';
    document.getElementById('color7').value = remainingLength === 64 ? '#' + c7.substring(0, 6) : '#FFFFFF';
    document.getElementById('color8').value = remainingLength === 64 ? '#' + c8.substring(0, 6) : '#FFFFFF';

    generateCode();
    importInput.value = '';
}

// --- HISTORY FUNCTIONS ---

function renderHistoryTable() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const historyBody = document.getElementById('historyBody');

    if (history.length === 0) {
        historyBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #777;">No skin codes generated yet.</td></tr>';
        return;
    }

    historyBody.innerHTML = '';
    history.forEach((entry, index) => {
        const row = document.createElement('tr');
        // Note: Using escapeHTML for any text data rendered from localStorage
        row.innerHTML = `
            <td>${escapeHTML(entry.species)}</td>
            <td>${escapeHTML(entry.pattern)}</td>
            <td>${escapeHTML(entry.variation)}</td>
            <td>${escapeHTML(entry.theme)}</td>
            <td>
                ${getSwatchCell(entry.maleDisplay, 'Male Display')}
                ${getSwatchCell(entry.markings, 'Markings')}
                ${getSwatchCell(entry.flank, 'Flank')}
                ${getSwatchCell(entry.body, 'Body')}
                ${getSwatchCell(entry.underbelly, 'Underbelly')}
                ${getSwatchCell(entry.teeth, 'Teeth')}
                ${getSwatchCell(entry.mouth, 'Mouth')}
                ${getSwatchCell(entry.claws, 'Claws')}
            </td>
            <td><button class="history-import-btn" onclick="importFromHistory(${index})">Import</button></td>
        `;
        historyBody.appendChild(row);
    });
}

function importFromHistory(index) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const entry = history[index];

    if (!entry) {
        alert('History entry not found.');
        return;
    }

    const normalizedSpecies = entry.species === 'N/A' ? '' : (entry.species || '');
    const normalizedPattern = entry.pattern === 'N/A' ? '' : (entry.pattern || '');
    const normalizedVariation = entry.variation === 'N/A' ? '' : (entry.variation || '');
    const normalizedTheme = entry.theme === 'N/A' ? '' : (entry.theme || '');

    const importedCode = entry.code || `${normalizedSpecies}${normalizedPattern}${normalizedVariation}${normalizedTheme}${entry.claws || ''}${entry.mouth || ''}${entry.teeth || ''}${entry.underbelly || ''}${entry.body || ''}${entry.flank || ''}${entry.markings || ''}${entry.maleDisplay || ''}`;
    document.getElementById('importInput').value = importedCode;
    importCode();
}

function addToHistory() {
    // FIX: Add 'let' to declare the variable properly
    let currentHistory = JSON.parse(localStorage.getItem('history')) || [];
    let code = outputDisplay.textContent;

    let dinoColors = {
        code: code,
        species: document.getElementById('species').value || '',
        pattern: document.getElementById('pattern').value || '',
        variation: document.getElementById('variation').value || '',
        theme: document.getElementById('theme').value || '',
        maleDisplay: code.substring(code.length - 8, code.length - 0),
        markings: code.substring(code.length - 16, code.length - 8),
        flank: code.substring(code.length - 24, code.length - 16),
        body: code.substring(code.length - 32, code.length - 24),
        underbelly: code.substring(code.length - 40, code.length - 32),
        teeth: code.length >= 64 ? code.substring(code.length - 48, code.length - 40) : null,
        mouth: code.length >= 64 ? code.substring(code.length - 56, code.length - 48) : null,
        claws: code.length >= 64 ? code.substring(code.length - 64, code.length - 56) : null
    };

    currentHistory.push(dinoColors);
    localStorage.setItem('history', JSON.stringify(currentHistory));
    renderHistoryTable();
}

// Ensure code generates reactively upon changing inputs
inputs.forEach(input => {
    input.addEventListener('input', () => generateCode(true));
});