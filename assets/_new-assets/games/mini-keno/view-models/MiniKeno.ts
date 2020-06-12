import GameMiniBase from "../../_base/GameMiniBase";
import MiniKenoConfig from "./MiniKenoConfig";
import BetPopup from "./BetPopup";

const { ccclass, property } = cc._decorator;

enum KenoType {
    Max,
    Max2,
    Mini,
    Mini2,
    Spring,
    Summer,
    Autumn,
    Winter,
}

type KenoTypeString = keyof typeof KenoType;

@ccclass
export default class MiniKeno extends GameMiniBase {
    @property({ type: cc.Enum(KenoType) })
    kenoType: KenoType = KenoType.Max;

    @property(BetPopup)
    betPopup: BetPopup = null;

    onLoad() {
        super.onLoad();
        this.init();
    }

    init() {
        this.gameName = `keno${KenoType[this.kenoType]}`;
        this.config = new MiniKenoConfig();
    }

    public onBetItemClick(e) {
        cc.RedT.audio.playClick();
        const betChoice = e.target.name;
        this.betPopup.show({
            title: `#${this.roundId}`,
            odd: this.gameConfigs.odds[betChoice],
            choice: betChoice,
            minBet: this.gameConfigs.minbet,
            maxBet: this.gameConfigs.maxbet
        }, (betAmount) => {
            this.bet({ bet: { amount: betAmount, betChoice: betChoice } });
        });
    }
}
