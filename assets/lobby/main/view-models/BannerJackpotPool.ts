import { lodash } from "../../../ClientModules";
import GameUtils from "../../../common/GameUtils";
import BannerJackpotPoolItem from "./BannerJackpotPoolItem";
import JackpotPoolInfo from "./JackpotPoolInfo";

const { ccclass, property } = cc._decorator;

export enum JackpotPoolType {
    MINOR = 0,
    MAJOR,
    GRAND
}

@ccclass
export default class BannerJackpotPool extends JackpotPoolInfo {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    gamePool: cc.Prefab = null;

    jackpotData;
    selectedTab;

    onReceivedData(data: any) {
        data.sort((a, b) => {
            return b.amount - a.amount;
        });
        this.jackpotData = lodash.groupBy(data, "pool");
        this.loadData(this.selectedTab ?? JackpotPoolType.GRAND);
    }

    selectPool(event, type) {
        this.loadData(+type);
    }

    loadData(type: number) {
        if (this.selectedTab === type) {
            return;
        }
        this.selectedTab = type;
        this.content.destroyAllChildren();
        Object.keys(this.jackpotData).forEach((pool, index) => {
            if (type === index) {
                this.jackpotData[pool].forEach((gamePool) => {
                    const { gameId, amount } = gamePool;
                    const item = cc.instantiate(this.gamePool);
                    this.content.addChild(item);
                    const poolItemComp = item.getComponent(BannerJackpotPoolItem);
                    poolItemComp.setData(GameUtils.getGameNameString(gameId), amount);
                });
            }
        });
    }
}
