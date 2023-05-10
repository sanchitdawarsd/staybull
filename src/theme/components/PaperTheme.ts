import { Components, Theme } from "@mui/material"

export default function PaperTheme(theme: Theme): Components {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: "none",
          borderImage: `${theme.palette.gradient?.secondary || "black"}`,
          borderStyle: "solid",
          borderWidth: "3px",
          boxShadow: "none",
          borderRadius: 0,
          opacity: 1,
        },
      },
    },
  }
}
