/* eslint-disable*/
import {
  BN_1E18,
  BN_DAY_IN_SECONDS,
  FARMS_MAP,
  PoolTypes,
} from "../../constants"
import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import React, { useContext, useEffect, useState } from "react"

import { AprsContext, GaugeApr } from "../../providers/AprsProvider"
import { BasicPoolsContext } from "../../providers/BasicPoolsProvider"
import ClaimRewardsDlg from "./ClaimRewardsDlg"
import FarmOverview from "./FarmOverview"
import { GaugeContext } from "../../providers/GaugeProvider"
import { IS_DEVELOPMENT } from "../../utils/environment"
import StakeDialog from "./StakeDialog"
import { UserStateContext } from "../../providers/UserStateProvider"
import VeSDLWrongNetworkModal from "../VeSDL/VeSDLWrongNetworkModal"
import { Zero } from "@ethersproject/constants"
import { formatUnits, parseUnits } from "ethers/lib/utils"
import useGaugeTVL from "../../hooks/useGaugeTVL"
import { useActiveWeb3React } from "../../hooks"
import { useOracle, useToken } from "../../hooks/useContract"
import { Erc20 } from "../../../types/ethers-contracts/Erc20"
import { BigNumber } from "@ethersproject/bignumber"
import { ethers } from "ethers"
import { getGaugeContract } from "../../hooks/useContract"
// import { useTranslation } from "react-i18next"

type ActiveGauge = {
  address: string
  lpToken: string
  displayName: string
  rewardsPid: number
}
const sushiGaugeName = "SLP-gauge"
export default function Farm(): JSX.Element {
  const { account, library, chainId } = useActiveWeb3React()
  const [activeGauge, setActiveGauge] = useState<ActiveGauge | undefined>()
  const [activeDialog, setActiveDialog] = useState<
    "stake" | "claim" | undefined
  >()
  const basicPools = useContext(BasicPoolsContext)
  const { gauges } = useContext(GaugeContext)
  const gaugeAprs = useContext(AprsContext)
  const userState = useContext(UserStateContext)
  const getGaugeTVL = useGaugeTVL()
  const farmData = Object.values(gauges)
    .filter(({ isKilled }) => !isKilled)
    .map((gauge) => {
      const {
        poolName,
        gaugeTotalSupply,
        gaugeName,
        address,
        poolAddress,
        rewards,
      } = gauge
      const farmName =
        gaugeName === sushiGaugeName
          ? "SDL/WETH SLP"
          : poolName || gaugeName || ""
      const gaugeAddress = address
      const aprs = gaugeAprs?.[gaugeAddress]
      const myStake = // is this a bug?
        userState?.gaugeRewards?.[gaugeAddress]?.amountStaked || Zero
      const tvl = getGaugeTVL(gaugeAddress)
      const gaugePoolAddress = poolAddress
      const userShare = gaugeTotalSupply.gt(Zero)
        ? myStake.mul(BN_1E18).div(gaugeTotalSupply)
        : Zero
      const sdlReward = rewards[rewards.length - 1]
      const userSdlRewardRate = userShare
        .mul(sdlReward?.rate || Zero)
        .div(BN_1E18)

      const gaugePool = Object.values(basicPools || {}).find(
        (pool) => pool.poolAddress === gaugePoolAddress,
      )
      const poolTokens = gaugePool?.tokens
      return {
        gauge,
        gaugeAddress,
        farmName,
        poolTokens,
        aprs,
        tvl,
        myStake,
        userSdlRewardRate,
      } as const
    })
    .sort((a, b) => {
      // Put SLP gauge at top
      // if (a.gauge.gaugeName === sushiGaugeName) {
      //   return -1
      // }
      // if (b.gauge.gaugeName === sushiGaugeName) {
      //   return 1
      // }
      // Sort by highest user balance
      if (a.myStake.gt(b.myStake)) {
        return -1
      }
      if (b.myStake.gt(a.myStake)) {
        return 1
      }
      // Sort by gauge TVL
      return a.tvl.gt(b.tvl) ? -1 : 1
    })

  const contract = useOracle()
  const lptoken0: Erc20 = useToken(FARMS_MAP[0].lpToken)!
  const lptoken1: Erc20 = useToken(FARMS_MAP[1].lpToken)!
  const rewardTokenContract: Erc20 = useToken(
    "0xbB01AFf00d6786B63325771Fb21A6F37564ddCBb",
  )!

  const [balances, setBalances] = useState<BigNumber[]>([])
  const [stakedLps, setStakedLps] = useState<BigNumber[]>([])
  const [stakedAprs, setStakedAprs] = useState<GaugeApr[][]>([])
  const [bcPrice, setBcPrice] = useState<Number>(0)

  useEffect(() => {
    async function getBalance() {
      const price = await contract?.estimateAmountOut(
        "0x1bAAED97039B00e62183aA70642F646124b6b001",
        ethers.BigNumber.from("1000000000000000000"),
        10,
      )
      let decimal: BigNumber = ethers.BigNumber.from(10 ** 6)
      if (price !== undefined) {
        setBcPrice(Number(price) / 10 ** 6)
      }
      let origbalances: BigNumber[] = await Promise.all([
        lptoken0.balanceOf(FARMS_MAP[0].addresses),
        lptoken1.balanceOf(FARMS_MAP[1].addresses),
      ])
      let balances: BigNumber[] = await Promise.all([
        lptoken0.balanceOf(FARMS_MAP[0].addresses),
        lptoken1.balanceOf(FARMS_MAP[1].addresses),
      ])
      if (price !== undefined) {
        balances[1] = balances[1].mul(price).div(10 ** 6)
      }
      setBalances(balances)
      return origbalances
    }

    async function getStakedLps() {
      if (account == null || chainId == null || library == null) {
        return
      }
      const gaugeContract = getGaugeContract(
        library!,
        chainId!,
        FARMS_MAP[0].addresses,
        account!,
      )
      const userInfos = await Promise.all([
        gaugeContract.userInfo(FARMS_MAP[0].pid, account),
        gaugeContract.userInfo(FARMS_MAP[1].pid, account),
      ])
      const stakedAmounts = userInfos.map(
        (info: { amount: BigNumber }) => info.amount,
      )
      setStakedLps(stakedAmounts)
    }

    async function getAprs() {
      console.log(
        "****************getAprs********************************************",
      )
      const appPrice = await contract?.estimateAmountOut(
        "0x1bAAED97039B00e62183aA70642F646124b6b001",
        ethers.BigNumber.from("1000000000000000000"),
        10,
      )
      let rewardBalance: BigNumber[] = await Promise.all([
        rewardTokenContract.balanceOf(FARMS_MAP[0].addresses),
        rewardTokenContract.balanceOf(FARMS_MAP[1].addresses),
      ])

      const balances = await getBalance()

      if (appPrice) {
        const value0: BigNumber = balances[0].isZero()
          ? Zero
          : appPrice
              .mul(rewardBalance[0].mul(100).div(balances[0]))
              .div(10 ** 6)
        const value1: BigNumber = balances[1].isZero()
          ? Zero
          : appPrice
              .mul(rewardBalance[1])
              .mul(100)
              .div(balances[1].mul(appPrice.mul(2)))
        console.log(value0.toString(), value1.toString(), "heyyy")

        const rewardToken = {
          address: "0xADc97c479C56B0105674d960B528FE8788c99D43",
          name: "apple",
          symbol: "app",
          decimals: 6,
          isLPToken: true,
          isOnTokenLists: true,
          typeAsset: PoolTypes.USD,
          isSynthetic: true,
        }
        const apr0: GaugeApr = {
          rewardToken,
          apr: {
            max: value0,
          },
        }

        const apr1: GaugeApr = {
          rewardToken,
          apr: {
            max: value1,
          },
        }

        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", { apr0, apr1 })
        setStakedAprs([[apr0], [apr1]])
      }
    }

    getBalance()
    getStakedLps()
    getAprs()
  }, [lptoken0, lptoken1, library, chainId, account])

  useEffect(() => {
    // TODO expose this to user once we have designs
    const userTotalRate = farmData.reduce(
      (sum, d) => sum.add(d.userSdlRewardRate),
      Zero,
    )
    const userDailyRate = userTotalRate.mul(BN_DAY_IN_SECONDS)
    if (IS_DEVELOPMENT && userDailyRate.gt(Zero)) {
      console.log("user SDL earned per day", formatUnits(userDailyRate, 18))
    }
  }, [farmData])

  return (
    <Container sx={{ pt: 5, pb: 5 }}>
      <Stack alignItems="flex-start">
        <div>
          <Typography
            sx={{
              fontFamily: "BAHIANA",
              fontSize: "120px",
              textAlign: "center",
            }}
          >
            FARM PAGE
          </Typography>
        </div>
        <div>
          <Typography
            sx={{
              fontFamily: "POPPINS",
              fontSize: "16px",
              color: "#FFFFFFB2",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
            purus sit amet luctus venenatis, lectus magna fringilla urna,
            porttitor
          </Typography>
        </div>
      </Stack>

      <Box
        position="sticky"
        top={0}
        bgcolor="#191919"
        // bgcolor={(theme) => theme.palette.background.paper}
        my={2}
        zIndex={(theme) => theme.zIndex.mobileStepper - 1}
        sx={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          display: { xs: "none", lg: "block" },
        }}
      >
        <Paper style={{ borderRadius: 0 }}>
          <FarmListHeader />
        </Paper>
      </Box>

      <Box
        // bgcolor={(theme) => theme.palette.background.paper}
        zIndex={(theme) => theme.zIndex.mobileStepper - 1}
        sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
      >
        {FARMS_MAP.map(({ addresses, name, lpToken, pid }, index) => {
          return (
            <Box key={index} my={2}>
              {console.log(index, pid, lpToken, "heyy7")}
              <Divider />
              <FarmOverview
                addresses={addresses}
                name={name}
                // poolTokens={poolTokens}
                aprs={stakedAprs[index]}
                tvl={balances[index]}
                myStake={stakedLps[index]}
                onClickStake={() => {
                  setActiveDialog("stake")
                  setActiveGauge({
                    address: addresses,
                    displayName: name,
                    lpToken: lpToken,
                    rewardsPid: pid,
                  })
                }}
                onClickClaim={() => {
                  setActiveDialog("claim")
                  setActiveGauge({
                    address: addresses,
                    displayName: name,
                    lpToken: lpToken,
                    rewardsPid: pid,
                  })
                }}
              />
            </Box>
          )
        })}
      </Box>
      {console.log(activeGauge, activeDialog, "active")}
      <StakeDialog
        name={activeGauge?.displayName}
        open={activeDialog === "stake"}
        address={activeGauge?.address}
        lptoken={activeGauge?.lpToken}
        rewardPids={activeGauge?.rewardsPid}
        onClose={() => {
          setActiveDialog(undefined)
          setActiveGauge(undefined)
        }}
        onClickClaim={() => {
          setActiveDialog("claim")
        }}
      />
      <ClaimRewardsDlg
        open={activeDialog === "claim"}
        gaugeAddress={activeGauge?.address}
        displayName={activeGauge?.displayName}
        rewardPid={activeGauge?.rewardsPid}
        onClose={() => {
          setActiveDialog(undefined)
          setActiveGauge(undefined)
        }}
      />
      <VeSDLWrongNetworkModal />
    </Container>
  )
}

function FarmListHeader(): JSX.Element {
  // const { t } = useTranslation()
  const theme = useTheme()
  const isLgDown = useMediaQuery(theme.breakpoints.down("lg"))
  return (
    <Grid
      container
      direction="row"
      sx={{
        py: 3,
        px: 3,
      }}
    >
      <Grid item xs={7} lg={3.5}>
        <Typography>FARMS</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography>APR</Typography>
      </Grid>
      {!isLgDown && (
        <Grid item xs={1.5}>
          <Typography>FARM TVL</Typography>
        </Grid>
      )}
      {!isLgDown && (
        <Grid item xs={1.5}>
          <Typography>MY STAKED LP</Typography>
        </Grid>
      )}
    </Grid>
  )
}
