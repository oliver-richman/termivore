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

Replace an existing log with something new:
```typescript
const myLog = log('searching...').print();
log('this log won\'t change').print();
// do something
log('completed search', myLog).green().print();
```
This allows you to change existing logs without complexities:

![Example of replacing log text working](https://github.com/oliver-richman/termivore/blob/master/assets/log-replace-example.gif?raw=true)

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