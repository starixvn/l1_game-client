import DetailHistoryBoard from "../../_base/view-models/DetailHistoryBoard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratDetailHistoryBoard extends DetailHistoryBoard {
    public static readonly BANKER = 0;
    public static readonly PLAYER = 1;
    public static readonly BANKER_TIE = 2;
    public static readonly PLAYER_TIE = 3;


    protected compareResult(result: number, previousResult: any) {
        return result == previousResult
            || (result == BaccaratDetailHistoryBoard.BANKER_TIE && previousResult == BaccaratDetailHistoryBoard.BANKER)
            || (result == BaccaratDetailHistoryBoard.BANKER && previousResult == BaccaratDetailHistoryBoard.BANKER_TIE)
            || (result == BaccaratDetailHistoryBoard.PLAYER_TIE && previousResult == BaccaratDetailHistoryBoard.PLAYER)
            || (result == BaccaratDetailHistoryBoard.PLAYER && previousResult == BaccaratDetailHistoryBoard.PLAYER_TIE)
    }
}
