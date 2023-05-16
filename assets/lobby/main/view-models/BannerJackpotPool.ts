import BannerJackpotPoolItem from "./BannerJackpotPoolItem";
import JackpotPoolInfo from "./JackpotPoolInfo";
import { JackpotEvents, jackpotManager } from "../../../managers/JackpotManager";
import JackpotPoolItem from "./JackpotPoolItem";

const { ccclass, property } = cc._decorator;

export enum JackpotPoolType {
    MINOR = 0,
    MAJOR,
    GRAND
}

@ccclass
export default class BannerJackpotPool extends JackpotPoolInfo {
    @property({ type: JackpotPoolItem, visible: false, override: true })
    items: JackpotPoolItem[] = [];

    @property({ visible: false, override: true })
    gameId = 0;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    gamePool: cc.Prefab = null;

    private poolData: any;
    private selectedTab: number;

    onReceivedData(data: any) {
        this.poolData = jackpotManager.getJackpotDataWithPools(data);
        this.loadData(this.selectedTab ?? JackpotPoolType.GRAND);
    }

    requestData() {
        jackpotManager.emitEvent(JackpotEvents.GET_POOLS, {});
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
        Object.keys(this.poolData).forEach((pool, index) => {
            if (type === index) {
                this.poolData[pool].forEach((gamePool) => {
                    const item = cc.instantiate(this.gamePool);
                    this.content.addChild(item);
                    const poolItemComp = item.getComponent(BannerJackpotPoolItem);
                    poolItemComp.setData(gamePool);
                });
            }
        });
    }
}
