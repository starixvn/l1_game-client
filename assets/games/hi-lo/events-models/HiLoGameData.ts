import { GameData } from "../../_new/_base/game-data-management/models/game-data";

export default class HiLoGameData<Choices> extends GameData<Choices> {
    static Events = {
        CHANGE_STATE: "changeState",
        CHOICES_RESULT: "choicesResult",
        SHOW_PROCESSING_BET: "showProcessingBet",
        HIDE_PROCESSING_BET: "hideProcessingBet",
        SETTLED: "settled"
    };
}
