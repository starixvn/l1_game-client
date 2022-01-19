import { EventEmitter } from "events";

export class HoldemPockerMD5Model extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "md5:change"
    };

    md5: any;
    md5CopyString: string = null;

    change(data: any) {
        this.md5 = data;
        this.md5CopyString = typeof data === "string" ? data : data.rawValue || this.md5;
        this.emit(HoldemPockerMD5Model.Events.CHANGE, this);
    }
}
