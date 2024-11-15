const { debounce } = require('@/utils/debounce');

jest.useFakeTimers();

describe('debounce', () => {
  let func = jest.fn();

  beforeEach(() => {
    func = jest.fn();
  });

  it('should call the function after the specified wait time', () => {
    const debouncedFunc = debounce(func, 1000);
    debouncedFunc();
    expect(func).not.toBeCalled();
    jest.advanceTimersByTime(1000);
    expect(func).toBeCalled();
  });

  it('should not call the function if called again before the wait time', () => {
    const debouncedFunc = debounce(func, 1000);
    debouncedFunc();
    jest.advanceTimersByTime(500);
    debouncedFunc();
    jest.advanceTimersByTime(500);
    expect(func).not.toBeCalled();
    jest.advanceTimersByTime(500);
    expect(func).toBeCalled();
  });

  it('should call the function with the correct arguments', () => {
    const debouncedFunc = debounce(func, 1000);
    debouncedFunc('arg1', 'arg2');
    jest.advanceTimersByTime(1000);
    expect(func).toBeCalledWith('arg1', 'arg2');
  });

  it('should handle multiple calls correctly', () => {
    const debouncedFunc = debounce(func, 1000);
    debouncedFunc();
    jest.advanceTimersByTime(500);
    debouncedFunc();
    jest.advanceTimersByTime(500);
    debouncedFunc();
    jest.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
  });
});
