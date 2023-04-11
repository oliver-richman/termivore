### **CLI Command Creation**
The CLI class allows you to quickly setup a command line interface, adding commands with arguments, options and a built in help command

```typescript
#!/usr/bin/env node
import { CLI } from 'termivore';

const myCli = new CLI('myCli')
myCli.addCommand('my-command')
	.description('Description of what this command does')
	.argument('my-argument', 'Purpose of argument')
	.option('my-option', 'boolean', ['-m'], 'Purpose of option')
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
---