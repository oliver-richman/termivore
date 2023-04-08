import { Spinner } from '../../spinner';
import { runCommand } from '../../utils';

export const installDependencies = async (projectName: string) => {
	const spinner = new Spinner('Installing dependencies...', {
		persistOnStop: true,
		stopText: 'Dependencies installed',
	}).start();

	await runCommand('npm install', projectName);

	spinner.stop();
};
