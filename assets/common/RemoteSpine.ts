import { SkeletonCache } from "../managers/GameUIManager";
import GameUtils from "./GameUtils";

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

    private cache: SkeletonCache;

    async init(cache: SkeletonCache) {
        this.cache = cache;
        this.spine = this.node.getComponent(sp.Skeleton);
        await this.loadResources();
    }

    async loadResources() {
        if (this.cache[this.id]) {
            this.spine.skeletonData = this.cache[this.id].skeletonData;
        } else {
            const spineRes = [];
            const versions = await GameUtils.getRemoteVersion(this.id);
            for (const ext of this.resourceExts) {
                try {
                    const resName = `${this.spineName}.${ext}?v=${versions?.icon}`;
                    const url = `${this.host}/${resName}`;
                    const data = await GameUtils.loadRemote(url);
                    if (data) {
                        spineRes.push(data);
                    }
                } catch (error) {}
            }
            const skeletonData = new sp.SkeletonData();
            skeletonData.skeletonJson = spineRes[SpineFile.Json].json;
            skeletonData.atlasText = spineRes[SpineFile.Atlas].text;
            skeletonData.textures = [spineRes[SpineFile.Texture]];
            skeletonData["textureNames"] = [`${this.spineName}.${this.resourceExts[SpineFile.Texture]}`];
            this.spine.skeletonData = skeletonData;
        }

        this.spine.premultipliedAlpha = this.premultipliedAlpha;
        this.spine.enableBatch = true;
        this.spine.defaultAnimation = this.animationName;
        this.spine.setAnimation(0, this.animationName, true);
    }
}
