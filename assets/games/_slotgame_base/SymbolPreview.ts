const { ccclass, property } = cc._decorator;

@ccclass
export default class SymbolPreview extends cc.Component {
    @property(sp.Skeleton)
    icon: sp.Skeleton = null;

    @property(cc.Node)
    infoNode: cc.Node = null;

    @property(cc.Node)
    border: cc.Node = null;

    setInfo(info: { spine: sp.SkeletonData; odds: any; colorList: [string, string]; borderColor: string }) {
        this.icon.skeletonData = info.spine;
        this.icon.setAnimation(0, "highlight", false);
        this.border.color = cc.Color.WHITE.fromHEX(info.borderColor);
        const keys = Object.keys(info.odds);
        this.infoNode.children.forEach((node, index) => {
            const key = keys[index];
            const show = index < keys.length && info.odds[key] > 0;
            node.active = show;

            if (!show) {
                return;
            }
            const values = [key, info.odds[key]];
            node.children.forEach((child, childIndex) => {
                child.getComponent(cc.Label).string = values[childIndex];
                child.color = cc.Color.WHITE.fromHEX(info.colorList[childIndex]);
            });
        });
    }
}
