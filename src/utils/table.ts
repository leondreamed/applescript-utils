import { outdent } from 'outdent';

import { createBaseElementReference } from '~/utils/element.js';
import type { BaseElementReference } from '~/utils/element-reference.js';
import { pathPartsToPathString } from '~/utils/path.js';
import { tellProcess } from '~/utils/process.js';
import { runAppleScript } from '~/utils/run.js';

export async function getTableRows(
	tableElement: BaseElementReference
): Promise<BaseElementReference[]> {
	const rowPathStrings = (await tellProcess(
		tableElement.applicationProcess,
		outdent`
			get rows of ${tableElement.pathString}
		`
	)) as string[];

	return rowPathStrings.map((pathString) =>
		createBaseElementReference(pathString)
	);
}

interface SelectTableRowProps {
	row: BaseElementReference;
	table?: BaseElementReference;
}
export async function selectTableRow(props: SelectTableRowProps) {
	const rowFullName = props.row.path[0]?.fullName;
	if (rowFullName === undefined) {
		throw new Error('Could not get full name of row.');
	}

	if (!rowFullName.startsWith('row')) {
		throw new Error('Row full name should start with `row`');
	}

	let table: BaseElementReference;
	if (props.table === undefined) {
		const tableIndex = props.row.path.findIndex(
			(part) => part.type === 'table'
		);
		table = createBaseElementReference(
			pathPartsToPathString(props.row.path.slice(tableIndex))
		);
	} else {
		table = props.table;
	}

	await runAppleScript(outdent`
		tell application "System Events"
			tell process ${JSON.stringify(table.applicationProcess)}
				select ${rowFullName} of ${table.pathString}
			end tell
		end tell
	`);
}
