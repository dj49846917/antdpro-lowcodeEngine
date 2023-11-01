/**
 * 
 * @param key            就是key
 * @param value          就是value
 * @param time:number    以毫秒的形式设置过期时间         ===》3000  
 * @param time:string    以时间字符的形式设置过期时间    ===》Sat, 13 Mar 2017 12:25:57 GMT  
 * @param time:Date      以Date设置过期时间             ===》new Date(2017, 03, 12)
 * 
 * @param defaultTime     如果没有时间参数，设置默认过期时间 单位毫秒 默认设置1个小时
 */

export default class Cookie {
  private static defaultTime = 3600000

  //name表示cookie名，val表示cookie值，n表示n天后过期
  static set(key: string, value: string, time?: number | Date) {
    let invalid = new Date();;
    if (time) {
      switch (typeof time) {
        case 'number':
          invalid.setTime(invalid.getTime() + time)
          break;
        default:
          invalid = time
      }
    } else {
      invalid.setTime(invalid.getTime() + Cookie.defaultTime)
    }
    //字符串拼接cookie
    window.document.cookie = key + "=" + value + ";path=/;expires=" + invalid.toUTCString();
  };

  static get(name: string) {
    let strCookie = document.cookie;
    let arrCookie = strCookie.split("; ");
    let flag = false
    for (let i = 0; i < arrCookie.length; i++) {
      let arr = arrCookie[i].split("=");
      if (arr[0] == name) {
        flag = true
        return unescape(arr[1]);
      }
    }
    return ''
  }

  static remove(key: string): void {
    let cookie: string = Cookie.get(key);
    Cookie.set(key, cookie, -1)
  }
}