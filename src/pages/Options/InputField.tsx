import { Box, TextField, Typography } from "@mui/material"
//import { BigNumber } from "ethers"
import React from "react"

type myProps = {
  balance: number
  name: string
  logoUrl: string
  onInput: (e: string) => void
  value: number
}
const InputField: React.FC<myProps> = ({
  balance = 0,
  name,
  logoUrl,
  onInput,
  value,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "solid 2px #FFF",
        marginTop: 3,
      }}
    >
      <TextField
        type="tel"
        variant="standard"
        fullWidth
        required
        sx={{ margin: 2 }}
        InputProps={{ disableUnderline: true }}
        value={value}
        onChange={(e) => onInput(e.target.value)}
      />
      <div style={{ flexDirection: "column", width: "30%" }}>
        <div style={{ display: "flex", alignItems: "center", margin: "2px" }}>
          <img src={logoUrl} alt="obull_logo" width="30%" />
          <Typography fontSize={11} ml={1}>
            {name}
          </Typography>
        </div>

        <Typography fontSize={11} onClick={() => onInput(balance.toString())}>
          Balance: {parseFloat(balance.toString()).toFixed(5)}
        </Typography>
      </div>
    </Box>
  )
}

export default InputField
