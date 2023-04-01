import { log, Logger } from '../src/log';
import * as Utils from '../src/utils';

const resetAnsiCode = 'x1b[0m';
const redAnsiCode = 'x1b[31m';
const greenAnsiCode = 'x1b[32m';
const boldAnsiCode = 'x1b[1m';
const dimAnsiCode = 'x1b[2m';

let mockWriteToTerminal;

describe('log', () => {
    beforeEach(() => {
      jest.mock('../src/utils', () => ({
        writeToTerminal: jest.fn(),
      }));  

      mockWriteToTerminal = jest.spyOn(Utils, 'writeToTerminal');
      mockWriteToTerminal.mockImplementation();

      const mockGetAnsiCode = jest.spyOn(Utils, 'getAnsiCode');
      mockGetAnsiCode.mockImplementation((style: string) => {
        return `x1b[${Utils.ansiCodes[style]}m`;
      });

      const mockRemoveDuplicateResetCodes = jest.spyOn(Utils, 'removeDuplicateResetCodes');
      mockRemoveDuplicateResetCodes.mockImplementation((message: string) => {
        const regex = /((x1b\[\d+m)*x1b\[0m){2,}/g;
        return message.replace(regex, 'x1b[0m');
      });
    });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('log()', () => {
    it('Should return instance of Logger', () => {
      expect(log('Test')).toBeInstanceOf(Logger);
    });
  });

  describe('print', () => {
    it('should print message and reset code', () => {
      log('Test').print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `Test${resetAnsiCode}`,
        false,
        true
      );
    });
  });

  describe('append', () => {
    it('should print message and appended message with reset code', () => {
      log('Test').append('123').print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `Test 123${resetAnsiCode}`,
        false,
        true,
      );
    });

    it('should print message and appended logger with reset code', () => {
      log('Test').append(log('123')).print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `Test 123${resetAnsiCode}`,
        false,
        true,
      );
    });
  });

  describe('red', () => {
    it('should print message with red code', () => {
      log('Test').red().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${redAnsiCode}Test${resetAnsiCode}`,
        false,
        true
      );
    });

    it('should print message and appended message with red code', () => {
      log('Test').append('123').red().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${redAnsiCode}Test${resetAnsiCode} ${redAnsiCode}123${resetAnsiCode}`,
        false,
        true
      );
    });

    it('should print message and appended logger with red code', () => {
      log('Test').append(log('123')).red().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${redAnsiCode}Test${resetAnsiCode} ${redAnsiCode}123${resetAnsiCode}`,
        false,
        true
      );
    });
  });

  describe('green', () => {
    it('should print message with green code', () => {
      log('Test').green().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${greenAnsiCode}Test${resetAnsiCode}`,
        false,
        true
      );
    });

    it('should print message and appended message with green code', () => {
      log('Test').append('123').green().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${greenAnsiCode}Test${resetAnsiCode} ${greenAnsiCode}123${resetAnsiCode}`,
        false,
        true
      );
    });

    it('should print message and appended logger with green code', () => {
      log('Test').append(log('123')).green().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${greenAnsiCode}Test${resetAnsiCode} ${greenAnsiCode}123${resetAnsiCode}`,
        false,
        true
      );
    });
  });

  describe('bold', () => {
    it('should print message with bold code', () => {
      log('Test').bold().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${boldAnsiCode}Test${resetAnsiCode}`,
        false,
        true
      );
    });

    it('should print message and appended message with bold code', () => {
      log('Test').append('123').bold().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${boldAnsiCode}Test${resetAnsiCode} ${boldAnsiCode}123${resetAnsiCode}`,
        false,
        true
      );
    });

    it('should print message and appended logger with bold code', () => {
      log('Test').append(log('123')).bold().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${boldAnsiCode}Test${resetAnsiCode} ${boldAnsiCode}123${resetAnsiCode}`,
        false,
        true
      );
    });
  });

  describe('dim', () => {
    it('should print message with dim code', () => {
      log('Test').dim().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${dimAnsiCode}Test${resetAnsiCode}`,
        false,
        true
      );
    });

    it('should print message and appended message with dim code', () => {
      log('Test').append('123').dim().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${dimAnsiCode}Test${resetAnsiCode} ${dimAnsiCode}123${resetAnsiCode}`,
        false,
        true
      );
    });

    it('should print message and appended logger with dim code', () => {
      log('Test').append(log('123')).dim().print();
      expect(mockWriteToTerminal).toBeCalledWith(
        `${dimAnsiCode}Test${resetAnsiCode} ${dimAnsiCode}123${resetAnsiCode}`,
        false,
        true
      );
    });
  });
});