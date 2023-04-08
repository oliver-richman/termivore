import { access, lstat, rm } from 'fs/promises';
import { createInterface, Interface, emitKeypressEvents } from 'readline';
import { spawn } from 'child_process';

export const writeToTerminal = (textToWrite: string, clearPreviousText = false, addNewLine = false) => {
	const clearLine = '\x1B[2K';
	const clearToStart = '\x1B[0G';
	const newLine = addNewLine ? '\n' : '';
	process.stdout.write(`${clearLine}${clearToStart}${textToWrite}${clearPreviousText ? '' : '\r'}${newLine}`);
};

export const hideCursor = (): void => {
	process.stdout.write('\u001b[?25l');
};

export const showCursor = (): void => {
	process.stdout.write('\u001b[?25h');
};

export const getFirstKeyFromMap = (map: Map<any, any>) => {
	return map.keys().next().value;
};

export const getLastKeyFromMap = (map: Map<any, any>) => {
	return Array.from(map)[map.size - 1][0];
};

export const createReadlineInterface = (): Interface => {
	return createInterface({
		input: process.stdin,
		output: process.stdout,
	});
};

export const listenForKeyPress = (callback: (key: string, rli: Interface) => void) => {
	emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);
	process.stdin.resume();
	const rli = createReadlineInterface();

	process.stdin.on('keypress', (str, key) => {
		if (key.ctrl && key.name === 'c') {
			process.exit();
		} else {
			callback(key.name, rli);
		}
	});
};

export const joinWithConjunction = (array: (string | number | boolean)[], conjunction: string): string => {
	if (!array.length) return '';

	const stringArray = array.map((item) => item.toString());
	const lastItem = stringArray.pop();

	if (!lastItem) return stringArray.join(', ');

	if (!stringArray.length) return lastItem;

	const joinedString = stringArray.join(', ') + ` ${conjunction} ` + lastItem;
	return joinedString;
};

export const toCamelCase = (inputString: string): string => {
	return inputString.replace(/[-_]+(.)?/g, (match, firstLetter) => {
		if (firstLetter) {
			return firstLetter.toUpperCase();
		} else {
			return '';
		}
	});
};

export const ansiCodes = {
	reset: 0,
	bold: 1,
	dim: 2,
	italic: 3,
	underline: 4,
	black: 30,
	blackBg: 40,
	red: 31,
	redBg: 41,
	green: 32,
	greenBg: 42,
	yellow: 33,
	yellowBg: 43,
	blue: 34,
	blueBg: 44,
	magenta: 35,
	magentaBg: 45,
	cyan: 36,
	cyanBg: 46,
	white: 37,
	whiteBg: 47,
};

export const removeDuplicateResetCodes = (message: string): string => {
	const regex = /(\\x1b\[0m){2,}/g;
	return message.replace(regex, '\x1b[0m');
};

export const getAnsiCode = (style: string): string => {
	return `\x1b[${ansiCodes[style]}m`;
};

export const runCommand = async (command: string, directoryToRunIn: string) => {
	return new Promise<void>((resolve, reject) => {
		const commandParts = command.split(' ');

		const child = spawn(commandParts[0], commandParts.slice(1), { cwd: directoryToRunIn });

		child.on('error', (err) => {
			reject(err);
		});

		child.on('exit', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`${command} exited with code ${code}`));
			}
		});
	});
};

export const isValidDirectoryName = (name: string): boolean => {
	const invalidChars = /[<>:"/\\|?*]/;
	// Reserved names for Windows
	const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;

	if (!name.trim()) {
		return false;
	}

	if (invalidChars.test(name)) {
		return false;
	}

	if (reservedNames.test(name)) {
		return false;
	}

	// Check for control characters (0x00-0x1F)
	for (const char of name) {
		if (char.charCodeAt(0) >= 0x00 && char.charCodeAt(0) <= 0x1f) {
			return false;
		}
	}

	return true;
};

export const isValidRootCommand = (command: string): boolean => {
	const validChars = /^[a-zA-Z0-9-_]+$/;
	return validChars.test(command);
};

export const doesDirectoryExist = async (directory: string): Promise<boolean> => {
	try {
		await access(directory);
		const stats = await lstat(directory);
		return stats.isDirectory();
	} catch (error) {
		return false;
	}
};

export const removeDirectory = async (directory: string) => {
	await rm(directory, { recursive: true, force: true });
};
