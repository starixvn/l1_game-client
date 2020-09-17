import * as helper from "./helpers/Helper";

export default class GameUtils {
    public static addFlyingText(parent: cc.Node, win: boolean, value: number, duration: number = 1, startY: number = 0, destY: number = 100) {
        var temp = new cc.Node().addComponent(cc.Label);
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
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }

    public static loadResource(path: string): Promise<cc.Prefab> {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(path, (err, prefab: cc.Prefab) => {
                resolve(prefab);
            });
        })
    }
}
