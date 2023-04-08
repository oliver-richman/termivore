import { IAction, ICommandArgument, ICommandOption, IOptionType } from './types';

export class Command {
	public name: string;
	public details: string;
	public execute: IAction;
	public arguments: ICommandArgument[] = [];
	public options: ICommandOption[] = [];

	constructor(name: string) {
		this.name = name;
	}

	public description(description: string): Command {
		this.details = description;

		return this;
	}

	public argument(name: string, description = ''): Command {
		this.arguments.push({
			name,
			description,
		});

		return this;
	}

	public option(
		doubleDashName: string,
		type: IOptionType = 'boolean',
		alternativeNames: string[] = [],
		description = '',
	): Command {
		this.options.push({
			doubleDashName,
			type,
			alternativeNames,
			description,
		});
		return this;
	}

	public action(callback: IAction): void {
		this.execute = callback;
	}
}
