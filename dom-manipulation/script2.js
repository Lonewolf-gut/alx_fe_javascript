document.addEventListener("DOMContentLoaded", function () {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const categoryFilter = document.getElementById("categoryFilter");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  const addQuoteBtn = document.getElementById("addQuote");

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

  function showRandomQuote() {
    const filteredQuotes =
      categoryFilter.value === "all"
        ? quotes
        : quotes.filter((quote) => quote.category === categoryFilter.value);

    if (filteredQuotes.length > 0) {
      const randomQuote =
        filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
      quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    } else {
      quoteDisplay.textContent = "No quotes available.";
    }
  }

  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      localStorage.setItem("quotes", JSON.stringify(quotes));
      newQuoteText.value = "";
      newQuoteCategory.value = "";
      populateCategories();
      filterQuotes();
    }
  }

  populateCategories();
  filterQuotes();
  categoryFilter.addEventListener("change", filterQuotes);
  addQuoteBtn.addEventListener("click", addQuote);
});
