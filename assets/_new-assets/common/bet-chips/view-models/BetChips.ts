const { ccclass, property } = cc._decorator;

type OnChangedBet = (bet: string) => void;

@ccclass
export default class BetChips extends cc.Component {
    public onChanged: OnChangedBet = (bet) => { };

    public onClickBet(event) {
        var bet = event.target.name;
        this.updateSelectedBet(bet);
        this.onChanged(bet);
    }

    public setCurrentBet(bet: string) {
        this.updateSelectedBet(bet);
    }

    private updateSelectedBet(targetName: string) {
        this.node.children.map(function (obj) {
            if (obj.name == targetName) {
                obj.children[0].active = true;
                obj.zIndex = 2;
                cc.tween(obj)
                    .to(0.2, {
                        scale: 1.15,
                        position: cc.v2(obj.position.x, 12)
                    })
                    .start();
            } else {
                obj.children[0].active = false;
                obj.zIndex = 1;
                cc.tween(obj)
                    .to(0.2, {
                        scale: 1,
                        position: cc.v2(obj.position.x, 0)
                    })
                    .start();
            }
        })
    }
}
