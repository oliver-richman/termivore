import { log } from '../../log';
import { prompt } from '../../prompt';
import { IActionData } from '../../types';
import { createDirectories } from './create-directories';
import { createPackageJson } from './create-package';
import { createEntryFile } from './create-code';
import { createTsConfig } from './create-tsconfig';
import { setupLinting } from './create-linting';
import { createMiscFiles } from './create-misc';
import { installDependencies } from './create-dependencies';
import { doesDirectoryExist, isValidDirectoryName, isValidRootCommand, removeDirectory } from '../../utils';

export const createNewCliProject = async ({ args, opts }: IActionData, termivoreVersion: string) => {
	log('').print();
	log(`Thank's for choosing Termivore, let's get your CLI ready to go! 🚀`).bold().hex('#3cf49f').print();

	const projectName = await getProjectName(args.projectName);
	await confirmOverwriteIfNecessary(projectName);

	log(`Before I create`)
		.append(log(projectName).white().bold())
		.append(`I've just got some questions I need to ask you`)
		.hex('#3cf49f')
		.print();
	log('').print();

	const language = await getLanguage(opts.language as string);
	const rootCommand = await getRootCommand(args.rootCommand);
	const wantsHelpCommand = opts.noHelp === undefined ? await doesWantHelpCommand() : !opts.noHelp;
	const wantsVersionCommand = opts.noVersion === undefined ? await doesWantVersionCommand() : !opts.noVersion;
	const lintingPreference = await getLintingPreference(projectName, opts.lintingPreference as string);
	const wantsToInitGit = opts.noGit === undefined ? await doesWantToInitGit(projectName) : !opts.noGit;

	log(`Great! Before we go ahead, these are the options you've selected for ${projectName}:`).hex('#3cf49f').print();
	log('').print();
	log(' - Project Name:').append(log(projectName).green()).print();
	log(' - Root Command:').append(log(rootCommand).green()).print();
	log(' - Language:').append(log(language).green()).print();
	log(` - Create '${rootCommand} help' command:`)
		.append(log(wantsHelpCommand ? 'Yes' : 'No').green())
		.print();
	log(` - Create '${rootCommand} -v' option:`)
		.append(log(wantsVersionCommand ? 'Yes' : 'No').green())
		.print();
	log(` - Linting prefence:`).append(log(lintingPreference).green()).print();
	log(' - Initialize as Git repository:')
		.append(log(wantsToInitGit ? 'Yes' : 'No').green())
		.print();
	log('').print();

	const happyToContinue = await prompt(
		`Are you happy to create ${projectName} with these settings?`,
		['Yes', 'No'],
		false,
	);

	if (happyToContinue !== 'Yes') {
		log('').print();
		log("No problem, run termivore create again when you're ready!").hex('#3cf49f').print();
		log('').print();
		process.exit();
		return;
	}

	await spinUpCli(
		projectName,
		language,
		rootCommand,
		lintingPreference,
		termivoreVersion,
		wantsHelpCommand,
		wantsVersionCommand,
		wantsToInitGit,
	);
};

const getProjectName = async (projectName: string, lastWasInvalid = false) => {
	const askForProjectName = async () => {
		return (await prompt(
			'What would you like your project directory/name to be?',
			null,
			false,
			!lastWasInvalid,
		)) as string;
	};
	const projectNameProvied = !!projectName;

	if (!projectNameProvied) {
		log('').print();
		projectName = await askForProjectName();
		log('').print();
	}

	if (isValidDirectoryName(projectName)) {
		return projectName;
	} else {
		log(`Sorry, ${projectName} is an invalid directory name`).red().bold().print();
		return getProjectName(null, true);
	}
};

const confirmOverwriteIfNecessary = async (projectName: string): Promise<void> => {
	const dirExists = await doesDirectoryExist(projectName);
	if (dirExists) {
		log(`The directory '${projectName}' already exists.`).yellow().print();
		log('If you are happy to overwrite it, please type the directory name below to confirm').yellow().print();
		log("If you don't want to overwrite this directory, exit the process or type anything else to abort.")
			.yellow()
			.print();
		const happyToOverwrite = await prompt(`Type '${projectName} if you are happy to overwrite it`);
		if (happyToOverwrite !== projectName) {
			log(`${projectName} has not been altered, exiting now...`).print();
			process.exit();
		} else {
			await removeDirectory(projectName);
		}
		log('').print();
	}
};

const getLanguage = async (optsLanguage: string) => {
	if ((optsLanguage && optsLanguage === 'TypeScript') || optsLanguage === 'JavaScript') {
		return optsLanguage;
	} else if (optsLanguage) {
		log("Unfortunately the language you passed isn't a valid option").yellow().print();
	}

	return (await prompt('Which language would you like to use?', ['TypeScript', 'JavaScript'])) as string;
};

const getRootCommand = async (rootCommand: string, wasInvalid = false) => {
	const rootCommandProvided = !!rootCommand;

	if (!rootCommandProvided) {
		if (wasInvalid) {
			rootCommand = (await prompt('What would you like your root command to be?', null, false, true)) as string;
		} else {
			log('What would you like your root command to be?').print();
			log(
				`For example when you typed in 'termivore create ...' just now, you used our root command of 'termivore'`,
			)
				.italic()
				.print();
			rootCommand = (await prompt('Try to make it short and simple if you can!', null, false, true)) as string;
		}
	}

	if (isValidRootCommand(rootCommand)) {
		return rootCommand;
	} else {
		log(`Sorry '${rootCommand}' is an invalid root command`).red().bold().print();
		return getRootCommand(null, true);
	}
};

const doesWantHelpCommand = async () => {
	const wantsHelpCommandYesNo = await prompt(
		'Would you like a help command auto-generating for you?',
		['Yes', 'No'],
		false,
	);
	const wantsHelpCommand = wantsHelpCommandYesNo === 'Yes' ? true : false;
	return wantsHelpCommand;
};

const doesWantVersionCommand = async () => {
	const wantsVersionCommandYesNo = await prompt(
		'Would you like a -v flag so people can check the current version?',
		['Yes', 'No'],
		false,
	);
	const wantsVersionCommand = wantsVersionCommandYesNo === 'Yes' ? true : false;
	return wantsVersionCommand;
};

const getLintingPreference = async (projectName: string, optsLintingPreference: string) => {
	if (optsLintingPreference) {
		switch (optsLintingPreference.toLowerCase()) {
			case 'both':
				return 'ESLint and Prettier';
			case 'eslint':
				return 'Just ESLint';
			case 'prettier':
				return 'Just Prettier';
			case 'none':
				return 'No linting or formatting';
		}
	}
	return (await prompt(
		`Would you like to lint and/or format ${projectName}?`,
		['ESLint and Prettier', 'Just ESLint', 'Just Prettier', 'No linting or formatting'],
		false,
	)) as string;
};

const doesWantToInitGit = async (projectName: string) => {
	const wantsToInitGitYesNo = await prompt(
		`Would you like to initialise ${projectName} as a git repository?`,
		['Yes', 'No'],
		false,
	);
	const wantsToInitGit = wantsToInitGitYesNo === 'Yes' ? true : false;
	return wantsToInitGit;
};

const spinUpCli = async (
	projectName: string,
	language: string,
	rootCommand: string,
	lintingPreference: string,
	termivoreVersion: string,
	wantsHelpCommand: boolean,
	wantsVersionCommand: boolean,
	wantsToInitGit: boolean,
) => {
	log('Sweet, thats everything I need to know').hex('#3cf49f').print();
	log('Please sit tight for a moment whilst I spin up your new CLI!').hex('#3cf49f').print();
	log('').print();

	await createDirectories(projectName, language);
	await createPackageJson(projectName, language, rootCommand, lintingPreference, termivoreVersion);
	await createEntryFile(projectName, rootCommand, language, wantsHelpCommand, wantsVersionCommand);
	if (language === 'TypeScript') {
		await createTsConfig(projectName);
	}
	await setupLinting(projectName, language, lintingPreference);
	await createMiscFiles(projectName, language, rootCommand, wantsHelpCommand, wantsVersionCommand, wantsToInitGit);

	await installDependencies(projectName);

	log('').print();
	log('All done!').hex('#3cf49f').bold().print();
	if (lintingPreference !== 'No linting or formatting') {
		const lintingFormattingText =
			lintingPreference === 'Just ESLint'
				? 'ESLint'
				: lintingPreference === 'Just Prettier'
				? 'Prettier'
				: lintingPreference;
		log(`Don't forget to customise ${lintingFormattingText} to your preference`).hex('#3cf49f').print();
	}
};
