import EventEmitterBase from "../../../../../common/emitter/EventEmitterBase";

export default class BlockchainBaccaratScoreboardModel extends EventEmitterBase {
    static Events = {
        IN_GAME: "IN_GAME",
        UPDATE_RESULT: "UPDATE"
    };

    roundHistory: any[];

    inGame(roundHistory: any[]) {
        this.roundHistory = roundHistory;
        this.emit(BlockchainBaccaratScoreboardModel.Events.IN_GAME, roundHistory);
    }

    updateResult(result: any) {
        this.roundHistory.shift();
        this.roundHistory.push(result);
        this.emit(BlockchainBaccaratScoreboardModel.Events.UPDATE_RESULT, result);
    }
}
