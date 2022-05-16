import GameBaseMd5Handler from "../../../_base/handlers/GameBaseMd5Handler";

export default class BaccaratMd5Handler extends GameBaseMd5Handler {
    private isFirstLoad: boolean;

    constructor(protected readonly main) {
        super(main);
        this.isFirstLoad = true;
    }

    handle(data: any): boolean {
        if (data.resultHash?.hashValue || this.isFirstLoad) {
            this.isFirstLoad = false;
            this.main.md5Component?.updateMD5String(data.resultHash);
        }

        return false;
    }
}
