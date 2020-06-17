import GameMiniBase from "../../_base/GameMiniBase";
import MiniKenoConfig from "./MiniKenoConfig";
import MiniKenoFinishHandler from "./handlers/MiniKenoFinishHandler";
import KenoRoundResult from "../../keno-pro/view-models/history/KenoRoundResult";
import KenoNumber from "../../keno-pro/view-models/KenoNumber";
import MiniKenoTimeHandler from "./handlers/MiniKenoTimeHandler";
import MiniKenoLogsHandler from "./handlers/MiniKenoLogsHandler";
import RoundHistory from "../../keno-pro/view-models/RoundHistory";
import GameUtils from "../../../common/GameUtils";
import MiniKenoBetItems from "./MiniKenoBetItems";
import MiniKenoBetBoard from "./MiniKenoBetBoard";
import MiniKenoBetItem from "./MiniKenoBetItem";
import KenoUtils from "./KenoUtils";

const { ccclass, property } = cc._decorator;

export enum KenoType {
    ProViet,
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

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.Node)
    center: cc.Node = null;

    @property(cc.Prefab)
    betItemsPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    betBoardPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    roundResultPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    roundResult10NumberPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    roundHistoryPrefab: cc.Prefab = null;

    @property(cc.Button)
    rebet: cc.Button = null;

    public resultAnimating = false;
    public kenoNumbers: KenoNumber[] = [];
    public onFavoriteChanged = (favourite: boolean) => { };
    public roundHistory: RoundHistory;
    public roundResult: KenoRoundResult;
    public betBoard: MiniKenoBetBoard;

    onLoad() {
        this.init();
        this.initComponents();

        super.onLoad();
    }

    onDestroy() {
        this.betBoard.destroy();
        this.roundHistory.destroy();
        this.roundResult.destroy();
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

    public onReBetClick() {
        cc.RedT.audio.playClick();
        this.betBoard.rebet(`#${this.getKenoName()} - ${this.roundId}`);
    }

    public onBetItemClick(e) {
        cc.RedT.audio.playClick();
        const betChoice = e.target.name;
        this.betBoard.show({
            title: `#${this.getKenoName()} - ${this.roundId}`,
            odd: this.gameConfigs.odds[betChoice],
            choice: GameUtils.getBetChoiceString(betChoice),
            minBet: this.gameConfigs.minbet,
            maxBet: this.gameConfigs.maxbet
        }, (betAmount) => {
            if (betAmount > 0) {
                this.rebet.interactable = true;
                this.sendBet(betAmount, betChoice);
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

    protected sendBet(betAmount, betChoice) {
        this.bet({ bet: { amount: betAmount, betChoice: betChoice } });
    }

    protected initComponents() {
        const betItemsNode = cc.instantiate(this.betItemsPrefab);
        const betItems = betItemsNode.getComponent(MiniKenoBetItems);
        this.betItems = betItems.betItems;
        this.body.addChild(betItemsNode);
        this.betItems.forEach(item => { item.betCallback = (e) => { this.onBetItemClick(e); } });

        const roundHistoryNode = cc.instantiate(this.roundHistoryPrefab);
        this.roundHistory = roundHistoryNode.getComponent(RoundHistory);
        this.body.addChild(roundHistoryNode);

        const miniType = this.kenoType == KenoType.Mini || this.kenoType == KenoType.Mini2;
        this.betItems.forEach(item => {
            const miniKenoBetItem = item as MiniKenoBetItem;
            const rule = KenoUtils.getKenoRuleChoice(item.node.name, miniType);
            miniKenoBetItem.setRule(rule);
        })
        const roundResultNode = cc.instantiate(miniType ? this.roundResult10NumberPrefab : this.roundResultPrefab);
        this.roundResult = roundResultNode.getComponent(KenoRoundResult);
        this.roundResult.node.active = false;
        this.center.addChild(roundResultNode);

        const betBoardNode = cc.instantiate(this.betBoardPrefab);
        this.betBoard = betBoardNode.getComponent(MiniKenoBetBoard);
        this.betBoard.node.active = false;
        this.center.addChild(betBoardNode);
    }

    private getKenoName(): string {
        const dict = {
            ProViet: "Keno Pro Viet",
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
}
