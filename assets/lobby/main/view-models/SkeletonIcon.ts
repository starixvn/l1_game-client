import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkeletonIcon extends cc.Component {
    static iconAnimationCache = {};

    @property(cc.Label)
    gameName: cc.Label = null;

    @property(cc.Node)
    gameContent: cc.Node = null;

    @property(cc.Node)
    lightTop: cc.Node = null;

    setGameName(text: string) {
        this.gameName.string = text;
    }

    private readonly timeGap = 0.125;

    async setGameContent(id: number, gameList: number[]) {
        if (!SkeletonIcon.iconAnimationCache[id]) {
            const batchIndex = Math.floor(gameList.findIndex((n) => n === id) / 5);
            this.scheduleOnce(async () => {
                await this.loadAnimation(id);
                SkeletonIcon.iconAnimationCache[id] = true;
            }, batchIndex * this.timeGap);
        } else {
            this.loadAnimation(id);
        }
    }

    private async loadAnimation(id: number) {
        const gamePath = `lobby/games/${id}`;
        const prefab = await GameUtils.loadResource(gamePath);
        const gameNode = cc.instantiate(prefab);
        this.gameContent?.addChild(gameNode);
        this.lightTop && (this.lightTop.active = false);
    }
}
