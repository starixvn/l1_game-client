import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";

const { ccclass, property } = cc._decorator;

export interface SymbolPreviewType {
    symbol?: number;
    spine: sp.SkeletonData;
    odds: any;
    colorList: [string, string];
    borderColor: string;
    coinValue?: number;
    betLevel?: number;
    freespin?: any;
    gameId: number;
}
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

    @property(cc.Node)
    textImages: cc.Node = null;

    gameId: number;

    onLoad() {
        const events = [
            InternalEvents.CLICK_AUTO_SPIN_BUTTON,
            InternalEvents.CLICK_LINE_SELECTION_BUTTON,
            InternalEvents.CLICK_SPIN_BUTTON,
            InternalEvents.CLICK_HAMBURGER_MENU,
            InternalEvents.CLICK_OUTSIDE_REEL_AREA,
            InternalEvents.CASCADING_CLICK_CHANGE_MODE
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

    showSymbolText(symbolNumber: number, textColor: string) {
        const showText = symbolNumber === 7 || symbolNumber === 8;
        const atlas = uiManager.prefabCache.gameAtlas[this.gameId];

        if (!showText) {
            return;
        }
        let symbolName = "";
        if (symbolNumber === 7) {
            symbolName = "freespins";
        }

        if (symbolNumber === 8) {
            symbolName = "bonus";
        }

        this.textImages.children.forEach((node) => {
            const nodeImage = node.getComponent(cc.Sprite);

            nodeImage.spriteFrame = atlas.getSpriteFrame(`text-symbol-${symbolName}`);
            nodeImage.node.color = cc.Color.WHITE.fromHEX(textColor);
        });
    }

    setInfo(info: SymbolPreviewType) {
        this.icon.skeletonData = info.spine;
        this.icon.setAnimation(0, "highlight", false);
        this.border.color = cc.Color.WHITE.fromHEX(info.borderColor);
        const keys = Object.keys(info.odds);
        this.textImages.active = false;
        this.gameId = info.gameId;

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
        this.checkShowSpecialSymbol(info);
    }

    checkShowSpecialSymbol(info) {
        if (info.symbol.index === 7 || info.symbol.index === 8) {
            this.textImages.active = true;
            this.showSymbolText(info.symbol.index, info.colorList[1]);
        }
    }
}
