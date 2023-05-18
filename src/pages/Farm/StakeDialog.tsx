/* eslint-disable*/
import {
  Box,
  Button,
  DialogContent,
  InputBase,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material"
import React, { useCallback, useEffect, useState } from "react"
import { TRANSACTION_TYPES, readableDecimalNumberRegex } from "../../constants"
import {
  commify,
  formatBNToString,
  getContract,
  missingKeys,
} from "../../utils"
import { enqueuePromiseToast, enqueueToast } from "../../components/Toastify"
import { formatUnits, parseUnits } from "ethers/lib/utils"
import { useDispatch, useSelector } from "react-redux"

import { AppState } from "../../state"
import { BigNumber, ethers } from "ethers"
import Dialog from "../../components/Dialog"
import ERC20_ABI from "../../constants/abis/erc20.json"
import { Erc20 } from "../../../types/ethers-contracts/Erc20"
import TokenInput from "../../components/TokenInput"
import checkAndApproveTokenForTrade from "../../utils/checkAndApproveTokenForTrade"
import { updateLastTransactionTimes } from "../../state/application"
import { useActiveWeb3React } from "../../hooks"
import useUserGauge from "../../hooks/useUserGauge"
import { getGaugeContract, useToken, useUsdc } from "../../hooks/useContract"
import { letterSpacing } from "@mui/system"
import { Masterchef } from "../../../types/ethers-contracts/Masterchef"

interface StakeDialogProps {
  open: boolean
  onClose: () => void
  onClickClaim: () => void
  name?: string
  address?: string
  lptoken?: string
  rewardPids?: number
}

const defaultInput = "0.0"
export default function StakeDialog({
  open,
  name,
  address,
  lptoken,
  rewardPids,
  onClose,
  onClickClaim,
}: StakeDialogProps): JSX.Element | null {
  const { chainId, account, library } = useActiveWeb3React()
  const userGauge = useUserGauge(address, lptoken)(address, lptoken)
  const dispatch = useDispatch()
  const [stakeStatus, setStakeStatus] = useState<"stake" | "unstake">("stake")
  const [amountInput, setAmountInput] = useState<string>(defaultInput)
  const [stakedBalance, setstakedBalance] = useState<any>("")
  const [pendingRewardsBalance, setpendingRewardsBalance] = useState<any>("")
  const [walletBalance, setwalletBalance] = useState<any>("")

  const { infiniteApproval } = useSelector((state: AppState) => state.user)
  const theme = useTheme()
  let lptokencontract: Erc20 | null
  let gaugeContract: Masterchef | null
  // if (lptoken) {
  lptokencontract = useToken(lptoken!)
  if (address) {
    gaugeContract = getGaugeContract(library!, chainId!, address!, account!)
  }

  const onClickStake = useCallback(async () => {
    console.log(name, address, lptoken, rewardPids, "hahah")
    const errorMsg = "Unable to stake"
    try {
      if (!chainId || !lptoken || !address || !account || !library) {
        console.error(
          `${errorMsg}: ${missingKeys({
            userGauge,
            chainId,
            address,
            account,
            library,
          }).join(", ")} missing`,
        )
        enqueueToast("error", errorMsg)
        return
      }
      const inputBN = parseUnits(amountInput)
      const lpTokenContract = getContract(
        lptoken,
        ERC20_ABI,
        library,
        account,
      ) as Erc20
      await checkAndApproveTokenForTrade(
        lpTokenContract,
        address,
        account,
        inputBN,
        infiniteApproval,
        BigNumber.from(1),
        {
          onTransactionError: () => {
            throw new Error("Your transaction could not be completed")
          },
        },
        chainId,
      )
      console.log(inputBN.toString(), "number")
      const txn = await userGauge?.stake(rewardPids!, inputBN)
      if (txn !== undefined)
        await enqueuePromiseToast(chainId, txn.wait(), "stake", {
          poolName: name,
        })
      dispatch(
        updateLastTransactionTimes({
          [TRANSACTION_TYPES.STAKE_OR_CLAIM]: Date.now(),
        }),
      )
      setAmountInput(defaultInput)
    } catch (e) {
      console.error(e)
      enqueueToast("error", errorMsg)
    }
  }, [
    userGauge,
    chainId,
    address,
    account,
    library,
    amountInput,
    infiniteApproval,
    name,
    dispatch,
  ])

  const onClickUnstake = useCallback(async () => {
    const errorMsg = "Unable to unstake"
    try {
      if (!chainId) {
        console.error(
          `${errorMsg}: ${missingKeys({
            userGauge,
            chainId,
          }).join(", ")} missing`,
        )
        enqueueToast("error", errorMsg)
        return
      }
      const inputBN = parseUnits(amountInput)
      const txn = await userGauge?.unstake(
        ethers.BigNumber.from(rewardPids),
        inputBN,
      )
      if (txn !== undefined)
        await enqueuePromiseToast(chainId, txn.wait(), "unstake", {
          poolName: name,
        })
      dispatch(
        updateLastTransactionTimes({
          [TRANSACTION_TYPES.STAKE_OR_CLAIM]: Date.now(),
        }),
      )
      setAmountInput(defaultInput)
    } catch (e) {
      console.error(e)
      enqueueToast("error", errorMsg)
    }
  }, [amountInput, chainId, name, dispatch])

  const isInputValid =
    readableDecimalNumberRegex.test(amountInput) && parseFloat(amountInput) > 0

  // if (!userGauge) return null

  useEffect(() => {
    //console.log("heyyy3")
    const getdata = async () => {
      const price = await lptokencontract?.balanceOf(account!)
      const userInfos = await Promise.all([
        gaugeContract?.userInfo(BigNumber.from(rewardPids), account!),
      ])
      const pendingRewards = await Promise.all([
        gaugeContract?.pendingStaybull(BigNumber.from(rewardPids), account!),
      ])

      setstakedBalance(userInfos[0]?.amount?.toString())
      setpendingRewardsBalance(pendingRewards?.toString())
      setwalletBalance(price?.toString())
    }
    void getdata()
  }, [lptoken, address])

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose()
        setStakeStatus("stake")
        setAmountInput(defaultInput)
      }}
      fullWidth
      maxWidth="xs"
    >
      <DialogContent sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h1" textAlign="center">
            {name}
          </Typography>
          <Typography>
            Stake your LP token and collect $oBull incentives.
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography>
                Rewards: {(pendingRewardsBalance / 10 ** 18).toFixed(4)} $oBULL
              </Typography>
            </Box>
            {/* <Box>
              <Typography>My Boost</Typography>
              {userGauge.boost ? formatBNToString(userGauge.boost, 18, 2) : "-"}
            </Box> */}
            <Button
              variant="outlined"
              size="large"
              onClick={onClickClaim}
              // disabled={!userGauge.hasClaimableRewards}
            >
              Claim Rewards
            </Button>
          </Stack>
          <Tabs
            value={stakeStatus}
            variant="fullWidth"
            onChange={(_, newValue: "stake" | "unstake") => {
              setStakeStatus(newValue)
              setAmountInput(defaultInput)
            }}
          >
            <Tab value="stake" label="Stake" />
            <Tab value="unstake" label="Unstake" />
          </Tabs>

          {stakeStatus === "stake" ? (
            <Button
              onClick={() =>
                setAmountInput((walletBalance / 10 ** 18).toString())
              }
            >
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                {"Balance"}: {(walletBalance / 10 ** 18).toFixed(4)}
              </Typography>
            </Button>
          ) : (
            <Button
              onClick={() =>
                setAmountInput((stakedBalance / 10 ** 18).toString())
              }
            >
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                {"Balance"}: {(stakedBalance / 10 ** 18).toFixed(4)}
              </Typography>
            </Button>
          )}
          <Box textAlign="end" flex={1}>
            <InputBase
              autoComplete="off"
              autoCorrect="off"
              type="text"
              placeholder="0.0"
              spellCheck="false"
              value={amountInput}
              inputProps={{
                style: {
                  textAlign: "end",
                  padding: 0,
                  fontFamily: theme.typography.body1.fontFamily,
                  fontSize: theme.typography.body1.fontSize,
                },
              }}
              onChange={(e) => {
                setAmountInput(e.target.value)
              }}
              onFocus={(e) => e.target.select()}
              fullWidth
            />
          </Box>
          {/* <TokenInput
            inputValue={amountInput}
            // token={userGauge.lpToken}
            // max={formatUnits(
            //   stakeStatus === "stake"
            //     ? userGauge.userWalletLpTokenBalance
            //     : userGauge.userStakedLpTokenBalance,
            //   userGauge.lpToken.decimals,
            // )}
            showUSDprice={false}
            onChange={setAmountInput}
          /> */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!isInputValid}
            onClick={() =>
              void (stakeStatus === "stake" ? onClickStake : onClickUnstake)()
            }
          >
            {stakeStatus === "stake" ? "Stake" : "Unstake"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
