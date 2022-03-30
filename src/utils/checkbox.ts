import { outdent } from 'outdent';
import type { ElementReference } from '~/types/element.js';
import { runAppleScript } from '~/utils/run.js';

type ToggleCheckboxProps = {
	element: ElementReference;
	value?: boolean;
};
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

	await runAppleScript(
		outdent`
			tell application "System Events" to tell process ${props.element.applicationProcess}
				set theCheckbox to ${props.element.pathString}
				tell theCheckbox
					${checkboxAction}
				end tell
			end tell
		`
	);
}