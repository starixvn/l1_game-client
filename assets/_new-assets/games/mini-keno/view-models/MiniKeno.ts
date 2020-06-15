import GameMiniBase from "../../_base/GameMiniBase";
import MiniKenoConfig from "./MiniKenoConfig";
import BetPopup from "./BetPopup";
import KenoFinishHandler from "../../keno-pro/view-models/handlers/KenoFinishHandler";
import MiniKenoFinishHandler from "./handlers/MiniKenoFinishHandler";
import KenoRoundResult from "../../keno-pro/view-models/history/KenoRoundResult";
import KenoNumber from "../../keno-pro/view-models/KenoNumber";
import MiniKenoTimeHandler from "./handlers/MiniKenoTimeHandler";
import MiniKenoLogsHandler from "./handlers/MiniKenoLogsHandler";
import RoundHistory from "../../keno-pro/view-models/RoundHistory";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

export enum KenoType {
    Max,
    Max2,
    Mini,
    Mini2,
    East,
    West,
    South,
    North,
}

type KenoTypeString = keyof typeof KenoType;

@ccclass
export default class MiniKeno extends GameMiniBase {
    @property({ type: cc.Enum(KenoType) })
    kenoType: KenoType = KenoType.Max;

    @property(BetPopup)
    betPopup: BetPopup = null;

    @property(KenoRoundResult)
    roundResult: KenoRoundResult = null;

    @property(RoundHistory)
    roundHistory: RoundHistory = null;

    public resultAnimating = false;
    public kenoNumbers: KenoNumber[] = [];

    onLoad() {
        super.onLoad();
        this.init();
        this.roundHistory.init(this);
    }

    initHandlers() {
        super.initHandlers();

        this.finishHandler = new MiniKenoFinishHandler(this);
        this.timeHandler = new MiniKenoTimeHandler(this);
        this.logsHandler = new MiniKenoLogsHandler(this);
    }

    init() {
        this.gameName = `keno${KenoType[this.kenoType]}`;
        this.config = new MiniKenoConfig(this.kenoType);
    }

    public onBetItemClick(e) {
        cc.RedT.audio.playClick();
        const betChoice = e.target.name;
        this.betPopup.show({
            title: `#${this.roundId}`,
            odd: this.gameConfigs.odds[betChoice],
            choice: GameUtils.getBetChoiceString(betChoice),
            minBet: this.gameConfigs.minbet,
            maxBet: this.gameConfigs.maxbet
        }, (betAmount) => {
            if (betAmount > 0) {
                this.bet({ bet: { amount: betAmount, betChoice: betChoice } });
            }
        });
    }

    updateRoundHistory() {
        this.roundHistory.setData(this.currentDataLogs);
    }
}
