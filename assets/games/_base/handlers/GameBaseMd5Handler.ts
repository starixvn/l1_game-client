import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseMd5Handler implements DataHandler {
    constructor(protected readonly main: GameBase) {}

    handle(data: any) {
        if (data.md5 || data.resultHash) {
            this.main.md5Component && this.main.md5Component.updateMD5String(data.md5 || data.resultHash, this.main);
        }
    }
}
