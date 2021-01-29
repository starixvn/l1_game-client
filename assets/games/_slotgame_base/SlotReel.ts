import { SlotGameBaseConfigs } from "./SlotGameBaseConfigs";
import SlotReelItem from "./SlotReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotReel extends cc.Component {
  @property
  itemCount = 18;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property
  itemDisplayCount = 3;

  items: SlotReelItem[] = [];

  public slotGameConfig: SlotGameBaseConfigs;

  public get itemTypeCount() {
    return this.items[0].itemPrefabs.length || 0;
  }

  protected readonly spinDuration = 1;

  onLoad() {
    this.createReel();
  }

  createReel() {
    for (let i = 0; i < this.itemCount; i++) {
      const node = cc.instantiate(this.itemPrefab);
      this.node.addChild(node);
      const item = node.getComponent(SlotReelItem);
      this.items.push(item);
      const random = Math.floor(Math.random() * this.itemTypeCount);
      item.setItem(random);
    }
  }

  setReelData(items: number[]) {
    items.forEach((row, index) => {
      const cloneIndex = this.itemCount + index - this.itemDisplayCount;
      this.items[index].setItem(row);
      this.items[cloneIndex].setItem(row);
    });
  }

  spin() {
    const boardHeight = this.node.parent.height;
    const moving = cc.moveTo(this.spinDuration, cc.v2(this.node.x, -(this.node.height - boardHeight))).easing(cc.easeInOut(3));
    this.node.runAction(
      cc.sequence(
        moving,
        cc.callFunc(() => this.onSpinFinish())
      )
    );
  }

  stop() {
    this.node.stopAllActions();
    this.onSpinFinish();
  }

  onSpinFinish() {
    for (let i = 0; i < this.itemDisplayCount; i++) {
      const index = this.itemCount - 1 - i;
      const copyIndex = this.itemDisplayCount - 1 - i;
      this.items[index].setItem(this.items[copyIndex].index);
    }
    this.node.y = 0;
  }

  showWinningEffect(position: number, symbol: number) {
    const item = this.items[this.itemCount + position - this.itemDisplayCount];
    const itemCopy = this.items[position];
    const highlight = item.index === symbol || item.index === this.slotGameConfig.wildSymbol;
    item.showWinningEffect(highlight);
    itemCopy.showWinningEffect(highlight);
  }

  hideWinningEffect() {
    this.items.forEach((item) => item.showWinningEffect(false));
  }

  showHighlightSpecialSymbols(symbol: number) {
    for (let i = 0; i < this.itemDisplayCount; i++) {
      const item = this.items[this.itemCount - 1 - i];
      if (item.index === symbol) {
        item.showWinningEffect(true);
        break;
      }
    }
  }
}
