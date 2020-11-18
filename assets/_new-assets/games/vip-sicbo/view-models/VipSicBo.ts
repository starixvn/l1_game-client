import * as _ from "lodash";

import { games } from "../../../SabaConfigs";
import NewSocketGameBase from "../../_base/NewSocketGameBase";
// import VipSicBoBetHandler from "./handlers/VipSicBoBetHandler";
// import VipSicBoFinishHandler from "./handlers/VipSicBoFinishHandler";
// import VipSicBoLogsHandler from "./handlers/VipSicBoLogsHandler";
// import VipSicBoTimeHandler from "./handlers/VipSicBoTimeHandler";
import VipSicBoConfigs from "./VipSicBoConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrab extends NewSocketGameBase {
    public readonly shakeThePlateTime = 33;

    @property(cc.Node)
    dice: cc.Node = null;

    @property(cc.SpriteFrame)
    characterIcons: cc.SpriteFrame[] = [];

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property(cc.Animation)
    openDiskAnimation: cc.Animation = null;

    @property(cc.Node)
    statsContainer: cc.Node = null;

    @property(cc.Prefab)
    statsPrefab: cc.Prefab = null;

    @property(cc.Animation)
    shakeAnimation: cc.Animation = null;

    @property(cc.AudioSource)
    shakeAudio: cc.AudioSource = null;

    @property(cc.Node)
    randomResult: cc.Node = null;

    @property(cc.Node)
    dice: cc.Node = null;

    constructor() {
        super();
        this.internalInit();
    }

    protected internalInit() {
        this.init("VipSicBo", new VipSicBoConfigs(), null, 1, games.VipSicBo.id);
        this.finishShowResult = false;
    }

    onLoad() {
        super.onLoad();
        this.shakeAnimation.node.active = false;
        this.animatedTime.setAnimatedY(30, -5);
    }

    initHandlers() {
        super.initHandlers();
    }

    // setResult() {
    //     if (this.currentDataLogs.length > 0) {
    //         const { result } = this.currentDataLogs[0];
    //         this.setDices(_.values(result));
    //     }
    // }

    // setDices(dices: number[]) {
    //     const optRandom = _.random(0, this.randomResult.children.length - 1);
    //     const randomOption = this.randomResult.children[optRandom];

    //     const resultText = [];

    //     dices.forEach((dice, index) => {
    //         this.dices[index].node.position = randomOption.children[index].position;
    //         this.dices[index].spriteFrame = this.characterIcons[dice];
    //         this.dices[index].node.active = true;
    //     });
    // }

    // resetDataAndUI() {
    //     super.resetDataAndUI();

    //     this.openDiskAnimation.node.active = false;
    // }



    onDataGameRoom(data) {
        if (data.history) {
            // this.historyComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }

    openGuide() {
    }

    openHistory() {
    }
}
