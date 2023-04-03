export { Spinner } from './spinner';
export { log } from './log';
export { CLI } from './cli';

export { ISpinnerOptions } from './types';

// log('Hello there');
// // Hello there

// log('%001100%Hello %red%there %bold%friend');
// // Hello there friend
// // hex^  red^  bold^

// log('Hi there').bold();
// // Hi there
// // bold^

// const spinner = new Spinner('Loading file in bold...').start().bold().red();
// // async/await methods
// spinner.stop();
// // (spin icon) Loading file in bold...
// // 				bold and red ^

// logTable(['Header 1', 'Header 2'], [
// 	['Column 1, Value 1', 'Column 2, Value 1'],
// 	['Column 1, Value 2', 'Column 2, Value 2'],
// 	['Column 1, Value 3', 'Column 2, Value 3'],
// ]);
// // |---------------------------------------|
// // |      Header 1     |     Header 2      |
// // |---------------------------------------|
// // | Column 1, Value 1 | Column 2, Value 1 |
// // | Column 1, Value 2 | Column 2, Value 2 |
// // | Column 1, Value 3 | Column 2, Value 3 |
// // |---------------------------------------|


// const answer = await prompt('Name?');
// // Name? oliver

// const answer = await prompt('Choose from this list', ['option 1', 'option 2', 'option 3']);
// // Choose from this list
// // - option 1
// // - option 2
// // - option 3

// const answer = await confirm('Are you sure?');
// // Are you sure? (y/n)

// const cli = CommandLineInterface();
// cli.addCommand({
// 	name: 'create',
// 	description: 'Create new project',
// 	arguments: [
// 		{
// 			name: 'project-name',
// 			description: 'Name of project',
// 		},
// 		{
// 			name: 'number-arg',
// 			description: 'An argument that must be a number',
// 			type: 'number'
// 		}
// 	],
// 	options: [
// 		{
// 			flags: ['-s, --silent'],
// 			description: 'Run without logging anything',
// 		}
// 	],
// 	action: ({arguments, options}) => {
// 		// Do something
// 	}
// });

// cli.start();
// // myCli create myProject -s

