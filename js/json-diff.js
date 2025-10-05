// JSON Diff Tool functionality
let file1Data = null;
let file2Data = null;
let json1Data = null;
let json2Data = null;
let isShowingOnlyDiffs = false;
let currentInputMethod = 'paste';

// Toggle input method
function toggleInputMethod() {
    const method = document.getElementById('input-method').value;
    const fileSection = document.getElementById('file-upload-section');
    const pasteSection = document.getElementById('json-paste-section');
    
    currentInputMethod = method;
    
    if (method === 'files') {
        fileSection.style.display = 'block';
        pasteSection.style.display = 'none';
        // Clear paste data when switching to files
        json1Data = null;
        json2Data = null;
        document.getElementById('json1').value = '';
        document.getElementById('json2').value = '';
        document.getElementById('json1-info').innerHTML = '';
        document.getElementById('json2-info').innerHTML = '';
    } else {
        fileSection.style.display = 'none';
        pasteSection.style.display = 'block';
        // Clear file data when switching to paste
        file1Data = null;
        file2Data = null;
        document.getElementById('file1').value = '';
        document.getElementById('file2').value = '';
        document.getElementById('file1-info').innerHTML = '';
        document.getElementById('file2-info').innerHTML = '';
    }
    
    updateCompareButton();
}

// File selection handler
function handleFileSelect(input, fileId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                if (fileId === 'file1') {
                    file1Data = jsonData;
                } else {
                    file2Data = jsonData;
                }
                
                // Update file info
                document.getElementById(`${fileId}-info`).innerHTML = 
                    `<strong>${file.name}</strong><br>Size: ${(file.size / 1024).toFixed(1)} KB`;
                
                updateCompareButton();
            } catch (error) {
                document.getElementById(`${fileId}-info`).innerHTML = `<span class="text-red-600">✗ Invalid JSON: ${error.message}</span>`;
                if (fileId === 'file1') {
                    file1Data = null;
                } else {
                    file2Data = null;
                }
                updateCompareButton();
            }
        };
        reader.readAsText(file);
    }
}

// JSON paste handler
function handleJsonPaste(textareaId) {
    const textarea = document.getElementById(textareaId);
    const content = textarea.value.trim();
    
    if (!content) {
        if (textareaId === 'json1') {
            json1Data = null;
            document.getElementById('json1-info').innerHTML = '';
        } else {
            json2Data = null;
            document.getElementById('json2-info').innerHTML = '';
        }
        updateCompareButton();
        return;
    }
    
    try {
        const jsonData = JSON.parse(content);
        if (textareaId === 'json1') {
            json1Data = jsonData;
            document.getElementById('json1-info').innerHTML = '<span class="text-green-600">✓ Valid JSON</span>';
        } else {
            json2Data = jsonData;
            document.getElementById('json2-info').innerHTML = '<span class="text-green-600">✓ Valid JSON</span>';
        }
        updateCompareButton();
    } catch (error) {
        if (textareaId === 'json1') {
            json1Data = null;
            document.getElementById('json1-info').innerHTML = `<span class="text-red-600">✗ Invalid JSON: ${error.message}</span>`;
        } else {
            json2Data = null;
            document.getElementById('json2-info').innerHTML = `<span class="text-red-600">✗ Invalid JSON: ${error.message}</span>`;
        }
        updateCompareButton();
    }
}

// Update compare button state
function updateCompareButton() {
    const compareBtn = document.getElementById('compare-btn');
    let hasFirstData, hasSecondData;
    
    if (currentInputMethod === 'files') {
        hasFirstData = file1Data;
        hasSecondData = file2Data;
    } else {
        hasFirstData = json1Data;
        hasSecondData = json2Data;
    }
    
    compareBtn.disabled = !(hasFirstData && hasSecondData);
}

// Drag and drop functionality
function setupDragAndDrop() {
    const uploads = document.querySelectorAll('#file1-upload, #file2-upload');
    
    uploads.forEach(upload => {
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
                    const fileId = upload.id.replace('-upload', '');
                    const input = document.getElementById(fileId);
                    
                    // Create a new FileList-like object
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    input.files = dataTransfer.files;
                    
                    handleFileSelect(input, fileId);
                } else {
                    // Show error in console or ignore
                    console.warn('Please select a JSON file');
                }
            }
        });
    });
}

// Toggle diff view
function toggleDiffView() {
    const toggleBtn = document.getElementById('toggle-btn');
    const diffContainer = document.getElementById('diff-container');
    
    isShowingOnlyDiffs = !isShowingOnlyDiffs;
    
    if (isShowingOnlyDiffs) {
        diffContainer.classList.add('show-only-diffs');
        toggleBtn.textContent = 'Show All';
        toggleBtn.classList.add('bg-blue-600');
    } else {
        diffContainer.classList.remove('show-only-diffs');
        toggleBtn.textContent = 'Show Only Differences';
        toggleBtn.classList.remove('bg-blue-600');
    }
}

// Compare files
function compareFiles() {
    let firstData, secondData;
    
    if (currentInputMethod === 'files') {
        firstData = file1Data;
        secondData = file2Data;
    } else {
        firstData = json1Data;
        secondData = json2Data;
    }
    
    if (!firstData || !secondData) {
        return;
    }
    
    try {
        // Wait for jsondiffpatch to be available
        if (typeof window.jsondiffpatch === 'undefined') {
            throw new Error('jsondiffpatch library not loaded');
        }

        // Generate diff using jsondiffpatch
        const instance = jsondiffpatch.create();
        const delta = instance.diff(firstData, secondData);
        
        const diffContainer = document.getElementById('diff-container');
        const toggleBtn = document.getElementById('toggle-btn');
        
        // Display the diff using jsondiffpatch's HTML formatter
        if (delta) {
            const formattersHtml = jsondiffpatch.formatters.html;
            const html = formattersHtml.format(delta, firstData);
            diffContainer.innerHTML = html;
            
            // Show toggle button
            toggleBtn.style.display = 'inline-block';
            
            // Reset toggle state
            isShowingOnlyDiffs = false;
            diffContainer.classList.remove('show-only-diffs');
            toggleBtn.textContent = 'Show Only Differences';
            toggleBtn.classList.remove('bg-blue-600');
        } else {
            diffContainer.innerHTML = '<div class="text-center p-10 text-gray-600 italic">No differences found between the JSON files</div>';
            toggleBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        const diffContainer = document.getElementById('diff-container');
        diffContainer.innerHTML = '<div class="text-center p-10 text-red-600">Error comparing files: ' + error.message + '</div>';
        document.getElementById('toggle-btn').style.display = 'none';
    }
}
