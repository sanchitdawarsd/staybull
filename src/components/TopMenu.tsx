/*eslint-disable*/
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { SDL_TOKEN } from "../constants"
import { Menu as MenuIcon } from "@mui/icons-material"
import { NavLink, NavLinkProps, useLocation } from "react-router-dom"
import React, { ReactElement, useEffect, useState } from "react"

import { AppState } from "../state"
// import NetworkDisplay from "./NetworkDisplay"
//import { RewardsBalancesContext } from "../providers/RewardsBalancesProvider"
import BullIcon from "../assets/bullLogo.png"
import BullLogo from "./BullLogo"
import SiteSettingsMenu from "./SiteSettingsMenu"
// import TokenClaimDialog from "./TokenClaimDialog"
import Web3Status from "./Web3Status"
import { areGaugesActive } from "../utils/gauges"
//import { formatBNToShortString } from "../utils"
import { isMainnet } from "../hooks/useContract"
import { useActiveWeb3React } from "../hooks"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import background from "../assets/bull-back.png"

type ActiveTabType =
  | ""
  | "pools"
  | "risk"
  | "vesdl"
  | "farm"
  | "options"
  | "buy"

const NavMenu = styled(NavLink)<NavLinkProps & { selected: boolean }>(
  ({ theme, selected }) => {
    return {
      fontWeight: selected ? "bold" : "normal",
      textDecoration: "none",
      fontSize: theme.typography.h3.fontSize,
      color: theme.palette.text.primary,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      border: !selected ? "none" : "4px solid #009c19",
    }
  },
)

function TopMenu(): ReactElement {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentModal, setCurrentModal] = useState<string | null>(null)
  const theme = useTheme()
  const isUnderLaptopSize = useMediaQuery(theme.breakpoints.down("lg"))
  const { tokenPricesUSD } = useSelector((state: AppState) => state.application)
  const sdlPrice = tokenPricesUSD?.[SDL_TOKEN.symbol]
  const handleSettingMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMoreMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (isUnderLaptopSize) {
      setDrawerOpen(true)
    } else {
      handleSettingMenu(event)
    }
  }

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme.palette.background.default)
  }, [theme.palette.background.default])

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ border: "none", backgroundImage: `url(${background})` }}
    >
      <Toolbar
        data-testid="topMenuContainer"
        sx={{
          xs: 0,
          lg: 7,
          backgroundColor: "#000000",
        }}
      >
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          my={3}
          pl={5}
          pr={9}
        >
          <Box display="flex" flex={0}>
            <NavLink to="/">
              <BullLogo
                height={isUnderLaptopSize ? "40px" : "80px"}
                color="#000"
              />
            </NavLink>
          </Box>

          <Stack
            display={isUnderLaptopSize ? "none" : "flex"}
            bottom={{ xs: theme.spacing(4) }}
            right="50%"
            flex={1}
            direction="row"
            spacing={2}
            justifyContent="center"
            padding={theme.spacing(1, 3)}
          >
            <MenuList />
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            flex={1}
            justifyContent="flex-end"
            alignItems="center"
          >
            <SDLPrice sdlPrice={sdlPrice} />
            {/* <RewardsButton setCurrentModal={setCurrentModal} /> */}
            <Box display={isUnderLaptopSize ? "none" : "block"}>
              <Web3Status />
            </Box>
            {/* <NetworkDisplay onClick={handleSettingMenu} /> */}
            <IconButton
              onClick={handleMoreMenu}
              data-testid="settingsMenuBtn"
              sx={{
                minWidth: 0,
                padding: 0.5,
                backgroundColor: theme.palette.background.default,
                borderRadius: theme.spacing(1),
              }}
            >
              <MenuIcon
                sx={{ display: !isUnderLaptopSize ? "none" : "block" }}
              />
            </IconButton>
          </Stack>
        </Box>

        <SiteSettingsMenu
          key="buttonSettings"
          anchorEl={anchorEl ?? undefined}
          close={() => setAnchorEl(null)}
        />

        {/* <TokenClaimDialog
          open={currentModal === "tokenClaim"}
          onClose={(): void => setCurrentModal(null)}
        /> */}
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          anchor="right"
          PaperProps={{ sx: { borderWidth: 0, borderRadius: 0 } }}
        >
          <Stack m={(theme) => theme.spacing(5, 5, 0, 8)}>
            <Stack onClick={() => setDrawerOpen(false)}>
              <MenuList />
            </Stack>
            <Divider />
            <Box py={2}>
              <Web3Status />
            </Box>
          </Stack>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}

// function RewardsButton({
//   setCurrentModal,
// }: {
//   setCurrentModal: React.Dispatch<React.SetStateAction<string | null>>
// }): ReactElement | null {
//   const rewardBalances = useContext(RewardsBalancesContext)
//   const formattedTotal = formatBNToShortString(rewardBalances.total, 18)

//   return IS_SDL_LIVE ? (
//     <Button
//       variant="outlined"
//       color="primary"
//       data-testid="rewardButton"
//       onClick={() => setCurrentModal("tokenClaim")}
//       endIcon={<img src={BullIcon} width={20} height={20} />}
//       sx={{ py: 3, borderRadius: 10 }}
//     >
//       {formattedTotal}
//       {"haha"}
//     </Button>
//   ) : null
// }

function MenuList() {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { pathname } = useLocation()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const activeTab = pathname.split("/")[1] as ActiveTabType
  const theme = useTheme()
  const myStyle = {
    fontWeight: "normal",
    textDecoration: "none",
    fontSize: theme.typography.h3.fontSize,
    color: theme.palette.text.primary,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  }

  return (
    <React.Fragment>
      {isMainnet(chainId) && (
        // <NavMenu to="/buy" selected={activeTab === "buy"}>

        <a
          href="https://app.uniswap.org/#/swap?inputCurrency=0x82aF49447D8a07e3bd95BD0d56f35241523fBab1&outputCurrency=0xccf8fb2374b508986a527deb89ef6ba340c83e46"
          target="_blank"
          style={myStyle}
        >
          {t("Buy")}
        </a>
        // </NavMenu>
      )}
      <NavMenu
        data-testid="swapNavLink"
        to="/"
        selected={activeTab === ""}
        sx={{ px: 3 }}
      >
        {t("swap")}
      </NavMenu>

      <NavMenu to="/pools" selected={activeTab === "pools"} sx={{ px: 3 }}>
        {t("pools")}
      </NavMenu>

      {areGaugesActive(chainId) && (
        <NavMenu to="/farm" selected={activeTab === "farm"} sx={{ px: 3 }}>
          {t("farm")}
        </NavMenu>
      )}

      {/* {isMainnet(chainId) && (
        <NavMenu to="/vesdl" selected={activeTab === "vesdl"} sx={{ px: 3 }}>
          {t("Stake")}
        </NavMenu>
      )} */}
      {isMainnet(chainId) && (
        <NavMenu to="/unlock" selected={activeTab === "options"}>
          {t("Unlock $oBULL")}
        </NavMenu>
      )}
    </React.Fragment>
  )
}

interface SDLPriceProps {
  sdlPrice: number | undefined
}

function SDLPrice({ sdlPrice }: SDLPriceProps): ReactElement | null {
  if (sdlPrice === undefined) return null

  const SUSHI_WETH_SDL_POOL_URL = "https://staybull.fi"
  return (
    <Button
      variant="outlined"
      color="primary"
      data-testid="sdlPriceButton"
      href={SUSHI_WETH_SDL_POOL_URL}
      target="_blank"
      startIcon={<img src={BullIcon} width={20} height={20} />}
      style={{ minWidth: 100 }}
      sx={{
        py: 3,
        borderRadius: 10,
        display: { xs: "none", md: "inline-flex" },
      }}
    >
      {"HOME"}
      {/* {`$${sdlPrice.toFixed(2)}`} */}
    </Button>
  )
}

export default TopMenu
