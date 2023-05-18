/*eslint-disable*/
import {
  Button,
  Grid,
  Paper,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import React, { useCallback, useContext } from "react"
import { enqueuePromiseToast, enqueueToast } from "../../components/Toastify"

import { BigNumber } from "@ethersproject/bignumber"
import { DEAD_FUSDC_GAUGE_ADDRESS } from "../../constants"
import { GaugeApr } from "../../providers/AprsProvider"
import GaugeRewardsDisplay from "../../components/GaugeRewardsDisplay"
import TokenIcon from "../../components/TokenIcon"
import { TokensContext } from "../../providers/TokensProvider"
import { UserStateContext } from "../../providers/UserStateProvider"
import { Zero } from "@ethersproject/constants"
import { formatBNToShortString } from "../../utils"
import { getGaugeContract } from "../../hooks/useContract"
import { useActiveWeb3React } from "../../hooks"
import { useTranslation } from "react-i18next"

interface FarmOverviewProps {
  name: string
  aprs?: GaugeApr[]
  // poolTokens?: string[]
  tvl?: BigNumber
  myStake: BigNumber
  addresses: string
  onClickStake: () => void
  onClickClaim: () => void
}

const TokenGroup = styled("div")(() => ({
  display: "flex",
  "& img:not(:first-of-type)": {
    marginLeft: -5,
  },
}))

export default function FarmOverview({
  name,
  // poolTokens,
  aprs,
  tvl,
  myStake,
  onClickStake,
  addresses,
}: // onClickClaim,
FarmOverviewProps): JSX.Element | null {
  const { t } = useTranslation()
  const { chainId, library, account } = useActiveWeb3React()
  const tokens = useContext(TokensContext)
  const theme = useTheme()
  const isLgDown = useMediaQuery(theme.breakpoints.down("lg"))
  const userState = useContext(UserStateContext)

  // console.log({ name, tvl, addresses, myStake, aprs })

  const amountStakedDeadFusdc =
    userState?.gaugeRewards?.[DEAD_FUSDC_GAUGE_ADDRESS]?.amountStaked || Zero
  const onClickUnstakeOldFusdc = useCallback(async () => {
    if (account == null || chainId == null || library == null) {
      enqueueToast("error", "Unable to unstake")
      console.error("gauge not loaded")
      return
    }
    try {
      const gaugeContract = getGaugeContract(
        library,
        chainId,
        DEAD_FUSDC_GAUGE_ADDRESS,
        account,
      )
      const txn = await gaugeContract["withdraw(uint256)"](
        amountStakedDeadFusdc,
      )
      await enqueuePromiseToast(chainId, txn.wait(), "unstake", {
        poolName: "fUSDC outdated",
      })
      // dispatch(
      //   updateLastTransactionTimes({
      //     [TRANSACTION_TYPES.STAKE_OR_CLAIM]: Date.now(),
      //   }),
      // )
    } catch (e) {
      console.error(e)
      enqueueToast("error", "Unable to unstake")
    }
  }, [account, chainId, library, amountStakedDeadFusdc])

  if (!chainId) return null
  const isDeadFusdcGauge = addresses === DEAD_FUSDC_GAUGE_ADDRESS
  if (isDeadFusdcGauge && amountStakedDeadFusdc.eq(Zero)) return null // don't show old gauge to non-stakers

  return (
    <Paper style={{ borderRadius: 0 }}>
      <Grid
        container
        alignItems={{ xs: "flex-start", lg: "center" }}
        direction="row"
        sx={{
          backgroundColor: (theme) =>
            isDeadFusdcGauge
              ? theme.palette.action.focus
              : theme.palette.background.paper,
          py: 1,
          px: 3,
        }}
      >
        <Grid item container xs={7} lg={3.5} flexDirection="column" gap={2}>
          <Grid item xs={6} lg={12}>
            <Typography variant="h4">FARM</Typography>
            <Typography variant="h2">
              {isDeadFusdcGauge ? "Outdated " : ""}
              {name}
            </Typography>
            <TokenGroup>
              {
                name === "SDL/WETH SLP" ? (
                  <>
                    <TokenIcon symbol="SDL" alt="sdl" />
                    <TokenIcon symbol="WETH" alt="weth" />
                  </>
                ) : null
                // poolTokens?.map((tokenAddress) => {
                //   const token = tokens?.[tokenAddress]
                //   if (!token) return <div></div>
                //   return (
                //     <TokenIcon
                //       key={token.name}
                //       symbol={token.symbol}
                //       alt={token.symbol}
                //     />
                //   )
                // })
              }
            </TokenGroup>
          </Grid>

          {isLgDown && (
            <Grid item xs={6}>
              <Typography variant="subtitle1">FARM TVL</Typography>
              <Typography variant="subtitle1">
                {tvl ? `$${formatBNToShortString(tvl, 18)}` : "_"}
              </Typography>
            </Grid>
          )}
        </Grid>
        <Grid item container xs={5} lg={3} flexDirection="column" gap={2}>
          <Grid xs={6} lg={12}>
            {isLgDown && <Typography variant="subtitle1">APR</Typography>}
            {<GaugeRewardsDisplay aprs={aprs} />}
          </Grid>
          {isLgDown && (
            <Grid xs={6}>
              <Typography variant="subtitle1">{t("myStaked")} LP</Typography>
              <Typography variant="subtitle1">
                {myStake?.gt(Zero) ? formatBNToShortString(myStake, 18) : "_"}
              </Typography>
            </Grid>
          )}
        </Grid>
        {!isLgDown && (
          <React.Fragment>
            <Grid item xs={0} lg={1.5}>
              <Typography variant="subtitle1">
                {tvl ? `$${formatBNToShortString(tvl, 18)}` : "-"}
              </Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography variant="subtitle1">
                {myStake?.gt(Zero) ? formatBNToShortString(myStake, 18) : "-"}
              </Typography>
            </Grid>
          </React.Fragment>
        )}
        <Grid item xs={12} lg="auto" justifyContent="center">
          {/* <Button variant="outlined" size="large">
          {t("claimRewards")}
        </Button> */}
          {isDeadFusdcGauge ? (
            <Button
              variant="contained"
              size="large"
              color="error"
              onClick={() => void onClickUnstakeOldFusdc()}
              fullWidth
              sx={{ mt: 1 }}
            >
              {t("unstake")}
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="large"
              onClick={onClickStake}
              fullWidth
              sx={{ mt: 1 }}
            >
              {t("stakeOrUnstake")}
            </Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}
