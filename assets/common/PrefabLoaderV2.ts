const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabLoaderV2 extends cc.Component {
  @property(cc.Prefab)
  private prefab: cc.Prefab = null;

  @property([cc.Component.EventHandler])
  private initializationEventHandlers: cc.Component.EventHandler[] = [];

  private instance: cc.Node;

  protected onLoad() {
    this.instance = cc.instantiate(this.prefab);
  }

  protected start() {
    this.initialize();
  }

  private initialize() {
    if (this.prefab) {
      this.initializationEventHandlers.forEach((eventHandler) => eventHandler.emit([this.instance]));

      this.node.addChild(this.instance);
    }
  }
}
