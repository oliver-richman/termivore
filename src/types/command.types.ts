export interface ICommandArgument {
	name: string;
	description?: string;
}

export interface ICommandOption {
	doubleDashName: string;
	type: IOptionType;
	alternativeNames: string[];
	description?: string;
}

export type IAction = (actionData?: IActionData) => void;

export interface IActionData {
	args: { [key: string]: string };
	opts: { [key: string]: boolean | string };
}

export interface ICommand {
	name: string;
	description?: string;
	arguments?: ICommandArgument[];
	options?: ICommandOption[];
	action: IAction;
}

export type IOptionType = 'string' | 'number' | 'boolean';
