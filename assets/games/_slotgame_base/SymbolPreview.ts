import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SymbolPreview extends cc.Component {
    @property(sp.Skeleton)
    icon: sp.Skeleton = null;

    @property(cc.Node)
    infoNode: cc.Node = null;

    @property(cc.Node)
    border: cc.Node = null;

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    textImages: cc.Node = null;

    onLoad() {
        const events = [
            InternalEvents.CLICK_AUTO_SPIN_BUTTON,
            InternalEvents.CLICK_LINE_SELECTION_BUTTON,
            InternalEvents.CLICK_SPIN_BUTTON,
            InternalEvents.CLICK_HAMBURGER_MENU,
            InternalEvents.CLICK_OUTSIDE_REEL_AREA
        ];
        events.forEach((event) => {
            uiManager.emitterListener(event, this.hidePreview.bind(this), this);
        });
    }

    onDestroy() {
        uiManager.removeListenersWithTarget(this);
    }

    hidePreview() {
        this.node.parent.active = false;
        this.node.destroy();
    }

    showSymbolText(symbolNumber: number, textColor: string, isInfoOnLeft: boolean) {
        this.textImages.children.forEach((node) => {
            const nodeImage = node.getComponent(cc.Sprite);
            nodeImage.spriteFrame = this.atlas.getSpriteFrame(`text-symbol-${symbolNumber}`);
            nodeImage.node.color = cc.Color.WHITE.fromHEX(textColor);
        });

        if (symbolNumber == 7) {
            this.border.width = 410;
            this.bg.width = 422;
        }

        if (symbolNumber == 8) {
            this.border.width = 350;
            this.bg.width = 362;
        }

        if (isInfoOnLeft && symbolNumber == 7) {
            this.infoNode.position = cc.v3(-295, 0, 0);
        }

        if (isInfoOnLeft && symbolNumber == 8) {
            this.infoNode.position = cc.v3(-235, 0, 0);
        }

        const infoNodePositionX = this.infoNode.position.x;

        console.log(infoNodePositionX);
        const textImageNodePosition = infoNodePositionX + 70;
        this.textImages.position = cc.v3(textImageNodePosition, 0, 0);
    }

    setInfo(info: {
        symbol: number;
        spine: sp.SkeletonData;
        odds: any;
        colorList: [string, string];
        borderColor: string;
        isInfoOnLeft: boolean;
    }) {
        this.icon.skeletonData = info.spine;
        this.icon.setAnimation(0, "highlight", false);
        this.border.color = cc.Color.WHITE.fromHEX(info.borderColor);
        const keys = Object.keys(info.odds);

        this.infoNode.children.forEach((node, index) => {
            const key = keys[index];
            const show = index < keys.length && info.odds[key] > 0;

            node.active = show;

            if (!show) {
                return;
            }
            const values = [key, info.odds[key]];
            node.children.forEach((child, childIndex) => {
                child.getComponent(cc.Label).string = values[childIndex];
                child.color = cc.Color.WHITE.fromHEX(info.colorList[childIndex]);
            });
        });

        if (info.symbol == 7 || info.symbol == 8) {
            this.textImages.active = true;
            this.showSymbolText(info.symbol, info.colorList[1], info.isInfoOnLeft);
        }
    }
}
