import * as React from "react"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Meme1 from "../assets/meme1.png"
import Meme2 from "../assets/meme2.png"
import BullLogo from "../assets/bull-logo.png"

import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

export default function Footer() {
  const theme = useTheme()

  return (
    <Box sx={{ width: "100%", backgroundColor: "#000702" }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-end"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={4} container justifyContent="center" alignItems="center">
          <img src={Meme1}></img>
        </Grid>
        <Grid item xs={4} container direction="column" justifyContent="center">
          <Typography
            sx={{
              fontFamily: "BAHIANA",
              fontSize: "120px",
              textAlign: "center",
            }}
          >
            CONTACT
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "36px",
              fontWeight: "700",
              backgroundImage: `${theme.palette.gradient?.primary || "black"}`,
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textAlign: "center",
            }}
          >
            Join Our Community
          </Typography>
          <Grid item justifyContent="center">
            <img src={BullLogo} width="40%" />
          </Grid>
        </Grid>
        <Grid item xs={4} container justifyContent="center">
          <img src={Meme2}></img>
        </Grid>
      </Grid>
    </Box>
  )
}
