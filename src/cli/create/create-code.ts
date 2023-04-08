import { writeFile } from 'fs/promises';
import path from 'path';
import { Spinner } from '../../spinner';
import { toCamelCase } from '../../utils';

export const createEntryFile = async (
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
		const indexTsContent = generateIndexTsContent(projectName, rootCommand, wantsHelpCommand);
		await writeFile(path.join(projectName, 'src', 'index.ts'), indexTsContent.trim());
	} else {
		const indexJsContent = generateIndexJsContent(projectName, rootCommand, wantsHelpCommand);
		await writeFile(path.join(projectName, 'bin', 'index.js'), indexJsContent.trim());
	}

	spinner.stop();
};

const generateIndexTsContent = (projectName: string, rootCommand: string, wantsHelpCommand: boolean) => {
	const cliVariableName = `${toCamelCase(projectName)}Cli`;
	return `
#!/usr/bin/env node

import { CLI, IActionData, log, Spinner } from 'termivore';

const ${cliVariableName} = new CLI(
	'${rootCommand}',
	{
		version: '1.0.0',${wantsHelpCommand ? '\nhelpCommand: false' : ''}
	}
);

${cliVariableName}
	.addCommand('example')
	.description('This is an example command, feel free to change or delete it!')
	.argument('your-name', 'Your name')
	.option('say-hello', 'boolean', ['-sh', '-hi', '-hello'], 'Passing this flag, log\\'s out a greeting')
	.action(async ({ args, opts}: IActionData): Promise<void> => {
		log(\`Hi\${ args.yourName || '' }, welcome to Termivore's example command!\`).cyan().bold().print();
		log('You can change/remove this example, but we thought it might be useful if you\\'ve not used Termivore before!').print();

		log('Here\\'s another great feature:').print();
		const exampleSpinner = new Spinner('I\\'m loading something...',
			{
				persistOnStop: true,
				stopText: 'Loaded!',
			}
		);

		// You can use this when performing asynchronous requests so user knows to wait
		await new Promise((resolve) => setTimeout(resolve, 1000));

		exampleSpinner.stop();

		if (opts.sayHello) {
			log('You passed the say hello flag!').print();
			log('Hi!!').green().print();
		}
	});

${cliVariableName}.start();
`;
};

const generateIndexJsContent = (projectName: string, rootCommand: string, wantsHelpCommand: boolean) => {
	const cliVariableName = `${toCamelCase(projectName)}Cli`;
	return `
#!/usr/bin/env node

import { CLI, IActionData, log, Spinner } from 'termivore';

const ${cliVariableName} = new CLI(
	'${rootCommand}',
	{
		version: '1.0.0',${wantsHelpCommand ? '\nhelpCommand: false' : ''}
	}
);

${cliVariableName}
	.addCommand('example')
	.description('This is an example command, feel free to change or delete it!')
	.argument('your-name', 'Your name')
	.option('say-hello', 'boolean', ['-sh', '-hi', '-hello'], 'Passing this flag, log\\'s out a greeting')
	.action(async ({ args, opts}) => {
		log(\`Hi\${ args.yourName || '' }, welcome to Termivore's example command!\`).cyan().bold().print();
		log('You can change/remove this example, but we thought it might be useful if you\\'ve not used Termivore before!').print();

		log('Here\\'s another great feature:').print();
		const exampleSpinner = new Spinner('I\\'m loading something...',
			{
				persistOnStop: true,
				stopText: 'Loaded!',
			}
		);

		// You can use this when performing asynchronous requests so user knows to wait
		await new Promise((resolve) => setTimeout(resolve, 1000));

		exampleSpinner.stop();

		if (opts.sayHello) {
			log('You passed the say hello flag!').print();
			log('Hi!!').green().print();
		}
	});

${cliVariableName}.start();
`;
};
