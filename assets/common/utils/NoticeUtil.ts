const i18n = require("LanguageData");
import ErrorCodeDictionary from "./ErrorCodeDictionary";
import { getLocale } from "../../common/auth/SessionManager";

export default class NoticeUtil {
    public static getLocalizedErrorMessage(errorCode: string, opt: any) {
        if (!ErrorCodeDictionary[errorCode]) {
            console.error(`not found error code ${errorCode}`);
            return "";
        }
        const key = `messages.${ErrorCodeDictionary[errorCode]}`;
        return i18n.t(key, opt);
    }

    public static getMessageByLocale(data: any): string {
        const locale = getLocale();
        return data[locale];
    }
}
