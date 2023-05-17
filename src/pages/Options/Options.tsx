/* eslint-disable */
import { Box, Button, Container, Typography } from "@mui/material"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import BullLogo from "../../assets/bullLogo.png"
import InputField from "./InputField"
import OBULLogo from "../../assets/oBullLogo.png"
import React, { useEffect, useState } from "react"
import {
  useOptions,
  useOracle,
  usePaymentToken,
  useUsdc,
} from "../../hooks/useContract"
import UsdcLogo from "../../assets/icons/usdc.svg"
import { ethers } from "ethers"
import { useActiveWeb3React } from "../../hooks"
import { createMultiCallContract, getMulticallProvider } from "../../utils"
import {
  BULL_ADDRESS,
  OPTIONS_ADDRESS,
  PAYMENT_CONTRACT_ADDRESSES,
  USDC_CONTRACT_ADDRESSES,
} from "../../constants"
import { Erc20 } from "../../../types/ethers-contracts/Erc20"
import ERC20_ABI from "../../constants/abis/erc20.json"

const Options = () => {
  const [price, setPrice] = useState<any>()
  const [value, setvalue] = useState<any>()
  const [usdcvalue, setusdcvalue] = useState<any>(0)

  const [obullbalance, setobullbalance] = useState<any>(0)
  const [bullbalance, setbullbalance] = useState<any>(0)
  const [usdcbalance, setusdcbalance] = useState<any>(0)
  const [usdcallowance, setusdcallowance] = useState<any>(0)
  const { library, chainId, account } = useActiveWeb3React()

  const handleInputChange = (e: string) => {
    const cap = parseInt(obullbalance) / 10 ** 18 // Specify your cap value here
    console.log(obullbalance)
    if (Number(e) <= cap) {
      setvalue(e)
      if (e) {
        setusdcvalue(Math.ceil((parseInt(e) * price) / 10 ** 6))
      } else {
        setusdcvalue(0)
      }
    } else {
      setvalue(cap.toString())
      if (e) {
        setusdcvalue(Math.ceil(parseInt(cap.toString()) * price) / 10 ** 6)
      } else {
        setusdcvalue(0)
      }
    }

    console.log(e)
  }
  const contract = useOracle()
  const optionsContract = useOptions()
  const usdcContract = usePaymentToken()

  const exercise = async (
    value: any,
    usdcvalue: any,
    usdcbalance: any,
    usdcallowance: any,
  ): Promise<void> => {
    if (account && !(usdcbalance < usdcvalue)) {
      console.log(value, usdcvalue)
      const cvalue = parseInt(value)
      const cusdcvalue = parseInt(usdcvalue)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      console.log(ethers.utils.parseUnits(value, 18).toString())
      try {
        if (usdcallowance < usdcvalue) {
          const tx1 = await usdcContract?.["approve(address,uint256)"](
            OPTIONS_ADDRESS[chainId!],
            ethers.utils.parseUnits(usdcvalue.toString(), 6),
          )
          await tx1?.wait()
        }
        console.log(
          ethers.utils.parseUnits(cvalue.toString(), 18).toString(),
          ethers.utils.parseUnits(cusdcvalue.toString(), 6).toString(),
          "price",
        )
        const tx2 = await optionsContract?.[
          "exercise(uint256,uint256,address)"
        ](
          ethers.utils.parseUnits(cvalue.toString(), 18),
          ethers.utils.parseUnits(usdcvalue.toString(), 6),
          account,
        )
        await tx2?.wait()
      } catch (e) {
        console.log(e)
      }
    }
  }

  useEffect(() => {
    const getdata = async () => {
      if (contract) {
        const price = await contract.estimateAmountOut(
          "0x1bAAED97039B00e62183aA70642F646124b6b001",
          ethers.BigNumber.from("1000000000000000000"),
          10,
        )
        setPrice(price)
      }
      if (usdcContract && library && chainId && account) {
        const ethCallProvider = await getMulticallProvider(library, chainId)
        const tokenContract = createMultiCallContract<Erc20>(
          OPTIONS_ADDRESS[chainId],
          ERC20_ABI,
        )
        const usdcContract = createMultiCallContract<Erc20>(
          PAYMENT_CONTRACT_ADDRESSES[chainId],
          ERC20_ABI,
        )
        const bullContract = createMultiCallContract<Erc20>(
          BULL_ADDRESS[chainId],
          ERC20_ABI,
        )
        const a = await ethCallProvider.tryAll([
          tokenContract.balanceOf(account),
          usdcContract.balanceOf(account),
          usdcContract.allowance(account, OPTIONS_ADDRESS[chainId]),
          bullContract.balanceOf(account),
        ])

        setobullbalance(a[0])
        setusdcbalance(a[1])
        setusdcallowance(a[2])
        setbullbalance(a[3])
        console.log(
          usdcallowance,
          a[0]?.toString(),
          a[1]?.toString(),
          a[2]?.toString(),
          a[3]?.toString(),
        )
      }
    }
    void getdata()
  }, [account, setusdcallowance])

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
          $oBULL Price: ${(price / 10 ** 6).toFixed(15)} || $BULL Price $
          {((price * 2) / 10 ** 6).toFixed(15)} || Discount: 50%
        </Typography>
        <div style={{ margin: "auto", textAlign: "center" }}>
          <InputField
            balance={obullbalance / 10 ** 18}
            name={"oBull"}
            logoUrl={OBULLogo}
            onInput={handleInputChange}
            value={value}
          />
          <InputField
            balance={usdcbalance / 10 ** 6}
            name={"USDC"}
            logoUrl={UsdcLogo}
            onInput={handleInputChange}
            value={usdcvalue}
          />
          <ArrowDownwardIcon sx={{ marginTop: 2 }} />
          <InputField
            balance={bullbalance / 10 ** 18}
            name={"Bull"}
            logoUrl={BullLogo}
            onInput={handleInputChange}
            value={value}
          />
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
          onClick={() =>
            exercise(
              value,
              usdcvalue,
              usdcbalance / 10 ** 6,
              usdcallowance / 10 ** 6,
            )
          }
        >
          {usdcvalue == 0
            ? "Enter amount"
            : usdcbalance / 10 ** 6 < usdcvalue
            ? "Not enough usdc balance to convert"
            : usdcallowance / 10 ** 6 < usdcvalue
            ? "Approve and Convert"
            : "CONVERT TO BULL"}
        </Button>
      </Box>
    </Container>
  )
}

export default Options
