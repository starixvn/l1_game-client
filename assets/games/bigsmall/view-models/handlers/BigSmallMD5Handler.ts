import GameBaseMd5Handler from "../../../_base/handlers/GameBaseMd5Handler";
import BigSmall from "../BigSmall";

export default class BigSmallMD5Handler extends GameBaseMd5Handler {
    constructor(protected readonly main: BigSmall) {
        super(main);
    }

    handle(data: any): boolean {
        if (!data.md5) {
            return false;
        }

        this.main.md5Comp.displayMd5Value(data.md5);

        return true;
    }
}
