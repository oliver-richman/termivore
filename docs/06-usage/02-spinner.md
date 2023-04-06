### **Spinner**
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
---