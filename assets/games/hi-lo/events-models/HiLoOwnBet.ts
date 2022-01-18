import { EventEmitter } from "events";

export class HiLoOwnBet extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        OWN_BETS: "ownBets"
    };
}
