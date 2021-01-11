import GameUtils from "../../../common/GameUtils";
import GameIconMenu from "./GameIconMenu";
import configs from "./LobbyMenuConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CirleMenu extends GameIconMenu {
  getList() {
    return configs.miniList;
  }

  async addItem(id: number): Promise<cc.Node> {
    const prefab = await GameUtils.loadResource(`minipanel/games/${id}`);
    const node = cc.instantiate(prefab);
    node.scale = 0.68;
    this.content.addChild(node);

    const hoverScale = node.getComponent('hoverScale');
    if (hoverScale) {
      hoverScale.pressedScale = 0.72;
    }
    return node;
  }

  onInitialized() {
    const count = this.content.childrenCount;
    const radius = this.content.width * 0.33;
    const degree = 360 / count;
    this.content.children.forEach((child, index) => {
      const angle = degree * index;
      child.position = cc.v2(radius * Math.sin(cc.misc.degreesToRadians(angle)), radius * Math.cos(cc.misc.degreesToRadians(angle)));
    });
  }
}
