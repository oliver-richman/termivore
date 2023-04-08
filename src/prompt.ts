import { askQuestion } from './ask-question';
import { log } from './log';
import { makeChoice } from './make-choice';

export const prompt = async (
	promptOrPrompts: string | string[],
	choices?: string[],
	showInstructionsForChoices = true,
	mustNotBeEmpty = false,
): Promise<string | string[]> => {
	let answer;
	if (typeof promptOrPrompts === 'string') {
		if (!choices) {
			answer = await askQuestion(promptOrPrompts);
		} else {
			answer = await makeChoice(promptOrPrompts, choices, showInstructionsForChoices);
		}
	} else {
		const answers = [];
		for (const question of promptOrPrompts) {
			answers.push(await askQuestion(question));
		}
		answer = answers;
	}

	if (mustNotBeEmpty && (!answer || (Array.isArray(answer) && answer.length !== promptOrPrompts.length))) {
		const noAnswerError = !choices
			? typeof promptOrPrompts === 'string'
				? 'provide a response to this prompt'
				: 'provide a response to these prompts'
			: 'choose an option.';
		log(`Sorry, you need to ${noAnswerError}`).red().print();
		return await prompt(promptOrPrompts, choices, showInstructionsForChoices, mustNotBeEmpty);
	}

	return answer;
};
