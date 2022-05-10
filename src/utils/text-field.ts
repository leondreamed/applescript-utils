import { outdent } from 'outdent';

import type { ElementReference } from '~/utils/element-reference.js';
import { runAppleScript } from '~/utils/run.js';

export async function setTextFieldValue(
	element: ElementReference,
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
