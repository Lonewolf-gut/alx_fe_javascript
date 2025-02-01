document.addEventListener("DOMContentLoaded", function () {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const categoryFilter = document.getElementById("categoryFilter");
  const newQuoteBtn = document.getElementById("newQuote");
  const exportQuotesBtn = document.getElementById("exportQuotes");
  const importFileInput = document.getElementById("importFile");

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

  // Populate categories when the page loads
  populateCategories();
  filterQuotes();

  // Event Listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);
  exportQuotesBtn.addEventListener("click", exportQuotes);
  importFileInput.addEventListener("change", importFromJsonFile);
  categoryFilter.addEventListener("change", filterQuotes);

  function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const randomQuote = filteredQuotes[randomIndex];
      quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    } else {
      quoteDisplay.textContent = "No quotes available.";
    }
  }

  function populateCategories() {
    const categories = [...new Set(quotes.map((quote) => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    const lastSelectedCategory = localStorage.getItem("selectedCategory");
    if (lastSelectedCategory) {
      categoryFilter.value = lastSelectedCategory;
    }
  }

  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);
    showRandomQuote();
  }

  function getFilteredQuotes() {
    const selectedCategory = categoryFilter.value;
    return selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);
  }

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

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          alert("Quotes imported successfully!");
          populateCategories();
          showRandomQuote();
        } else {
          alert("Invalid file format.");
        }
      } catch (error) {
        alert("Error reading the file.");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
});
