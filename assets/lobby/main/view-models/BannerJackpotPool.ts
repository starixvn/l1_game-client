import GameUtils from "../../../common/GameUtils";
import { uiManager } from "../../../managers/GameUIManager";
import { InternalEvents } from "../../../managers/InternalEvents";
import { JackpotDataKey, JackpotEvents, jackpotManager } from "../../../managers/JackpotManager";
import BannerJackpotPoolItem from "./BannerJackpotPoolItem";
import JackpotPoolInfo from "./JackpotPoolInfo";
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
    protected dataType = JackpotDataKey.JACKPOT_POOLS;
    protected dataKey = `${JackpotDataKey.JACKPOT_POOLS}${this.uuid}`;

    protected initEvents() {
        jackpotManager.addDataObserver(this.dataType, this.dataKey);
        uiManager.emitterListener(InternalEvents.RECEIVED_JACKPOT_POOLS, (data) => this.onData(data), this);
    }

    onData(data: any) {
        this.poolData = data;
        this.loadData(this.selectedTab ?? JackpotPoolType.GRAND);
    }

    protected requestData() {
        jackpotManager.emitEvent(JackpotEvents.GET_POOLS, {});
    }

    selectPool(event, type) {
        this.loadData(+type);
    }

    private loadData(type: number) {
        if (this.selectedTab === type || !this.poolData) {
            return;
        }

        this.selectedTab = type;
        this.content.destroyAllChildren();
        Object.keys(this.poolData).forEach((pool, index) => {
            if (type === index) {
                this.poolData[pool].forEach((gamePool) => {
                    const item = GameUtils.createNodeFromPrefab(this.gamePool);
                    if (item) {
                        this.content.addChild(item);
                        const poolItemComp = item.getComponent(BannerJackpotPoolItem);
                        poolItemComp.setData(gamePool);
                    }
                });
            }
        });
    }
}
