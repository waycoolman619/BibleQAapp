// NOTE: The 'bibleData' array is now loaded from the separate 'questions.js' file.

// --- Application Global Variables and Setup ---
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results-container');

// --- Search Logic Function (Synchronous) ---
function performSearch() {
    // CRITICAL CHECK: Ensure data is actually loaded from questions.js
    if (typeof bibleData === 'undefined' || !Array.isArray(bibleData)) {
        resultsContainer.innerHTML = `<p class="text-red-500 p-4">Error: Data failed to load. Check console for 'bibleData is not defined'.</p>`;
        return;
    }
    
    // Get the user's search query and sanitize it
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = ''; // Clear previous results

    if (query.length < 3) {
        resultsContainer.innerHTML = `<p class="text-gray-500 p-4">Please enter at least 3 characters to search.</p>`;
        return;
    }

    // Search the global 'bibleData' array for a partial, case-insensitive match
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

// --- Initialization: Set up listeners immediately ---
// Add event listener to the search button
searchButton.addEventListener('click', performSearch);
// Also allow searching on 'Enter' key press in the input field
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Display initial ready message
window.onload = () => {
    resultsContainer.innerHTML = `
        <p class="text-center text-gray-500 p-4 border border-dashed border-gray-300 rounded-lg">
            Data loaded successfully! Enter your search query above.
        </p>
    `;
    searchButton.textContent = "Search for Answer";
};
