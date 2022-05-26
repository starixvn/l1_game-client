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

    private timeGap = 1.5;

    async setGameContent(id: number, gameList: number[]) {
        const index = gameList.findIndex((n) => n === id);

        switch (true) {
            case index < 10:
                await GameUtils.delayTime(0);
                break;
            case index < 20:
                await GameUtils.delayTime(this.timeGap);
                break;
            default:
                await GameUtils.delayTime(this.timeGap++);
                console.log(this.timeGap++);
                break;
        }

        const gamePath = `lobby/games/${id}`;
        const prefab = await GameUtils.loadResource(gamePath);
        const gameNode = cc.instantiate(prefab);
        this.gameContent?.addChild(gameNode);
    }
}
