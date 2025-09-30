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
