// --- Application Global Variables and Setup ---
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results-container');
const loadingIndicator = document.getElementById('loading-indicator');
const statusDisplay = document.getElementById('status-display'); // New diagnostic element

let bibleData = []; // This will hold the loaded data

// Helper function to update the status display visually
function updateStatus(message, type = 'info') {
    statusDisplay.textContent = `Current Status: ${message}`;
    statusDisplay.className = 'mb-4 p-3 rounded-lg text-sm border';
    
    if (type === 'success') {
        statusDisplay.classList.add('bg-green-100', 'border-green-300', 'text-green-800');
    } else if (type === 'error') {
        statusDisplay.classList.add('bg-red-100', 'border-red-300', 'text-red-700');
    } else { // info
        statusDisplay.classList.add('bg-gray-100', 'border-gray-300', 'text-gray-800');
    }
}

// --- Initialization Function ---
async function initializeApp() {
    loadingIndicator.classList.remove('hidden');
    searchButton.disabled = true;
    searchButton.textContent = "Loading Data...";
    updateStatus("Initializing and fetching data...");

    try {
        const response = await fetch('./questions.json');
        
        if (!response.ok) {
            // Handle network errors (e.g., 404 file not found)
            throw new Error(`Network Error! (Status: ${response.status}). Check if 'questions.json' is deployed.`);
        }
        
        // Attempt to parse the JSON data
        try {
            bibleData = await response.json(); 
        } catch (parseError) {
            // Handle JSON parsing errors (bad syntax in the file)
            throw new Error(`JSON Parse Error: Check your 'questions.json' file for missing commas, unquoted keys, or stray characters.`);
        }

        // Success: Enable search functionality
        searchButton.disabled = false;
        searchButton.textContent = "Search for Answer";
        updateStatus(`Data loaded successfully (${bibleData.length} items). Ready to search.`, 'success');

        resultsContainer.innerHTML = `
            <p class="text-center text-gray-500 p-4 border border-dashed border-gray-300 rounded-lg">
                Enter your search query above and press Search or Enter.
            </p>
        `;

    } catch (error) {
        // Display a clear error if loading failed
        updateStatus(`ERROR! ${error.message}`, 'error');
        console.error('Data Loading Error:', error);
        searchButton.disabled = true;
        searchButton.textContent = "Data Error";
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

// --- Search Logic Function ---
function performSearch() {
    // CRITICAL CHECK: If data is empty, display an error and exit
    if (bibleData.length === 0) {
        resultsContainer.innerHTML = `<p class="text-red-500 p-4">Error: Question data is not loaded. Cannot perform search.</p>`;
        return;
    }
    
    // Get the user's search query and sanitize it
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = ''; // Clear previous results

    if (query.length < 3) {
        resultsContainer.innerHTML = `<p class="text-gray-500 p-4">Please enter at least 3 characters to search.</p>`;
        return;
    }

    // Search the loaded 'bibleData' array for a partial, case-insensitive match
    const matchingResults = bibleData.filter(item => 
        item.question.toLowerCase().includes(query)
    );

    // Display the results
    if (matchingResults.length > 0) {
        let resultsHtml = '';
        
        matchingResults.forEach(result => {
            // Join all the correct answers with a pipe separator
            const answersList = result.answers.join(' | ');

            resultsHtml += `
                <div class="result-box mt-3">
                    <h3 class="font-semibold text-lg">${result.question}</h3>
                    <p class="mt-2 text-gray-700"><strong>Answer(s):</strong> <span class="text-green-700 font-medium">${answersList}</span></p>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = `
            <p class="text-sm text-gray-600 mb-2">Found ${matchingResults.length} matching questions:</p>
            ${resultsHtml}
        `;
        
    } else {
        // No match found
        resultsContainer.innerHTML = `
            <div class="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-300">
                <p>Sorry, no question matching <strong>"${query}"</strong> was found. Try a different keyword.</p>
            </div>
        `;
    }
}

// Add event listener to the search button
searchButton.addEventListener('click', performSearch);
// Also allow searching on 'Enter' key press in the input field
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Start the application by loading the data
window.onload = initializeApp;
