const { ccclass, property } = cc._decorator;
import { numberWithCommas } from "./../../../../common/helpers/Helper";
import { TAIXIU_HISTORIES_DETAIL } from "../../../../common/helpers/Message";
@ccclass
export default class MiniKenoGuide extends cc.Component {

    @property(cc.Node)
    sideBar: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property({ type: cc.Label })
    kenoProVietReplaceNodes: cc.Label[] = [];

    @property({ type: cc.Label })
    kenoMaxReplaceNodes: cc.Label[] = [];

    @property({ type: cc.Label })
    kenoMiniReplaceNodes: cc.Label[] = [];

    private kenoProVietGameName = "kenoProViet";
    private kenoMaxGameName = "kenoMax";
    private kenoMiniGameName = "kenoMini";
    private mainGameGuides = [this.kenoProVietGameName, this.kenoMaxGameName, this.kenoMiniGameName];

    private gameName = this.kenoProVietGameName;

    onLoad() {
        this.select(this.gameName);
    }

    receivedData(data) {
        if (data[this.gameName] && data[this.gameName].gameConfigs) {
            this.onData(data[this.gameName].gameConfigs);
        }
    }

    onData(data) {
        const { minbet, maxbet, odds, choices_maxbet } = data;
        const replaceData = {
            "_oddBig": odds.big,
            "_oddEven": odds.even,
            "_oddEarth": odds.earth,
            "_oddFire": odds.fire,
            "_oddWater": odds.water,
            "_oddGold": odds.gold,
            "_oddWood": odds.wood,
            "_minBet": numberWithCommas(minbet),
            "_maxBetBig": numberWithCommas(choices_maxbet.big),
            "_maxBetGold": numberWithCommas(choices_maxbet.gold),
            "_maxBetWood": numberWithCommas(choices_maxbet.wood),
            "_maxBetWater": numberWithCommas(choices_maxbet.water),
            "_maxBetFire": numberWithCommas(choices_maxbet.fire),
            "_maxBetEarth": numberWithCommas(choices_maxbet.earth),
            "_maxBetRound": numberWithCommas(maxbet)
        }

        switch (this.gameName) {
            case this.kenoProVietGameName:
                this.kenoProVietReplaceNodes.forEach(label => {
                    Object.keys(replaceData).forEach(key => {
                        label.string = label.string.replace(key, replaceData[key]);
                    });
                });
                break;
            case this.kenoMaxGameName:
                this.kenoMaxReplaceNodes.forEach(label => {
                    Object.keys(replaceData).forEach(key => {
                        label.string = label.string.replace(key, replaceData[key]);
                    });
                });
                break;
            case this.kenoMiniGameName:
                this.kenoMiniReplaceNodes.forEach(label => {
                    Object.keys(replaceData).forEach(key => {
                        label.string = label.string.replace(key, replaceData[key]);
                    });
                });
                break;
        }
    }

    isMainGameGuide(gameName) {
        return this.mainGameGuides.indexOf(gameName) > -1;
    }

    selectGame(event, game) {
        if (this.isMainGameGuide(this.gameName)) {
            cc.RedT.removeDataObserver(`${this.gameName}Guide}`);
        }
        this.gameName = game;
        this.select(game);
    }

    select(game: string) {
        if (this.isMainGameGuide(this.gameName)) {
            cc.RedT.addDataObserver(`${this.gameName}Guide}`, this.receivedData.bind(this));
            cc.RedT.send({ g: { [this.gameName]: { getGameConfigs: true } } });
        }

        cc.RedT.audio.playClick();
        var self = this;
        Promise.all(this.sideBar.children.map(function (obj) {
            if (obj.name == game) {
                obj.children[0].active = true;
                obj.pauseSystemEvents(true);
                self.title.string = obj.children[1].getComponent(cc.Label).string;
            } else {
                obj.children[0].active = false;
                obj.resumeSystemEvents(true);
            }
            return void 0;
        }));

        Promise.all(this.content.children.map(function (obj) {
            if (obj.name == game) {
                obj.active = true;
            } else {
                obj.active = false;
            }
            return void 0;
        }));
    }

    closeDialog() {
        this.node.active = false;
    }
}
