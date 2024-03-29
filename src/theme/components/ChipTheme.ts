import { Components, ComponentsVariants, Theme } from "@mui/material"

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    text: true
  }
}
type ColorVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"

const textStyle = (
  colors: ColorVariant[],
  theme: Theme,
): ComponentsVariants["MuiChip"] =>
  colors.map((color) => ({
    props: {
      variant: "text",
      color: color,
    },
    style: {
      background: "transparent",
      color:
        color === "default"
          ? theme.palette.getContrastText(theme.palette.background.default)
          : theme.palette[color].main,
    },
  }))

const chipColorVariant: ColorVariant[] = [
  "default",
  "primary",
  "secondary",
  "info",
  "warning",
  "success",
  "error",
]

export default function ChipTheme(theme: Theme): Components {
  return {
    MuiChip: {
      variants: textStyle(chipColorVariant, theme)?.concat([
        {
          props: { variant: "filled", color: "default" },
          style: {
            background:
              theme.palette.mode === "dark"
                ? theme.palette.primary.main
                : theme.palette.primary.main,
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.common.white,
            borderRadius: 0,
          },
        },
      ]),
      styleOverrides: {
        sizeSmall: {
          height: "fit-content",
          borderRadius: 0,
        },
        labelSmall: {
          padding: "0px 2px 0px 2px",
          fontSize: theme.typography.subtitle2.fontSize,
          fontWeight: theme.typography.subtitle2.fontWeight,
          borderRadius: 0,
        },
        labelMedium: {
          textAlign: "center",
          fontSize: theme.typography.subtitle1.fontSize,
          fontWeight: theme.typography.subtitle1.fontWeight,
          borderRadius: 0,
        },
      },
    },
  }
}
