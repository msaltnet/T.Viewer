const setOptions = jest.fn();
export default {
    setOptions: setOptions,
    edit: jest.fn().mockReturnValue({
        setOptions: setOptions,
    }),
    define: jest.fn()
};
