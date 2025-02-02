document.addEventListener("DOMContentLoaded", function () {
  // Initialize quotes array and load from localStorage
  let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    {
      text: "Life is what happens when you're busy making other plans.",
      category: "Life",
    },
    {
      text: "Do what you can, with what you have, where you are.",
      category: "Motivation",
    },
  ];

  // Show random quote initially
  showRandomQuote();

  // Get elements from the DOM
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  const addQuoteBtn = document.getElementById("addQuote");
  const exportQuotesBtn = document.getElementById("exportQuotes");
  const importFileInput = document.getElementById("importFile");

  // Event listeners
  addQuoteBtn.addEventListener("click", addQuote);
  exportQuotesBtn.addEventListener("click", exportQuotes);
  importFileInput.addEventListener("change", importFromJsonFile);

  // Function to show a random quote
  function showRandomQuote() {
    if (quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
      // Save last viewed quote to sessionStorage
      sessionStorage.setItem(
        "lastViewedQuote",
        `${randomQuote.text} - ${randomQuote.category}`
      );
    } else {
      quoteDisplay.textContent = "No quotes available.";
    }
  }

  // Function to add a new quote
  function addQuote() {
    const quoteText = newQuoteText.value.trim();
    const quoteCategory = newQuoteCategory.value.trim();
    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      saveQuotes(); // Save to localStorage
      newQuoteText.value = "";
      newQuoteCategory.value = "";
      showRandomQuote(); // Show the new random quote
    } else {
      alert("Please enter both a quote and a category.");
    }
  }

  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // Function to export quotes to a JSON file
  function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes); // Merge imported quotes with the current quotes
          saveQuotes(); // Save to localStorage
          alert("Quotes imported successfully!");
          showRandomQuote(); // Show a random quote after importing
        } else {
          alert("Invalid file format.");
        }
      } catch (error) {
        alert("Error reading the file.");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Optional: Retrieve last viewed quote from sessionStorage when the page loads
  window.onload = function () {
    const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
    if (lastViewedQuote) {
      alert("Last viewed quote: " + lastViewedQuote);
    }
  };
});
