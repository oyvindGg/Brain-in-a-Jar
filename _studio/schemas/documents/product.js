export default {
	title: 'Product',
	name: 'product',
	type: 'document',
	fields: [
		{
			title: 'Name',
			name: 'name',
			type: 'string',
		},
		{
			title: 'Slug',
			name: 'slug',
			type: 'slug',
			options: {
				source: 'name'
			}
		},
		{
			title: 'Price',
			description: 'Price in USD',
			name: 'price',
			type: 'number',
		},
		{
			title: 'Color',
			name: 'color',
			type: 'string',
			options: {
				list: [
					{ title: 'Base', value: 'base' },
					{ title: 'Blue', value: 'b' },
					{ title: 'Green', value: 'g' },
					{ title: 'Purple', value: 'p' },
					{ title: 'Red', value: 'r' },
				]
			}
		},
		{
			title: 'Material',
			name: 'material',
			type: 'string',
			options: {
				list: [
					{ title: 'Base', value: 'base'},
					{ title: 'Marble', value: 'marble'},
					{ title: 'Wood', value: 'wood'},
				]
			}
		},
		{
			title: 'Flower',
			name: 'flower',
			type: 'boolean',
			options: {
				layout: 'checkbox'
			}
		},
		{
			title: 'Preview',
			name: 'preview',
			type: 'image',
		}
	]
}