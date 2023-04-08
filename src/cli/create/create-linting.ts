import { writeFile } from 'fs/promises';
import path from 'path';
import { Spinner } from '../../spinner';
import { runCommand } from '../../utils';

export const setupLinting = async (projectName: string, language: string, lintingPreference: string) => {
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
