import MainGame from "./MainGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotNavigation extends cc.Component {
    @property(cc.Toggle)
    adsToggle: cc.Toggle = null;

    @property(cc.Toggle)
    jackpotToggle: cc.Toggle = null;

    mainGame: MainGame;

    public onInit(main: MainGame): void {
        this.mainGame = main;
    }

    onBannerTypeChanged(e, param) {
        const type = +param;
        const showJackpot = type === 1;
        this.mainGame.switchBanner(showJackpot, true);
    }
}
