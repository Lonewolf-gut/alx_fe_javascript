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

  // Populate categories on page load
  populateCategories();
  filterQuotes();

  // Event Listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);
  exportQuotesBtn.addEventListener("click", exportQuotes);
  importFileInput.addEventListener("change", importFromJsonFile);
  categoryFilter.addEventListener("change", filterQuotes);

  // Fetch and sync server data every 30 seconds
  setInterval(fetchQuotesFromServer, 30000);

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

  async function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = async function (event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          await saveQuotes();
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

  async function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // Fetching quotes from server and handling sync
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const data = await response.json();

      const newQuotes = data.map((quote, index) => ({
        text: quote.title,
        category: index % 2 === 0 ? "Motivation" : "Life",
      }));

      handleNewQuotes(newQuotes);
    } catch (error) {
      console.error("Error fetching data from server:", error);
    }
  }

  // Handling syncing logic
  function handleNewQuotes(newQuotes) {
    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    const lastSyncVersion = localStorage.getItem("lastSyncVersion") || 0;

    if (newQuotes.length > storedQuotes.length) {
      console.log("Syncing new quotes from server...");
      localStorage.setItem("quotes", JSON.stringify(newQuotes));
      localStorage.setItem("lastSyncVersion", Date.now());
      alert("Quotes have been updated from the server.");
      populateCategories();
      showRandomQuote();

      // Post the new quotes to the server
      postQuotesToServer(newQuotes);
    }
  }

  // Posting new or updated quotes to the server
  async function postQuotesToServer(newQuotes) {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newQuotes),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Quotes successfully posted to the server:", result);
      } else {
        console.error("Failed to post quotes to the server.");
      }
    } catch (error) {
      console.error("Error posting quotes to server:", error);
    }
  }
});
