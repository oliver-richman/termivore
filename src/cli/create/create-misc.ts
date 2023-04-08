import { writeFile } from 'fs/promises';
import path from 'path';
import { Spinner } from '../../spinner';
import { runCommand } from '../../utils';

export const createMiscFiles = async (
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

const generateGitignoreContent = (language: string) => {
	return `node_modules/\n${language === 'TypeScript' ? `bin/\n` : ''}.DS_Store\n`;
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
