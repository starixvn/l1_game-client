import JackpotPoolItem from "./JackpotPoolItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolInfoBase extends cc.Component {
    @property({ type: JackpotPoolItem })
    items: JackpotPoolItem[] = [];

    setData(data: any[]) {
        if (!this.items || data.length < this.items.length) {
            return;
        }

        const sort = [...data].sort((a, b) => +b.pool - +a.pool);
        this.items.forEach((item, index) => {
            const itemData = sort[index];
            item.setData(itemData.amount);
            item.node.name = `${itemData.pool}`;
        });
    }

    setHighlight(pool: number) {
        this.items.forEach((item) => item.setHighlight(pool === +item.node.name));
    }
}
