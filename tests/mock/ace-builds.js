const setOptions = jest.fn();
export default {
    setOptions: setOptions,
    session: {
        setUseWrapMode: jest.fn()
    },
    edit: jest.fn().mockReturnValue({
        setOptions: setOptions,
    }),
    define: jest.fn()
};
