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

    private spine: sp.Skeleton;

    readonly resourceExts = ["atlas", "json", "png"];

    onLoad() {
        this.spine = this.node.getComponent(sp.Skeleton);
        this.loadResources();
    }

    async loadResources() {
        const spineRes = [];
        for (const ext of this.resourceExts) {
            try {
                const resName = `${this.spineName}.${ext}`;
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
        this.spine.premultipliedAlpha = this.premultipliedAlpha;
        this.spine.enableBatch = true;
        this.spine.setAnimation(0, this.animationName, true);
    }
}
