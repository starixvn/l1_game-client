import { reloadLanguageData } from "../../../../common/i18n/CustomLanguageData";

if (!window.i18n) window.i18n = {};
if (!window.i18n.languages) window.i18n.languages = {};
if (!window.i18n.languages.vi) window.i18n.languages.vi = {};

export const phrases = {
    treasureIsland: {
        tumpleWin: "Thắng\nNổ Sập",
        totalWin: "Thắng",
        turboMode: "Siêu Tốc",
        trialMode: "Chơi Thử",
        betMultiplierX: "Hệ Số Cược 20X",
        betLevel: "Mức Cược",
        coinValue: "Giá trị xu",
        congratulation: "Chúc Mừng",
        youWinFreeSpin: "Bạn đã thắng",
        multiplier: "Số Nhân",
        totalMultiplier: "Tổng Số Nhân",
        no: "Stt",
        resultBoard: "Bảng Kết Quả",
        symbolAndNumber: "Biếu Tượng Thắng",
        winAmount: "Tiền Thắng",
        trialModeText: "Bạn Đang Chơi Thử",
        freeSpin: "Free Spins",
        extraFreeSpin: "Free Spins Thêm",
        autoSpinLeft: "Lượt Quay Tự Động Còn Lại",
        bigWinTextNotify: "Bấm Vào Vị Trí Bất Kỳ Để Tiếp Tục",
        reachMaxWin: "Bạn Đã Đạt Mức Tiền Thắng Tối Đa",
        warningTrialMode: "Chơi Thật,\nThắng Thật"
    }
};

Object.assign(window.i18n.languages.vi, phrases);
reloadLanguageData();
