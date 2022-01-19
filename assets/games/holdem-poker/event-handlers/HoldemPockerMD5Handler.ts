import HoldemPokerEventHandler from "./HoldemPokerEventHandler";

export type MD5<Choices> = {
    md5: {
        key: any;
    };
};

export default class HoldemPockerMD5Handler<Choices> extends HoldemPokerEventHandler<MD5<Choices>, Choices> {
    protected verifyEvent(event: MD5<Choices>) {
        return !!event.md5;
    }

    protected handle(event: MD5<Choices>) {
        !!event.md5.key && this.gameData.md5Model.change(event.md5.key);
    }
}
