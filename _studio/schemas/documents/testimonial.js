export default {
	title: 'Testiomonial',
	name: 'testimonial',
	type: 'document',
	fields: [
		{
			title: 'Avatar',
			name: 'avatar',
			type: 'image',
		},
		{
			title: 'Name',
			name: 'name',
			type: 'string',
		},
		{
			title: 'Usertitle',
			name: 'usertitle',
			type: 'string',
		},
		{
			title: 'Slug',
			name: 'slug',
			type: 'slug',
			options: {
				source: 'title'
			}
		},
		{
			title: 'Review',
			name: 'review',
			type: 'text',
		}
	]
}