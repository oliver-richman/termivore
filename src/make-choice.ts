import { log } from './log';
import { getFirstKeyFromMap, getLastKeyFromMap, hideCursor, listenForKeyPress, showCursor } from './utils';

const logMakeChoiceInstructions = () => {
	log('Use your')
		.append(log('arrow keys').cyan())
		.append('to highlight your choice and hit')
		.append(log('enter').cyan())
		.append('to select your answer')
		.italic()
		.print();
};

const logChoicesAndCreateMap = (choices: string[]): Map<number, string> => {
	const choiceLineMap = new Map();
	for (const choice of choices) {
		let line;
		if (!choiceLineMap.size) {
			line = log(' -').append(log(choice).yellow().underline()).print();
		} else {
			line = log(` - ${choice}`).print();
		}

		choiceLineMap.set(line, choice);
	}

	return choiceLineMap;
};

const onArrowUpKey = (currentLine: number, keyMap: Map<number, string>, firstKey: number): number => {
	if (currentLine > firstKey) {
		log(` - ${keyMap.get(currentLine)}`, currentLine).print();
		currentLine--;
		log(' -', currentLine)
			.append(log(keyMap.get(currentLine)).yellow().underline())
			.print();
	}
	return currentLine;
};

const onArrowDownKey = (currentLine: number, keyMap: Map<number, string>, lastKey: number): number => {
	if (currentLine < lastKey) {
		log(` - ${keyMap.get(currentLine)}`, currentLine).print();
		currentLine++;
		log(' -', currentLine)
			.append(log(keyMap.get(currentLine)).yellow().underline())
			.print();
	}
	return currentLine;
};

export const makeChoice = (prompt: string, choices: string[], showInstructions = true): Promise<string> => {
	hideCursor();

	if (showInstructions) {
		logMakeChoiceInstructions();
	}

	log(prompt).bold().print();
	const keyMap = logChoicesAndCreateMap(choices);

	let [firstKey, lastKey] = [getFirstKeyFromMap(keyMap), getLastKeyFromMap(keyMap)];
	let currentLine = firstKey;

	return new Promise((resolve) => {
		listenForKeyPress((key, rli) => {
			switch (key) {
				case 'return':
					resolve(keyMap.get(currentLine));
					showCursor();
					[currentLine, firstKey, lastKey] = [null, null, null];
					rli.close();
					break;
				case 'up':
					currentLine = onArrowUpKey(currentLine, keyMap, firstKey);
					break;
				case 'down':
					currentLine = onArrowDownKey(currentLine, keyMap, lastKey);
					break;
			}
		});
	});
};
