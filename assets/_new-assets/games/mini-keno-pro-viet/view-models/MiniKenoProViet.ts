import MiniKeno from "../../mini-keno/view-models/MiniKeno";
import MiniKenoProVietConfig from "./MiniKenoProVietConfig";
import MiniKenoProVietRoundsSelection from "./components/MiniKenoProVietRoundsSelection";
import MiniKenoProVietRoundsHandler from "./handlers/MiniKenoProVietRoundsHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoProViet extends MiniKeno {
    @property(cc.Prefab)
    roundsSelectionPrefab: cc.Prefab

    roundsHandler: MiniKenoProVietRoundsHandler;

    private roundsSelection: MiniKenoProVietRoundsSelection;

    onLoad() {
        super.onLoad();

        this.addHandlers(this.roundsHandler)
    }


    init() {
        super.init();
        this.config = new MiniKenoProVietConfig();
    }

    initHandlers() {
        super.initHandlers();

        this.roundsHandler = new MiniKenoProVietRoundsHandler(this);
    }

    protected sendBet(betAmount, betChoice) {
        this.bet({ bet: { amount: betAmount, betChoice: betChoice, roundId: this.roundId + 1 } });
    }

    getGameRounds() {
        this.sendData({ "getRounds": true });
    }

    changeRound(roundId: string) {
        this.sendData({ getPlayerBets: true, roundId: roundId });
        this.roundId = parseInt(roundId) - 1;
    }

    initRoundSelectionPopup(): MiniKenoProVietRoundsSelection {
        if (this.roundsSelection && this.roundsSelection.node) {
            return this.roundsSelection;
        }

        const roundsSelectionNode = cc.instantiate(this.roundsSelectionPrefab);
        this.roundsSelection = roundsSelectionNode.getComponent(MiniKenoProVietRoundsSelection);
        this.roundsSelection.node.active = false;
        this.center.addChild(this.roundsSelection.node);
        this.roundsSelection.init(this);

        return this.roundsSelection;
    }

}
