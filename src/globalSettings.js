export default class GlobalSettings {
    constructor(settings) {
        this.fontSize = "15";

        if (settings) {
            Object.assign(this, settings);
        }
    }
}