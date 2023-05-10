// import { ReactComponent as Logo } from
import React, { ImgHTMLAttributes } from "react"
import BullLogo from "../assets/bull-logo.png"
// import { useTheme } from "@mui/material"

export default function SaddleLogo({
  ...props
}: ImgHTMLAttributes<HTMLImageElement>): JSX.Element {
  // const theme = useTheme()
  return <img src={BullLogo} {...props} />
}
