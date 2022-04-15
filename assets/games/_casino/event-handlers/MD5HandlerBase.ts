import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";

export type MD5<Choices> = {
    md5: {
        key: any;
    };
};

export default class MD5HandlerBase<Choices> extends BaseEventHandler<MD5<Choices>, Choices> {
    protected verifyEvent(event: MD5<Choices>) {
        return !!event.md5;
    }

    protected handle(event: MD5<Choices>) {
        !!event.md5.key && this.gameData.md5Data.change(event.md5.key);
    }
}
