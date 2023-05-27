import { sanity } from "../sanity.js";

export default async function shopCustomisation() {
  async function handleFormSubmit(event) {
	event.preventDefault();

	const colorOptions = await fetchColorOptions();
	const materialOptions = await fetchMaterialOptions();


	// Generate color option buttons
	const colorButtonsContainer = document.querySelector('.shop__customise--color');
	colorButtonsContainer.innerHTML = '';

	colorOptions.forEach((option) => {
		const button = document.createElement('button');
		button.className = option.value;
		button.textContent = option.title;
		button.value = option.value;
		button.style.backgroundImage = `url(${option.imageUrl})`;
		button.addEventListener('click', handleColorSelection);
		colorButtonsContainer.appendChild(button);
	});

	// Generate material option buttons
	const materialButtonsContainer = document.querySelector('.shop__customise--material');
	materialButtonsContainer.innerHTML = '';

	materialOptions.forEach((option) => {
		const button = document.createElement('button');
		button.className = option.value;
		button.textContent = option.title;
		button.value = option.value;
		button.style.backgroundImage = `url(${option.imageUrl})`;
		button.addEventListener('click', handleMaterialSelection);
		materialButtonsContainer.appendChild(button);
	});

	// Reset the form
	form.reset();

	// Update the preview image
	updatePreviewImage();
  }

  // Fetch the color and material options from Sanity
  async function fetchColorOptions() {
    const query = `*[_type == 'product']{
      colorOptions[]{
			title,
			value,
			'imageUrl': image.asset->url
		}
    }`;

    const response = await sanity.fetch(query);
    return response[0].colorOptions || [];
  }

  async function fetchMaterialOptions() {
    const query = `*[_type == 'product']{
      materialOptions[]{
			title,
			value,
			'imageUrl': image.asset->url
		}
    }`;

    const response = await sanity.fetch(query);
    return response[0].materialOptions || [];
  }

  // Update the preview image
  function handleColorSelection(event) {
    const color = event.target.value;
    form.elements.color.value = color;

    updatePreviewImage();
  }

  function handleMaterialSelection(event) {
    const material = event.target.value;
    form.elements.material.value = material;

    updatePreviewImage();
  }

  function updatePreviewImage() {
    const color = form.elements.color.value;
    const material = form.elements.material.value;

    // Generate the preview image URL based on color and material
    const previewImageUrl = getPreviewImageUrl(color, material);

    const previewImage = document.querySelector('.shop__preview-image');
    previewImage.style.backgroundImage = `url(${previewImageUrl})`;
  }

  const form = document.getElementById('product-form');
  form.addEventListener('submit', handleFormSubmit);
}

// Generate the preview image URL based on color and material
function getPreviewImageUrl(color, material) {
  // Implement this function to return the URL of the preview image
  // based on the selected color and material.
  // Replace this placeholder code with the actual implementation.
  return '';
}
