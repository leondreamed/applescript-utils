import { outdent } from 'outdent';
import type { Options as PWaitForOptions } from 'p-wait-for';
import pWaitFor from 'p-wait-for';

import type { BaseElementReference } from '~/utils/element-reference.js';
import { ElementReference } from '~/utils/element-reference.js';
import { pathStringToPathParts } from '~/utils/path.js';
import { runAppleScript } from '~/utils/run.js';

export async function getElements(
	processName: string
): Promise<ElementReference[]> {
	const elements = createElementReferences(
		(await runAppleScript(
			outdent`
				tell application "System Events"
				  tell front window of process ${JSON.stringify(processName)}
				    get entire contents
				  end tell
				end tell
			`
		)) as string[]
	);

	return elements;
}

export function createBaseElementReference(
	elementPathString: string
): BaseElementReference {
	const pathParts = pathStringToPathParts(elementPathString);

	return {
		application: pathParts.find((part) => part.type === 'application')!.name,
		applicationProcess: pathParts.find(
			(part) => part.type === 'application process'
		)!.name,
		path: pathParts,
		pathString: elementPathString,
	};
}

export function createElementReferences(
	elementPathStrings: string[]
): ElementReference[] {
	const baseElementReferences = elementPathStrings.map((elementPathString) =>
		createBaseElementReference(elementPathString)
	);

	const elementReferences: ElementReference[] = baseElementReferences.map(
		(_, elementIndex) =>
			new ElementReference({
				baseElements: baseElementReferences,
				elementIndex,
			})
	);

	return elementReferences;
}

type WaitForElementProps = {
	elementReference: ElementReference;
	interval?: number;
};
export async function waitForElementExists({
	elementReference,
	interval = 0.1,
}: WaitForElementProps) {
	await runAppleScript(
		outdent`
			tell application "System Events"
				tell process ${JSON.stringify(elementReference.applicationProcess)}
						repeat until exists ${elementReference.pathString}
								delay ${interval}
						end repeat
				end tell
			end tell
		`
	);
}

type WaitForElementHiddenProps = {
	elementReference: BaseElementReference;
	interval?: number;
};
export async function waitForElementHidden({
	elementReference,
	interval = 0.1,
}: WaitForElementHiddenProps) {
	await runAppleScript(
		outdent`
			tell application "System Events"
				tell process ${JSON.stringify(elementReference.applicationProcess)}
						repeat while exists ${elementReference}
								delay ${interval}
						end repeat
				end tell
			end tell
		`
	);
}

export async function waitForElementMatch(
	windowName: string,
	elementMatcher: (element: ElementReference) => boolean | Promise<boolean>,
	pWaitForOptions?: PWaitForOptions
) {
	const matchingElement = await pWaitFor(async () => {
		const elements = await getElements(windowName);
		for (const element of elements) {
			// eslint-disable-next-line no-await-in-loop
			if (await elementMatcher(element)) {
				return pWaitFor.resolveWith(element);
			}
		}

		return false;
	}, pWaitForOptions);

	return matchingElement;
}

export async function getElementProperties(
	element: BaseElementReference
): Promise<Record<string, unknown>> {
	const properties = (await runAppleScript(
		outdent`
			tell application "System Events"
				tell process ${JSON.stringify(element.applicationProcess)}
					get properties of ${element.pathString}
				end tell
			end tell
		`
	)) as Record<string, unknown>;

	return properties;
}
