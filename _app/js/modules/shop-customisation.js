import { sanity } from "../sanity.js";

export default async function shopCustomisation() {
  let colorOption = "base";
  let materialOption = "base";
  let flowerOption = false;
  const shopPreviewImage = document.querySelector(".shop__preview-image");
  let productPrice = 0;
  const shopPriceBox = document.querySelector(".shop__price--box--price");
  let colorOptions = [];

  async function handleFormSubmit(event, form) {
    try {
      event.preventDefault();
      
      // Fetch color and material options if not already fetched
      if (colorOptions.length === 0) {
        colorOptions = await fetchColorOptions();
      }

      // Add event listeners to color, material, and flower options
      const colorButtons = document.querySelectorAll(".color-button");
      const materialButtons = document.querySelectorAll(".material-button");
      const flowerCheckbox = document.getElementById("flower");

      colorButtons.forEach((button) => {
        const option = colorOptions.find((opt) => opt.color === button.id);

        if (option) {
          button.addEventListener("click", () => {
            colorOption = option.color;
            updateProduct();
          });
        }
      });

      materialButtons.forEach((button) => {
        const option = colorOptions.find((opt) => opt.material === button.id);

        if (option) {
          button.addEventListener("click", () => {
            materialOption = option.material;
            updateProduct();
          });
        }
      });

      flowerCheckbox.addEventListener("change", () => {
        flowerOption = flowerCheckbox.checked;
        updateProduct();
      });

      
    } catch (error) {
        console.error("Error in handleFormSubmit:", error);
    }
 }

    // Find the right URL address to the unique product image
    function updateProduct() {
        const option = colorOptions.find((opt) => opt.color === colorOption && opt.material === materialOption && opt.flower === flowerOption);

        if (option) {
        shopPreviewImage.style.backgroundImage = `url("${option.previewImage.url}")`;
        shopPriceBox.innerText = `€ ${option.price.toFixed(2)}`;
        }
    }

    // Fetch the product details from Sanity
    async function fetchColorOptions() {
        const query = `*[ _type == 'product' ] {
            'colorMaterial': colorMaterial[]{
            'color': color,
            'material': material,
            'flower': flower,
            'previewImage': previewImage.asset->{
            url
            }
        }
        }`;

    const response = await sanity.fetch(query);
    const colorOptions = response.flatMap((product) => product.colorMaterial);

    const uniqueColorOptions = Array.from(new Set(colorOptions.map((option) => JSON.stringify(option)))).map((stringified) =>
      JSON.parse(stringified),
    );

    return uniqueColorOptions;
  }

  // ...

  const form = document.querySelector("#product-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleFormSubmit(event, form).catch((error) => console.error("Error in form submission:", error));
  });

  // Fetch the color and material options and update the UI
  await handleFormSubmit(new Event("submit"), form);
}
