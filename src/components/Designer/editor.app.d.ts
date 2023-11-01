/** 独立类型文件，需要单独注入到编辑器中， 不能使用import方法 */
declare const self: {
    utils: utils,
};

interface Utils {
    jsSdkApi: any,
}
interface Constants {
    appId: string,
    userId: string
}

interface AppHelper {
    utils: Utils,
    constants: Constants,
}

declare const utils: Utils;
declare const appHelper: AppHelper