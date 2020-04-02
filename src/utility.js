import React, { Component } from 'react';
import { AsyncStorage, ToastAndroid, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { updateBasketCount } from './actions';

import DeviceInfo from "react-native-device-info";
import JalaliCalender from './utility/jalaliCalendar/jdate';
import { nodeApiServer } from './utility/consts';

export const dateFormat = {
    longFormat: 'dddd DD MMMM YYYY'
}
const
    mobileReg = /(0|\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/ig,
    englishRegex = '^[a-zA-Z0-9$@$!%*?&#^-_. +]+$',
    userNameRegex = /^[A-Za-z0-9_@#.]+$/,
    passwordRegex = /^[A-Za-z0-9!@#$%^&*)(_+\/{},+-]+$/,
    junkReg = /[^\d]/ig,
    persinNum = [/۰/gi, /۱/gi, /۲/gi, /۳/gi, /۴/gi, /۵/gi, /۶/gi, /۷/gi, /۸/gi, /۹/gi],
    num2en = function (str) {
        for (var i = 0; i < 10; i++) {
            str = str.replace(persinNum[i], i);
        }
        return str;
    };
export const convertMiladiToShamsi = (date, format) => {
    try {
        var getYear = date.split('T')[0].split('-');
        var getTime = date.split('T')[1].split('.')[0].split(':');
        const shamsiDate = new JalaliCalender(new Date(parseInt(getYear[0]), parseInt(getYear[1]) - 1, parseInt(getYear[2])));
        return shamsiDate.format(format) + ' ' + getTime[0] + ':' + getTime[1];
    }
    catch (e) {
        return 'error';
    }
}
export const backAndroid = (that) => {
    // if (that.props.routeList.length) {
    //     if (that.props.routeList[that.props.routeList.length - 2])
    //         Actions[(that.props.routeList[that.props.routeList.length - 2]).toString()]();
    //     else
    //         Actions[(that.props.routeList[that.props.routeList.length - 1]).toString()]();
    //     that.props.updateRouteList(null, true)
    //     return true
    // }
    // else
    //     BackHandler.exitApp()
}
export const consts = {
    userStorage: 'User',
    basketItemsStorage: 'basketItems',
    notificationsIdStorage: 'notificationsIDs',
    loginToken: 'loginData',
    userInitial: 'UserInitial',
    userChoosedSupplier: 'UserChoosedSupplier'
}
export const validateMobileNumber = (str) => {
    var mobiles = num2en(str + '').match(mobileReg) || [];
    mobiles.forEach(function (value, index, arr) {
        arr[index] = value.replace(junkReg, '');
        arr[index][0] === '0' || (arr[index] = '0' + arr[index]);
    });
    return mobiles;
};
export const validateEnglishCharacter = (param) => {
    return param.match(englishRegex)
}
export const userNameValidation = (param) => {
    return param.match(userNameRegex)
}
export const passwordValidation = (param) => {
    return param.match(passwordRegex)
}
export const clearBasket = (supplierId, isEmptyBasket) => {
    return new Promise((fullFill, eject) => {
        let basketItems = [];
        if (isEmptyBasket)
            AsyncStorage.setItem(consts.basketItemsStorage, JSON.stringify(basketItems)).then(d => {
                fullFill(basketItems);
            })
        else
            AsyncStorage.getItem(consts.basketItemsStorage).then(x => {
                basketItems = JSON.parse(x);
                basketItems = basketItems.filter(bskItem => bskItem.SupplierID != supplierId);
                AsyncStorage.setItem(consts.basketItemsStorage, JSON.stringify(basketItems)).then(d => {
                    fullFill(basketItems);
                })
            });
    });
}
export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export const numberValidation = (value) => {
    if (value)
        return value.replace(/[^\d]/g, '');
    else return ''
}
export const EmailValidation = (Value) => {
    let reg = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
    return reg.test(Value)
}
export const getCMS = (that, pageType) => {
    return new Promise((fullFill, eject) => {
        fetch(`${nodeApiServer}GetMobileAppCMS/${pageType}`)
            .then(res => {
                return res.json();
            }).then(data => {
                fullFill(data)
            })
    })


}
export const addToBasket = (basketItem, from, categoryCode, tag) => {
    return new Promise((fullFill, eject) => {
        AsyncStorage.getItem("BasketActiveDuration").then(duration => {
            if (!duration) {
                AsyncStorage.setItem("BasketActiveDuration", new Date());
            }
            AsyncStorage.getItem(consts.basketItemsStorage).then(basketStringify => {
                let basket = []
                if (basketStringify)
                    basket = JSON.parse(basketStringify)
                if (basket.filter(item => (item.ItemID == basketItem.ItemID + '-1') || (item.ItemID == basketItem.ItemID)).length) {
                    basket.map((item) => {
                        if (item.ItemID == basketItem.ItemID + '-1' || item.ItemID == basketItem.ItemID) {
                            item.Qty = parseInt(item.Qty) + 1;
                            item.TotalPrice = item.UnitOriginalPrice * item.Qty
                        }
                    });
                    AsyncStorage.setItem(consts.basketItemsStorage, JSON.stringify(basket)).then(res => {
                        ToastAndroid.show('یک عدد به محصول مورد نظر شما اضافه شد', ToastAndroid.SHORT)
                        fullFill(true)
                    })
                }
                else {
                    basket.push(basketItem)
                    AsyncStorage.setItem(consts.basketItemsStorage, JSON.stringify(basket)).then(res => {
                        ToastAndroid.show('محصول به سبد اضافه گردید', ToastAndroid.SHORT)
                        fullFill(true)
                    })
                }
            })
        })
    })
}

export const getBasketCount = () => {
    return new Promise((fullFill, eject) => {
        AsyncStorage.getItem(consts.basketItemsStorage).then(basketStringify => {
            if (basketStringify)
                fullFill(JSON.parse(basketStringify).length);
            else
                fullFill(0)
        })

    })
}
export const login = (username, password, captcha) => {
    return new Promise((fullFill, eject) => {
        appFetch(`https://www.cheegel.com/apis/api/user/Login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                myUser: {
                    UserName: username,
                    Password: password
                },
                Captcha: captcha,
                KeepMeSignIn: true
            })
        }).then((response) => {
            response.text().then(result => fullFill(JSON.parse(result)))
        })
    })
}
export const isUserLogin = () => {
    return new Promise((fullFill, reject) => {
        return appFetch(`http://www.cheegel.com/apis/api/user/isUserLogin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then(response => {
            response.text().then(result => fullFill(JSON.parse(result)))
        }).catch((error) => {
            console.warn('api error', error)
        })
    })
}
export const logOut = () => {
    return new Promise((fullFill, eject) => {
        appFetch(`https://www.cheegel.com/apis/api/user/Logout`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then(response => {
            response.text().then(result => {
                AsyncStorage.removeItem(consts.userStorage).then(() => {
                    AsyncStorage.removeItem(consts.notificationsIdStorage).then(() => {
                        fullFill(result)
                    })
                })
            })
        })
    })
}
export const getBasketCalatogs = (skip, take) => {
    return new Promise((fullFill, eject) => {
        fetch(`${nodeApiServer}getProductsFromChannel/@chidaily/${skip}/${take}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            }
        }).then(response => {
            response.text().then(response => {
                if (response.toString().indexOf('emptylist') == -1) {
                    let obj = JSON.parse(response)
                    let basketList = Object.keys(obj).map((x, i) => {
                        return ({
                            ...obj[x].filter(x => x.ProductType == 'Master')[0],
                            details: obj[x].filter(x => x.ProductType == 'Detail')
                        })
                    })
                    fullFill(basketList)
                }
                else
                    fullFill(false)
            })
        })
            .catch(err => eject(err))
    })

}
export const getMobileAppCategories = (that) => {
    return new Promise((fullFill, eject) => {
        appFetch(`http://www.cheegel.com:3004/api/GetMobileAppCategory`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then(response => {
            response.json().then(result => {
                that.props.updateCategoriesList(result);
                fullFill(result);
            })
        })
    })
}
export const isCaptchaRequired = () => {
    return new Promise((fullFill, eject) => {
        appFetch(`https://www.cheegel.com/apis/api/user/isCaptchaRequired`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then(response => {
            response.text().then(result => {
                fullFill(JSON.parse(result))
            })
        })
    })
}
export const getUserRolesByUserName = (username) => {
    return new Promise((fullFill, eject) => {
        appFetch(`http://www.cheegel.com:3004/api/getuserrolebyusername/${username}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then(response => response.text().then(result => fullFill(JSON.parse(result))))
    })
}
export const appFetch = (url, request) => {
    return new Promise((fullFill, eject) => {
        if (!request)
            request = { headers: {} };
        else if (!request.headers)
            request.headers = {};
        AsyncStorage.getItem(consts.userStorage).then(userobj => {
            AsyncStorage.getItem(consts.loginToken).then(token => {
                if (url.toLowerCase().substring(0, 5) == "https") {
                    request.headers["Sender"] = "mobile";
                    request.headers["Device-ID"] = DeviceInfo.getUniqueID().replace(/-/g, '');
                    if (userobj && token) {
                        let user = JSON.parse(userobj);
                        request.headers["Login-Token"] = token;
                        request.headers["Login-FullName"] = encodeURIComponent(user.FullName);
                    }
                }
                fetch(url, request).then((response) => {
                    let token = response.headers.get("Login-Token");
                    if (token) {
                        if (token.toLowerCase() != "nok")
                            AsyncStorage.setItem(consts.loginToken, token).then(() => {
                                fullFill(response);
                            })
                        else
                            AsyncStorage.removeItem(consts.loginToken).then(() => {
                                fullFill(response);
                            })
                    }
                    else
                        fullFill(response);
                })
            })
        })
    })
}
export const getUserContactInfo = () => {
    return new Promise((fullFill, eject) => {
        fetch(`https://www.cheegel.com/apis/api/user/GetUserContactByUserID`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            }
        }).then(response => response.text().then(result => fullFill(JSON.parse(result))))
    })
}
export const getCitiesList = () => {
    return new Promise((fullFill, eject) => {
        fetch('http://www.cheegel.com/backoffice/BScripts/socialChannelList.js').then(response => {
            response.text().then(x => {
                let cityList = JSON.parse(x.split('=')[1]).filter(function (element) { return element.ChannelName == '@chidaily' })[0].Cities;
                fullFill(cityList);
            });
        });
    });
}
export const getStoresList = (that, cityId) => {
    return new Promise((fullFill, eject) => {
        fetch('http://www.cheegel.com/apis/ChidailyStores/suppliersList.js')
            .then(response => response.text())
            .then(suppliersList => {
                suppliersList = stringToJSON(suppliersList)
                that.props.updateStoresList(suppliersList.filter(x => x.CityID == cityId));
                fullFill(suppliersList);
            });
    });
}
export const setUserStoreView = (supplierID, supplierFirstName, supplierLastName) => {
    AsyncStorage.getItem(consts.userChoosedSupplier).then(res => {
        if (res && res.length) {
            res = JSON.parse(res);
            if (res.filter(function (element) { return element.SupplierID == supplierID }).length == 0) {
                res.push({ "SupplierID": supplierID, "SupplierName": supplierFullName });
                AsyncStorage.setItem(consts.userChoosedSupplier, JSON.stringify(res));
            }
        }
        else {
            storesList.push({ "SupplierID": supplierID, "SupplierFirstName": supplierFirstName, "SupplierLastName": supplierLastName });
            AsyncStorage.setItem(consts.userChoosedSupplier, JSON.stringify(storesList));
        }
    });
}
export const getBasketItems = () => {
    return new Promise((fullFill, eject) => {
        let basketItems = {
            BasketItems: [],
            StoresList: []
        }
        AsyncStorage.getItem(consts.basketItemsStorage).then(x => {
            if (x && x.length) {
                basketItems.BasketItems = JSON.parse(x);
                basketItems.StoresList = basketItems.BasketItems.map(item => item.SupplierID).filter(distinct);
                fullFill(basketItems);
            }
            else
                fullFill(false);
        })
    });
}
export const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
}
export const stringToJSON = (str) => {
    return JSON.parse(JSON.stringify(eval("(" + str + ")")))
}