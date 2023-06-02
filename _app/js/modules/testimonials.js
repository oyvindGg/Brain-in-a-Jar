import { sanity } from "../sanity.js";

export default async function loadTestimonialsSection() {
  // Fetch the testimonial data from Sanity
  async function fetchTestimonialData() {
    const query = `*[_type == 'testimonial']{
      avatar,
      name,
      usertitle,
      review
    }`;

    const response = await sanity.fetch(query);
    return response;
  }

  // Create the HTML structure for a testimonial box
  function createTestimonialBox(testimonial) {
    const testimonialBox = document.createElement("div");
    testimonialBox.classList.add("testimonial__box");

    const avatar = document.createElement("img");
    avatar.classList.add("testimonial__avatar");
    avatar.src = testimonial.avatar.asset.url;
    avatar.alt = "Testimonial Avatar";

    const contentContainer = document.createElement("div");
    contentContainer.classList.add("testimonial__content");

    const name = document.createElement("h3");
    name.classList.add("testimonial__name");
    name.textContent = testimonial.name;

    const usertitle = document.createElement("p");
    usertitle.classList.add("testimonial__usertitle");
    usertitle.textContent = testimonial.usertitle;

    const review = document.createElement("p");
    review.classList.add("testimonial__review");
    review.textContent = testimonial.review;

    contentContainer.appendChild(name);
    contentContainer.appendChild(usertitle);
    contentContainer.appendChild(review);

    testimonialBox.appendChild(avatar);
    testimonialBox.appendChild(contentContainer);

    return testimonialBox;
  }

  // Fetch testimonial data and populate the HTML
  async function loadTestimonialsSection() {
    try {
      const testimonialsData = await fetchTestimonialData();
      const testimonialsContainer = document.querySelector(".testimonials__container");

      testimonialsData.forEach((testimonial, index) => {
        const testimonialBox = createTestimonialBox(testimonial);
        testimonialsContainer.appendChild(testimonialBox);

        // Show the first testimonial, hide the rest
        if (index === 0) {
          testimonialBox.style.display = "block";
        } else {
          testimonialBox.style.display = "none";
        }
      });

      const testimonialBoxes = document.querySelectorAll(".testimonial__box");
      let currentTestimonialIndex = 0;

      // Function to show the current testimonial
      function showCurrentTestimonial() {
        testimonialBoxes.forEach((testimonialBox, index) => {
          if (index === currentTestimonialIndex) {
            testimonialBox.style.display = "block";
          } else {
            testimonialBox.style.display = "none";
          }
        });
      }

      // Function to show the next testimonial
      function showNextTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialBoxes.length;
        showCurrentTestimonial();
      }

      // Function to show the previous testimonial
      function showPreviousTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialBoxes.length) % testimonialBoxes.length;
        showCurrentTestimonial();
      }

      // Add event listeners to handle navigation between testimonials
      const nextButton = document.querySelector(".testimonial__next");
      const previousButton = document.querySelector(".testimonial__previous");

      nextButton.addEventListener("click", showNextTestimonial);
      previousButton.addEventListener("click", showPreviousTestimonial);

      // Show the first testimonial initially
      showCurrentTestimonial();
    } catch (error) {
      console.error("Error loading testimonials section:", error);
    }
  }

  // Load testimonials section on page load
  loadTestimonialsSection();
}
