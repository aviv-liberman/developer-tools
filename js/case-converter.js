// Text Case Converter functionality

// Case conversion functionality
function convertCases() {
    const input = document.getElementById('case-input').value;
    const resultsContainer = document.getElementById('case-results');
    
    if (!input.trim()) {
        resultsContainer.innerHTML = '<div class="col-span-full text-center text-gray-500 italic">Enter some text to see case conversions</div>';
        return;
    }
    
    const cases = [
        { name: 'camelCase', convert: toCamelCase },
        { name: 'PascalCase', convert: toPascalCase },
        { name: 'snake_case', convert: toSnakeCase },
        { name: 'kebab-case', convert: toKebabCase },
        { name: 'UPPER_SNAKE_CASE', convert: toUpperSnakeCase },
        { name: 'UPPER CASE', convert: toUpperCase },
        { name: 'lower case', convert: toLowerCase },
        { name: 'Title Case', convert: toTitleCase },
        { name: 'Sentence case', convert: toSentenceCase },
        { name: 'dot.case', convert: toDotCase },
        { name: 'path/case', convert: toPathCase },
        { name: 'Header-Case', convert: toHeaderCase },
        { name: 'no case', convert: toNoCase },
        { name: 'swap case', convert: toSwapCase }
    ];
    
    const resultsHTML = cases.map(caseType => {
        try {
            const converted = caseType.convert(input);
            return `
                <div class="bg-gray-50 p-4 rounded-lg border hover:border-blue-300 transition-colors cursor-pointer" 
                     onclick="copyToClipboard('${converted.replace(/'/g, "\\'")}', '${caseType.name}')">
                    <div class="text-sm font-medium text-gray-700 mb-2">${caseType.name}</div>
                    <div class="text-gray-900 font-mono text-sm break-all">${converted}</div>
                    <div class="text-xs text-blue-600 mt-2">Click to copy</div>
                </div>
            `;
        } catch (error) {
            return `
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-sm font-medium text-red-700 mb-2">${caseType.name}</div>
                    <div class="text-red-600 text-sm">Error: ${error.message}</div>
                </div>
            `;
        }
    }).join('');
    
    resultsContainer.innerHTML = resultsHTML;
}

// Robust case conversion functions that work with any input case
function splitIntoWords(str) {
    // Handle various separators and case changes
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase -> camel Case
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // HTML -> H TML
        .replace(/[_\-\s]+/g, ' ') // Replace separators with spaces
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);
}

function toCamelCase(str) {
    const words = splitIntoWords(str);
    return words.map((word, index) => {
        const lower = word.toLowerCase();
        return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join('');
}

function toPascalCase(str) {
    const words = splitIntoWords(str);
    return words.map(word => {
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join('');
}

function toSnakeCase(str) {
    const words = splitIntoWords(str);
    return words.map(word => word.toLowerCase()).join('_');
}

function toKebabCase(str) {
    const words = splitIntoWords(str);
    return words.map(word => word.toLowerCase()).join('-');
}

function toUpperSnakeCase(str) {
    const words = splitIntoWords(str);
    return words.map(word => word.toUpperCase()).join('_');
}

function toUpperCase(str) {
    return str.toUpperCase();
}

function toLowerCase(str) {
    return str.toLowerCase();
}

function toTitleCase(str) {
    const words = splitIntoWords(str);
    return words.map(word => {
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join(' ');
}

function toSentenceCase(str) {
    const words = splitIntoWords(str);
    if (words.length === 0) return str;
    
    return words.map((word, index) => {
        const lower = word.toLowerCase();
        if (index === 0) {
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        }
        return lower;
    }).join(' ');
}

function toDotCase(str) {
    const words = splitIntoWords(str);
    return words.map(word => word.toLowerCase()).join('.');
}

function toPathCase(str) {
    const words = splitIntoWords(str);
    return words.map(word => word.toLowerCase()).join('/');
}

function toHeaderCase(str) {
    const words = splitIntoWords(str);
    return words.map(word => {
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join('-');
}

function toNoCase(str) {
    const words = splitIntoWords(str);
    return words.map(word => word.toLowerCase()).join(' ');
}

function toSwapCase(str) {
    return str.split('').map(char => {
        if (char === char.toUpperCase()) {
            return char.toLowerCase();
        } else {
            return char.toUpperCase();
        }
    }).join('');
}

// JSON Case Conversion functionality

// Toggle between text and JSON case conversion modes
function toggleCaseInputMethod() {
    const inputMethod = document.getElementById('case-input-method').value;
    const textSection = document.getElementById('text-case-section');
    const jsonSection = document.getElementById('json-case-section');
    
    if (inputMethod === 'text') {
        textSection.style.display = 'block';
        jsonSection.style.display = 'none';
    } else {
        textSection.style.display = 'none';
        jsonSection.style.display = 'block';
    }
}

// Toggle between JSON paste and file upload methods
function toggleJsonCaseInputMethod() {
    const inputMethod = document.getElementById('json-case-input-method').value;
    const pasteSection = document.getElementById('json-case-paste-section');
    const fileSection = document.getElementById('json-case-file-section');
    
    if (inputMethod === 'paste') {
        pasteSection.style.display = 'block';
        fileSection.style.display = 'none';
    } else {
        pasteSection.style.display = 'none';
        fileSection.style.display = 'block';
    }
}

// Handle JSON file selection for case conversion
function handleJsonCaseFileSelect(input) {
    const file = input.files[0];
    const infoDiv = document.getElementById('json-case-file-info');
    const convertBtn = document.getElementById('convert-json-case-btn');
    
    if (file) {
        infoDiv.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        infoDiv.className = 'mt-2 text-sm text-green-600';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonContent = e.target.result;
                // Validate JSON
                JSON.parse(jsonContent);
                document.getElementById('json-case-input').value = jsonContent;
                convertBtn.disabled = false;
                convertJsonCases();
            } catch (error) {
                infoDiv.textContent = `Error: Invalid JSON file - ${error.message}`;
                infoDiv.className = 'mt-2 text-sm text-red-600';
                convertBtn.disabled = true;
            }
        };
        reader.readAsText(file);
    } else {
        infoDiv.textContent = '';
        convertBtn.disabled = true;
    }
}

// Convert JSON keys to specified case
function convertJsonCases() {
    const jsonInput = document.getElementById('json-case-input').value.trim();
    const caseType = document.getElementById('json-case-type').value;
    const convertBtn = document.getElementById('convert-json-case-btn');
    const resultsDiv = document.getElementById('json-case-results');
    const outputDiv = document.getElementById('json-case-output');
    const infoDiv = document.getElementById('json-case-input-info');
    
    if (!jsonInput) {
        convertBtn.disabled = true;
        resultsDiv.style.display = 'none';
        infoDiv.textContent = '';
        return;
    }
    
    try {
        // Parse the JSON
        const jsonData = JSON.parse(jsonInput);
        infoDiv.textContent = 'Valid JSON ✓';
        infoDiv.className = 'mt-2 text-sm text-green-600';
        
        // Convert keys recursively
        const convertedJson = convertJsonKeys(jsonData, caseType);
        
        // Format and display the result
        const formattedJson = JSON.stringify(convertedJson, null, 2);
        outputDiv.textContent = formattedJson;
        resultsDiv.style.display = 'block';
        convertBtn.disabled = false;
        
    } catch (error) {
        infoDiv.textContent = `Error: ${error.message}`;
        infoDiv.className = 'mt-2 text-sm text-red-600';
        resultsDiv.style.display = 'none';
        convertBtn.disabled = true;
    }
}

// Recursively convert JSON keys to specified case
function convertJsonKeys(obj, caseType) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => convertJsonKeys(item, caseType));
    }
    
    const convertedObj = {};
    for (const [key, value] of Object.entries(obj)) {
        const convertedKey = convertKeyToCase(key, caseType);
        convertedObj[convertedKey] = convertJsonKeys(value, caseType);
    }
    
    return convertedObj;
}

// Convert a single key to the specified case
function convertKeyToCase(key, caseType) {
    switch (caseType) {
        case 'camelCase':
            return toCamelCase(key);
        case 'PascalCase':
            return toPascalCase(key);
        case 'snake_case':
            return toSnakeCase(key);
        case 'kebab-case':
            return toKebabCase(key);
        case 'UPPER_SNAKE_CASE':
            return toUpperSnakeCase(key);
        case 'UPPER CASE':
            return toUpperCase(key);
        case 'lower case':
            return toLowerCase(key);
        case 'Title Case':
            return toTitleCase(key);
        case 'Sentence case':
            return toSentenceCase(key);
        case 'dot.case':
            return toDotCase(key);
        case 'path/case':
            return toPathCase(key);
        case 'Header-Case':
            return toHeaderCase(key);
        case 'no case':
            return toNoCase(key);
        default:
            return key;
    }
}

// Copy the converted JSON result to clipboard
function copyJsonCaseResult(event) {
    const output = document.getElementById('json-case-output').textContent;
    if (output) {
        navigator.clipboard.writeText(output).then(() => {
            // Show temporary success message
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.className = 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors';
            setTimeout(() => {
                button.textContent = originalText;
                button.className = 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard');
        });
    }
}
