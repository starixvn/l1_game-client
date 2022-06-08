const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabLoaderV2 extends cc.Component {
    @property(cc.Prefab)
    public prefab: cc.Prefab = null;

    @property([cc.Component.EventHandler])
    private readonly initializationEventHandlers: cc.Component.EventHandler[] = [];

    public instance: cc.Node;

    protected onLoad() {
        this.instance = cc.instantiate(this.prefab);
    }

    protected start() {
        this.initialize();
    }

    private initialize() {
        if (this.instance) {
            this.initializationEventHandlers.forEach((eventHandler) => eventHandler.emit([this.instance]));

            this.node.addChild(this.instance);
        }
    }
}
