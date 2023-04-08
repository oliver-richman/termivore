#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises';
import { spawn } from 'child_process';
import path from 'path';
import { CLI } from './cli';
import { log } from './log';
import { prompt } from './prompt';
import { Spinner } from './spinner';

const termivoreVersion = '1.5.0';
const termivoreCli = new CLI('termivore', {
	version: termivoreVersion,
});

termivoreCli
	.addCommand('create')
	.description('Creates a new CLI project with everything needed to get up and running')
	.argument('project-name', 'The name of the project and directory to create')
	.action(async ({ args }) => {
		let projectName = args.projectName;
		const projectNameProvied = !!projectName;
		log('').print();
		log(`Thank's for choosing Termivore, let's get your CLI ready to go! 🚀`).bold().hex('#3cf49f').print();

		if (!projectNameProvied) {
			log('').print();
			projectName = (await prompt(
				'What would you like your project directory/name to be?',
				null,
				false,
				true,
			)) as string;
			log('').print();
		}

		const greatChoice = projectNameProvied ? '' : 'Great choice! ';
		log(`${greatChoice}Before I create`)
			.append(log(projectName).white().bold())
			.append(`I've just got a some of questions I need to ask you`)
			.hex('#3cf49f')
			.print();
		log('').print();

		const language = (await prompt('Which language would you like to use?', [
			'TypeScript',
			'JavaScript',
		])) as string;

		log('What would you like your root command to be?').print();
		log(
			`For example when you typed in 'termivore create ${projectName}' just now, you used our root command of 'termivore'`,
		)
			.italic()
			.print();
		const rootCommand = (await prompt('Try to make it short and simple if you can!', null, false, true)) as string;

		log('').print();
		log('Thanks!').hex('#3cf49f').print();
		log(`Just a few more questions and you'll be good to go`).hex('#3cf49f').print();
		log('').print();

		const wantsHelpCommandYesNo = await prompt(
			'Would you like a help command auto-generating for you?',
			['Yes', 'No'],
			false,
		);
		const wantsHelpCommand = wantsHelpCommandYesNo === 'Yes' ? true : false;

		const wantsVersionCommandYesNo = await prompt(
			'Would you like a -v flag so people can check the current version?',
			['Yes', 'No'],
			false,
		);
		const wantsVersionCommand = wantsVersionCommandYesNo === 'Yes' ? true : false;

		const lintingPreference = (await prompt(
			`Would you like to lint and/or format ${projectName}?`,
			['ESLint and Prettier', 'Just ESLint', 'Just Prettier', 'No linting or formatting'],
			false,
		)) as string;

		const wantsToInitGitYesNo = await prompt(
			`Would you like to initialise ${projectName} as a git repository?`,
			['Yes', 'No'],
			false,
		);
		const wantsToInitGit = wantsToInitGitYesNo === 'Yes' ? true : false;

		log('Sweet, thats everything I need to know').hex('#3cf49f').print();
		log('Please sit tight for a moment whilst I spin up your new CLI!').hex('#3cf49f').print();
		log('').print();

		await createDirectories(projectName, language);
		await createPackageJson(projectName, language, rootCommand, lintingPreference);
		await createEntryFile(projectName, rootCommand, language, wantsHelpCommand, wantsVersionCommand);
		if (language === 'TypeScript') {
			await createTsConfig(projectName);
		}
		await setupLinting(projectName, language, lintingPreference);
		await createMiscFiles(
			projectName,
			language,
			rootCommand,
			wantsHelpCommand,
			wantsVersionCommand,
			wantsToInitGit,
		);

		await installDependencies(projectName);

		log('').print();
		log('All done!').hex('#3cf49f').bold().print();
		if (lintingPreference !== 'No linting or formatting') {
			const lintingFormattingText =
				lintingPreference === 'Just ESLint'
					? 'ESLint'
					: lintingPreference === 'Just Prettier'
					? 'Prettier'
					: lintingPreference;
			log(`Don't forget to customise ${lintingFormattingText} to your preference`).hex('#3cf49f').print();
		}
	});

termivoreCli.start();

const createDirectories = async (projectName: string, language: string) => {
	const creatingDirectoriesSpinner = new Spinner('Creating directories...', {
		persistOnStop: true,
		stopText: 'Directories created',
	}).start();

	await createRootDir(projectName);
	await createBinDir(projectName);
	await createTestsDir(projectName);
	if (language === 'TypeScript') {
		await createSrcDir(projectName);
	}

	creatingDirectoriesSpinner.stop();
};

const createPackageJson = async (
	projectName: string,
	language: string,
	rootCommand: string,
	lintingPreference: string,
) => {
	const spinner = new Spinner('Creating package...', {
		persistOnStop: true,
		stopText: 'Package created',
	}).start();

	const packageJsonContent = generatePackageJsonContent(projectName, rootCommand, language, lintingPreference);
	await writeFile(path.join(projectName, 'package.json'), JSON.stringify(packageJsonContent, null, 2));

	if (language === 'TypeScript') {
		await runCommand('npm i -D typescript @types/node', projectName);
	}

	spinner.stop();
};

const createEntryFile = async (
	projectName: string,
	rootCommand: string,
	language: string,
	wantsHelpCommand: boolean,
	wantsVersionCommand: boolean,
) => {
	const spinner = new Spinner('Creating entry file...', {
		persistOnStop: true,
		stopText: 'Entry file created',
	}).start();

	if (language === 'TypeScript') {
		const indexTsContent = generateIndexTsContent(rootCommand, wantsHelpCommand, wantsVersionCommand);
		await writeFile(path.join(projectName, 'src', 'index.ts'), indexTsContent.trim());
	} else {
		const indexJsContent = generateIndexJsContent(rootCommand, wantsHelpCommand, wantsVersionCommand);
		await writeFile(path.join(projectName, 'bin', 'index.js'), indexJsContent.trim());
	}

	spinner.stop();
};

const createTsConfig = async (projectName: string) => {
	const spinner = new Spinner('Configuring TypeScript...', {
		persistOnStop: true,
		stopText: 'TypeScript configured',
	}).start();

	const tsConfigContent = generateTsConfigContent();
	await writeFile(path.join(projectName, 'tsconfig.json'), JSON.stringify(tsConfigContent, null, 2));

	spinner.stop();
};

const setupLinting = async (projectName: string, language: string, lintingPreference: string) => {
	if (!lintingPreference || lintingPreference === 'No linting or formatting') {
		return;
	}

	const spinner = new Spinner('Configuring Linting/Formatting...', {
		persistOnStop: true,
		stopText: 'Linting/Formatting configured',
	}).start();

	switch (lintingPreference) {
		case 'ESLint and Prettier':
			await setupEslintAndPrettier(projectName, language);
			break;
		case 'Just ESLint':
			await setupEslint(projectName, language, false);
			break;
		case 'Just Prettier':
			await setupPrettier(projectName);
			break;
	}
	spinner.stop();
};

const createMiscFiles = async (
	projectName: string,
	language: string,
	rootCommand: string,
	wantsHelpCommand: boolean,
	wantsVersionCommand: boolean,
	wantsToInitGit: boolean,
) => {
	const spinner = new Spinner('Creating miscellaneous files...', {
		persistOnStop: true,
		stopText: 'Miscellaneous files created',
	}).start();

	if (wantsToInitGit) {
		const gitignoreContent = generateGitignoreContent(language);
		await writeFile(path.join(projectName, '.gitignore'), gitignoreContent.trim());
		await runCommand('git init', projectName);
	}

	const readmeContent = generateReadmeContent(
		projectName,
		language,
		rootCommand,
		wantsHelpCommand,
		wantsVersionCommand,
	);
	await writeFile(path.join(projectName, 'README.md'), readmeContent.trim());

	spinner.stop();
};

const installDependencies = async (projectName: string) => {
	const spinner = new Spinner('Installing dependencies...', {
		persistOnStop: true,
		stopText: 'Dependencies installed',
	}).start();

	await runCommand('npm install', projectName);

	spinner.stop();
};

const createRootDir = async (rootDir: string) => {
	await mkdir(rootDir);
};

const createBinDir = async (rootDir: string) => {
	await mkdir(path.join(rootDir, 'bin'));
};

const createTestsDir = async (rootDir: string) => {
	await mkdir(path.join(rootDir, '__tests__'));
};

const createSrcDir = async (rootDir: string) => {
	await mkdir(path.join(rootDir, 'src'));
};

const generatePackageJsonContent = (
	projectName: string,
	rootCommand: string,
	language: string,
	lintingPreference: string,
) => {
	const lintingScripts = {};
	switch (lintingPreference) {
		case 'ESLint and Prettier':
			lintingScripts['lint'] = `eslint ${language === 'TypeScript' ? 'src/**/*.ts' : 'bin/**/*.js'}`;
			lintingScripts['lint:fix'] = `eslint ${language === 'TypeScript' ? 'src/**/*.ts' : 'bin/**/*.js'} --fix`;
			break;
		case 'Just ESLint':
			lintingScripts['lint'] = `eslint ${language === 'TypeScript' ? 'src/**/*.ts' : 'bin/**/*.js'}`;
			lintingScripts['lint:fix'] = `eslint ${language === 'TypeScript' ? 'src/**/*.ts' : 'bin/**/*.js'} --fix`;
			break;
		case 'Just Prettier':
			lintingScripts['format:fix'] = `prettier --config .prettierrc '${
				language === 'TypeScript' ? 'src/**/*.ts' : 'bin/**/*.js'
			}' --write`;
			lintingScripts['format'] = `prettier --config .prettierrc '${
				language === 'TypeScript' ? 'src/**/*.ts' : 'bin/**/*.js'
			}' --check`;
			break;
	}

	const scripts =
		language === 'TypeScript'
			? {
					watch: 'tsc --watch',
					build: 'tsc',
					...lintingScripts,
			  }
			: {
					...lintingScripts,
			  };
	const type =
		language === 'JavaScript'
			? {
					type: 'module',
			  }
			: {};
	return {
		name: projectName,
		version: '1.0.0',
		description: 'A Termivore CLI',
		bin: {
			[rootCommand]: 'bin/index.js',
		},
		scripts,
		...type,
		author: 'A Termivore User',
		license: 'MIT',
		dependencies: {
			termivore: `^${termivoreVersion}`,
		},
	};
};

const generateGitignoreContent = (language: string) => {
	return `node_modules/\n${language === 'TypeScript' ? `bin/\n` : ''}.DS_Store\n`;
};

const generateTsConfigContent = () => {
	return {
		compilerOptions: {
			target: 'es2018',
			module: 'commonjs',
			lib: ['es2018'],
			allowJs: false,
			esModuleInterop: true,
			moduleResolution: 'node',
			resolveJsonModule: true,
			declaration: true,
			removeComments: true,
			outDir: './bin',
			rootDir: './src',
		},
		include: ['src/**/*'],
		exclude: ['node_modules', '**/*.test.ts', '**/*.spec.ts'],
	};
};

const generateReadmeContent = (
	projectName: string,
	language: string,
	rootCommand: string,
	wantsHelpCommand: boolean,
	wantsVersionCommand: boolean,
) => {
	const gettingStartedStepsJs = `
1. cd into the \`${projectName}\` directory.
2. run \`npm link\`
3. cd into another directory of your choice
4. run \`npm link ${projectName}\`
5. run \`${rootCommand} example\` to test out the example command Termivore generated for you

	`;

	const gettingStartedStepsTs = `
1. cd into the \`${projectName}\` directory.
2. run \`npm run watch\` to watch your TS files and compile on change.
3. run \`npm link\`.
4. cd into another directory of your choice.
5. run \`npm link ${projectName}\`.
6. run \`${rootCommand} example\` to test out the example command Termivore generated for you.

Note: Don't edit the files in \`./bin/\`, they are your compiled TS files.
If you want to compile your TypeScript without watching you can run \`npm run build\`

	`;

	const helpSection = wantsHelpCommand
		? `
### Help
Because you said yes to creating a help command, you can run \`${rootCommand} help\` to see all your available commands

	`
		: '';

	const versionSection = wantsVersionCommand
		? `
### Version
Because you said yes to creating a version flag, you can run \`${rootCommand} -v\` to see your CLI's current version.
This version is set in your index file, you can change it there as you change versions.

	`
		: '';

	return `
# ${projectName}
Built with Termivore

## Getting Started
The Termivore CLI has setup pretty much everything you'll need to get going with your new CLI, including a couple of example commands!
To use your ${projectName} cli, you need to follow these steps:
${language === 'TypeScript' ? gettingStartedStepsTs : gettingStartedStepsJs}
${helpSection}
${versionSection}

## Termivore
If you get stuck on anything or need to check the docs for help with something you can do so by checking out the Termivore readme:
[Termivore Readme](https://github.com/oliver-richman/termivore#readme)

If you think Termivore is missing something, has a bug, or you just have a general question then feel free to open an issue:
[Create a Termivore Issue](https://github.com/oliver-richman/termivore/issues)
	`;
};

const generateIndexTsContent = (rootCommand: string, wantsHelpCommand: boolean, wantsVersionCommand: boolean) => {
	return `
import { CLI } from 'termivore';
	`;
};

const generateIndexJsContent = (rootCommand: string, wantsHelpCommand: boolean, wantsVersionCommand: boolean) => {
	return `
import { CLI } from 'termivore';
	`;
};

const setupEslintAndPrettier = async (projectName: string, language: string) => {
	await setupEslint(projectName, language, true);
	await setupPrettier(projectName);
};

const setupEslint = async (projectName: string, language: string, usingPrettier: boolean) => {
	const eslintRcJsonJs = {
		env: {
			es6: true,
			node: true,
		},
		extends: ['eslint:recommended'],
		parserOptions: {
			ecmaVersion: 2018,
			sourceType: 'module',
		},
	};
	const eslintRcJsonTs = {
		env: {
			es6: true,
			node: true,
		},
		extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
		parser: '@typescript-eslint/parser',
		parserOptions: {
			ecmaVersion: 2018,
			sourceType: 'module',
		},
		plugins: ['@typescript-eslint'],
		rules: {
			'no-console': 'warn',
			'no-unused-vars': 'warn',
			semi: ['error', 'always'],
			quotes: ['error', 'single'],
		},
	};
	let eslintRc;
	if (language === 'TypeScript') {
		eslintRc = eslintRcJsonTs;
		await runCommand('npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin', projectName);
	} else {
		eslintRc = eslintRcJsonJs;
		await runCommand('npm i -D eslint', projectName);
	}

	if (usingPrettier) {
		eslintRc.extends.push('prettier');
		await runCommand('npm i -D eslint-config-prettier', projectName);
	}

	await writeFile(path.join(projectName, '.eslintrc'), JSON.stringify(eslintRc, null, 2));
};

const setupPrettier = async (projectName: string) => {
	const prettierrcContent = JSON.stringify(
		{
			tabWidth: 4,
			useTabs: true,
			trailingComma: 'all',
			semi: true,
			singleQuote: true,
			printWidth: 120,
			bracketSpacing: true,
		},
		null,
		2,
	);

	await runCommand('npm i -D prettier', projectName);
	await writeFile(path.join(projectName, '.prettierrc'), prettierrcContent);
};

const runCommand = async (command: string, directoryToRunIn: string) => {
	return new Promise<void>((resolve, reject) => {
		const commandParts = command.split(' ');

		const child = spawn(commandParts[0], commandParts.slice(1), { cwd: directoryToRunIn });

		child.on('error', (err) => {
			reject(err);
		});

		child.on('exit', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`${command} exited with code ${code}`));
			}
		});
	});
};
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
