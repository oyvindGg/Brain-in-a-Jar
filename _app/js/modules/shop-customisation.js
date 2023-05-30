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

      // Generate color option buttons
      const colorButtonsContainer = document.querySelector('#color');
      colorButtonsContainer.innerHTML = '';

      colorOptions.forEach((option) => {
        const button = createOptionButton(option, 'color-button');
        button.addEventListener('click', handleColorSelection);
        colorButtonsContainer.appendChild(button);
      });

      // Generate material option buttons if there are options available
      const materialButtonsContainer = document.querySelector('#material');
      materialButtonsContainer.innerHTML = '';

      if (materialOptions.length > 0) {
        materialOptions.forEach((option) => {
          const button = createOptionButton(option, 'material-button');
          button.addEventListener('click', handleMaterialSelection);
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

  // Fetch the color options
  async function fetchColorOptions() {
    const query = `*[ _type == 'product' ] {
      'colorMaterial': colorMaterial[]{
        'color': color,
        'material': material,
        'flower': flower,
        'previewImage': previewImage->{
          'asset': asset->{ url }
        }
      }
    }`;

    const response = await sanity.fetch(query);
    const colorOptions = response.flatMap((product) => product.colorMaterial);

    // Remove duplicates based on the 'color', 'material', and 'flower' properties
    const uniqueColorOptions = Array.from(
      new Set(colorOptions.map((option) => JSON.stringify(option))),
    ).map((stringified) => JSON.parse(stringified));

    return uniqueColorOptions;
  }

  async function fetchMaterialOptions() {
    const query = `*[ _type == 'product' ] {
      'colorMaterial': colorMaterial[]{
        'color': color,
        'material': material,
        'flower': flower,
        'previewImage': previewImage->{
          'asset': asset->{ url }
        }
      }
    }`;

    const response = await sanity.fetch(query);
    const materialOptions = response.flatMap((product) => product.colorMaterial);

    // Remove duplicates based on the 'color', 'material', and 'flower' properties
    const uniqueMaterialOptions = Array.from(
      new Set(materialOptions.map((option) => JSON.stringify(option))),
    ).map((stringified) => JSON.parse(stringified));

    return uniqueMaterialOptions;
  }

  function createOptionButton(option, buttonClass) {
    const button = document.createElement('button');
    button.className = buttonClass;
    button.textContent = option.title;
    button.value = option.value;
  
    if (option.previewImage && option.previewImage.asset && option.previewImage.asset.url) {
      const imageUrl = option.previewImage.asset.url;
  
      button.dataset.imageId = option.previewImage._ref; // Set the dataset property to the image reference ID
      button.dataset.imageUrl = imageUrl; // Set the dataset property to the image URL
  
      // Set the background image using the background-image CSS property
      button.style.backgroundImage = `url(${imageUrl})`;
    }
  
    if (buttonClass === 'color-button') {
      button.addEventListener('click', handleColorSelection);
    } else if (buttonClass === 'material-button') {
      button.addEventListener('click', handleMaterialSelection);
    }
  
    return button;
  }
  
  
  
  
  
  function handleColorSelection(event) {
    const color = event.target.value;
    console.log('Selected color:', color);

    const form = document.querySelector('#product-form');
    console.log('Form:', form);

    form.elements.color.value = color;
    form.elements.color.dataset.imageId = event.target.dataset.imageId;
    form.elements.color.dataset.imageUrl = event.target.dataset.imageUrl; // Add this line

    updatePreviewImage(form);
  }

  function handleMaterialSelection(event) {
    const material = event.target.value;
    console.log('Selected material:', material);

    const form = document.querySelector('#product-form');
    console.log('Form:', form);

    form.elements.material.value = material;
    form.elements.material.dataset.imageId = event.target.dataset.imageId;
    form.elements.material.dataset.imageUrl = event.target.dataset.imageUrl; // Add this line

    updatePreviewImage(form);
  }

  function updatePreviewImage(form) {
    const colorImageUrl = form.elements.color.dataset.imageUrl || '';
    const materialImageUrl = form.elements.material.dataset.imageUrl || '';
    const hasFlower = form.elements.flower.checked;

    const previewImage = document.querySelector('.shop__preview-image');
    const previewImageUrl = getPreviewImageUrl(colorImageUrl, materialImageUrl, hasFlower);

    console.log('Color image URL:', colorImageUrl);
    console.log('Material image URL:', materialImageUrl);

    // Set the background-image style property
    previewImage.style.backgroundImage = `url("${previewImageUrl}")`;
  }

  function getPreviewImageUrl(colorImageUrl, materialImageUrl) {
    if (colorImageUrl && materialImageUrl) {
      const colorExtension = getColorExtension(colorImageUrl);
      const materialExtension = getMaterialExtension(materialImageUrl);
      return `${colorImageUrl}${colorExtension},${materialImageUrl}${materialExtension}`;
    } else if (colorImageUrl) {
      return colorImageUrl;
    } else if (materialImageUrl) {
      return materialImageUrl;
    } else {
      return '';
    }
  }

  function getColorExtension(colorImageUrl) {
    return colorImageUrl.substr(colorImageUrl.lastIndexOf('.'));
  }

  function getMaterialExtension(materialImageUrl) {
    return materialImageUrl.substr(materialImageUrl.lastIndexOf('.'));
  }

  const form = document.querySelector('#product-form');
  form.addEventListener('submit', (event) => handleFormSubmit(event, form));

  // Fetch the color and material options and update the UI
  await handleFormSubmit(new Event('submit'), form);
}

shopCustomisation();
