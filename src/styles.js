import { StyleSheet, Dimensions } from 'react-native'

export const fonts = {
    BYekan: 'byekan',
    shabnam: 'Shabnam',
    shabnamBold: 'Shabnam-Bold',
    shabnamLight: 'Shabnam-Light'
}
export const colors = {
    primary: '#0097A7',
    secondPrimary: '#026c77',
    textPrimary: '#212121',
    secondaryText: '#616161',
    purple: '#026c77',
    red: '#ED1C24',
    blue: '#024b8f',
    bluesamsunte: '#024b8f',
    secondary: '#24aeb2',
    thirth: '#f44336',
    warning: '#ffc107'
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const fixedSize = 400;

export const fontSize = {
    tiny: deviceWidth >= deviceHeight ? 5 * deviceWidth / fixedSize : 8 * deviceWidth / fixedSize,
    smaller: deviceWidth >= deviceHeight ? 9 * deviceWidth / fixedSize : 12 * deviceWidth / fixedSize,
    small: deviceWidth >= deviceHeight ? 13 * deviceWidth / fixedSize : 16 * deviceWidth / fixedSize,
    normal: deviceWidth >= deviceHeight ? 17 * deviceWidth / fixedSize : 20 * deviceWidth / fixedSize,
    large: deviceWidth >= deviceHeight ? 21 * deviceWidth / fixedSize : 24 * deviceWidth / fixedSize,
    xLarge: deviceWidth >= deviceHeight ? 29 * deviceWidth / fixedSize : 32 * deviceWidth / fixedSize,
    xxLarge: deviceWidth >= deviceHeight ? 33 * deviceWidth / fixedSize : 36 * deviceWidth / fixedSize
}
export default styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#fefefe',
    },
    fontFamily: {
        fontFamily: fonts.shabnam,
    },
    fontFamilyBold: {
        fontFamily: fonts.shabnamBold,
    },
    fontFamilyLight: {
        fontFamily: fonts.shabnamLight,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    descriptionRow: {
        fontSize: 14,
        paddingHorizontal: 8,
        paddingVertical: 4,
        color: '#333',
        borderRadius: 2,
        backgroundColor: '#e3e3e3'
    },
    card: {
        borderRadius: 4,
        backgroundColor: 'white',
        alignItems: 'stretch',
        paddingHorizontal: 4,
        paddingVertical: 4
    },
    footerIcons1: {
        color: '#888',
        // fontSize: fontSize.xxLarge
    },
    footerIcons2: {
        color: '#555',
        fontSize: fontSize.xxLarge
    },
    footerIconsSelected: {
        color: colors.primary,
        fontSize: fontSize.xxLarge
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 6,
        justifyContent: 'space-between',
        width: Dimensions.get('window').width * 0.7,
        elevation: 16,
        paddingVertical: 16
    },
    buyitnowtextInput: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    buyitnowtextInputAlt: {
        borderColor: colors.textPrimary,
    },
    buyitnowselectedbtn: {
        backgroundColor: colors.primary,
        borderWidth: 0,
    },
    buyitnowunselectedbtn: {
        borderWidth: 2,
        borderColor: colors.primary
    }
});
