import { BundleManager } from "bundle-management";

import GameUtils from "../../common/GameUtils";
import SlotGameTicketDetail from "./SlotGameTicketDetail";
import SlotGameTicketDetailItem from "./SlotGameTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGameTicketDetail extends SlotGameTicketDetail {
    @property({ type: cc.SpriteAtlas, override: true, visible: false })
    mainAtlas: cc.SpriteAtlas = null;

    private paylinesAtlas: cc.SpriteAtlas;
    gameId: number;

    async loadPaylineAtlas() {
        const path = `shared/slot-game/textures/shared-standard-slot`;
        try {
            this.paylinesAtlas = await new Promise((resolve) => {
                cc.resources.load<cc.SpriteAtlas>(path, cc.SpriteAtlas, (err, atlas) => {
                    if (err) {
                        console.log("aaaaaa");
                        return;
                    }
                    resolve(atlas);
                });
            });
        } catch (e) {
            console.warn(`Missing Payline spriteAtlas for ${path} `, e);
        }
    }

    async loadSymbolsAtlas() {
        const path = `resources/textures/standard-slot-game`;
        const devPath = `../games/*/${path}`;
        try {
            const spriteAtlas = await BundleManager.getInstance().loadAsset<cc.SpriteAtlas>({
                bundleId: this.gameId.toString(),
                path: path,
                pathForDevMode: devPath,
                type: cc.SpriteAtlas
            });
            this.mainAtlas = spriteAtlas;
        } catch (e) {
            console.warn(`Missing Symbols spriteAtlas for ${path} `, e);
        }
    }

    protected getSpriteLine(line: number): cc.SpriteFrame {
        return this.paylinesAtlas.getSpriteFrame(`line-selection-${line + 1}`);
    }

    protected setSymbolFrame(symbolNumber: number) {
        return this.mainAtlas.getSpriteFrame(`symbol-${symbolNumber}`);
    }

    enhancePerformanceLoadLabels() {
        this.content.children.forEach((child) => {
            const item = child.getComponent(SlotGameTicketDetailItem);
            const tempNode = new cc.Node();
            tempNode.position = child.position;
            this.content.addChild(tempNode);

            GameUtils.moveToOtherNode(item.order.node, tempNode);
            GameUtils.moveToOtherNode(item.amount.node, tempNode);
            GameUtils.moveToOtherNode(item.payout.node, tempNode);
            GameUtils.moveToOtherNode(item.bet.node, tempNode);
            GameUtils.moveToOtherNode(item.win.node, tempNode);

            // fix error related convertToNodeSpaceAR
            item.order.node.position = cc.v3(item.order.node.x, 0);
            item.amount.node.position = cc.v3(item.amount.node.x, 0);
            item.payout.node.position = cc.v3(item.payout.node.x, 0);
            item.bet.node.position = cc.v3(item.bet.node.x, 0);
            item.win.node.position = cc.v3(item.win.node.x, 0);
        });
    }
}
