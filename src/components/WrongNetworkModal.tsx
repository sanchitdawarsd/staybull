/* eslint-disable*/
import { Button, DialogContent, Typography } from "@mui/material"

import React, { ReactElement, useEffect, useState } from "react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import Dialog from "./Dialog"
import { Web3Provider } from "@ethersproject/providers"
import { useTranslation } from "react-i18next"
import { useActiveWeb3React } from "../hooks"

export default function WrongNetworkModal(): ReactElement {
  const [open, setOpen] = useState<boolean | undefined>()
  const { error } = useWeb3React<Web3Provider>()
  const isUnsupportChainIdError = error instanceof UnsupportedChainIdError
  const { t } = useTranslation()
  const { library, account, chainId } = useActiveWeb3React()
  const handleConnectMainnet = () => {
    void library?.send("wallet_switchEthereumChain", [
      { chainId: "0xa4b1" },
      account,
    ])
  }
  useEffect(() => {}, [chainId])

  return (
    <Dialog
      open={open ?? isUnsupportChainIdError}
      maxWidth="xs"
      onClose={() => setOpen(false)}
    >
      <DialogContent sx={{ whiteSpace: "pre-line" }}>
        <Typography textAlign="center" mb={3} sx={{ fontSize: 48 }}>
          &#129325;
        </Typography>
        <Typography>{t("wrongNetworkContent")}</Typography>
        <Button
          variant="contained"
          fullWidth
          onClick={handleConnectMainnet}
          sx={{ mt: 3 }}
        >
          {t("changeToMainnet")}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
