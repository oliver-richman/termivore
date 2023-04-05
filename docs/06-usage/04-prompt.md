### **🕹️ Prompt**
The prompt method allows you to 'prompt' the user for their input. It can be used to ask your user a question (or multiple) and receive their answer for your use. You can also give the user a list of options to choose from rather than typing their answer in.

Ask a question:
```typescript
import { prompt, log } from 'termivore';

const name = await prompt(`What's your name?`);
log(`Hi ${name}! Great to meet you!`).print();
```