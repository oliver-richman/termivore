import { IAction, ICommandArgument, ICommandOption} from './types';

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

	public argument(name: string, description: string = ''): Command {
		this.arguments.push({
			name,
			description
		});

		return this;
	}

	public option(doubleDashName: string, alternativeNames: string[] = [], description: string = ''): Command {
		this.options.push({
			doubleDashName,
			alternativeNames,
			description
		})
		return this;
	}

	public action(callback: IAction): void {
		this.execute = callback;
	}
}