import LineItem from "./LineItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LineSelectionDialog extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Node)
  itemSample: cc.Node = null;

  @property(cc.SpriteAtlas)
  atlas: cc.SpriteAtlas = null;

  @property(cc.Node)
  mainFrame: cc.Node = null;

  @property(cc.Button)
  confirmButton: cc.Button = null;

  private readonly items: LineItem[] = [];

  private timer = 0;

  onConfirmCallback = (betChoices: number[]) => {};

  onLoad() {
    for (let i = 0; i < 24; i++) {
      this.content.addChild(cc.instantiate(this.itemSample));
    }
    this.content.children.forEach((child, index) => {
      const item = child.getComponent(LineItem);
      const num = index + 1;
      item.icon.spriteFrame = this.atlas.getSpriteFrame(`dong${num}`);
      item.num.string = `${num}`;
      item.setChecked(false);
      this.items.push(item);
    });

    const commonDialog = this.mainFrame.getComponent('CommonDialog');
    commonDialog.onDidHide = () => {
      this.node.destroy();
    };
  }

  setCheckItems(items: number[]) {
    items.forEach((item) => {
      this.items[item].setChecked(true);
    });
  }

  onCloseDialog() {
    cc.RedT.audio.playClick();

    this.node.destroy();
  }

  selectAllEvenLine() {
    cc.RedT.audio.playClick();

    this.items.forEach((item, index) => {
      item.setChecked(index % 2 !== 0);
    });
  }

  selectAllOddLine() {
    cc.RedT.audio.playClick();

    this.items.forEach((item, index) => {
      item.setChecked(index % 2 === 0);
    });
  }

  selectAll() {
    cc.RedT.audio.playClick();

    this.items.forEach((item) => {
      item.setChecked(true);
    });
  }

  unSelectAll() {
    cc.RedT.audio.playClick();

    this.items.forEach((item) => {
      item.setChecked(false);
    });
  }

  onConfirmClick() {
    cc.RedT.audio.playClick();
    this.onConfirmCallback(this.getCurrentBetChoices());
    this.node.destroy();
  }

  getCurrentBetChoices(): number[] {
    const betChoices: number[] = [];
    this.items.forEach((item, index) => item.toggle.isChecked && betChoices.push(index));
    return betChoices;
  }

  update(dt: number) {
    this.timer++;
    if (this.timer > 20) {
      this.timer = 0;
      const betChoices = this.getCurrentBetChoices();
      this.confirmButton.interactable = betChoices.length > 0;
    }
  }
}
