import GameUtils from "../../../common/GameUtils";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameIconMenu extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  public miniPanel: MiniPanel;

  onLoad() {
    this.initItems();
  }

  getList() {
    return null;
  }

  async initItems() {
    const list = this.getList();
    for (const id of list) {
      const node = await this.addItem(id);
      node.on('click', () => this.itemPressed(id));
    }

    this.onInitialized();
  }

  onInitialized() {}

  async addItem(id: number): Promise<cc.Node> {
    return null;
  }

  itemPressed(id: number) {
    cc.RedT.audio.playClick();
    GameUtils.openGame(id, this.miniPanel);
  }
}
