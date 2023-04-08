## **Installation**

You can import the features of Termivore as and when you need them, but if you're creating a new CLI, not just integrating some of our features into an existing CLI, it's recommended you use the Termivore CLI (see below).

### Termivore CLI
A quick and easy way to get your CLI started is to use Termivore's CLI (It wouldn't be a CLI package without it's own CLI right?)

First of all you'll want to install termivore globally:
```bash
npm i -g termivore
```

Now you can run `termivore help` if you want to see more details about the available commands, but to get started you'll just need to do:

```bash
termivore create
```
Just follow the instructions, termivore will do the rest for you!

![Example of the Termivore CLI](https://github.com/oliver-richman/termivore/blob/master/assets/termivore-cli-example.gif?raw=true)

If you don't want to go through all the questions, you can pass various arguments and options:

`create <project-name> <root-command> --language --no-help --no-version --linting-preference --no-git`
| Argument/Option | Description |   
| --- | --- |
|`project-name` | The name of the project and directory to create |
|`root-command` | The root command of your cli, e.g. Termivore's root command is 'termivore' |
| `--language` | The language of your project, must be either 'TypeScript' or 'JavaScript' (alternatively, use: `-l` or `--lang`) |
| `--no-help` | Use this flag if you don	 want a help command to be created (alternatively, use: `-nh`)
| `--no-version` | Use this flag if you don't want a -v flag to show your CLIs version (alternatively, use: `-nv`) |
| `--linting-preference` | Specify your linting preference, 'both', 'eslint', 'prettier', 'none' (alternatively, use: `-lp` or `--lint`) |
| `--no-git` | Use this flag if you don't want to init this project as a git repository (alternatively, use: -`ng`) |

### Manual Installation
If you're creating a new CLI from scratch, it's recommended to use the [Termivore CLI](#termivore-cli). 

However, if you're using termivore for the features in an existing CLI then you can do the following:

```bash
npm i termivore
```

You will now be able to import the methods/classes needed.

```typescript
import { log } from 'termivore';

log('Example of a bold log!').bold().print();
```

```typescript
import { Spinner } from 'termivore';

const mySpinner = new Spinner();

// Perform async task here...

mySpinner.start();
```

See [usage](#usage) form more details.