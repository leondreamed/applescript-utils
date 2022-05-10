import { outdent } from 'outdent';

import type { BaseElementReference } from '~/utils/element-reference.js';
import { tellProcess } from '~/utils/process.js';

export async function setTextFieldValue(
	element: BaseElementReference,
	text: string
) {
	await tellProcess(
		element.applicationProcess,
		outdent`
			set value of ${element.pathString} to ${JSON.stringify(text)}
		`
	);
}

export async function getTextFieldValue(element: BaseElementReference) {
	const textFieldValue = await tellProcess(
		element.applicationProcess,
		outdent`
			get value of ${element.pathString}
		`
	);

	return textFieldValue;
}
