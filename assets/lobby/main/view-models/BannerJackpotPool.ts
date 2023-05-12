import { lodash } from "../../../ClientModules";
import GameUtils from "../../../common/GameUtils";
import BannerJackpotPoolItem from "./BannerJackpotPoolItem";

const { ccclass, property } = cc._decorator;

export enum JackpotPoolType {
    MINOR = 0,
    MAJOR,
    GRAND
}

@ccclass
export default class BannerJackpotPool extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    gamePool: cc.Prefab = null;

    receivedData = [
        {
            amount: 5103.125,
            gameId: 29,
            pool: 1
        },
        {
            amount: 50208.75,
            gameId: 29,
            pool: 10
        },
        {
            amount: 252031.25,
            gameId: 29,
            pool: 50
        },
        {
            amount: 6008.75,
            gameId: 46,
            pool: 1
        },
        {
            amount: 56008.75,
            gameId: 46,
            pool: 10
        },
        {
            amount: 252008.75,
            gameId: 46,
            pool: 50
        },
        {
            amount: 1000008.75,
            gameId: 63,
            pool: 1
        },
        {
            amount: 50408.75,
            gameId: 63,
            pool: 10
        },
        {
            amount: 350008.75,
            gameId: 63,
            pool: 50
        },
        {
            amount: 3008.75,
            gameId: 64,
            pool: 1
        },

        {
            amount: 250008.75,
            gameId: 64,
            pool: 50
        },
        {
            amount: 58008.75,
            gameId: 64,
            pool: 10
        }
    ];

    jackpotData;

    onLoad() {
        this.convertData();
        this.loadData(JackpotPoolType.MINOR);
    }

    selectPool(event, type) {
        this.loadData(+type);
    }

    convertData() {
        this.receivedData.sort((a, b) => {
            return b.amount - a.amount;
        });
        this.jackpotData = lodash.groupBy(this.receivedData, "pool");
        console.log(this.jackpotData);
    }

    loadData(type: number) {
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
