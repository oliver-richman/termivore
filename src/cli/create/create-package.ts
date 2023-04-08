import { writeFile } from 'fs/promises';
import path from 'path';
import { Spinner } from '../../spinner';
import { runCommand } from '../../utils';

export const createPackageJson = async (
	projectName: string,
	language: string,
	rootCommand: string,
	lintingPreference: string,
	termivoreVersion: string,
) => {
	const spinner = new Spinner('Creating package...', {
		persistOnStop: true,
		stopText: 'Package created',
	}).start();

	const packageJsonContent = generatePackageJsonContent(
		projectName,
		rootCommand,
		language,
		lintingPreference,
		termivoreVersion,
	);
	await writeFile(path.join(projectName, 'package.json'), JSON.stringify(packageJsonContent, null, 2));

	if (language === 'TypeScript') {
		try {
			await runCommand('npm i -D typescript @types/node', projectName);
		} catch (error) {
			console.log(error);
			process.exit();
		}
	}

	spinner.stop();
};

const generatePackageJsonContent = (
	projectName: string,
	rootCommand: string,
	language: string,
	lintingPreference: string,
	termivoreVersion: string,
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
