import * as React from "react"
import Box from "@mui/material/Box"
import Meme1 from "../assets/meme1.png"
import Meme2 from "../assets/meme2.png"
import BullLogo from "../assets/bull-logo.png"
import { ReactComponent as Discord } from "../assets/discord.svg"
import { ReactComponent as Telegram } from "../assets/telegram.svg"
import { ReactComponent as Twitter } from "../assets/twitter.svg"

import { Button, Typography } from "@mui/material"

export default function Footer() {
  return (
    <Box>
      <div style={{ backgroundColor: "#000", textAlign: "center" }}>
        <Typography
          color={"#fff"}
          fontSize={60}
          fontFamily="Bahiana"
          letterSpacing={2}
        >
          CONTACT
        </Typography>

        <Button
          sx={{
            color: "#00FF94",
            letterSpacing: 2,
            fontFamily: "Montserrat",
            fontSize: 20,
          }}
        >
          Join Our Community
        </Button>
        <div style={{ marginTop: 5 }}>
          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Discord />
          </button>
          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Telegram />
          </button>
          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Twitter />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <img src={Meme1} alt="meme1" width="20%" />
          <img src={BullLogo} alt="meme2" width="20%" />
          <img src={Meme2} alt="meme3" width="20%" />
        </div>
      </div>
    </Box>
  )
}
