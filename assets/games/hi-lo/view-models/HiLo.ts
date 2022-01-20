import NewMiniGameBase from "../../_new/_base/NewMiniGameBase";
import { HiLoChoices } from "../events-models/HiLoChoices";
import HiLoGameData from "../events-models/HiLoGameData";
import { HiLoRoundCounter } from "../events-models/HiLoRoundCounter";
import HiLoBetModel from "../events-models/HiLoBetModel";
import { updateRoundId } from "../actions/HiLoRoundCounterAction";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLo extends NewMiniGameBase {
    @property(cc.Node)
    betBoardContainer: cc.Node = null;

    @property(cc.Prefab)
    betBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    topNode: cc.Node = null;

    @property(cc.Node)
    guideNode: cc.Node = null;

    @property(cc.Node)
    statisticContainer: cc.Node = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    @property(cc.Animation)
    resultAnimation: cc.Animation = null;

    @property(cc.Node)
    cardContainer: cc.Node = null;

    @property(cc.Button)
    playButton: cc.Button = null;

    private gameData: HiLoGameData<HiLoChoices> = null;

    onLoad() {
        this.gameData = new HiLoGameData<HiLoChoices>();
        super.onLoad();
        this.showHideTopArea();
        this.initBetBoard();
        this.registerBetEvents();
    }

    private registerBetEvents() {
        this.gameData.betModel.on(HiLoBetModel.Events.CHANGE, (betModel: HiLoBetModel) => {});
        this.gameData.betModel.on(HiLoBetModel.Events.CHANGE, () => {
            this.gameData.roundCounter.change(this.gameData.betModel.roundId);
        });
    }

    private registerAfterDealEvents() {}

    private registerRoundCounterEvents() {
        this.gameData.roundCounter.on(HiLoRoundCounter.Events.CHANGE, updateRoundId(this.gameRound));
    }

    openHistory() {
        this.playClick();
    }

    showHideTopArea() {
        this.topNode.active = !this.topNode.active;
    }

    initBetBoard() {
        const betBoard = cc.instantiate(this.betBoardPrefab);
        this.betBoardContainer.addChild(betBoard);
    }
}
