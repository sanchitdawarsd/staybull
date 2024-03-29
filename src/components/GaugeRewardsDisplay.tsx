import { Box, Typography } from "@mui/material"
import React, { ReactElement } from "react"
import { commify, formatBNToString } from "../utils"

import { GaugeApr } from "../providers/AprsProvider"

export default function GaugeRewardsDisplay({
  aprs: gaugeAprs,
}: {
  aprs?: GaugeApr[] | null
}): ReactElement | null {
  if (!gaugeAprs) return null
  return (
    <>
      {gaugeAprs.map((aprData) => {
        if (!aprData.rewardToken) return null
        const { symbol, address, decimals } = aprData.rewardToken
        if (aprData.amountPerDay) {
          const { max } = aprData.amountPerDay
          if (max.isZero()) return null
          return (
            <Box key={address}>
              <Typography component="p" color="secondary">
                {symbol}/24h:
              </Typography>
              <Typography component="span" variant="subtitle1">
                {`${commify(formatBNToString(max, decimals, 0))}`}
              </Typography>
            </Box>
          )
        } else if (aprData.apr) {
          const { max } = aprData.apr
          if (max.isZero()) return null
          return (
            <Box key={address}>
              <Typography component="p" variant="subtitle1" color="secondary">
                {/* {symbol} apr: */}
              </Typography>
              <Typography component="span">{max.toString()} %</Typography>
            </Box>
          )
        }
      })}
    </>
  )
}
