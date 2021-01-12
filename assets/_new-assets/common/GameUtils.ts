import * as SabaConfigs from "../../_new-assets/SabaConfigs";
import * as helper from "./helpers/Helper";

export default class GameUtils {
    public static addFlyingText(parent: cc.Node, win: boolean, value: number, duration = 1, startY = 0, destY = 100) {
        const temp = new cc.Node().addComponent(cc.Label);
        temp.string = (win ? "+" : "-") + helper.numberWithCommas(value);
        temp.font = win ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;
        temp.lineHeight = 130;
        temp.fontSize = 30;
        temp.node.position = cc.v2(0, startY);
        parent.addChild(temp.node);
        temp.node.runAction(
            cc.sequence(
                cc.moveTo(duration, cc.v2(0, startY + destY)),
                cc.callFunc(function () {
                    this.node.destroy();
                }, temp)
            )
        );
        return temp.node;
    }

    public static getBetChoiceString(choice: string): string {
        const dict = {
            even: "CHẴN",
            odd: "LẺ",
            big: "TÀI",
            small: "XỈU",

            gold: "KIM",
            wood: "MỘC",
            water: "THỦY",
            fire: "HỎA",
            earth: "THỔ",

            dragon: "RỒNG",
            tiger: "HỔ",
            tie: "HÒA",
            red3: "3 ĐỎ",
            red4: "4 ĐỎ",
            white3: "1 ĐỎ",
            white4: "4 TRẮNG"
        };

        return dict[choice];
    }

    public static capitalizeWords(str: string) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    public static loadResource(path: string): Promise<cc.Prefab> {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(path, (err, prefab: cc.Prefab) => {
                resolve(prefab);
            });
        });
    }

    public static getChipValues(bet: number, options: number[]): any {
        let total = bet;
        const values = {};
        options.forEach((value) => {
            const count = Math.floor(total / value);
            values[value] = count;
            total = total % value;
        });
        return values;
    }

    public static openGame(gameId, miniPanel) {
        if (SabaConfigs.gameRoomNewSocketIds.includes(gameId)) {
            miniPanel.openNewGameSocket(null, gameId);
        } else if (SabaConfigs.gameRoomIds.includes(gameId)) {
            miniPanel.openGameRoom(null, gameId);
        } else if (SabaConfigs.gameMiniNewSocketIds.includes(gameId)) {
            miniPanel.openNewSocketMiniGame(null, gameId);
        } else {
            miniPanel.openGame(null, gameId);
        }
    }

    public static roundFixed(num: number, fixedNumber: number): number {
        const numToFixedDp = Number(num).toFixed(fixedNumber);
        return Number(numToFixedDp);
    }

    public static moveToOtherNode(node: cc.Node, destNode: cc.Node) {
        const position = destNode.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.v2(0, 0)));
        node.parent = destNode;
        node.position = position;
    }
}
