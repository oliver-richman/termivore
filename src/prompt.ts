// import * as readline from 'readline';
// import { log } from "./log";

// export const prompt = async (query: string | string[]): Promise<string | string[]> => {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });

//   const answers: string[] = [];

//   if (typeof query === 'string') {
//     return new Promise((resolve) => {
//       log(query).print();
//       rl.question('↪ ', (answer) => {
//         resolve(answer);
//         rl.close();
//       });
//     });
//   } else if (Array.isArray(query)) {
//     for (const q of query) {
//       const answer = await new Promise<string>((resolve) => {
//         log(q).print();
//         rl.question('↪ ', (answer) => {
//           resolve(answer);
//         });
//       });
//       answers.push(answer);
//     }
//     rl.close();
//     return answers;
//   } else {
//     throw new Error('Invalid input type');
//   }
// };

import * as readline from 'readline';
import { log } from "./log";

export const prompt = async (query: string, choices?: string[]): Promise<string | string[]> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answers: string[] = [];

  const moveCursorUp = () => {
    process.stdout.write('\x1B[1A');
  };

  const moveCursorDown = () => {
    process.stdout.write('\x1B[1B');
  };

  const highlightChoice = (index: number) => {
    moveCursorUp();
    moveCursorDown();
    readline.clearLine(process.stdout, 1);
    const choiceStr = `${index + 1}. ${choices[index]}`;
    log(choiceStr).yellow().print();
  };

  const resetChoice = (index: number) => {
    moveCursorUp();
    moveCursorDown();
    readline.clearLine(process.stdout, 1);
    const choiceStr = `${index + 1}. ${choices[index]}`;
    log(choiceStr).print();
  };

  if (typeof choices !== 'undefined') {
    const choiceStr = choices.map((choice, index) => `${index + 1}. ${choice}`).join('\n');
    query = `${query}\n${choiceStr}\n`;
  }

  return new Promise((resolve) => {
    let selectedChoiceIndex = 0;

    log(query).print();

    if (typeof choices !== 'undefined') {
      highlightChoice(selectedChoiceIndex);
    }

    rl.on('line', (line) => {
      if (typeof choices !== 'undefined') {
        const choice = parseInt(line, 10);
        if (isNaN(choice) || choice < 1 || choice > choices.length) {
          log('Invalid choice. Please try again.').red().print();
        } else {
          resetChoice(selectedChoiceIndex);
          selectedChoiceIndex = choice - 1;
          highlightChoice(selectedChoiceIndex);
          answers.push(choices[selectedChoiceIndex]);
          if (answers.length === choices.length) {
            resolve(answers);
            rl.close();
          }
        }
      } else {
        resolve(line);
        rl.close();
      }
    });

    if (typeof choices === 'undefined') {
      rl.prompt();
    } else {
      process.stdin.on('keypress', (_, key) => {
        if (key.name === 'up' && selectedChoiceIndex > 0) {
          resetChoice(selectedChoiceIndex);
          selectedChoiceIndex--;
          highlightChoice(selectedChoiceIndex);
        } else if (key.name === 'down' && selectedChoiceIndex < choices.length - 1) {
          resetChoice(selectedChoiceIndex);
          selectedChoiceIndex++;
          highlightChoice(selectedChoiceIndex);
        } else if (key.name === 'return') {
          resetChoice(selectedChoiceIndex);
          answers.push(choices[selectedChoiceIndex]);
          resolve(answers);
          rl.close();
        }
      });
    }
  });
};

