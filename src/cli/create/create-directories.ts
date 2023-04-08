import { mkdir } from 'fs/promises';
import path from 'path';
import { Spinner } from '../../spinner';

export const createDirectories = async (projectName: string, language: string) => {
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
