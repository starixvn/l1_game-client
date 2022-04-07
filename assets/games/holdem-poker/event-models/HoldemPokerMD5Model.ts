import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export class HoldemPokerMD5Model extends EventEmitterBase {
    static Events = {
        CHANGE: "md5:change"
    };

    md5: any;
    md5CopyString: string = null;

    change(data: any) {
        this.md5 = data;
        this.md5CopyString = typeof data === "string" ? data : data.rawValue || this.md5;
        this.emit(HoldemPokerMD5Model.Events.CHANGE, this);
    }
}
