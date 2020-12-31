const { ccclass, property } = cc._decorator;
import * as _ from "lodash";
import { numberWithCommas } from "../../../common/helpers/Helper";
import { RouletteBetType } from "./Roulette";

@ccclass
export default class RouletteTicketDetailItem extends cc.Component {
    @property(cc.Label)
    type: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    height: number = null;

    betTypes = {
        straightUp: "Cược đơn",
        split: "Cược đôi",
        street: "Cược hàng",
        triangle: "Cược bộ ba",
        corner: "Cược góc",
        fourNumbers: "Cược bộ bốn",
        line: "Cược 2 hàng",
        column: "Cược cột",
        dozen: "Cược tá",
        redBlack: "Đỏ/Đen",
        oddEven: "Chẵn/Lẻ",
        bigSmall: "Tài/Xỉu"
    };

    choiceNames = {
        small: "1-18",
        big: "19-36",
        odd: "Lẻ",
        even: "Chẵn",
        red: "Đỏ",
        black: "Đen",
        dozen1: "1-12",
        dozen2: "13-24",
        dozen3: "25-36",
        column1: "Cột 1",
        column2: "Cột 2",
        column3: "Cột 3"
    };

    updateContent(type: string, choice: string, amount: number, isWinning: boolean) {
        this.type.string = this.betTypes[type];
        switch (type) {
            case RouletteBetType.BigSmall:
            case RouletteBetType.OddEven:
            case RouletteBetType.RedBlack:
                this.choice.string = this.choiceNames[choice];
                break;
            case RouletteBetType.Dozen:
            case RouletteBetType.Column:
                this.choice.string = this.choiceNames[type + choice];
                break;
            case RouletteBetType.Split:
            case RouletteBetType.Street:
            case RouletteBetType.Triangle:
            case RouletteBetType.Corner:
            case RouletteBetType.FourNumbers:
                const list = _.split(choice, "-");
                this.choice.string = _.join(list, ", ");
                break;
            case RouletteBetType.Line:
                const array = _.split(choice, "-");
                const firstArray = _.slice(array, 0, 3);
                const secondArray = _.slice(array, 3, 6);
                this.choice.string = `${_.join(firstArray, ", ")}\n${_.join(secondArray, ", ")}`;
                this.node.height = 48;
                break;
            default:
                this.choice.string = choice;
        }

        this.choice.node.color = isWinning ? cc.Color.YELLOW : cc.Color.WHITE;
        this.amount.string = numberWithCommas(amount);
        this.amount.node.color = isWinning ? cc.Color.YELLOW : cc.Color.WHITE;
        this.height = this.node.height;
    }
}
