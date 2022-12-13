import NewGameData from "../../../_base_new/models/NewGameData";

const { ccclass } = cc._decorator;

@ccclass
export default class WinThreeCardsGameData extends NewGameData {
    constructor() {
        super();
    }

    protected registerBaseEventHandlers() {
        const handlers = [];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
