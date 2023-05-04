import JackpotPoolInfoBase from "../../lobby/main/view-models/JackpotPoolInfoBase";
import JackpotPoolBelongToStake from "./JackpotPoolBelongToStake";
import StandardSlotGame from "./StandardSlotGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardJackpotSlotGame extends StandardSlotGame {
    @property(cc.Node)
    jackpotPoolNode: cc.Node = null;

    @property(cc.Node)
    jackpotPoolListNode: cc.Node = null;

    private readonly jackpotPoolPrefab: cc.Prefab;
    private readonly jackpotPoolListPrefab: cc.Prefab;
    private jackpotPoolBelongToStake: JackpotPoolBelongToStake;

    onLoad() {
        super.onLoad();
    }

    public get jackpotEnabled() {
        // enable jackpot
        return true;
    }

    getPrefabsList() {
        const normalPrefabs = super.getPrefabsList();
        const jackpotPrefabs = {
            // prefab name : prefab property
            "top-winner": "topWinnerPrefab",
            "effect-jackpot": "effectJackpot",
            "jackpot-pool": "jackpotPoolPrefab",
            "jackpot-pool-list": "jackpotPoolListPrefab"
        };
        return Object.assign({}, normalPrefabs, jackpotPrefabs);
    }

    initJackpot() {
        this.initJackpotPool();
        this.initJackpotPoolInfo();
    }

    initJackpotPool() {
        const node = cc.instantiate(this.jackpotPoolPrefab);
        this.jackpotPoolBelongToStake = node.getComponent(JackpotPoolBelongToStake);
        this.jackpotPoolNode.addChild(node);
        this.updateJackpotPoolBelongToStake();
    }

    initJackpotPoolInfo() {
        const node = cc.instantiate(this.jackpotPoolListPrefab);
        this.jackpotPoolInfo = node.getComponent(JackpotPoolInfoBase);
        this.jackpotPoolListNode.addChild(node);
        this.updateJackpotPoolList();
    }

    updateJackpotPoolBelongToStake() {
        const poolValue = this.jackpotPool[`${this.stake}`];
        if (poolValue && poolValue !== this.jackpotPoolValue && this.jackpotPoolBelongToStake) {
            this.jackpotPoolValue = poolValue;
            this.jackpotPoolBelongToStake.updatePool(poolValue);
        }
    }
}
