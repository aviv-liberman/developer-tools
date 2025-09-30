// URL Breakdown functionality

// URL Breakdown functionality
function breakdownURL() {
    const urlInput = document.getElementById('url-input').value;
    const resultsContainer = document.getElementById('url-results');
    
    if (!urlInput.trim()) {
        resultsContainer.innerHTML = '<div class="col-span-full text-center text-gray-500 italic">Enter a URL to breakdown</div>';
        return;
    }

    try {
        // Add protocol if missing
        let processedUrl = urlInput;
        if (!urlInput.match(/^https?:\/\//)) {
            processedUrl = 'https://' + urlInput;
        }
        
        const url = new URL(processedUrl);
        
        
        // Build results HTML
        let resultsHTML = '';
        
        // Protocol
        resultsHTML += `
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 class="text-lg font-medium text-gray-700 mb-2">Protocol</h3>
                <p class="text-gray-900 font-mono text-sm break-all cursor-pointer" onclick="copyToClipboard('${url.protocol.replace(':', '')}', 'Protocol')">${url.protocol.replace(':', '')}</p>
                <div class="text-xs text-blue-600 mt-2">Click to copy</div>
            </div>
        `;
        
        // Username and Password (if exists)
        if (url.username || url.password) {
            if (url.username) {
                resultsHTML += `
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 class="text-lg font-medium text-gray-700 mb-2">Username</h3>
                        <p class="text-gray-900 font-mono text-sm break-all cursor-pointer" onclick="copyToClipboard('${url.username}', 'Username')">${url.username}</p>
                        <div class="text-xs text-blue-600 mt-2">Click to copy</div>
                    </div>
                `;
            }
            if (url.password) {
                resultsHTML += `
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 class="text-lg font-medium text-gray-700 mb-2">Password</h3>
                        <p class="text-gray-900 font-mono text-sm break-all cursor-pointer" onclick="copyToClipboard('${url.password}', 'Password')">${url.password}</p>
                        <div class="text-xs text-blue-600 mt-2">Click to copy</div>
                    </div>
                `;
            }
        }
        
        // Hostname
        resultsHTML += `
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 class="text-lg font-medium text-gray-700 mb-2">Hostname</h3>
                <p class="text-gray-900 font-mono text-sm break-all cursor-pointer" onclick="copyToClipboard('${url.hostname}', 'Hostname')">${url.hostname}</p>
                <div class="text-xs text-blue-600 mt-2">Click to copy</div>
            </div>
        `;
        
        // Origin (protocol + hostname + port)
        resultsHTML += `
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 class="text-lg font-medium text-gray-700 mb-2">Origin</h3>
                <p class="text-gray-900 font-mono text-sm break-all cursor-pointer" onclick="copyToClipboard('${url.origin}', 'Origin')">${url.origin}</p>
                <div class="text-xs text-blue-600 mt-2">Click to copy</div>
            </div>
        `;
        
        // Port (if exists)
        if (url.port) {
            resultsHTML += `
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 class="text-lg font-medium text-gray-700 mb-2">Port</h3>
                    <p class="text-gray-900 font-mono text-sm break-all cursor-pointer" onclick="copyToClipboard('${url.port}', 'Port')">${url.port}</p>
                    <div class="text-xs text-blue-600 mt-2">Click to copy</div>
                </div>
            `;
        }
        
        // Pathname
        resultsHTML += `
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 class="text-lg font-medium text-gray-700 mb-2">Path</h3>
                <p class="text-gray-900 font-mono text-sm break-all cursor-pointer" onclick="copyToClipboard('${url.pathname || '/'}', 'Path')">${url.pathname || '/'}</p>
                <div class="text-xs text-blue-600 mt-2">Click to copy</div>
            </div>
        `;
        
        // Query Parameters
        if (url.search) {
            const searchParams = new URLSearchParams(url.search);
            let queryHTML = '';
            searchParams.forEach((value, key) => {
                queryHTML += `
                    <div class="bg-white p-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-200">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <span class="font-bold text-blue-800 text-xl">${key}</span>
                                    <span class="text-gray-400 mx-3 text-lg">:</span>
                                </div>
                                <div class="bg-gray-50 p-3 rounded border border-gray-200">
                                    <span class="text-gray-800 font-mono text-base break-all cursor-pointer hover:text-blue-600 transition-colors" onclick="copyToClipboard('${value}', 'Query Value: ${key}')">${value}</span>
                                </div>
                            </div>
                            <div class="ml-4 flex flex-col gap-2">
                                <button onclick="copyToClipboard('${key}', 'Query Key: ${key}')" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors">
                                    Copy Key
                                </button>
                                <button onclick="copyToClipboard('${value}', 'Query Value: ${key}')" class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors">
                                    Copy Value
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            resultsHTML += `
                <div class="col-span-full bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-300 shadow-md">
                    <h3 class="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                        <svg class="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        Query Parameters (${searchParams.size})
                    </h3>
                    
                    <!-- Raw Query String -->
                    <div class="bg-white p-4 rounded border border-blue-200 mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-blue-700">Raw Query String:</span>
                            <button onclick="copyToClipboard('${url.search}', 'Raw Query String')" class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors">
                                Copy Raw
                            </button>
                        </div>
                        <p class="text-gray-800 font-mono text-sm break-all bg-gray-50 p-2 rounded">${url.search}</p>
                    </div>
                    
                    <!-- Individual Parameters -->
                    <div class="space-y-3">${queryHTML}</div>
                </div>
            `;
        } else {
            resultsHTML += `
                <div class="col-span-full bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 class="text-lg font-medium text-gray-700 mb-2">Query Parameters</h3>
                    <p class="text-gray-500 italic">None</p>
                 </div>
            `;
        }
        
        // Fragment
        if (url.hash) {
            resultsHTML += `
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 class="text-lg font-medium text-gray-700 mb-2">Fragment</h3>
                    <p class="text-gray-900 font-mono text-sm break-all cursor-pointer" onclick="copyToClipboard('${url.hash.replace('#', '')}', 'Fragment')">${url.hash.replace('#', '')}</p>
                    <div class="text-xs text-blue-600 mt-2">Click to copy</div>
                </div>
            `;
        } else {
            resultsHTML += `
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 class="text-lg font-medium text-gray-700 mb-2">Fragment</h3>
                    <p class="text-gray-500 italic">None</p>
                </div>
            `;
        }
        
        // Full URL
        resultsHTML += `
            <div class="col-span-full bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 class="text-lg font-medium text-blue-700 mb-2">Full URL</h3>
                <p class="text-blue-900 font-mono text-sm break-all cursor-pointer" onclick="copyToClipboard('${url.href}', 'Full URL')">${url.href}</p>
                <div class="text-xs text-blue-600 mt-2">Click to copy</div>
            </div>
        `;
        
        
        resultsContainer.innerHTML = resultsHTML;
        showMessage('URL breakdown complete!', 'success');
    } catch (error) {
        showMessage(`Invalid URL: ${error.message}`, 'error');
        resultsContainer.innerHTML = '<div class="col-span-full text-center text-red-500 italic">Invalid URL format</div>';
    }
}
