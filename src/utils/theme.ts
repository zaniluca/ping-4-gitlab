import { createTheme } from "@shopify/restyle";

const palette = {
  purple: "#6E49CB",
  purpleDark: "#380D75",
  indigo: "#29295E",
  green: "#108548",
  blue: "#1068BF",
  red: "#E24329",
  orange: "#FC6D26",
  gray100: "#F9F9F9",
  gray300: "#CCCCCC",
  gray600: "#8C929D",
  gray900: "#2E2E2E",
  white: "#FFFFFF",
};

const font = {
  bold: "SourceSansPro_700Bold",
  semibold: "SourceSansPro_600SemiBold",
  regular: "SourceSansPro_400Regular",
};

const theme = createTheme({
  colors: {
    ...palette,
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
    largeTitle: {
      fontFamily: font.bold,
      fontSize: 34,
      color: "gray900",
    },
    smallTitle: {
      fontFamily: font.bold,
      fontSize: 20,
      color: "gray900",
    },
    headline: {
      fontFamily: font.semibold,
      fontSize: 17,
      color: "gray900",
    },
    body: {
      fontFamily: font.regular,
      fontSize: 17,
      color: "gray900",
    },
    callout: {
      fontFamily: font.regular,
      fontSize: 16,
      color: "gray900",
    },
    caption: {
      fontFamily: font.regular,
      fontSize: 12,
      color: "gray900",
    },
  },
});

export type Theme = typeof theme;
export default theme;
