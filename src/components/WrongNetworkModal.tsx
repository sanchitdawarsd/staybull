/* eslint-disable*/
import { Button, DialogContent, Typography } from "@mui/material"

import React, { ReactElement, useEffect, useState } from "react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import Dialog from "./Dialog"
import { Web3Provider } from "@ethersproject/providers"
import { useTranslation } from "react-i18next"
import { useActiveWeb3React } from "../hooks"
import { SUPPORTED_WALLETS } from "../constants"

export default function WrongNetworkModal(): ReactElement {
  const [open, setOpen] = useState<boolean | undefined>()
  const { error, activate } = useWeb3React<Web3Provider>()
  const isUnsupportChainIdError = error instanceof UnsupportedChainIdError
  const { t } = useTranslation()
  const { library, account, chainId } = useActiveWeb3React()

  const handleConnectMainnet = () => {
    // void activate(
    //   SUPPORTED_WALLETS["METAMASK"].connector,
    //   undefined,
    //   true,
    // ).catch((error) => {
    //   if (error instanceof UnsupportedChainIdError) {
    //     void activate(SUPPORTED_WALLETS["METAMASK"].connector) // a little janky...can't use setError because the connector isn't set
    //   } else {
    //     // TODO: handle error
    //   }
    // })

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
