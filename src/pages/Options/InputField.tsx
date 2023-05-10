import { Box, TextField, Typography } from "@mui/material"
import React, { useState } from "react"

type myProps = {
  balance: number
  name: string
  logoUrl: string
}
const InputField: React.FC<myProps> = ({ balance = 0, name, logoUrl }) => {
  const [inputValue, setInputValue] = useState<string>("0")

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
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div style={{ flexDirection: "column", width: "30%" }}>
        <div style={{ display: "flex", alignItems: "center", margin: "2px" }}>
          <img src={logoUrl} alt="obull_logo" width="30%" />
          <Typography fontSize={11} ml={1}>
            {name}
          </Typography>
        </div>
        <Typography fontSize={11}>Balance: {balance.toFixed(4)}</Typography>
      </div>
    </Box>
  )
}

export default InputField
