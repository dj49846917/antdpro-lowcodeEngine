import { Constant } from '@/constant';
import { CommonResponseType } from '@/types/common';
import { Drequest } from '@/utils/request';
import { commonParams, commonParams2 } from '@/utils/utils';

export async function getUserInfo(options?: { [key: string]: any }) {
    return Drequest(`${Constant.API.LC_AUTH}login/currentUser`, {
        method: 'POST',
        body: JSON.stringify(options),
    });
}

export async function login(options?: { [key: string]: any }) {
    return Drequest(`${Constant.API.LC_AUTH}login/login`, {
        method: 'POST',
        body: JSON.stringify(commonParams(options)),
    });
}

export async function logout(options?: { [key: string]: any }) {
    return Drequest(`${Constant.API.LC_AUTH}login/loginOut`, {
        method: 'POST',
        body: JSON.stringify(options),
    });
}

const loginApi = {
    // 获取验证码
    getCode: (options: string): Promise<CommonResponseType> => {
        return Drequest(`${Constant.API.LC_AUTH}login/sendVerificationCode`, {
            method: 'POST',
            body: JSON.stringify(commonParams2(options)),
        });
    },
}
export default loginApi;