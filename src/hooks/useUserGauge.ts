/*eslint-disable*/
import { BasicToken, TokensContext } from "../providers/TokensProvider"
import {
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  getChildGaugeFactory,
  getChildOracle,
  getGaugeContract,
  getGaugeMinterContract,
  getVotingEscrowContract,
  isMainnet,
  useErc20Contract,
  useToken,
} from "./useContract"

import { BigNumber } from "@ethersproject/bignumber"
import { ChainId } from "../constants/networks"
import { ContractTransaction } from "ethers"
import { GaugeContext } from "../providers/GaugeProvider"
import { GaugeUserReward } from "../utils/gauges"
import { LiquidityGaugeV5 } from "../../types/ethers-contracts/LiquidityGaugeV5"
import { UserStateContext } from "../providers/UserStateProvider"
import { Web3Provider } from "@ethersproject/providers"
import { Zero } from "@ethersproject/constants"
import { calculateBoost, getMulticallProvider } from "../utils"
import { enqueueToast } from "../components/Toastify"
import { useActiveWeb3React } from "."
import { useRegistryAddress } from "./useRegistryAddress"
import { Masterchef } from "../../types/ethers-contracts/Masterchef"

type UserGauge = {
  stake: Masterchef["deposit(uint256,uint256)"]
  unstake: Masterchef["withdraw(uint256,uint256)"]
  claim: Masterchef["deposit(uint256,uint256)"]
  // lpToken: BasicToken
  // userWalletLpTokenBalance: BigNumber
  // userStakedLpTokenBalance: BigNumber
  // hasClaimableRewards: boolean
  // userGaugeRewards: GaugeUserReward | null
  // boost: BigNumber | null
}

export default function useUserGauge(): (
  gaugeAddress?: string,
  lpTokenAddress?: string,
) => UserGauge | null {
  const { account, library, chainId } = useActiveWeb3React()
  const { data: registryAddresses } = useRegistryAddress()

  const { gauges } = useContext(GaugeContext)
  const userState = useContext(UserStateContext)
  const tokens = useContext(TokensContext)

  const [veSdlBalance, setVeSdlBalance] = useState(Zero)
  const [totalVeSdl, setTotalVeSdl] = useState(Zero)

  useEffect(() => {
    const fetchVeSdlBalance = async () => {
      if (!account || !chainId || !library) {
        return
      }

      await retrieveAndSetSDLValues(
        account,
        chainId,
        library,
        setVeSdlBalance,
        setTotalVeSdl,
      )
    }

    void fetchVeSdlBalance()
  }, [account, chainId, library])

  return useCallback(
    (gaugeAddress?: string, lpTokenAddress?: string) => {
      const gauge = Object.values(gauges).find(
        ({ address }) => address === gaugeAddress,
      )

      const lpToken = tokens?.[lpTokenAddress ?? ""]
      console.log("tokenss", lpToken)
      if (lpTokenAddress) {
        // const lptokencontract = useToken(lpTokenAddress.toString())
        // let lpdecimal = lptokencontract?.decimals()
        // let lpsymbol = lptokencontract?.symbol()
        // let lpname = lptokencontract?.name()
        console.log(lpTokenAddress, "details")
      }

      if (
        !account ||
        !chainId ||
        !gaugeAddress ||
        !lpTokenAddress ||
        !library
      ) {
        return null
      }

      const gaugeContract = getGaugeContract(
        library,
        chainId,
        gaugeAddress,
        account,
      )

      return {
        stake: gaugeContract["deposit(uint256,uint256)"],
        unstake: gaugeContract["withdraw(uint256,uint256)"],
        claim: gaugeContract["deposit(uint256,uint256)"],
        // hasClaimableRewards: hasSDLRewards || hasExternalRewards,
        // lpToken,
        // userWalletLpTokenBalance:
        //   userState.tokenBalances?.[lpToken.address] || Zero,
        // userStakedLpTokenBalance: userGaugeRewards?.amountStaked || Zero,
        // userGaugeRewards: userGaugeRewards || null,
        // boost,
      }
    },
    [
      account,
      chainId,
      gauges,
      library,
      registryAddresses,
      userState,
      tokens,
      veSdlBalance,
      totalVeSdl,
    ],
  )
}

export async function retrieveAndSetSDLValues(
  account: string,
  chainId: ChainId,
  library: Web3Provider,
  setVeSdlBalance: (value: SetStateAction<BigNumber>) => void,
  setTotalVeSdl: (value: SetStateAction<BigNumber>) => void,
): Promise<void> {
  let [veSDLBalance, veSDLSupply] = [Zero, Zero]
  try {
    const votingEscrowOrChildOracleContract = isMainnet(chainId)
      ? getVotingEscrowContract(library, chainId, account)
      : getChildOracle(library, chainId, account) // todo move to userstateprovider

    ;[veSDLBalance, veSDLSupply] = await Promise.all([
      votingEscrowOrChildOracleContract["balanceOf(address)"](account),
      votingEscrowOrChildOracleContract["totalSupply()"](),
    ])
  } catch (e) {
    console.error("Unable to update veSDL information", e)
  }

  setVeSdlBalance(veSDLBalance)
  setTotalVeSdl(veSDLSupply)
}
