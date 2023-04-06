import { Command } from './command';
import { log } from './log';

import { ICommandArgument, ICommandOption } from './types';
import { ICLIOptions } from './types';
import { joinWithConjunction, toCamelCase } from './utils';

export class CLI {
	private helpCommand = true;
	private commands: Command[] = [];
	private version: string;
	private rootCommand: string;

	constructor(rootCommand: string, cliOptions?: ICLIOptions) {
		if (!rootCommand) {
			throw new Error('RootCommand not specified');
		}
		this.rootCommand = rootCommand;
		this.setOptions(cliOptions);
		if (this.helpCommand) {
			this.addHelpCommand();
		}
	}

	public addCommand(name: string): Command {
		if (this.getCommand(name)) {
			throw new Error(`Command names must be unique, ${name} command already exists`);
		}
		const command = new Command(name);
		this.commands.push(command);
		return command;
	}

	public start(): void {
		const [binPath, , ...consoleArgs] = process.argv;
		const commandName = consoleArgs[0];

		if (consoleArgs.includes('-v') || consoleArgs.includes('--version')) {
			this.showVersion();
			return;
		}

		const command = this.getCommand(commandName);
		if (command) {
			const args = this.buildArgs(command.arguments, consoleArgs);
			const opts = this.buildOpts(command.options, consoleArgs);
			command.execute({ args, opts });
		} else if (this.helpCommand) {
			const helpCommand = this.getCommand('help');
			helpCommand.execute();
		} else {
			console.error('This command does not exist');
		}
	}

	private showVersion(): void {
		if (!this.version) {
			console.error('No version specified');
		} else {
			console.log(this.version);
		}
	}

	private buildArgs(commandArguments: ICommandArgument[], consoleArgs: string[]): { [key: string]: string } {
		let argIndex = 1;
		const args = {};
		for (const argument of commandArguments) {
			args[toCamelCase(argument.name)] = consoleArgs[argIndex];
			argIndex++;
		}

		return args;
	}

	private buildOpts(commandOptions: ICommandOption[], consoleArgs: string[]): { [key: string]: boolean } {
		const dashOpts = consoleArgs.filter((arg) => arg.startsWith('-') && !arg.startsWith('--'));
		const doubleDashOpts = consoleArgs.filter((arg) => arg.startsWith('--'));
		const allOpts = [...dashOpts, ...doubleDashOpts];
		const opts = {};

		for (const commandOption of commandOptions) {
			const optionKey = toCamelCase(commandOption.doubleDashName);
			if (allOpts.includes(`--${commandOption.doubleDashName}`)) {
				opts[optionKey] = true;
			} else if (commandOption.alternativeNames.find((altName) => allOpts.includes(altName))) {
				opts[optionKey] = true;
			} else {
				opts[optionKey] = false;
			}
		}

		return opts;
	}

	private addHelpCommand(): void {
		const helpCommand = new Command('help');
		this.commands.push(helpCommand);
		helpCommand
			.description('Shows available commands and what they can do')
			.argument('command', 'Specify a command to see details about the command')
			.action(({ args }) => {
				let commandsToDisplay = this.commands.filter((command) => command.name !== 'help');
				if (args.command) {
					commandsToDisplay = commandsToDisplay.filter((command) => command.name === args.command);
					if (!commandsToDisplay.length) {
						log(
							`No command with this name exists, run ${this.rootCommand} help to see all available commands`,
						)
							.red()
							.print();
						return;
					}
				}

				log('———————————————————————————————————————————————————').print();
				if (!args.command) {
					log(`${this.rootCommand}:`).bold().print();
					log('Usage:')
						.append(log(`${this.rootCommand} [command] [arguments] [options]`).italic())
						.print();
					log('').print();
					log('Commands:').underline().print();
				}

				for (const command of commandsToDisplay) {
					const formattedArgs = command.arguments.map((argument) => `<${argument.name}>`).join(' ');
					const formattedOpts = command.options.map((option) => `--${option.doubleDashName}`).join(' ');

					if (!args.command) {
						log('-')
							.append(
								log(
									`${command.name}${formattedArgs ? ` ${formattedArgs}` : ''}${
										formattedOpts ? ` ${formattedOpts}` : ''
									}`,
								).hex('#8590c7'),
							)
							.print();
					} else {
						log(
							`${command.name}${formattedArgs ? ` ${formattedArgs}` : ''}${
								formattedOpts ? ` ${formattedOpts}` : ''
							}`,
						)
							.hex('#8590c7')
							.print();
					}
					log(`  ${command.details}`).italic().print();
					log('').print();

					if (command.arguments.length) {
						log(' ').append(log('Arguments:').underline()).print();
						for (const argument of command.arguments) {
							log(`    `)
								.append(log(`${argument.name}`).hex('#8590c7').append(':'))
								.append(`${argument.description || 'No description available for this argument.'}`)
								.print();
						}
					}

					if (command.options.length) {
						log('').print();

						log(' ').append(log('Options:').underline()).print();
						for (const option of command.options) {
							log(`    `)
								.append(log(`--${option.doubleDashName}`).hex('#8590c7').append(':'))
								.append(`${option.description || 'No description available for this argument.'}`)
								.append(`(alternatively, use: ${joinWithConjunction(option.alternativeNames, 'or')})`)
								.print();
						}
					}
					log('').print();
				}

				if (args.command) {
					log(`Use ${this.rootCommand} help to see all available commands.`).cyan().print();
				} else {
					log(`Use ${this.rootCommand} help <command> to see help about a specific command.`).cyan().print();
				}
				log('———————————————————————————————————————————————————').print();
			});
	}

	private getCommand(name: string): Command {
		return this.commands.find((command) => command.name === name);
	}

	private setOptions(cliOptions: ICLIOptions): void {
		if (cliOptions) {
			if ('helpCommand' in cliOptions) {
				this.helpCommand = cliOptions.helpCommand;
			}
			if (cliOptions.version) {
				this.version = cliOptions.version;
			}
		}
	}
}
