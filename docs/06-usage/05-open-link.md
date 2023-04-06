### **Open Link**

This is a small but handy method which allows you to open a link in your user's default browser. This can be useful for a lot of things, here are a couple of examples:

**Open link to documentation:**

```typescript
import { prompt, openLink } from 'termivore';

const answer = await prompt('Would you like to open our documentation? (y/n)');
if (answer === 'y') {
	openLink('https://link.to.documentation.com');
}
```

**Open a locally running server:**

Say the user has started a local server with your project and you want it to open in their browser, you can do so like so:

```typescript
import { log, openLink } from 'termivore';
const url = 'http://localhost:3000';
log(`Server started at: ${url}`).green().print();
openLink(url);
```
