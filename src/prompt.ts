import { askQuestion } from './ask-question';
import { makeChoice } from './make-choice';

export const prompt = async (prompt: string | string[], choices?: string[], showInstructionsForChoices: boolean = true): Promise<string | string[]> => {
	if (typeof prompt === 'string'){
		if (choices === undefined) {
			return await askQuestion(prompt);
		} else {
			return await makeChoice(prompt, choices, showInstructionsForChoices);
		}
	} else {
		const answers = [];
		for (const question of prompt) {
			answers.push(await askQuestion(question));
		}
		return answers;
	}
}