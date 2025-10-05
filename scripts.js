// --- Application Global Variables and Setup ---
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const resultsContainer = document.getElementById("results-container");
const loadingIndicator = document.getElementById("loading-indicator");

let bibleData = []; // This will hold the loaded data

// --- Initialization Function ---
// This function handles loading the JSON data asynchronously
async function initializeApp() {
  loadingIndicator.classList.remove("hidden");
  searchButton.disabled = true;

  try {
    // Fetch the JSON data from the file
    const response = await fetch("./questions.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    bibleData = await response.json(); // Convert the response to a JavaScript object

    // Success: Enable search functionality
    searchButton.disabled = false;
    searchButton.textContent = "Search for Answer";
    resultsContainer.innerHTML = `<p class="text-center text-gray-500 p-4 border border-dashed border-gray-300 rounded-lg">Data loaded successfully! Enter your search query above.</p>`;
  } catch (error) {
    // Display a clear error if the file can't be loaded
    resultsContainer.innerHTML = `<div class="p-4 bg-red-100 text-red-700 rounded-lg">
                <p class="font-bold">Error loading questions!</p>
                <p>Please ensure you are running the app on a local web server (e.g., Live Server in VS Code) and the 'questions.json' file is in the same directory.</p>
                <p class="text-sm mt-1">Details: ${error.message}</p>
            </div>`;
    console.error("Error loading questions.json:", error);
    searchButton.disabled = true;
    searchButton.textContent = "Data Error";
  } finally {
    loadingIndicator.classList.add("hidden");
  }
}

// --- Search Logic Function ---
function performSearch() {
  // Check if data is loaded before proceeding
  if (bibleData.length === 0) {
    resultsContainer.innerHTML = `<p class="text-red-500">Data not available. Please refresh the app.</p>`;
    return;
  }

  // Get the user's search query and sanitize it
  const query = searchInput.value.trim().toLowerCase();
  resultsContainer.innerHTML = ""; // Clear previous results

  if (query.length < 3) {
    resultsContainer.innerHTML = `<p class="text-gray-500 p-4">Please enter at least 3 characters to search.</p>`;
    return;
  }

  // Search the loaded 'bibleData' array for a partial, case-insensitive match
  // We filter all matching results, not just the first one
  const matchingResults = bibleData.filter((item) =>
    item.question.toLowerCase().includes(query)
  );

  // Display the results
  if (matchingResults.length > 0) {
    let resultsHtml = "";

    // Iterate over all found matches
    matchingResults.forEach((result) => {
      // Join all the correct answers with a comma and space
      const answersList = result.answers.join(" | ");

      resultsHtml += `
                <div class="result-box mt-3">
                    <h3 class="font-semibold">${result.question}</h3>
                    <p class="mt-2 text-gray-700"><strong>Answer(s):</strong> <span class="text-green-700 font-medium">${answersList}</span></p>
                </div>
            `;
    });

    resultsContainer.innerHTML = `
            <p class="text-sm text-gray-500 mb-2">Found ${matchingResults.length} matching questions:</p>
            ${resultsHtml}
        `;
  } else {
    // No match found
    resultsContainer.innerHTML = `
            <p class="text-center text-red-500 p-4 border border-dashed border-red-300 rounded-lg">
                Sorry, no question matching "${query}" was found. Try a different keyword.
            </p>
        `;
  }
}

// Add event listener to the search button
searchButton.addEventListener("click", performSearch);
// Also allow searching on 'Enter' key press in the input field
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    performSearch();
  }
});

// Start the application by loading the data
window.onload = initializeApp;
