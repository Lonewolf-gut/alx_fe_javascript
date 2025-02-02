document.addEventListener("DOMContentLoaded", function () {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");

  let quotes = [
    {
      text: "Life is what happens when you're busy making other plans.",
      category: "Life",
    },
    {
      text: "Do what you can, with what you have, where you are.",
      category: "Motivation",
    },
  ];

  function showRandomQuote() {
    if (quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    } else {
      quoteDisplay.textContent = "No quotes available.";
    }
  }

  function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteBtn">Add Quote</button>
      `;
    document.body.appendChild(formContainer);

    document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  }

  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      showRandomQuote();
    }
  }

  newQuoteBtn.addEventListener("click", showRandomQuote);
  createAddQuoteForm();
  showRandomQuote();
});
