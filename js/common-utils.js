// Common utility functions

// Copy to clipboard functionality
function copyToClipboard(text, caseType) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage(`"${caseType}" copied to clipboard!`, 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showMessage('Failed to copy to clipboard', 'error');
    });
}

// Show message
function showMessage(message, type = 'info') {
    const container = document.getElementById('message-container');
    let bgColor, textColor;
    
    switch(type) {
        case 'error':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            break;
        case 'success':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            break;
        default:
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
    }
    
    container.innerHTML = `<div class="${bgColor} ${textColor} text-center p-5 rounded my-2">${message}</div>`;
}

// Clear message
function clearMessage() {
    document.getElementById('message-container').innerHTML = '';
}

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active state from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('border-blue-500', 'text-blue-600');
        button.classList.add('border-transparent', 'text-gray-500');
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('tabindex', '-1');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
    
    // Activate selected tab button
    const selectedButton = document.getElementById(tabName + '-tab');
    if (selectedButton) {
        selectedButton.classList.remove('border-transparent', 'text-gray-500');
        selectedButton.classList.add('border-blue-500', 'text-blue-600');
        selectedButton.setAttribute('aria-selected', 'true');
        selectedButton.setAttribute('tabindex', '0');
    }
}

// Keyboard navigation for tabs
function handleTabKeydown(event) {
    const tabs = Array.from(document.querySelectorAll('.tab-button'));
    const currentIndex = tabs.indexOf(event.target);
    let newIndex = currentIndex;
    
    switch(event.key) {
        case 'ArrowLeft':
            newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            break;
        case 'ArrowRight':
            newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            break;
        case 'Home':
            newIndex = 0;
            break;
        case 'End':
            newIndex = tabs.length - 1;
            break;
        default:
            return;
    }
    
    event.preventDefault();
    tabs[newIndex].focus();
    const tabName = tabs[newIndex].id.replace('-tab', '');
    switchTab(tabName);
}

// Add keyboard event listeners to tabs
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('keydown', handleTabKeydown);
    });
}

// Handle URL hash changes
function handleHashChange() {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    const validTabs = ['json', 'case', 'url', 'analytics'];
    
    if (hash && validTabs.includes(hash)) {
        switchTab(hash);
    } else if (!hash) {
        // Default to json tab if no hash
        switchTab('json');
    }
}

// Initialize the app
function initializeApp() {
    setupDragAndDrop();
    setupAnalyticsDragAndDrop();
    setupTabNavigation();
    // Initialize case converter with empty state
    convertCases();
    // Initialize URL breakdown with empty state
    breakdownURL();
    // Handle initial hash
    handleHashChange();
}
