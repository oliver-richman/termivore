### **Prompt**
The prompt method allows you to 'prompt' the user for their input. It can be used to ask your user a question (or multiple) and receive their answer for your use. You can also give the user a list of options to choose from rather than typing their answer in.

**Ask a question:**
```typescript
import { prompt, log } from 'termivore';

const name = await prompt(`What's your name?`);
log(`Hi ${name}! Great to meet you!`).print();
```

![Example of a simple prompt](https://github.com/oliver-richman/termivore/blob/master/assets/prompt-example-1.gif?raw=true)

**Ask multiple questions in a row:**
```typescript
import { prompt, log } from 'termivore';

const [age, location] = await prompt([
	`What's your age?`,
	'Where do you live?'
]);

log(`Nice! ${age} in ${location} must be fun!`).print();
```

![Example of a multi-question prompt](https://github.com/oliver-richman/termivore/blob/master/assets/prompt-example-2.gif?raw=true)

**Ask for a choice:**
```typescript
import { prompt, log } from 'termivore';
const fruits = ['Apples', 'Oranges', 'Bananas', 'Pears'];
const fruit = await prompt(`What's your favourite fruit?`, fruits);

log(`Yum! I like ${fruit} too!`).print();
```

![Example of a question requiring a user's choice](https://github.com/oliver-richman/termivore/blob/master/assets/prompt-example-3.gif?raw=true)
---