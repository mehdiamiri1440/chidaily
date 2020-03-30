import { Dimensions } from 'react-native'
import {
    UPDATE_BASKET_COUNT,
    SET_DARK_FOOTER,
    SET_FOOTER_VISIBILITY,
    UPDATE_USER,
    UPDATE_USER_LOGIN,
    UPDATE_DEVICE_DIMENSIONS,
    UPDATE_BASKET_CATALOG_LIST,
    UPDATE_ROUTE_LIST,
    UPDATE_PRODUCT_GALLERY,
    UPDATE_STORES_LIST,
    UPDATE_SUPPLIERID,
    UPDATE_CITYID,
    UPDATE_SHOW_TUTORIAL,
    UPDATE_CATEGORIES_LIST,
    UPDATE_CMS_LIST,
    SHOW_FOOTER
} from '../actions/types';

const INITIAL_STATE = {
    routeList: [],
    deviceDimensions: {
        ...Dimensions.get('window'),
        oriention: Dimensions.get('window').width > Dimensions.get('window').height ? 'horizontal' : 'vertical'
    },
    basketItemsCount: 0,
    showFooter: true,
    darkFooter: false,
    user: {},
    isUserLogin: false,
    appUpdateProgress: 0,
    basketCalatogList: [],
    productGallery: [],
    cmsList: [],
    storesList: [],
    supplierId: 0,
    cityId: 0,
    showFooter: true,
    showTutorial: false

}
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_BASKET_COUNT:
            return { ...state, basketItemsCount: action.payload }
        case SET_DARK_FOOTER:
            return { ...state, darkFooter: action.payload }
        case SET_FOOTER_VISIBILITY:
            return { ...state, showFooter: action.payload }
        case UPDATE_USER:
            return { ...state, user: action.payload }
        case UPDATE_USER_LOGIN:
            return { ...state, isUserLogin: action.payload }
        case UPDATE_DEVICE_DIMENSIONS:
            return { ...state, deviceDimentions: action.payload }
        case UPDATE_BASKET_CATALOG_LIST:
            return { ...state, basketCalatogList: action.payload }
        case UPDATE_ROUTE_LIST:
            let routeList = []
            if (!action.payload.backMode) {
                let routeName = action.payload.routeName.split('_')[1]
                if (routeName != state.routeList[state.routeList.length - 1]) {
                    routeList = [...state.routeList, routeName]
                }
            }
            else if (state.routeList.length) {
                state.routeList.splice(state.routeList.length - 1, 1)
                routeList = state.routeList
            }
            return {
                ...state,
                routeList
            }
        case UPDATE_PRODUCT_GALLERY:
            return {
                ...state,
                productGallery: action.payload.needRefreshList ? action.payload.productGallery : [...state.productGallery, ...action.payload.productGallery]
            }
        case UPDATE_STORES_LIST:
            return { ...state, storesList: action.payload }
        case UPDATE_SUPPLIERID:
            return { ...state, supplierId: action.payload }
        case UPDATE_CITYID:
            return { ...state, cityId: action.payload }
        case UPDATE_SHOW_TUTORIAL:
            return { ...state, showTutorial: action.payload }
        case UPDATE_CATEGORIES_LIST:
            return { ...state, categoriesList: action.payload }
        case UPDATE_CMS_LIST:
            return { ...state, cmsList: action.payload }
        case SHOW_FOOTER:
            return { ...state, showFooter: action.payload }
        default:
            return state;
    }

}