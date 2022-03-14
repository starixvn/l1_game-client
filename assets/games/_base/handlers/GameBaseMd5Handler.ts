import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseMd5Handler implements DataHandler {
    constructor(protected readonly main: GameBase) {}

    handle(data: any): boolean {
        if (!data.md5) {
            return false;
        }

        this.main.md5Base.setMD5String(data.md5);

        return true;
    }
}
