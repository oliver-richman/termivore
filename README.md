# 🥩 Termivore</h1>
Feed your hunger for beautiful CLI interfaces with Termivore

---

![npm](https://img.shields.io/npm/v/termivore)
![npm](https://img.shields.io/npm/dw/termivore)
![npm bundle size](https://img.shields.io/bundlephobia/min/termivore)
![GitHub top language](https://img.shields.io/github/languages/top/oliver-richman/termivore)
![NPM](https://img.shields.io/npm/l/termivore)

<br />

## **What is Termivore?**
Termivore is a Node.js package for creating beautiful and responsive command line interfaces. With spinner animations, progress bars, table printing, and more, Termivore provides developers with powerful and flexible tools to create custom terminal interfaces. It also includes utilities for handling user input, validating arguments, and parsing options. Whether you're building a CLI tool, a server-side application, or a DevOps automation script, Termivore can help you streamline your development process and create high-quality terminal interfaces with ease.

<br />

## **Table of Contents**

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [CLI Command Creation](#🚀-cli-command-creation)
  - [Spinner](#🎡-spinner)
  - [Logger](#📝-logger)
- [Contributors](#contributors)
- [FAQ](#faq)
- [License](#license)

<br />

## **Features**

- 🚀 **[CLI Command Creation](#🚀-cli-command-creation)**: users can easily create and customize their own CLI commands with arguments/options and actions.
- 🎡 **[Spinner](#🎡-spinner)**: display an animated spinner to indicate loading
- 📊 **Progress Bar** (SOON): display a progress bar with percentage and ETA
- 📜 **Table** (SOON): print data in a tabular format with support for pagination, sorting, and filtering
- 📝 **[Logger](#📝-logger)**: log messages to the console with customizable colors and styles
- 🕹️ **Prompt** (SOON): prompt the user for input with customizable options and validation
- 🎚️ **Slider** (SOON): allow the user to input a value using a slider with customizable range and step
- 🌈 **Colors and Styles** (SOON): add colors and styles to text output with support for ANSI escape codes, RGB and Hex
- 🧐 **Argument Parsing** (SOON): parse command line arguments with support for options, flags, and values
- 🤖 **Auto-suggestion** (SOON): provide auto-suggestion for command line input using fuzzy search
- 🤝 **Interactive** (SOON): provide interactive command line interfaces with support for mouse events and key bindings

<br />

## **Installation**
To install termivore, simply perform:
```bash
npm i termivore
```

You will now be able to import the methods/classes needed, see [usage](#usage) form more details.

<br />

## **Usage**

### 🚀 **CLI Command Creation**
The CLI class allows you to quickly setup a command line interface, adding commands with arguments, options and a built in help command

```typescript
#!/usr/bin/env node
import { CLI } from 'termivore';

const myCli = new CLI('myCli')
myCli.addCommand('my-command')
	.description('Description of what this command does')
	.argument('my-argument', 'Purpose of argument')
	.option('my-option', ['-m'], 'Purpose of option')
	.action((actionData) => {
		// Logic for command goes here
	});

myCli.start();
```
This means your users would be able to run:

```bash
myCli my-command my-argument --my-option
```

This also implements a help command (which can be disabled if necessary), so running `myCli help` would output:

![Output of myCli help command](https://github.com/oliver-richman/termivore/blob/master/assets/cli-example-1.png?raw=true)

> **Important:**
>
> If you're using the CLI class without the termivore CLI, You will need to have `#!/usr/bin/env node` at the top of your file. and update the bin field in your package.json (example below)
```json
"bin": {
	"myCli": "path/to/file"
}
```


### 🎡 **Spinner**
The Spinner class provides an easy way to show a spinner on the command line to indicate loading. It can be used like so:

```typescript
import { Spinner } from 'termivore';

const spinner = new Spinner().start();
// Perform async/await method(s)
spinner.stop();
```

**Options**

The `Spinner` constructor accepts an optional object that can be used to customize the spinner. Here are the available options:

| Option Name | Type | Default Value | Description |
| ----------- | ---- | ------------- | ----------- |
| `frames` | `string[]` | `[ '⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏' ]` | Array of frames to use for the spinner |
| `persistOnStop` | `boolean` | `false` | Whether or not to keep the last frame and text displayed after stopping the spinner |
| `stopIcon` | `string` | `'✓'` | Icon to display when spinner stops |
| `stopText` | `string` | `'Loaded'` | Text to display when spinner stops |


**Methods**

The `Spinner` class has the following methods:


`start(): this`

Starts the spinner.

Returns this, which allows you to use `const spinner = new Spinner().start()`


`stop(): void`

Stops the spinner.


`setText(text: string): void`

Changes the text displayed next to the spinner.


**Example**

Here's an example of using the Spinner class with custom options:

```typescript
import { Spinner, ISpinnerOptions } from 'termivore';

const options: ISpinnerOptions = {
  frames: ['🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔'],
  persistOnStop: true,
  stopIcon: '👍',
  stopText: 'All done!'
};

const spinner = new Spinner('Processing...', options).start();

await performSomething();
spinner.setText('Almost done...');
await performSomethingElse();
spinner.stop();
```

This example will display a spinner with custom frames, icon and stop text, and will change the text next to the spinner after the first async method has finished. After the second async method finishes, the spinner will be stopped and the stop icon and stop text will be displayed.

![Example of Termivore Spinner with custom options](https://github.com/oliver-richman/termivore/blob/master/assets/termivore-spinner.gif?raw=true)

### **📝 Logger**
The Logger class provides an easy way to format and print messages to the command line. It can be used like so:

```typescript
import { log } from './logger';

log('Hello').print();
// Hello
```

To add formatting options to a message, methods can be chained after calling log():

```typescript
Copy code
log('Hello').bold().red().print();
// Hello (bold and red)
```

**Chainable Methods**

The log method has the following methods that can be chained to it:

| Method | Description |
| ------ | ----------- |
| print() |	Prints the formatted message to the command line. Content of log and other formatting/appended text will not appear without calling print at the end |
| bold() | Makes the text bold |
| dim() | Makes the text dim |
| italic() | Makes the text italic |
| underline() | Makes the text underlined |
| black() | Sets the text color to black |
| blackBg() | Sets the background color to black |
| red() | Sets the text color to red |
| redBg() | Sets the background color to red |
| green() | Sets the text color to green |
| greenBg() | Sets the background color to green |
| yellow() | Sets the text color to yellow |
| yellowBg() | Sets the background color to yellow |
| blue() | Sets the text color to blue |
| blueBg() | Sets the background color to blue |
| magenta() | Sets the text color to magenta |
| magentaBg() | Sets the background color to magenta |
| cyan() | Sets the text color to cyan |
| cyanBg() | Sets the background color to cyan |
| white() | Sets the text color to white |
| whiteBg() | Sets the background color to white |
| rgb(...rgb: (string | number)[]) | Sets the text color to a specified RGB value. RGB values can be provided as separate arguments or as an array |
| rgbBg(...rgb: (string | number)[]) | Sets the background color to a specified RGB value. RGB values can be provided as separate arguments or as an array |
| hex(hexCode: string) | Sets the text color to a specified hexadecimal value |
| hexBg(hexCode: string) | Sets the background color to a specified hexadecimal value |

**Examples**

Here's an example of using the Logger class with various formatting options:

```typescript
import { log } from './logger';

log('Hello').bold().red().underline().print();

log('Hello').green().append('World').bold().print();

log('Hello').red().append(log('World').green()).print();

log('Hello').yellow().append('World').red().print();
```

![Example of Logger class with different formatting options](https://github.com/oliver-richman/termivore/blob/master/assets/log-example-1.png?raw=true)

The Logger class can also handle custom RGB values and hexadecimal colors:

```typescript
import { log } from './logger';

log('rgb text').rgb([72, 14, 253]).rgbBg(146, 237, 149).print();

log('hex color text').hex('#11f8bf').hexBg('#710057').print();
```

![Example of Logger class with custom RGB and hex colors](https://github.com/oliver-richman/termivore/blob/master/assets/log-example-2.png?raw=true)

The Logger class also supports appending messages and nested Logger instances for more complex output:

```typescript
import { log } from './logger';

log('Hello').red().append(log('World').green().underline()).print();

log('Hello').yellow().append('World').red().print();

log('The quick brown fox').cyan().append('jumped over the').red().append(log('lazy dog').bold().green()).print();
```

![Example of Logger class with message appending and nested Logger instances](https://github.com/oliver-richman/termivore/blob/master/assets/log-example-3.png?raw=true)

<br />

## **FAQ**

Nothing here yet, if you have a question you want answering, please raise an issue on the GitHub repository, using the Question template.

[Raise an issue on GitHub](https://github.com/oliver-richman/termivore/issues)

<br />

## **Contributors**

<div>
    <img src="https://avatars.githubusercontent.com/u/36195868?v=4" width="75px" alt="Oliver Richman" style="float:left; margin-right:20px; border-radius:50%;">
    <div>
        <h4 style="margin: 0;">Oliver Richman</h4>
        <p style="margin: 0;"><em>London, UK</em></p>
        <p style="margin-top:0"><a href="https://github.com/oliver-richman">GitHub</a> • <a href="https://www.linkedin.com/in/oliverrichman52">LinkedIn</a> • <a href="https://www.npmjs.com/~oliver-richman">NPM</a></p>
    </div>
</div>

<br />

## **License**
Termivore is distributed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0), which allows for the use, modification, and distribution of the software under certain conditions.

✅ You can use, modify, and distribute this package under the terms of the Apache License, Version 2.0.

✅ You can use this package in commercial and non-commercial projects without any restrictions.

✅ You can modify the source code of this package and create derivative works based on it.

❌ You cannot remove or modify the license text included with this package.

❌ You cannot use the name or trademarks associated with this package in a way that implies endorsement or promotion of your own products or services.

❌ You cannot hold the authors or contributors of this package liable for any damages or losses arising from the use of this software.

Please note that this is not a comprehensive list of the terms and conditions of the Apache License, Version 2.0. For the full text of Termivore's license agreement, please see the link provided above.

[Termivore License](https://github.com/oliver-richman/termivore/blob/master/LICENSE)