import { exec } from 'child_process';

export const openLink = (url: string): void => {
	if (!url) {
		throw new Error('URL cannot be empty');
	}
	exec(`open ${url}`);
};
