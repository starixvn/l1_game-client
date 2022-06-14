const { ccclass, property } = cc._decorator;

@ccclass
export class BlockchainBaccaratPrediction extends cc.Component {
    @property(cc.Node)
    banker: cc.Node = null;

    @property(cc.Node)
    player: cc.Node = null;

    private readonly itemKey = {
        bigEyeBoyItem: "bigEyeBoyItem",
        smallRoadItem: "smallRoadItem",
        cockroachPigItem: "cockroachPigItem"
    };

    private readonly itemValueKey = { red: "red", blue: "blue" };

    resetItem() {
        for (const childName in this.itemKey) {
            this.banker.getChildByName(childName).getChildByName(this.itemValueKey.red).active = false;
            this.banker.getChildByName(childName).getChildByName(this.itemValueKey.blue).active = false;
            this.player.getChildByName(childName).getChildByName(this.itemValueKey.red).active = false;
            this.player.getChildByName(childName).getChildByName(this.itemValueKey.blue).active = false;
        }
    }

    setBanker(data: boolean[]) {
        for (let index = 0; index < data.length; index++) {
            this.setData(data[index], index, this.banker);
        }
    }

    setPlayer(data: boolean[]) {
        for (let index = 0; index < data.length; index++) {
            this.setData(data[index], index, this.player);
        }
    }

    private setData(isRed: boolean | undefined, index: number, node: cc.Node) {
        if (isRed === undefined) {
            node.children[index].getChildByName(this.itemValueKey.red).active = false;
            node.children[index].getChildByName(this.itemValueKey.blue).active = false;
        } else {
            node.children[index].getChildByName(this.itemValueKey.red).active = isRed;
            node.children[index].getChildByName(this.itemValueKey.blue).active = !isRed;
        }
    }
}
