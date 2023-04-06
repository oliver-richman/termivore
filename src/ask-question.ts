import { log } from './log';
import { createReadlineInterface } from './utils';

export const askQuestion = (question: string): Promise<string> => {
	return new Promise((resolve) => {
		const rli = createReadlineInterface();
		log(question).print();
		rli.question('↪ ', (answer) => {
			resolve(answer);
			rli.close();
		});
	});
};
