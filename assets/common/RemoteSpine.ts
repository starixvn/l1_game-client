import GameUtils from "./GameUtils";
import { uiManager } from "../managers/GameUIManager";

const { ccclass, property } = cc._decorator;

enum SpineFile {
    Atlas = 0,
    Json = 1,
    Texture = 2
}

@ccclass
export default class RemoteSpine extends cc.Component {
    @property
    public spineName = "icon-game";

    @property
    public animationName = "show";

    @property
    public host = "";
    public premultipliedAlpha = false;
    public id = -1;

    private spine: sp.Skeleton;

    readonly resourceExts = ["atlas", "json", "png"];

    async init() {
        this.spine = this.node.getComponent(sp.Skeleton);
        await this.loadResources();
    }

    async loadResources() {
        if (uiManager.remoteIconCache[this.id]) {
            this.spine.skeletonData = uiManager.remoteIconCache[this.id].skeletonData;
            this.spine.premultipliedAlpha = this.premultipliedAlpha;
            this.spine.enableBatch = true;
            this.spine.defaultAnimation = this.animationName;
            this.spine.setAnimation(0, this.animationName, true);
        }
    }
}
