export const writeToTerminal = (textToWrite: string, clearPreviousText = false, addNewLine = false) => {
	const clearLine = '\x1B[2K';
	const clearToStart = '\x1B[0G';
	const newLine = addNewLine ? '\n' : '';
	process.stdout.write(`${clearLine}${clearToStart}${textToWrite}${clearPreviousText ? '' : '\r'}${newLine}`);
}

export const joinWithConjunction = (array: (string | number | boolean)[], conjunction: string): string => {
  if (!array.length) return "";
  
  const stringArray = array.map(item => item.toString());
  const lastItem = stringArray.pop()!;
  
  if (!stringArray.length) return lastItem;
  
  const joinedString = stringArray.join(", ") + ` ${conjunction} ` + lastItem;
  return joinedString;
}

export const toCamelCase = (inputString: string): string => {
  return inputString.replace(/[-_]+(.)?/g, (match, firstLetter) => {
    if (firstLetter) {
      return firstLetter.toUpperCase();
    } else {
      return '';
    }
  });
};


export const ansiCodes = {
  reset: 0,
  bold: 1,
  dim: 2,
  italic: 3,
  underline: 4,
  black: 30,
  blackBg: 40,
  red: 31,
  redBg: 41,
  green: 32,
  greenBg: 42,
  yellow: 33,
  yellowBg: 43,
  blue: 34,
  blueBg: 44,
  magenta: 35,
  magentaBg: 45,
  cyan: 36,
  cyanBg: 46,
  white:37,
  whiteBg: 47,
};

export const removeDuplicateResetCodes = (message: string): string => {
  const regex = /(\\x1b\[0m){2,}/g;
  return message.replace(regex, '\x1b[0m');
}

export const getAnsiCode = (style: string): string => {
  return `\x1b[${ansiCodes[style]}m`;
}