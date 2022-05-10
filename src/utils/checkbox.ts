import { outdent } from 'outdent';

import type { BaseElementReference } from '~/utils/element-reference.js';
import { tellProcess } from '~/utils/process.js';
import { runAppleScript } from '~/utils/run.js';

interface ToggleCheckboxProps {
	element: BaseElementReference;
	value?: boolean;
}

export async function toggleCheckbox(props: ToggleCheckboxProps) {
	let checkboxAction: string;
	switch (props.value) {
		case true:
			// If checkbox is not checked, then check it
			checkboxAction = 'if not (its value as boolean) then click theCheckbox';
			break;
		case false:
			checkboxAction = 'if (its value as boolean) then click theCheckbox';
			break;
		default:
			checkboxAction = 'click theCheckbox';
	}

	await tellProcess(
		props.element.applicationProcess,
		outdent`
			set theCheckbox to ${props.element.pathString}
			tell theCheckbox
				${checkboxAction}
			end tell
		`
	);
}
