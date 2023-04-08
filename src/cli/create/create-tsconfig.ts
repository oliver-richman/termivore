import { Spinner } from '../../spinner';
import { writeFile } from 'fs/promises';
import path from 'path';

export const createTsConfig = async (projectName: string) => {
	const spinner = new Spinner('Configuring TypeScript...', {
		persistOnStop: true,
		stopText: 'TypeScript configured',
	}).start();

	const tsConfigContent = generateTsConfigContent();
	await writeFile(path.join(projectName, 'tsconfig.json'), JSON.stringify(tsConfigContent, null, 2));

	spinner.stop();
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
