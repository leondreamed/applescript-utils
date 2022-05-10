import { outdent } from 'outdent';

import type { BaseElementReference } from '~/utils/element-reference.js';
import { tellProcess } from '~/utils/process.js';

export async function clickElement(element: BaseElementReference) {
	await tellProcess(
		element.applicationProcess,
		outdent`
			set myElement to a reference to ${element.pathString}
			click myElement
		`
	);
}
