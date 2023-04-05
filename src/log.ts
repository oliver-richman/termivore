import { writeToTerminal, ansiCodes, removeDuplicateResetCodes, getAnsiCode } from "./utils";
let currentRow = 0;

export class Logger {
  private row: number;
  private existingRow: boolean;
  private message: string;
  private appendedMessages: (string | Logger)[];

  constructor(message: string, row: number = currentRow) {
    if (row !== currentRow) {
      this.existingRow = true;
    }
    this.row = row;
    this.message = message;
    this.appendedMessages = [];
  }

  public append(appendedMessage: string | Logger): Logger {
    if (appendedMessage instanceof Logger) {
      this.appendedMessages.push(appendedMessage.message, ...appendedMessage.appendedMessages);
    } else {
      this.appendedMessages.push(appendedMessage);
    }
    return this;
  }

  public bold(): Logger {
    return this.style('bold');
  }

  public dim(): Logger {
    return this.style('dim');
  }

  public italic(): Logger {
    return this.style('italic');
  }

  public underline(): Logger {
    return this.style('underline');
  }

  public black(): Logger {
    return this.style('black');
  }

  public blackBg(): Logger {
    return this.style('blackBg');
  }

  public red(): Logger {
    return this.style('red');
  }

  public redBg(): Logger {
    return this.style('redBg');
  }

  public green(): Logger {
    return this.style('green');
  }

  public greenBg(): Logger {
    return this.style('greenBg');
  }

  public yellow(): Logger {
    return this.style('yellow');
  }

  public yellowBg(): Logger {
    return this.style('yellowBg');
  }

  public blue(): Logger {
    return this.style('blue');
  }

  public blueBg(): Logger {
    return this.style('blueBg');
  }

  public magenta(): Logger {
    return this.style('magenta');
  }

  public magentaBg(): Logger {
    return this.style('magentaBg');
  }

  public cyan(): Logger {
    return this.style('cyan');
  }

  public cyanBg(): Logger {
    return this.style('cyanBg');
  }

  public white(): Logger {
    return this.style('white');
  }

  public whiteBg(): Logger {
    return this.style('whiteBg');
  }

  public rgb(...rgb: string[] | number[]): Logger {
    return this._rgb(rgb, false);
  }

  public rgbBg(...rgb: (string | number)[]): Logger {
    return this._rgb(rgb, true);
  }

  public hex(hexCode: string): Logger {
    if (!hexCode.startsWith('#')){
      hexCode = `#${hexCode}`
    }
    const rgbValues = hexCode.slice(1).match(/.{2}/g)?.map((val) => parseInt(val, 16));
    if (rgbValues && rgbValues.length === 3) {
      return this.ansi(`\u001b[38;2;${rgbValues[0]};${rgbValues[1]};${rgbValues[2]}m`);
    }
    throw new Error('Invalid hex color format');
  }

  public hexBg(hexCode: string): Logger {
    if (!hexCode.startsWith('#')){
      hexCode = `#${hexCode}`
    }
    const rgbValues = hexCode.slice(1).match(/.{2}/g)?.map((val) => parseInt(val, 16));
    if (rgbValues && rgbValues.length === 3) {
      return this.ansi(`\u001b[48;2;${rgbValues[0]};${rgbValues[1]};${rgbValues[2]}m`);
    }
    throw new Error('Invalid hex color format');
  }

  public ansi(ansi: string): Logger {
    this.message = `${ansi}${this.message}${getAnsiCode('reset')}`;
    this.appendedMessages = this.appendedMessages.map(text => {
      if (typeof text === 'string') {
        return `${ansi}${text}${getAnsiCode('reset')}`;
      } else {
        text.ansi(ansi);
        return text;
      }
    });
    return this;
  }

  private replace(message: string): void {
  const rowsToGoUp = currentRow - this.row;
  process.stdout.write(`\x1b[${rowsToGoUp}A\x1b[2K`);
  process.stdout.write(`${message}\n`);
  process.stdout.write(`\x1b[${rowsToGoUp}B`);
  }

  public print(): number {
    const message = [this.message, ...this.appendedMessages].join(' ');
    const formattedMessage = `${message}${getAnsiCode('reset')}`;
    const cleanedMessage = removeDuplicateResetCodes(formattedMessage);

    if (this.existingRow){
      this.replace(cleanedMessage);
    } else {
      writeToTerminal(cleanedMessage, false, true);
      currentRow++;
    }
    return this.row;
  }

  private _rgb(rgb: (string | number)[], background: boolean): Logger {
    let formattedRgb = [];
    if (rgb.length === 1 && Array.isArray(rgb[0])) {
      formattedRgb = rgb[0];
    } else if (rgb.length === 3) {
      formattedRgb = [...rgb];
    }
    if (formattedRgb && formattedRgb.length === 3) {
      formattedRgb = formattedRgb.map(val => val.toString());
      const backgroundCode = background ? '48' : '38';
      return this.ansi(`\u001b[${backgroundCode};2;${formattedRgb[0]};${formattedRgb[1]};${formattedRgb[2]}m`);
    }
    throw new Error('Invalid RGB');
  }

  private style(styleType: string): Logger {
    const ansi = getAnsiCode(styleType);
    return this.ansi(ansi);
  }
}

export function log(message: string, row?: number): Logger {
  if (row) {
    return new Logger(message, row);
  } else {
    return new Logger(message);
  }
}
