import { Box, Button, Container, Typography } from "@mui/material"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import BullLogo from "../../assets/bullLogo.png"
import InputField from "./InputField"
import OBULLogo from "../../assets/oBullLogo.png"
import React from "react"
import UsdcLogo from "../../assets/icons/usdc.svg"

const Options = () => {
  return (
    <Container maxWidth="md" sx={{ pb: 16 }}>
      <Typography
        sx={{
          fontFamily: "BAHIANA",
          fontSize: "120px",
          textAlign: "center",
        }}
      >
        Unlock $oBULL
      </Typography>
      <Typography variant="body1" textAlign={"center"} mt={2} fontSize={14}>
        oBULL gives its holder the right to purchase BULL at a discount price.
        Pay USDC to convert your oBULL to BULL.
      </Typography>

      <Box
        p={3}
        sx={{
          border: "solid 2px #00ef80",
          margin: "25px auto",
          backgroundColor: "#1a1a1a",
        }}
      >
        <Typography variant="body1" mt={1} fontSize={12}>
          Strike price: $0.03365 $oBULL Price: $0.07078 $BULL Discount: 52.46%
        </Typography>
        <div style={{ margin: "auto", textAlign: "center" }}>
          <InputField balance={0} name={"oBull"} logoUrl={OBULLogo} />
          <InputField balance={0} name={"USDC"} logoUrl={UsdcLogo} />
          <ArrowDownwardIcon sx={{ marginTop: 2 }} />
          <InputField balance={0} name={"Bull"} logoUrl={BullLogo} />
        </div>
        <Button
          fullWidth
          style={{
            color: "#000",
            backgroundColor: "#00fe93",
            border: "solid .1px #00fe93",
            marginTop: 14,
            borderRadius: 0,
          }}
        >
          Enter An Amount
        </Button>
      </Box>
    </Container>
  )
}

export default Options
