export const isError = (message: string, code: number = 400) => {
    throw new Error(`${message}#EC${code}`);
};
