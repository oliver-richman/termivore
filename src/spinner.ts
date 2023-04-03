import { ISpinnerOptions } from './types';
import { writeToTerminal } from './utils';

const defaultSpinnerOptions: ISpinnerOptions = {
	frames: [ '⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏' ],
	stopIcon: '✓',
	stopText: 'Loaded',
};

export class Spinner {
  private text: string;
  private options: ISpinnerOptions;
  private timerId: NodeJS.Timeout | null;
  private currentFrame: number;
  private isStopped: boolean;

  constructor(text = 'Loading...', options: ISpinnerOptions = defaultSpinnerOptions) {
    this.text = text;
	this.options = {...defaultSpinnerOptions, ...options};
    this.timerId = null;
    this.currentFrame = 0;
	this.isStopped = false;
  }

  public start(): Spinner {
    this.timerId = setInterval(() => {
      this.currentFrame = ++this.currentFrame % this.options.frames.length;
      this.render();
    }, 100);

	return this;
  }

  public stop(): void {
    clearInterval(this.timerId!);
    this.timerId = null;
    this.currentFrame = 0;
	this.isStopped = true;
    this.render();
  }

  public setText(text: string): void {
    this.text = text;
    this.render();
  }

  private render(): void {
	if (this.isStopped && this.options.persistOnStop){
		writeToTerminal(`${this.options.stopIcon} ${this.options.stopText}`, true, true);
	} else {
		if (this.timerId !== null) {
			const frame = this.options.frames[this.currentFrame];
			writeToTerminal(`${frame} ${this.text}`, true);
		} else {
			writeToTerminal('');
		}
	}
  }
}