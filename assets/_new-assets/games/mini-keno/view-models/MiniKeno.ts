import GameMiniBase from "../../_base/GameMiniBase";
import MiniKenoConfig from "./MiniKenoConfig";
import BetPopup from "./BetPopup";
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

@ccclass
export default class MiniKeno extends GameMiniBase {
    @property({ type: cc.Enum(KenoType) })
    kenoType: KenoType = KenoType.Max;

    @property(cc.Label)
    kenoName: cc.Label = null;

    @property(cc.Toggle)
    favourite: cc.Toggle = null;

    @property(BetPopup)
    betPopup: BetPopup = null;

    @property(KenoRoundResult)
    roundResult: KenoRoundResult = null;

    @property(RoundHistory)
    roundHistory: RoundHistory = null;

    @property(cc.Button)
    rebet: cc.Button = null;

    public resultAnimating = false;
    public kenoNumbers: KenoNumber[] = [];
    public onFavoriteChanged = (favourite: boolean) => { };

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
        this.kenoName.string = this.getKenoName();
    }

    private getKenoName(): string {
        const dict = {
            Max: "Keno Max",
            Max2: "Keno Max 2",
            Mini: "Keno Mini",
            Mini2: "Keno Mini 2",
            East: "Keno Đông",
            West: "Keno Tây",
            South: "Keno Nam",
            North: "Keno Bắc",
        }
        return dict[KenoType[this.kenoType]];
    }

    public onReBetClick() {
        cc.RedT.audio.playClick();
        this.betPopup.rebet(`#${this.getKenoName()} - ${this.roundId}`);
    }

    public onBetItemClick(e) {
        cc.RedT.audio.playClick();
        const betChoice = e.target.name;
        this.betPopup.show({
            title: `#${this.getKenoName()} - ${this.roundId}`,
            odd: this.gameConfigs.odds[betChoice],
            choice: GameUtils.getBetChoiceString(betChoice),
            minBet: this.gameConfigs.minbet,
            maxBet: this.gameConfigs.maxbet
        }, (betAmount) => {
            if (betAmount > 0) {
                this.rebet.interactable = true;
                this.bet({ bet: { amount: betAmount, betChoice: betChoice } });
            }
        });
    }

    public toggleFavorite() {
        cc.RedT.audio.playClick();
        this.onFavoriteChanged(this.favourite.isChecked);
    }

    updateRoundHistory() {
        this.roundHistory.setData(this.currentDataLogs);
    }
}
