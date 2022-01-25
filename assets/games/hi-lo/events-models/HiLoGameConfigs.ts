import { EventEmitter } from "events";

export default class HiLoGameConfigs extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "configs:change"
    };

    maxBet: number;
    minBet: number;
    chips: number[];

    change(configs: HiLoGameConfigs) {
        const { maxBet, minBet, chips } = configs;

        this.maxBet = maxBet || this.maxBet;
        this.minBet = minBet || this.minBet;
        this.chips = chips || this.chips;

        this.emit(HiLoGameConfigs.Events.CHANGE, configs);
    }
}
