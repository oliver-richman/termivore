# 🥩 Termivore</h1>
Feed your hunger for beautiful CLI interfaces with Termivore

---

## **What is Termivore?**
Termivore is a Node.js package for creating beautiful and responsive command-line interfaces. With spinner animations, progress bars, table printing, and more, Termivore provides developers with powerful and flexible tools to create custom terminal interfaces. It also includes utilities for handling user input, validating arguments, and parsing options. Whether you're building a CLI tool, a server-side application, or a DevOps automation script, Termivore can help you streamline your development process and create high-quality terminal interfaces with ease.

## **Features**

- 🎡 **Spinner**: display an animated spinner to indicate loading
- 📊 **Progress Bar** (SOON): display a progress bar with percentage and ETA
- 📜 **Table** (SOON): print data in a tabular format with support for pagination, sorting, and filtering
- 📝 **Logger** (SOON): log messages to the console with customizable colors and styles
- 🕹️ **Prompt** (SOON): prompt the user for input with customizable options and validation
- 🎚️ **Slider** (SOON): allow the user to input a value using a slider with customizable range and step
- 🌈 **Colors and Styles** (SOON): add colors and styles to text output with support for ANSI escape codes and Chalk
- 🧐 **Argument Parsing** (SOON): parse command-line arguments with support for options, flags, and values
- 🤖 **Auto-suggestion** (SOON): provide auto-suggestion for command-line input using fuzzy search
- 🤝 **Interactive** (SOON): provide interactive command-line interfaces with support for mouse events and key bindings

## **Usage**

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
