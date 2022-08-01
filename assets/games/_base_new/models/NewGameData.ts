import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import { TimeEventHandler } from "../../_new/_base/game-data-management/event-handlers/time-handler";
import { TotalBetsEventHandler } from "../../_new/_base/game-data-management/event-handlers/total-bets-handler";
import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import { BetHandler } from "../handlers/BetHandler";
import { GameConfigHandler } from "../handlers/GameConfigHandler";
import { NoticeHandler } from "../handlers/NoticeHandler";
import { ResultHashHandler } from "../handlers/ResultHashHandler";
import { RoundHistoryHandler } from "../handlers/RoundHistoryHandler";
import { SettlemenHandler } from "../handlers/SettlementHandler";
import { BetModel } from "./BetModel";
import { GameConfigs } from "./GameConfigs";
import { NoticeModel } from "./NoticeModel";
import { ResultHash } from "./ResultHash";
import { RoundHistory } from "./RoundHistory";
import { Settlement } from "./Settlement";

export default class NewGameData extends GameData {
    static Events = {
        CHANGE_ROUND_ID: "NewGameData:CHANGE_ROUND_ID"
    };

    protected readonly eventEmitters: EventEmitterBase[] = [];
    protected readonly eventHandlers: BaseEventHandler<any>[] = [];

    betModel: BetModel;
    gameConfigs: GameConfigs;
    notice: NoticeModel;
    roundHistory: RoundHistory;
    settlement: Settlement;
    resultHash: ResultHash;

    roundId: number;

    constructor() {
        super();
        this.betModel = new BetModel();
        this.gameConfigs = new GameConfigs();
        this.notice = new NoticeModel();
        this.roundHistory = new RoundHistory();
        this.settlement = new Settlement();
        this.resultHash = new ResultHash();

        const models: EventEmitterBase[] = [
            //
            this.durations,
            this.totalBets,
            this.betModel,
            this.gameConfigs,
            this.notice,
            this.roundHistory,
            this.settlement,
            this.resultHash
        ];
        this.eventEmitters.push(...models);
    }

    changeRoundId(roundId: number) {
        this.roundId = roundId;
        this.emit(NewGameData.Events.CHANGE_ROUND_ID, this.roundId);
    }

    updateUI() {
        this.emit(NewGameData.Events.CHANGE_ROUND_ID, this.roundId);
        this.eventEmitters.forEach((emitter) => emitter.updateUI());
    }

    protected registerBaseEventHandlers() {
        const handlers = [
            //
            TimeEventHandler,
            GameConfigHandler,
            RoundHistoryHandler,
            TotalBetsEventHandler,
            BetHandler,
            NoticeHandler,
            SettlemenHandler,
            ResultHashHandler
        ];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
