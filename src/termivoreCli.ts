#!/usr/bin/env node

import { CLI } from './cli';
import { log } from './log';

// const fs = require('fs');
// const path = require('path');

const termivoreCli = new CLI('termivore', {
	version: '1.3.0',
});

termivoreCli
	.addCommand('create')
	.description('Creates a new CLI project with everything needed to get up and running')
	.argument('project-name', 'The name of the project and directory to create')
	.action(({ args }) => {
		log(`This functionality hasn't been implemented yet`).red().bold().print();
	});

termivoreCli.start();

/*

termivore create <project-name>
	- Would you like to use TypeScript? (y/n)
	- What would you like your root command to be?
	- Would you like a {rootCommand} help command?
	- Would you like a {rootCommand} -v/--version command?

Creates new directory of project-name
Creates a bin directory
Creates a package.json with bin pointing to bin/index.js or dist/bin/index.js
Creates a bin/index.js or bin/index.ts with code in it for options they desire




termivore
- Are you using typescript? (y/n) (Won't be asked if you pass -ts or --typescript)
- What would you like your root command to be? nasts (Won't be asked if you pass <root-command> as first arg)
- Would you like a nasts help command? (Won't be asked if you pass -hi or --help-included)
- Would you like a nasts -v/--version command? (Won't be asked if you pass -vi or --version-included)
- Would you like to change where your cli file is created? (default: bin/cli.(ts|js)) (Won't be asked if you put -p=path or --path=path)

termivore nasts -ts -hi -vi
Creates a cli.ts file in bin/ (creates bin dir if doesn't exist)
Updates package.json bin field to point to output file (if ts then point to tsconfig.outDir/bin/cli.js) (if js then point to js file)
log a warning that states "If you're bundling/compiling files, please check where "
*/
