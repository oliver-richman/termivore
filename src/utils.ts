export const writeToTerminal = (textToWrite: string, clearPreviousText = false, addNewLine = false) => {
	const clearLine = '\x1B[2K';
	const clearToStart = '\x1B[0G';
	const newLine = addNewLine ? '\n' : '';
	process.stdout.write(`${clearLine}${clearToStart}${textToWrite}${clearPreviousText ? '' : '\r'}${newLine}`);
}