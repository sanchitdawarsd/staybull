// ---------------------------------------------------------------------

import { TypographyOptions } from "@mui/material/styles/createTypography"

function pxToRem(value: number): string {
  return `${value / 16}rem`
}

// const SOURCE_CODE_PRO_FAMILY = ['"Source Code Pro"', "monospace"].join(",")
// const SATOSHI_FAMILY = ["Satoshi", "sans-serif"].join(",")
// const SATOSHI_VARIABLE = ["Satoshi-Variable", "sans-serif"].join(",")
const POPPINS = ["Poppins", "sans-serif"].join(",")
// const BAHIANA = ["Bahiana"]

declare module "@mui/material/styles/createTypography" {}

const typography: TypographyOptions = {
  fontFamily: POPPINS,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightBold: 500,
  h1: {
    fontFamily: POPPINS,
    fontWeight: 500,
    fontSize: pxToRem(32),
    lineHeight: 40 / 32,
  },
  h2: {
    fontFamily: POPPINS,
    fontWeight: 500,
    fontSize: pxToRem(24),
    lineHeight: 32 / 24,
  },
  h3: {
    fontFamily: POPPINS,
    fontWeight: 500,
    fontSize: pxToRem(22),
  },
  h4: {
    fontSize: pxToRem(20),
    lineHeight: 24 / 20,
  },
  h5: {
    fontWeight: 500,
    fontSize: pxToRem(18),
  },
  h6: {
    fontWeight: 500,
    fontSize: pxToRem(17),
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: pxToRem(16),
    lineHeight: 20.11 / 16,
  },
  subtitle2: {
    fontWeight: 400,
    fontSize: pxToRem(12),
    lineHeight: 16 / 12,
  },
  body1: {
    fontSize: pxToRem(16),
    lineHeight: 20.11 / 16,
  },
  body2: {
    fontSize: pxToRem(12),
    lineHeight: 16 / 12,
  },
  caption: {
    fontSize: pxToRem(16),
    lineHeight: 16 / 12,
    fontFamily: "Poppins",
    fontWeight: "700",
    backgroundImage: `linear-gradient(180deg, #F3AAFB 0%, #B4CBF7 48.96%, #C0F7F0 100%)`,
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  button: {
    fontWeight: 500,
    fontSize: pxToRem(16),
  },
}

export default typography
