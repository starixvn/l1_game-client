const { ccclass, property } = cc._decorator;

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
        "straightUp": "Cược đơn",
        "split": "Cược đôi",
        "street": "Cược hàng",
        "triangle": "Cược bộ ba",
        "corner": "Cược góc",
        "fourNumbers": "Cược bộ bốn",
        "line": "Cược 2 hàng",
        "column": "Cược cột",
        "dozen": "Cược tá",
        "redBlack": "Đỏ/Đen",
        "oddEven": "Lẻ/Chẵn",
        "bigSmall": "Tài/Xỉu"
    };

    choiceNames = {
        "big": "Tài",
        "small": "Xỉu",
        "odd": "Lẻ",
        "even": "Chẵn",
        "red": "Đỏ",
        "black": "Đen",
        "dozen1": "Tá 1",
        "dozen2": "Tá 2",
        "dozen3": "Tá 3",
        "column1": "Cột 1",
        "column2": "Cột 2",
        "column3": "Cột 3",
    }

    updateContent(type: string, choice: string, amount: number) {
        this.type.string = this.betTypes[type];
        switch (type) {
            case "bigSmall":
            case "oddEven":
            case "redBlack":
                this.choice.string = this.choiceNames[choice];
                break;
            case "dozen":
            case "column":
                this.choice.string = this.choiceNames[type + choice];
                break;
            default:
                this.choice.string = choice;
        }

        this.amount.string = amount.toString();;
        this.height = this.node.height;
    }
}
