import AudioManager from "../../../common/audio/AudioManager";
import MultiplayGame from "../../multiplay/scripts/MultiplayGame";
import MultiplayScoreBoard from "../../multiplay/scripts/MultiplayScoreBoard";
import MiniSedie from "./MiniSedie";
import { MiniSedie1Id, MiniSedie2Id, MiniSedie3Id, MiniSedie4Id } from "./MiniSedieConfigs";
import MiniSediePromotionGuide from "./MiniSediePromotionGuide";
import MiniSedieSubGame from "./MiniSedieSubGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedieMultiplay extends MultiplayGame {
    @property(cc.Prefab)
    scoreBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    promotionGuideNode: cc.Node = null;

    @property(cc.Prefab)
    promotionGuidePrefab: cc.Prefab = null;

    promotionGuideComp: MiniSediePromotionGuide = null;

    gameIds: number[] = [MiniSedie1Id, MiniSedie2Id, MiniSedie3Id, MiniSedie4Id];

    constructor() {
        super();
        this.gameId = MiniSedie1Id;
    }

    onLoad() {
        super.onLoad();
        // cc.sys.localStorage.setItem(KeyOpenScoreBoardStorage, "true");
        this.addPromotionGuide();
    }

    addPromotionGuide() {
        if (!this.promotionGuideNode || !this.promotionGuidePrefab) {
            return;
        }

        this.promotionGuideNode.destroyAllChildren();
        const guideNode = cc.instantiate(this.promotionGuidePrefab);
        this.promotionGuideComp = guideNode.getComponent(MiniSediePromotionGuide);
        const data = this.promotionGuideComp.getLocalStorageData();
        if (!data.enabled) {
            return;
        }

        this.promotionGuideNode.addChild(guideNode);
        this.promotionGuideComp.dontShowAgainCallback = (dontShow: boolean) => {
            data.enabled = !dontShow;
            this.promotionGuideComp.setLocalStorageData(data);
        };
    }

    createSubGameUI(gameId: number, location: number): cc.Node {
        const node = super.createSubGameUI(gameId, location);
        const multiplaySingle = node.getComponent(MiniSedieSubGame);
        multiplaySingle.setGameId(gameId);
        return node;
    }

    createMainGameUI(gameId: number) {
        const node = super.createMainGameUI(gameId);
        const multiplaySingle = node.getComponent(MiniSedie);
        multiplaySingle.setGameId(gameId);
        return node;
    }

    onScoreBoardClick() {
        AudioManager.getInstance().playClick();
        const node = cc.instantiate(this.scoreBoardPrefab);
        this.currentMiniPanel.addDialog(node);

        const scoreBoard = node.getComponent(MultiplayScoreBoard);
        scoreBoard.init(this.games);
        scoreBoard.openGameCallback = (gameId) => {
            this.switchGameToMain(gameId);
        };
    }
}
