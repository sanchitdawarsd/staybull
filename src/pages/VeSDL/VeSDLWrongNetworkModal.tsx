/*eslint-disable*/
import { Button, DialogContent, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"

import Dialog from "../../components/Dialog"
import { SUPPORTED_NETWORKS } from "../../constants/networks"
import { areGaugesActive } from "../../utils/gauges"
import { useActiveWeb3React, useEagerConnect } from "../../hooks"
import { useTranslation } from "react-i18next"
import { injectedMetaMaskProvider } from "../../connectors"
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core"

export default function VeSDLWrongNetworkModal(): JSX.Element {
  const [openDialog, setOpenDialog] = useState(false)
  const { active, activate, error } = useWeb3ReactCore()
  const { library, account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const handleConnectMainnet = () => {
    account
      ? void library?.send("wallet_switchEthereumChain", [
          { chainId: "0xa4b1" },
          account,
        ])
      : null
  }
  const chainName = chainId && SUPPORTED_NETWORKS[chainId]?.chainName

  useEffect(() => {
    if (chainId) {
      const networkName = SUPPORTED_NETWORKS[chainId]?.chainName

      // void injectedMetaMaskProvider.isAuthorized().then((isAuthorized) => {
      //   if (!isAuthorized) {
      //     activate(injectedMetaMaskProvider, undefined, true)
      //   }
      // })

      console.log(
        !areGaugesActive(chainId) && !!networkName,
        areGaugesActive(chainId),
        chainId,
        networkName,
      )
      if (account) {
        setOpenDialog(!areGaugesActive(chainId) && !!networkName)
      }
    }
  }, [chainId, account])

  return (
    <Dialog
      open={openDialog}
      fullWidth
      onClose={() => setOpenDialog(false)}
      hideClose={true}
      disableEscapeKeyDown={false}
    >
      <DialogContent>
        <Typography textAlign="center" mt={3} whiteSpace="pre-line">
          {t("veSdlNetworkText", { chainName })}
        </Typography>
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
