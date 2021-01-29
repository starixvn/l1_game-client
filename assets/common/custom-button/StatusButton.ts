const { ccclass, property } = cc._decorator;

@ccclass
export default class StatusButton extends cc.Button {
  @property(cc.Node)
  inActiveBackground: cc.Node = null;

  _updateState() {
    super._updateState();

    this.inActiveBackground.active = !this.interactable;
  }
}
