<p align="center">
  <img width="80px" src="assets/termivore-logo.svg" alt="Termivore logo">
  <h1 style="font-weight: bold" align="center">Termivore</h1>
  <p align="center">Feed your hunger for beautiful CLI interfaces with Termivore</p>
</p>

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/oliver-richman/termivore/onPrToMaster.yml" alt="GitHub Workflow Status">
  <img src="https://img.shields.io/npm/v/termivore" alt="npm">
  <img src="https://img.shields.io/npm/dw/termivore" alt="npm">
  <img src="https://img.shields.io/bundlephobia/min/termivore" alt="npm bundle size">
  <img src="https://img.shields.io/github/languages/top/oliver-richman/termivore" alt="GitHub top language">
  <img src="https://img.shields.io/npm/l/termivore" alt="NPM">
  <img src="https://img.shields.io/github/commit-activity/w/oliver-richman/termivore" alt="GitHub commit activity">
</p>

---

<div align="center">
    <h1><a style="font-weight: bold;" href="https://oliver-richman.github.io/termivore-site/">~ Full Termivore Documentation ~</a></h1>
</div>

___

## **What is Termivore?**
Termivore is a Node.js package for creating beautiful and responsive command line interfaces. With spinner animations, progress bars, table printing, and more, Termivore provides developers with powerful and flexible tools to create custom terminal interfaces. It also includes utilities for handling user input, validating arguments, and parsing options. Whether you're building a CLI tool, a server-side application, or a DevOps automation script, Termivore can help you streamline your development process and create high-quality terminal interfaces with ease.

<br />

## **Table of Contents**

-   [Features](#features)
-   [Installation](#installation)
    -   [Termivore CLI](#termivore-cli)
    -   [Manual Installation](#manual-installation)
-   [Contributors](#contributors)
-   [FAQ](#faq)
-   [License](#license)


<br />

## **Features**

-   🚀 **[CLI Command Creation](https://oliver-richman.github.io/termivore-site/features/cli-commands/)**: users can easily create and customize their own CLI commands with arguments/options and actions.
-   🎡 **[Spinner](https://oliver-richman.github.io/termivore-site/features/spinner/)**: display an animated spinner to indicate loading
-   📝 **[Logger](#https://oliver-richman.github.io/termivore-site/features/logger/)**: log messages to the console with customizable colors and styles
-   🕹️ **[Prompt](https://oliver-richman.github.io/termivore-site/features/prompt/)**: prompt the user for input with customizable options and validation
-   🔗 **[Open Link](https://oliver-richman.github.io/termivore-site/features/open-link/)**: Open's the url passed to it in the user's default browser.
-   📊 **Progress Bar** (SOON): display a progress bar with percentage and ETA
-   📜 **Table** (SOON): print data in a tabular format with support for pagination, sorting, and filtering
-   🎚️ **Slider** (SOON): allow the user to input a value using a slider with customizable range and step
-   🧐 **Argument Parsing** (SOON): parse command line arguments with support for options, flags, and values
-   🤖 **Auto-suggestion** (SOON): provide auto-suggestion for command line input using fuzzy search
-   🤝 **Interactive** (SOON): provide interactive command line interfaces with support for mouse events and key bindings


<br />

## **Installation**

[**Full Getting Started Guide Here**](https://oliver-richman.github.io/termivore-site/getting-started/)

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
| `<project-name>` | The name of the project and directory to create |
| `<root-command>` | The root command of your cli, e.g. Termivore's root command is 'termivore' |
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

<br />
