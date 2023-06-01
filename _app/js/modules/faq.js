import { sanity } from "../sanity.js";

export default async function loadFAQSection() {
  // Fetch the FAQ data from Sanity
  async function fetchFAQData() {
    const query = `*[_type == 'faq']{
      question,
      answer
    }`;

    const response = await sanity.fetch(query);
    return response;
  }

  // Create the HTML structure for FAQ items
  function createFAQItems(faqData) {
    const faqList = document.querySelector(".faq__list");

    faqData.forEach((item) => {
      const faqItem = document.createElement("div");
      faqItem.classList.add("faq__item");

      const question = document.createElement("div");
      question.classList.add("faq__question");
      question.textContent = item.question;

      const answer = document.createElement("div");
      answer.classList.add("faq__answer");
      answer.textContent = item.answer;

      faqItem.appendChild(question);
      faqItem.appendChild(answer);
      faqList.appendChild(faqItem);
    });

    // Add event listeners to handle the click functionality
    const faqItems = document.querySelectorAll(".faq__item");

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq__question");
      const answer = item.querySelector(".faq__answer");

      question.addEventListener("click", () => {
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("open");
          }
        });

        item.classList.toggle("open");
      });
    });
  }

  // Fetch FAQ data and populate the HTML
  async function loadFAQSection() {
    try {
      const faqData = await fetchFAQData();
      createFAQItems(faqData);
    } catch (error) {
      console.error("Error loading FAQ section:", error);
    }
  }

  // Load FAQ section on page load
  loadFAQSection();
}
