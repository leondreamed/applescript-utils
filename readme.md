# applescript-utils

[![npm version](https://img.shields.io/npm/v/applescript-utils)](https://npmjs.com/package/applescript-utils)

Some utilities for working with AppleScript.

## Installation

```shell
npm install applescript-utils
```

## Usage

```javascript
import { getElements } from 'applescript-utils';

await getElements('System Preferences');
```

## API

### getElements(processName)

Returns: `ElementReference[]`

Gets all the UI elements in a process. This function runs the following AppleScript:

```applescript
tell application "System Events"
  tell front window of process ${JSON.stringify(processName)}
    get entire contents
  end tell
end tell
```

#### processName

Type: `string`\
Required: `true`

The name of the process to retrieve all the elements from.

### waitForElementExists(options)

Waits until an element exists. This function runs the following AppleScript:

```applescript
tell application "System Events"
  tell process ${JSON.stringify(elementReference.applicationProcess)}
      repeat until exists ${elementReference.pathString}
          delay ${interval}
      end repeat
  end tell
end tell
```

#### options.elementReference

Type: `ElementReference`\
Required: `true`

A reference to the element to wait for.

#### options.interval

Type: `number`\
Default: `0.1`

The amount of time in seconds to wait for before re-checking to see if the element exists.

### clickElement(elementReference)

Clicks an element. This function runs the following AppleScript:

```applescript
tell application "System Events"
  tell process ${element.applicationProcess}
    set myElement to a reference to ${element.pathString}
    click myElement
  end tell
end tell
```

#### elementReference

Type: `ElementReference`\
Required: `true`

A reference to the element to click.

### toggleCheckbox(options)

Toggles a checkbox element. Runs the following AppleScript:

```applescript
tell application "System Events" to tell process ${props.element.applicationProcess}
  set theCheckbox to ${props.element.pathString}
  tell theCheckbox
    ${checkboxAction}
  end tell
end tell
```

#### options.element

Type: `ElementReference`\
Required: `true`

A reference to the checkbox element.

#### options.value

Type: `boolean | undefined`\
Required: `false`

The value to set the checkbox. If `undefined`, the checkbox will be toggled to the opposite of its current state.

### waitForElementHidden(options)

Waits until an element is hidden. Runs the following AppleScript:

```applescript
tell application "System Events"
  tell process ${JSON.stringify(elementReference.applicationProcess)}
      repeat while exists ${elementReference}
          delay ${interval}
      end repeat
  end tell
end tell
```

#### options.elementReference

Type: `ElementReference`\
Required: `true`

A reference to the element to wait for until it's hidden.

#### options.interval

Type: `number`\
Default: `0.1`

The amount of time to wait inbetween checks.

### waitForElementMatch(windowName, elementMatcher, pWaitForOptions?)

Waits until a matching element on the window is found.

#### windowName

Type: `string`\
Required: `true`

The name of the window.

#### elementMatcher

Type: `(element: ElementReference) => boolean`\
Required: `true`

A function that takes an element reference and returns a boolean representing whether or not it matches.

#### pWaitForOptions

Type: `import('p-wait-for').Options`\
Required: `false`

Options to pass to `pWaitFor`.

### inputKeystrokes(keystrokes)

Input keystrokes. Runs the following AppleScript:

```applescript
tell application "System Events" to keystroke ${JSON.stringify(keystrokes)}
```

#### keystrokes

Type: `string`\
Required: `true`

The keystrokes to enter.

### runAppleScript(appleScript)

Returns: `string | number | boolean | Record<string, unknown> | unknown[] | Date | Buffer | undefined`

Runs an AppleScript string and parses the result using [`parse-applescript`](https://github.com/leonzalion/parse-applescript).

#### appleScript

Type: `string`\
Required: `true`

The AppleScript code to run.
