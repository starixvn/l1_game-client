const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomDisplayToggle extends cc.Toggle {
  @property(cc.Node)
  disabledDisplayNode: cc.Node = null;

  _updateState() {
    super._updateState();
    this.disabledDisplayNode.active = !this.interactable;
  }
}
