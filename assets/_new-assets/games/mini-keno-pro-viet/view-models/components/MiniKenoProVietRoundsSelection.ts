import MiniKenoProVietRoundItem from "./MiniKenoProVietRoundItem";

const { ccclass, property } = cc._decorator;

export interface MiniKenoProVietRound {
    id: string;
    time: string;
    hasBet: boolean;
}

@ccclass
export default class MiniKenoProVietRoundsSelection extends cc.Component {
    @property(cc.Node)
    layout: cc.Node = null;

    @property(cc.Node)
    roundItem: cc.Node = null;

    close() {
        this.node.active = false;
    }

    setData(rounds: MiniKenoProVietRound[]) {
        this.layout.destroyAllChildren();

        if (!rounds) {
            return;
        }


        rounds.forEach(round => {
            const roundItemNode = cc.instantiate(this.roundItem);
            const roundItem = roundItemNode.getComponent(MiniKenoProVietRoundItem);
            roundItemNode.active = true;
            roundItem.roundId.string = "#" + round.id;
            const dateTime = new Date(round.time);

            roundItem.roundTime.string = dateTime.getHours() + ":" + dateTime.getMinutes();
            roundItem.roundDate.string = dateTime.getDay() + "/" + dateTime.getMonth();

            this.layout.addChild(roundItemNode);
        })

        this.node.active = true;
    }
}
