import { sanity } from "../sanity.js";

export default async function shopCustomisation() {
  async function handleFormSubmit(event, form) {
    try {
      event.preventDefault();

      // Fetch color and material options
      const colorOptions = await fetchColorOptions();
      const materialOptions = await fetchMaterialOptions();

      console.log('Color options:', colorOptions);
      console.log('Material options:', materialOptions);

      // Add event listeners to color, material, and flower options
      const colorButtonsContainer = document.querySelector('#color');
      colorButtonsContainer.innerHTML = '';

      colorOptions.forEach((option) => {
        const button = createOptionButton(option, 'color-button');
        button.addEventListener('click', () => handleColorSelection(option));
        colorButtonsContainer.appendChild(button);
      });

      // Generate material option buttons if there are options available
      const materialButtonsContainer = document.querySelector('#material');
      materialButtonsContainer.innerHTML = '';

      if (materialOptions.length > 0) {
        materialOptions.forEach((option) => {
          const button = createOptionButton(option, 'material-button');
          button.addEventListener('click', () => handleMaterialSelection(option));
          materialButtonsContainer.appendChild(button);
        });
      } else {
        // Handle the scenario when there are no material options
        const noMaterialOption = document.createElement('p');
        noMaterialOption.textContent = 'No material options available.';
        materialButtonsContainer.appendChild(noMaterialOption);
      }

      // Reset the form
      form.reset();

      // Update the preview image
      updatePreviewImage(form);

    } catch (error) {
      console.error('Error in handleFormSubmit:', error);
    }
  }

  async function updatePreviewImage(form) {
    const colorImageUrl = form.elements.color.dataset.imageUrl || '';
    const materialImageUrl = form.elements.material.dataset.imageUrl || '';
    const hasFlower = form.elements.flower.checked;

    const previewImage = document.querySelector('.shop__preview-image');

    // Remove any existing background image styles
    previewImage.style.backgroundImage = '';

    // Create an array to hold the URLs of the selected images
    const imageUrls = [];

    // Add the color image URL
    if (colorImageUrl) {
      imageUrls.push(`url("${colorImageUrl}")`);
    }

    // Add the material image URL
    if (materialImageUrl) {
      imageUrls.push(`url("${materialImageUrl}")`);
    }

    // Add the flower image URL if flowers are selected
    if (hasFlower && materialImageUrl) {
      const flowerImageUrl = materialImageUrl.replace(/(\.[\w\d_-]+)$/i, '-flower$1');
      imageUrls.push(`url("${flowerImageUrl}")`);
    }

    // Set the background image using the joined URLs
    console.log('Image URLs:', imageUrls.join(', '));
    previewImage.style.backgroundImage = imageUrls.join(', ');
  }

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

    const uniqueColorOptions = Array.from(
      new Set(colorOptions.map((option) => JSON.stringify(option)))
    ).map((stringified) => JSON.parse(stringified));

    return uniqueColorOptions;
  }

  async function fetchMaterialOptions() {
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
    const materialOptions = response.flatMap((product) => product.colorMaterial);

    const uniqueMaterialOptions = Array.from(
      new Set(materialOptions.map((option) => JSON.stringify(option)))
    ).map((stringified) => JSON.parse(stringified));

    return uniqueMaterialOptions;
  }

  function createOptionButton(option, buttonClass) {
    const button = document.createElement('button');
    button.className = buttonClass;
    button.textContent = option.color;
    button.value = option.color;

    if (option.previewImage?.asset?.url) {
      const imageUrl = option.previewImage.asset.url;

      button.dataset.imageUrl = option.previewImage.asset.url; // Set the dataset property to the image URL

      // Set the background image using the style attribute
      button.style.backgroundImage = `url("${imageUrl}")`;
      button.style.backgroundSize = 'cover';
      button.style.backgroundPosition = 'center center';
      button.style.backgroundRepeat = 'no-repeat';
    }

    return button;
  }

  async function handleColorSelection(option) {
    const form = document.querySelector('#product-form');
    form.elements.color.value = option.color;
    form.elements.color.dataset.imageUrl = option.previewImage.asset.url;

    // Clear the material buttons container
    const materialButtonsContainer = document.querySelector('#material');
    materialButtonsContainer.innerHTML = '';

    // Generate material option buttons if there are options available
    if (option.materials && option.materials.length > 0) {
      option.materials.forEach((materialOption) => {
        const button = createOptionButton(materialOption, 'material-button');
        button.addEventListener('click', () => handleMaterialSelection(materialOption));
        materialButtonsContainer.appendChild(button);
      });
    } else {
      // Handle the scenario when there are no material options
      const noMaterialOption = document.createElement('p');
      noMaterialOption.textContent = 'No material options available.';
      materialButtonsContainer.appendChild(noMaterialOption);
    }

    // Update the preview image
    updatePreviewImage(form);
  }

  function handleMaterialSelection(option) {
    const form = document.querySelector('#product-form');
    form.elements.material.value = option.material;
    form.elements.material.dataset.imageUrl = option.previewImage.asset.url;

    updatePreviewImage(form); // Update the preview image with the new material selection
  }

  const form = document.querySelector('#product-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleFormSubmit(event, form).catch(error => console.error('Error in form submission:', error));
  });

  // Fetch the color and material options and update the UI
  await handleFormSubmit(new Event('submit'), form);
}

shopCustomisation();
