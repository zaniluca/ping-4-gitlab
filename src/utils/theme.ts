import {
  DarkTheme as NavigationDarkTheme,
  Theme as NavigationTheme,
} from "@react-navigation/native";
import { createTheme, useTheme as useRestyleTheme } from "@shopify/restyle";
import { Platform } from "react-native";

const lightPalette = {
  purple: "#6E49CB",
  purpleDark: "#380D75",
  indigo: "#29295E",
  green: "#108548",
  blue: "#1068BF",
  red: "#E24329",
  orange: "#FC6D26",
  quaternary: "#F9F9F9",
  tertiary: "#CCCCCC",
  secondary: "#8C929D",
  primary: "#2E2E2E",
  white: "#FFFFFF",
  black: "#000000",
};

const font = {
  bold: "SourceSansPro_700Bold",
  semibold: "SourceSansPro_600SemiBold",
  regular: "SourceSansPro_400Regular",
};

export const lightTheme = createTheme({
  colors: {
    ...lightPalette,
    primaryBackground: lightPalette.white,
    divider: "#D2D2D2",
    accent: lightPalette.indigo,
  },
  fontFamily: {
    ...font,
  },
  spacing: {
    xxs: 2,
    xs: 4,
    s: 8,
    m: 16,
    l: 20,
    xl: 32,
    xxl: 40,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    // defaults: {
    //   fontFamily: font.regular,
    //   fontSize: 17,
    //   color: "primary",
    // },
    largeTitle: {
      fontFamily: font.bold,
      fontSize: 34,
      color: "primary",
    },
    smallTitle: {
      fontFamily: font.bold,
      fontSize: 20,
      color: "primary",
    },
    headline: {
      fontFamily: font.semibold,
      fontSize: 17,
      color: "primary",
    },
    body: {
      fontFamily: font.regular,
      fontSize: 17,
      color: "primary",
    },
    callout: {
      fontFamily: font.regular,
      fontSize: 16,
      color: "primary",
    },
    caption: {
      fontFamily: font.regular,
      fontSize: 12,
      color: "primary",
    },
  },
  buttonVariants: {
    defaults: {
      backgroundColor: lightPalette.purple,
    },
    outline: {
      elevation: 1,
      backgroundColor: "primaryBackground",
      borderWidth: 1,
      borderColor: "tertiary",
      shadowColor: "black",
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
  },
});

export type Theme = typeof lightTheme;

export const darkTheme = createTheme({
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    quaternary: "#333333",
    secondary: "#868686",
    primary: "#ffffff",
    primaryBackground: "#1F1F1F",
    divider: "#333333",
    accent: lightPalette.purple,
  },
});

const AndroidNavDarkTheme = NavigationDarkTheme;
const IosNavDarkTheme: NavigationTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    card: darkTheme.colors.primaryBackground,
  },
};

export const NavDarkTheme =
  Platform.OS === "ios" ? IosNavDarkTheme : AndroidNavDarkTheme;

export default lightTheme;
export const useTheme = () => useRestyleTheme<Theme>();
