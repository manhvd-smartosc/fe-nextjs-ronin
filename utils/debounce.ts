/* eslint-disable prettier/prettier */
let timeout: ReturnType<typeof setTimeout>;
const debounce =
  (func: (...args: any[]) => void, wait = 1000) =>
  (...args: any[]) => {
    const executeFunction = () => {
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(executeFunction, wait);
  };
export { debounce };
