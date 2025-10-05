// JSON Analytics functionality
let analyticsData = null;
let currentAnalyticsInputMethod = 'paste';

// Analytics functions
function toggleAnalyticsInputMethod() {
    const method = document.getElementById('analytics-input-method').value;
    const fileSection = document.getElementById('analytics-file-section');
    const pasteSection = document.getElementById('analytics-paste-section');
    
    currentAnalyticsInputMethod = method;
    
    if (method === 'file') {
        fileSection.style.display = 'block';
        pasteSection.style.display = 'none';
        // Clear paste data
        document.getElementById('analytics-json').value = '';
        document.getElementById('analytics-json-info').innerHTML = '';
    } else {
        fileSection.style.display = 'none';
        pasteSection.style.display = 'block';
        // Clear file data
        document.getElementById('analytics-file').value = '';
        document.getElementById('analytics-file-info').innerHTML = '';
    }
    
    analyticsData = null;
    updateAnalyzeButton();
    hideAnalyticsResults();
}

function handleAnalyticsFileSelect(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                analyticsData = JSON.parse(e.target.result);
                document.getElementById('analytics-file-info').innerHTML = 
                    `<strong>${file.name}</strong><br>Size: ${(file.size / 1024).toFixed(1)} KB<br><span class="text-green-600">✓ Valid JSON</span>`;
                updateAnalyzeButton();
                analyzeJSON();
            } catch (error) {
                showMessage(`Error parsing ${file.name}: ${error.message}`, 'error');
                document.getElementById('analytics-file-info').innerHTML = 
                    `<strong>${file.name}</strong><br><span class="text-red-600">✗ Invalid JSON: ${error.message}</span>`;
                analyticsData = null;
                updateAnalyzeButton();
                hideAnalyticsResults();
            }
        };
        reader.readAsText(file);
    }
}

function updateAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyze-btn');
    analyzeBtn.disabled = !analyticsData;
}

function hideAnalyticsResults() {
    document.getElementById('analytics-results').style.display = 'none';
}

function analyzeJSON() {
    if (currentAnalyticsInputMethod === 'paste') {
        const content = document.getElementById('analytics-json').value.trim();
        const infoDiv = document.getElementById('analytics-json-info');
        
        if (!content) {
            analyticsData = null;
            infoDiv.innerHTML = '';
            updateAnalyzeButton();
            hideAnalyticsResults();
            return;
        }
        
        try {
            analyticsData = JSON.parse(content);
            infoDiv.innerHTML = '<span class="text-green-600">✓ Valid JSON</span>';
        } catch (error) {
            analyticsData = null;
            infoDiv.innerHTML = `<span class="text-red-600">✗ Invalid JSON: ${error.message}</span>`;
            updateAnalyzeButton();
            hideAnalyticsResults();
            return;
        }
    }
    
    if (!analyticsData) {
        return;
    }
    
    updateAnalyzeButton();
    performAnalysis();
}

function performAnalysis() {
    const jsonString = JSON.stringify(analyticsData);
    const analysis = analyzeJSONStructure(analyticsData);
    
    // Update summary cards
    document.getElementById('size-result').textContent = formatBytes(new Blob([jsonString]).size);
    document.getElementById('keys-result').textContent = analysis.totalKeys.toString();
    document.getElementById('depth-result').textContent = analysis.maxDepth.toString();
    document.getElementById('types-result').textContent = Object.keys(analysis.dataTypes).length.toString();
    
    // Update detailed analysis tabs
    updateStructureTab(analysis);
    updateSchemaTab(analysis);
    updateValidationTab(analysis);
    updateFormattedTab(jsonString);
    
    // Show results
    document.getElementById('analytics-results').style.display = 'block';
    
    showMessage('JSON analysis complete!', 'success');
}

function analyzeJSONStructure(obj, path = '', depth = 0) {
    const analysis = {
        maxDepth: depth,
        totalKeys: 0,
        dataTypes: {},
        structure: [],
        paths: [],
        arrays: [],
        objects: []
    };
    
    if (obj === null) {
        analysis.dataTypes.null = (analysis.dataTypes.null || 0) + 1;
        return analysis;
    }
    
    const type = Array.isArray(obj) ? 'array' : typeof obj;
    analysis.dataTypes[type] = (analysis.dataTypes[type] || 0) + 1;
    
    if (type === 'object') {
        analysis.objects.push({ path, keys: Object.keys(obj).length });
        Object.keys(obj).forEach(key => {
            analysis.totalKeys++;
            const newPath = path ? `${path}.${key}` : key;
            analysis.paths.push({ path: newPath, type: typeof obj[key] });
            
            const childAnalysis = analyzeJSONStructure(obj[key], newPath, depth + 1);
            analysis.maxDepth = Math.max(analysis.maxDepth, childAnalysis.maxDepth);
            analysis.totalKeys += childAnalysis.totalKeys;
            
            // Merge data types
            Object.keys(childAnalysis.dataTypes).forEach(t => {
                analysis.dataTypes[t] = (analysis.dataTypes[t] || 0) + childAnalysis.dataTypes[t];
            });
            
            analysis.paths.push(...childAnalysis.paths);
            analysis.arrays.push(...childAnalysis.arrays);
            analysis.objects.push(...childAnalysis.objects);
        });
    } else if (type === 'array') {
        analysis.arrays.push({ path, length: obj.length });
        obj.forEach((item, index) => {
            const newPath = `${path}[${index}]`;
            const childAnalysis = analyzeJSONStructure(item, newPath, depth + 1);
            analysis.maxDepth = Math.max(analysis.maxDepth, childAnalysis.maxDepth);
            analysis.totalKeys += childAnalysis.totalKeys;
            
            // Merge data types
            Object.keys(childAnalysis.dataTypes).forEach(t => {
                analysis.dataTypes[t] = (analysis.dataTypes[t] || 0) + childAnalysis.dataTypes[t];
            });
            
            analysis.paths.push(...childAnalysis.paths);
            analysis.arrays.push(...childAnalysis.arrays);
            analysis.objects.push(...childAnalysis.objects);
        });
    }
    
    return analysis;
}

function switchAnalyticsTab(tabName) {
    // Remove active state from all analytics tab buttons
    const tabButtons = document.querySelectorAll('.analytics-tab');
    tabButtons.forEach(button => {
        button.classList.remove('border-blue-500', 'text-blue-600');
        button.classList.add('border-transparent', 'text-gray-500');
    });
    
    // Hide all analytics tab contents
    const tabContents = document.querySelectorAll('.analytics-tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(tabName + '-content');
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
    
    // Activate selected tab button
    const selectedButton = document.getElementById(tabName + '-tab');
    if (selectedButton) {
        selectedButton.classList.remove('border-transparent', 'text-gray-500');
        selectedButton.classList.add('border-blue-500', 'text-blue-600');
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function updateStructureTab(analysis) {
    const container = document.getElementById('structure-tree');
    let html = '<div class="space-y-4">';
    
    // Data Types Summary
    html += '<div class="bg-gray-50 p-4 rounded border">';
    html += '<h4 class="font-semibold text-gray-700 mb-3">Data Types Distribution</h4>';
    html += '<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">';
    Object.entries(analysis.dataTypes).forEach(([type, count]) => {
        const color = getTypeColor(type);
        html += `
            <div class="bg-white p-2 rounded border ${color} text-center">
                <div class="font-medium text-sm">${type}</div>
                <div class="text-lg font-bold">${count}</div>
            </div>
        `;
    });
    html += '</div></div>';
    
    // Arrays Summary
    if (analysis.arrays.length > 0) {
        html += '<div class="bg-blue-50 p-4 rounded border border-blue-200">';
        html += '<h4 class="font-semibold text-blue-700 mb-3">Arrays Found</h4>';
        analysis.arrays.slice(0, 10).forEach(arr => {
            html += `<div class="text-sm mb-1"><code class="bg-blue-100 px-2 py-1 rounded">${arr.path || 'root'}</code> - ${arr.length} items</div>`;
        });
        if (analysis.arrays.length > 10) {
            html += `<div class="text-sm text-blue-600 mt-2">... and ${analysis.arrays.length - 10} more arrays</div>`;
        }
        html += '</div>';
    }
    
    // Objects Summary
    if (analysis.objects.length > 0) {
        html += '<div class="bg-green-50 p-4 rounded border border-green-200">';
        html += '<h4 class="font-semibold text-green-700 mb-3">Objects Found</h4>';
        analysis.objects.slice(0, 10).forEach(obj => {
            html += `<div class="text-sm mb-1"><code class="bg-green-100 px-2 py-1 rounded">${obj.path || 'root'}</code> - ${obj.keys} keys</div>`;
        });
        if (analysis.objects.length > 10) {
            html += `<div class="text-sm text-green-600 mt-2">... and ${analysis.objects.length - 10} more objects</div>`;
        }
        html += '</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function updateSchemaTab(analysis) {
    const container = document.getElementById('schema-info');
    const schema = generateJSONSchema(analyticsData);
    
    let html = '<div class="space-y-4">';
    html += '<div class="bg-gray-50 p-4 rounded border">';
    html += '<h4 class="font-semibold text-gray-700 mb-3">Generated Schema</h4>';
    html += '<div class="mb-4">';
    html += '<button onclick="copySchemaToClipboard()" class="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">';
    html += 'Copy Schema';
    html += '</button>';
    html += '</div>';
    html += '<pre class="bg-white p-4 rounded border overflow-auto max-h-64 text-sm" id="schema-output">' + JSON.stringify(schema, null, 2) + '</pre>';
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
}

function copySchemaToClipboard() {
    const schema = generateJSONSchema(analyticsData);
    const schemaText = JSON.stringify(schema, null, 2);
    copyToClipboard(schemaText, 'JSON Schema', event.target);
}

function updateValidationTab(analysis) {
    const container = document.getElementById('validation-info');
    const validation = validateJSONStructure(analyticsData);
    
    let html = '<div class="space-y-4">';
    
    // Validation Status
    html += `<div class="p-4 rounded border ${validation.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">`;
    html += `<h4 class="font-semibold ${validation.isValid ? 'text-green-700' : 'text-red-700'} mb-2">`;
    html += `${validation.isValid ? '✓ Valid JSON' : '✗ Issues Found'}`;
    html += '</h4>';
    
    if (validation.warnings.length > 0) {
        html += '<div class="mt-3">';
        html += '<h5 class="font-medium text-yellow-700 mb-2">Warnings:</h5>';
        validation.warnings.forEach(warning => {
            html += `<div class="text-sm text-yellow-600 mb-1">• ${warning}</div>`;
        });
        html += '</div>';
    }
    
    if (validation.suggestions.length > 0) {
        html += '<div class="mt-3">';
        html += '<h5 class="font-medium text-blue-700 mb-2">Suggestions:</h5>';
        validation.suggestions.forEach(suggestion => {
            html += `<div class="text-sm text-blue-600 mb-1">• ${suggestion}</div>`;
        });
        html += '</div>';
    }
    
    html += '</div>';
    
    // Statistics
    html += '<div class="bg-gray-50 p-4 rounded border">';
    html += '<h4 class="font-semibold text-gray-700 mb-3">Statistics</h4>';
    html += '<div class="grid grid-cols-2 gap-4 text-sm">';
    html += `<div><strong>Total Keys:</strong> ${analysis.totalKeys}</div>`;
    html += `<div><strong>Max Depth:</strong> ${analysis.maxDepth}</div>`;
    html += `<div><strong>Arrays:</strong> ${analysis.arrays.length}</div>`;
    html += `<div><strong>Objects:</strong> ${analysis.objects.length}</div>`;
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    container.innerHTML = html;
}

function updateFormattedTab(jsonString) {
    const container = document.getElementById('formatted-json');
    container.textContent = JSON.stringify(analyticsData, null, 2);
}

function copyFormattedJSON() {
    const formattedJson = JSON.stringify(analyticsData, null, 2);
    copyToClipboard(formattedJson, 'Formatted JSON', event.target);
}

function getTypeColor(type) {
    const colors = {
        'string': 'text-blue-600 bg-blue-50',
        'number': 'text-green-600 bg-green-50',
        'boolean': 'text-purple-600 bg-purple-50',
        'object': 'text-orange-600 bg-orange-50',
        'array': 'text-red-600 bg-red-50',
        'null': 'text-gray-600 bg-gray-50',
        'undefined': 'text-gray-600 bg-gray-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
}

function generateJSONSchema(obj) {
    if (obj === null) return { type: 'null' };
    
    const type = Array.isArray(obj) ? 'array' : typeof obj;
    
    switch (type) {
        case 'object':
            const schema = {
                type: 'object',
                properties: {},
                required: []
            };
            
            Object.keys(obj).forEach(key => {
                schema.properties[key] = generateJSONSchema(obj[key]);
                schema.required.push(key);
            });
            
            return schema;
        
        case 'array':
            const arraySchema = { type: 'array' };
            if (obj.length > 0) {
                // Generate schema for first item as example
                arraySchema.items = generateJSONSchema(obj[0]);
            }
            return arraySchema;
        
        case 'string':
            return { type: 'string' };
        
        case 'number':
            return { type: 'number' };
        
        case 'boolean':
            return { type: 'boolean' };
        
        default:
            return { type: type };
    }
}

function validateJSONStructure(obj) {
    const validation = {
        isValid: true,
        warnings: [],
        suggestions: []
    };
    
    // Check for common issues
    checkForLargeArrays(obj, validation);
    checkForDeepNesting(obj, validation, 0);
    checkForEmptyObjects(obj, validation);
    checkForInconsistentArrays(obj, validation);
    
    return validation;
}

function checkForLargeArrays(obj, validation, path = '') {
    if (Array.isArray(obj) && obj.length > 1000) {
        validation.warnings.push(`Large array at ${path || 'root'} with ${obj.length} items`);
        validation.suggestions.push(`Consider paginating large arrays at ${path || 'root'}`);
    }
    
    if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
            const newPath = path ? `${path}.${key}` : key;
            checkForLargeArrays(obj[key], validation, newPath);
        });
    }
}

function checkForDeepNesting(obj, validation, depth, path = '') {
    if (depth > 10) {
        validation.warnings.push(`Deep nesting (${depth} levels) at ${path || 'root'}`);
        validation.suggestions.push(`Consider flattening deeply nested structures at ${path || 'root'}`);
    }
    
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        Object.keys(obj).forEach(key => {
            const newPath = path ? `${path}.${key}` : key;
            checkForDeepNesting(obj[key], validation, depth + 1, newPath);
        });
    } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            const newPath = `${path}[${index}]`;
            checkForDeepNesting(item, validation, depth + 1, newPath);
        });
    }
}

function checkForEmptyObjects(obj, validation, path = '') {
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj) && Object.keys(obj).length === 0) {
        validation.warnings.push(`Empty object at ${path || 'root'}`);
    }
    
    if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                const newPath = `${path}[${index}]`;
                checkForEmptyObjects(item, validation, newPath);
            });
        } else {
            Object.keys(obj).forEach(key => {
                const newPath = path ? `${path}.${key}` : key;
                checkForEmptyObjects(obj[key], validation, newPath);
            });
        }
    }
}

function checkForInconsistentArrays(obj, validation, path = '') {
    if (Array.isArray(obj) && obj.length > 1) {
        const firstType = typeof obj[0];
        const hasInconsistentTypes = obj.some(item => typeof item !== firstType);
        
        if (hasInconsistentTypes) {
            validation.warnings.push(`Inconsistent array types at ${path || 'root'}`);
            validation.suggestions.push(`Consider using consistent data types in arrays at ${path || 'root'}`);
        }
    }
    
    if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                const newPath = `${path}[${index}]`;
                checkForInconsistentArrays(item, validation, newPath);
            });
        } else {
            Object.keys(obj).forEach(key => {
                const newPath = path ? `${path}.${key}` : key;
                checkForInconsistentArrays(obj[key], validation, newPath);
            });
        }
    }
}

function setupAnalyticsDragAndDrop() {
    const upload = document.getElementById('analytics-file-upload');
    
    upload.addEventListener('dragover', (e) => {
        e.preventDefault();
        upload.classList.add('border-blue-500', 'bg-blue-50');
    });
    
    upload.addEventListener('dragleave', (e) => {
        e.preventDefault();
        upload.classList.remove('border-blue-500', 'bg-blue-50');
    });
    
    upload.addEventListener('drop', (e) => {
        e.preventDefault();
        upload.classList.remove('border-blue-500', 'bg-blue-50');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                const input = document.getElementById('analytics-file');
                
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;
                
                handleAnalyticsFileSelect(input);
            } else {
                showMessage('Please select a JSON file', 'error');
            }
        }
    });
}
