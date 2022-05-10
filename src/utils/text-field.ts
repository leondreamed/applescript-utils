import { outdent } from 'outdent';

import type { BaseElementReference } from '~/utils/element-reference.js';
import { runAppleScript } from '~/utils/run.js';

export async function setTextFieldValue(
	element: BaseElementReference,
	text: string
) {
	await runAppleScript(outdent`
		tell application "System Events"
		    tell process ${JSON.stringify(element.applicationProcess)}
		        set value of ${element.pathString} to ${JSON.stringify(text)}
		    end tell
		end tell
	`);
}

export async function getTextFieldValue(element: BaseElementReference) {
	await runAppleScript(outdent`
		tell application "System Events"
		    tell process ${JSON.stringify(element.applicationProcess)}
		        get value of ${element.pathString}
		    end tell
		end tell
	`);
}
