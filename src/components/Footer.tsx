import * as React from "react"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Meme1 from "../assets/meme1.png"
import Meme2 from "../assets/meme2.png"
import BullLogo from "../assets/bull-logo.png"
import { ReactComponent as Discord } from "../assets/discord.svg"
import { ReactComponent as Telegram } from "../assets/telegram.svg"
import { ReactComponent as Twitter } from "../assets/twitter.svg"

import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

export default function Footer() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#000702",
        marginTop: "auto",
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-end"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid
          item
          xs={2}
          lg={4}
          container
          justifyContent="center"
          sx={{ display: { xs: "none", lg: "block" } }}
        >
          <img src={Meme1}></img>
        </Grid>
        <Grid
          item
          container
          xs={8}
          lg={4}
          pt={10}
          pb={5}
          direction="column"
          rowSpacing={3}
          alignItems="center"
          justifyContent="center"
        >
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
          <Grid item container spacing={3} justifyContent="center">
            <Grid item>
              <Discord />
            </Grid>
            <Grid item>
              <Telegram />
            </Grid>
            <Grid item>
              <Twitter />
            </Grid>
          </Grid>
          <Grid item justifyContent="center">
            <img src={BullLogo} />
          </Grid>
        </Grid>
        <Grid
          item
          xs={2}
          lg={4}
          container
          justifyContent="center"
          sx={{ display: { xs: "none", lg: "block" } }}
        >
          <img src={Meme2}></img>
        </Grid>
      </Grid>
    </Box>
  )
}
