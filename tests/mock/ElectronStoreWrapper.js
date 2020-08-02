export default class Store {
    constructor () {
        this.set = jest.fn();
        this.get = jest.fn();
    }
};
