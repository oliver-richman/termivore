import * as readline from 'readline';
import { log } from './log';
import { getFirstKeyFromMap, getLastKeyFromMap, hideCursor, showCursor } from './utils';

const askQuestion = (question: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		log(question).print();
		rl.question('↪ ', (answer) => {
			resolve(answer);
			rl.close();
		});
	});
}

const askQuestions = (questions: string[]): Promise<string[]> => {
	return Promise.all(questions.map(question => askQuestion(question)));
}

const logMakeChoiceInstructions = () => {
	log('Use your')
      .append(log('arrow keys').cyan())
      .append('to highlight your choice and hit')
      .append(log('enter').cyan())
      .append('to select your answer').print();
}

const logChoicesAndCreateMap = (choices: string[]): Map<number, string> => {
	const choiceLineMap = new Map();
	for (const choice of choices) {
		let line;
		if (!choiceLineMap.size){
			line = log(' -').append(log(choice).yellow().underline()).print();
		} else {
			line = log(` - ${choice}`).print();
		}

		choiceLineMap.set(line, choice);
    }

	return choiceLineMap;
}

const makeChoice = (prompt: string, choices: string[], showInstructions: boolean = true): Promise<string> => {
  return new Promise((resolve, reject) => {
	hideCursor();
    log(prompt).print();
    let keyMap = logChoicesAndCreateMap(choices);
	
	if (showInstructions) {
		logMakeChoiceInstructions();
	}

	let firstKey = getFirstKeyFromMap(keyMap);
	let lastKey = getLastKeyFromMap(keyMap);
	let currentLine = firstKey;

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);
  	process.removeAllListeners();
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      } else {
		if (key.name === 'return'){
			resolve(keyMap.get(currentLine));
			showCursor();
			currentLine = null;
			firstKey = null;
			lastKey = null;
			rl.close();
		} else if (key.name === 'up') {
			currentLine = onArrowUpKey(currentLine, keyMap, firstKey);
        } else if (key.name === 'down') {
			currentLine = onArrowDownKey(currentLine, keyMap, lastKey);
        }
      }
    });
  });
};

const onArrowUpKey = (currentLine: number, keyMap: Map<number, string>, firstKey: number): number => {
	if (currentLine > firstKey){
		log(` - ${keyMap.get(currentLine)}`, currentLine).print();
		currentLine--;
		log(' -', currentLine).append(log(keyMap.get(currentLine)).yellow().underline()).print();
    }
	return currentLine;
}

const onArrowDownKey = (currentLine: number, keyMap: Map<number, string>, lastKey: number): number => {
	if (currentLine < lastKey){
		log(` - ${keyMap.get(currentLine)}`, currentLine).print()
		currentLine++;
		log(' -', currentLine).append(log(keyMap.get(currentLine)).yellow().underline()).print();
	}
	return currentLine
}

export const prompt = async (prompt: string | string[], choices?: string[], showInstructionsForChoices: boolean = true): Promise<string | string[]> => {
	if (typeof prompt === 'string'){
		if (choices === undefined) {
			return await askQuestion(prompt);
		} else {
			return await makeChoice(prompt, choices, showInstructionsForChoices);
		}
	} else {
		return await askQuestions(prompt);
	}
}