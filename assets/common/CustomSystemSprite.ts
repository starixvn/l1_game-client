import { SystemType, isSabaPlay } from "../ISystem";
import { ComponentSystem, ICashSystem, ICreditSystem } from "../System";
import * as sessionManager from "../common/auth/SessionManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomSystemSprite extends ComponentSystem implements ICreditSystem, ICashSystem {
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property
    spriteName = "";

    env: string;

    customizeCredit(): void {
        this.env = SystemType.SC1;
    }
    customizeCash(): void {
        this.env = SystemType.SC2;
    }

    onLoad() {
        const operator = sessionManager.getOperator();
        this.env = isSabaPlay(operator || "") ? SystemType.SP : this.env;
        const component = this.node.getComponent(cc.Sprite);
        component.spriteFrame = this.atlas.getSpriteFrame(`${this.spriteName}-${this.env}`);
    }
}
