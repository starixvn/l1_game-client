import * as i18n from "i18n/runtime-scripts/LanguageData";

import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "./../../../common/helpers/NumberHelper";
import AHCLTicketDetailItem from "./AHCLTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AHCLTicketDetail extends cc.Component {
    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    @property(cc.Node)
    resultBoard: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    AHCLAtlas: cc.SpriteAtlas = null;

    onLoad() {
        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    initResultBoard(board) {
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 5; column++) {
                const node = new cc.Node();
                node.scale = 0.8;
                node.addComponent(cc.Sprite).spriteFrame = this.setSymbolFrame(board[row + column * 3]);
                this.resultBoard.addChild(node);
            }
        }
    }

    createBetLogs(data) {
        const { paylines, settlementResult, bet } = data;
        let order = 1;
        const winningLines = [];
        const winningArray = [];

        settlementResult.winningPaylines.forEach((winingLine) => {
            if (paylines.includes(winingLine.payline)) {
                winningLines.push(winingLine);
                winningArray.push(winingLine.payline);
            }
        });

        const failureLine = [];

        paylines.forEach((line) => {
            if (!winningArray.includes(line) && (!settlementResult.jackpot || line !== settlementResult.jackpot.winningLine)) {
                failureLine.push(line);
            }
        });

        winningLines.forEach((line) => {
            this.creatLogItem(
                order,
                this.getSpriteLine(line.payline),
                this.setSymbolFrame(+line.symbol),
                line.count,
                line.odds,
                bet,
                `${bet * line.odds}`
            );
            order++;
        });

        if (settlementResult.bonus.odds > 0) {
            const bonus = settlementResult.bonus;
            this.creatLogItem(
                order,
                null,
                this.AHCLAtlas.getSpriteFrame(`item8`),
                bonus.count,
                `${bonus.odds} Bonus`,
                "",
                bonus.winningAmount
            );
            order++;
        }

        if (settlementResult.freeSpins.odds > 0) {
            const freeSpins = settlementResult.freeSpins;

            this.creatLogItem(order, null, this.AHCLAtlas.getSpriteFrame(`item7`), freeSpins.count, `${freeSpins.odds} Free Spins`, "", "");
            order++;
        }

        failureLine.forEach((line) => {
            this.creatLogItem(order, this.getSpriteLine(line), null, "", "", bet, "0");
            order++;
        });

        const layout = this.content.getComponent(cc.Layout);
        layout.updateLayout();
        layout.enabled = false;

        this.content.children.forEach((child) => {
            const item = child.getComponent(AHCLTicketDetailItem);
            GameUtils.moveToOtherNode(item.order.node, this.content);
            GameUtils.moveToOtherNode(item.amount.node, this.content);
            GameUtils.moveToOtherNode(item.payout.node, this.content);
            GameUtils.moveToOtherNode(item.bet.node, this.content);
            GameUtils.moveToOtherNode(item.win.node, this.content);
        });
    }

    getSpriteLine(line: number): cc.SpriteFrame {
        return this.AHCLAtlas.getSpriteFrame(`dong${line + 1}`);
    }

    creatLogItem(
        order: number,
        paylineSprite: cc.SpriteFrame,
        symbolsSprite: cc.SpriteFrame,
        amount: string,
        payout: string,
        bet: string,
        win: string
    ) {
        const item = cc.instantiate(this.itemPrefab);
        const ticketDetail = item.getComponent(AHCLTicketDetailItem);

        ticketDetail.order.string = order.toString();
        ticketDetail.payline.spriteFrame = paylineSprite;
        ticketDetail.symbol.spriteFrame = symbolsSprite;
        ticketDetail.amount.string = amount;
        ticketDetail.payout.string = payout;
        ticketDetail.bet.string = bet !== "" ? numberWithCommas(bet, 1) : "";
        ticketDetail.win.string = win !== "" ? numberWithCommas(win) : "";
        ticketDetail.backhground.active = (order - 1) % 2 > 0;
        this.content.addChild(item);
    }

    setSymbolFrame(symbolNumber: number) {
        return this.AHCLAtlas.getSpriteFrame(`item${symbolNumber}`);
    }
}
