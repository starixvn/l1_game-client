import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkeletonIcon extends cc.Component {
    @property(cc.Label)
    gameName: cc.Label = null;

    @property(cc.Node)
    gameContent: cc.Node = null;

    setGameName(text: string) {
        this.gameName.string = text;
    }

    private timeGap = 0.125;

    async setGameContent(id: number, gameList: number[]) {
        const batchIndex = Math.floor(gameList.findIndex((n) => n === id) / 5);
        this.scheduleOnce(async () => {
            const gamePath = `lobby/games/${id}`;
            const prefab = await GameUtils.loadResource(gamePath);
            const gameNode = cc.instantiate(prefab);
            this.gameContent?.addChild(gameNode);
        }, batchIndex * this.timeGap);
    }
}
