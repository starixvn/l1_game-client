import MiniKenoProVietLogsHandler from "./handlers/MiniKenoProVietLogsHandler";
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

    initRoundSelectionPopup(): MiniKenoProVietRoundsSelection {
        const roundsSelectionNode = cc.instantiate(this.roundsSelectionPrefab);
        const roundsSelection = roundsSelectionNode.getComponent(MiniKenoProVietRoundsSelection);
        roundsSelection.node.active = false;
        this.center.addChild(roundsSelectionNode);

        return roundsSelection;
    }

}
