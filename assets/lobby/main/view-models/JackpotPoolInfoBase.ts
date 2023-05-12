import JackpotPoolItem from "./JackpotPoolItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolInfoBase extends cc.Component {
    @property({ type: JackpotPoolItem })
    items: JackpotPoolItem[] = [];

    setData(data: any[]) {
        if (data.length < this.items.length) {
            return;
        }
        const sort = [...data].sort((a, b) => +b.pool - +a.pool);
        sort.forEach((itemData, index) => {
            const item = this.items[index];
            item.setData(itemData.amount);
            item.node.name = `${itemData.pool}`;
        });
    }

    setHighlight(pool: number) {
        this.items.forEach((item) => item.setHighlight(pool === +item.node.name));
    }
}
