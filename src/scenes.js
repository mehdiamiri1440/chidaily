import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { Scene, Stack, ActionConst, Actions } from 'react-native-router-flux';
import { Icon } from 'native-base';

//pages
import Agents from './components/pages/Agents'
import Postman from './components/pages/Postman'
import ItemDetails from './components/pages/ItemDetails';
import Basket from './components/pages/Basket'
import Profile from './components/pages/Profile'
import BasketPurchaseResult from './components/pages/BasketPurchaseResult';
import BuyItNow from './components/pages/BuyItNow';
import Product from './components/pages/Product';
import Category from './components/pages/Category';
import Login from './components/pages/Login';
import ProductGallery from './components/pages/ProductGallery';
import SignUp from './components/pages/SignUp';
import SplashScreen from './components/pages/SplashScreen'
import ContactUs from './components/pages/ContactUs'
import AboutUs from './components/pages/AboutUs'
import Stores from './components/pages/Stores'
import BankPayment from './components/pages/BankPayment'
import CMS from './components/pages/CMS'
import AdvertimentCMS from './components/pages/AdvertimentCMS'
import Introduction from './components/pages/Introduction'
//components
import Header from './components/common/Header';
import Menu from './components/common/Menu';
import ShowDetail from './components/pages/ShowDetail';
import styles, { colors, fonts } from './styles';
import UserBaskets from './components/pages/UserBaskets';
import IntroducerInfo from './components/pages/IntroducerInfo';
import RegisterUserAccountInfo from './components/pages/RegisterUserAccountInfo';
import RegisterMarketerQuota from './components/pages/RegisterMarketerQuota';
import ViewQoutaDetails from './components/pages/ViewQoutaDetails';
import RedirectionHandler from './components/pages/RedirectionHandler';
const headerMenuDarkMode = (<Icon name='menu' style={{ color: '#e5e3e9', fontSize: 40 }} />)
const headerMenu = (<Icon name='menu' style={{ color: colors.secondaryText, fontSize: 40 }} />)
const navigationBarStyle = { backgroundColor: colors.purple, borderBottomColor: colors.purple }

export default scenes = Actions.create(
    <Stack key="root">

        {/* <Scene key="splashScreen"
            component={SplashScreen}
            hideNavBar
        />
        <Scene key="introduction"
            component={Introduction}
            hideNavBar
        /> */}
        <Scene
            drawer
            key="menu"
            contentComponent={Menu}
            drawerWidth={Dimensions.get('window').width * 0.7}
            drawerPosition="right"
            navTransparent={1}
        >
            <Scene key="advertimentCMS"
                component={AdvertimentCMS}
                drawerIcon={headerMenu}
                renderTitle={<Header title='پیشنهاد های چی دیلی' />}
            />
            <Scene key="aboutUs"
                component={AboutUs}
                drawerIcon={headerMenu}
                renderTitle={<Header title='درباره ما' />}
            />
            {/* <Scene key="cms"
                component={CMS}
                drawerIcon={headerMenu}
                renderTitle={<Header title='چی دیلی' />}
            /> */}
            <Scene key="contactUs"
                component={ContactUs}
                drawerIcon={headerMenu}
                renderTitle={<Header title='تماس با ما' />}
            />
            <Scene key="product"
                component={Product}
                drawerIcon={headerMenu}
                renderTitle={<Header title='پیشنهادهای چی دیلی' />}
            />
            {/* <Scene key="category"
                component={Category}
                navigationBarStyle={navigationBarStyle}
                drawerIcon={headerMenuDarkMode}
                renderTitle={<Header dark title='گروه کالاها' />}
            /> */}
            {/* <Scene key="productGallery"
                component={ProductGallery}
                drawerIcon={headerMenu}
                renderTitle={<Header title='محصولات' />}
            /> */}
            <Scene key="buyItNow"
                component={BuyItNow}
                drawerIcon={headerMenu}
                renderTitle={<Header title='ثبت سفارش' />}
            />
            <Scene key="itemDetails"
                component={ItemDetails}
                renderTitle={<Header title='جزییات محصول' />}
                drawerIcon={headerMenu}
            />
            <Scene key="agents"
                component={Agents}
                renderTitle={<Header title='وظایف من' />}
                drawerIcon={headerMenu}

            />
            <Scene key="basket"
                component={Basket}
                renderTitle={<Header title='سبد من' />}
                drawerIcon={headerMenu}
            />
            <Scene key="postman"
                component={Postman}
                renderTitle={<Header title='وظایف من' />}
                drawerIcon={headerMenu}
            />
            {/* <Scene key="login"
                component={Login}
                navigationBarStyle={navigationBarStyle}
                drawerIcon={headerMenuDarkMode}
            /> */}

            {/* <Scene key="signUp"
                component={SignUp}
                renderTitle={<Header dark title='ثبت نام' />}
                navigationBarStyle={navigationBarStyle}
                drawerIcon={headerMenuDarkMode}
            /> */}
            <Scene key="showDetail"
                component={ShowDetail}
                renderTitle={<Header title='نمایش جزییات' />}
                drawerIcon={headerMenu}
            />
            <Scene key="basketPurchaseResult"
                component={BasketPurchaseResult}
                direction="vertical"
                hideNavBar
            />
            {/* <Scene key="profile"
                component={Profile}
                renderTitle={<Header dark title='حساب کاربری' />}
                navigationBarStyle={navigationBarStyle}
                drawerIcon={headerMenuDarkMode}
            /> */}
            <Scene key="stores"
                component={Stores}
                drawerIcon={headerMenu}
                renderTitle={<Header title='فروشگاه ها' />}
            />
            <Scene key="basketpayment"
                component={BankPayment}
            />
            <Scene key="userbasket"
                component={UserBaskets}
                drawerIcon={headerMenu}
                renderTitle={<Header title='سبد های من' />}
            />
            <Scene key="introducerInfo"
                component={IntroducerInfo}
                drawerIcon={headerMenu}
                renderTitle={<Header title='اطلاعات معرف' />}
            />
            <Scene key="registerUserAccountInfo"
                component={RegisterUserAccountInfo}
                drawerIcon={headerMenu}
                renderTitle={<Header title='ثبت اطلاعات حساب' />}
            />
            <Scene key="registerMarketerQuota"
                component={RegisterMarketerQuota}
                drawerIcon={headerMenu}
                renderTitle={<Header title='ثبت درخواست برداشت' />}
            />
            <Scene key="viewQoutaDetails"
                component={ViewQoutaDetails}
                drawerIcon={headerMenu}
                renderTitle={<Header title='جزییات درآمد از چی دیلی' />}
            />
            <Scene key="redirectionHandler"
                component={RedirectionHandler}
                hideNavBar
            />
        </Scene>

    </Stack>
);