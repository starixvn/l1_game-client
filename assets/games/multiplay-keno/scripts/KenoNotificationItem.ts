const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class KenoNotificationItem extends cc.Component {
    abstract setData(data: any);
}
