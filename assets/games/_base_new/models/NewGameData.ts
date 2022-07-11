import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import { TimeEventHandler } from "../../_new/_base/game-data-management/event-handlers/time-handler";
import { TotalBetsEventHandler } from "../../_new/_base/game-data-management/event-handlers/total-bets-handler";
import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import { BetHandler } from "../handlers/BetHandler";
import { GameConfigHandler } from "../handlers/GameConfigHandler";
import { NoticeHandler } from "../handlers/NoticeHandler";
import { RoundHistoryHandler } from "../handlers/RoundHistoryHandler";
import { BetModel } from "./BetModel";
import { GameConfigs } from "./GameConfigs";
import { NoticeModel } from "./NoticeModel";
import { RoundHistory } from "./RoundHistory";

export default class NewGameData extends GameData {
    protected readonly eventEmitters: EventEmitterBase[] = [];
    protected readonly eventHandlers: BaseEventHandler<any>[] = [];

    betModel: BetModel;
    gameConfigs: GameConfigs;
    notice: NoticeModel;
    roundHistory: RoundHistory;

    constructor() {
        super();
        this.betModel = new BetModel();
        this.gameConfigs = new GameConfigs();
        this.notice = new NoticeModel();
        this.roundHistory = new RoundHistory();

        const models: EventEmitterBase[] = [
            //
            this.durations,
            this.totalBets,
            this.betModel,
            this.gameConfigs,
            this.notice,
            this.roundHistory
        ];
        this.eventEmitters.push(...models);
    }

    updateUI() {
        this.eventEmitters.forEach((emitter) => emitter.updateUI());
    }

    protected registerBaseEventHandlers() {
        const handlers = [
            //
            GameConfigHandler,
            TimeEventHandler,
            RoundHistoryHandler,
            TotalBetsEventHandler,
            BetHandler,
            NoticeHandler
        ];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
