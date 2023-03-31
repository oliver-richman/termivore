import readline from 'readline';

export const clearLastLine = () => {
	readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 0);
}

export const writeToTerminal = (textToWrite: string, clearPreviousText = false, addNewLine = false) => {
	const clearLine = '\x1B[2K';
	const clearToStart = '\x1B[0G';
	const newLine = addNewLine ? '\n' : '';
	process.stdout.write(`${clearLine}${clearToStart}${textToWrite}${clearPreviousText ? '' : '\r'}${newLine}`);
}