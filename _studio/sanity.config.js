import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';

import schemas from './schemas/schemas.js';

export default {
	title: 'Brain in a Jar',

	projectId: 'i41q89f0',
	dataset: 'production',

	plugins: [
		deskTool(), 
		visionTool()
	],

	schema: {
		types: schemas,
	},
};
