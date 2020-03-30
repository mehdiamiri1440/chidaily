
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
} from './types'


export const updateBasketCount = (count) => ({
    type: UPDATE_BASKET_COUNT,
    payload: count
})
export const setDarkFooter = (dark) => ({
    type: SET_DARK_FOOTER,
    payload: dark
})
export const setFooterVisibility = (visible) => ({
    type: SET_FOOTER_VISIBILITY,
    payload: visible
})
export const updateUser = (user) => ({
    type: UPDATE_USER,
    payload: user
})
export const updateUserLogin = (status) => ({
    type: UPDATE_USER_LOGIN,
    payload: status
})
export const updateDeviceDimensions = (dimentions) => ({
    type: UPDATE_DEVICE_DIMENSIONS,
    payload: dimentions
})
export const updateBasketCatalogList = (basketList) => ({
    type: UPDATE_BASKET_CATALOG_LIST,
    payload: basketList
})
export const updateRouteList = (routeName, backMode) => ({
    type: UPDATE_ROUTE_LIST,
    payload: { routeName, backMode }
})
export const updateProductGallery = (productGallery, needRefreshList) => ({
    type: UPDATE_PRODUCT_GALLERY,
    payload: { productGallery, needRefreshList }
})
export const updateStoresList = (storesList) => ({
    type: UPDATE_STORES_LIST,
    payload: storesList
})
export const updateSupplierId = (supplierId) => ({
    type: UPDATE_SUPPLIERID,
    payload: supplierId
})
export const updateCityId = (cityId) => ({
    type: UPDATE_CITYID,
    payload: cityId
})
export const updateShowTutorial = (showTutorial) => ({
    type: UPDATE_SHOW_TUTORIAL,
    payload: showTutorial
})
export const updateCategoriesList = (categoriesList) => ({
    type: UPDATE_CATEGORIES_LIST,
    payload: categoriesList
})
export const updateCmsList = (cmsList) => ({
    type: UPDATE_CMS_LIST,
    payload: cmsList
})
export const showFooter = (visibility) => ({
    type: SHOW_FOOTER,
    payload: visibility
})