import { WagmiConfig, createClient, configureChains, } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import React from 'react'
import { Layout } from "../components/Layout/Layout"
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { BuildBear } from "../components/Helpers/CustomChain"
import Head from "next/head"
import logo from '../pages/assets/Fantom.png'

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)"
};

const customTheme = extendTheme({
  colors: {
    myPalette: {
      100: "#537188",
      200: "#CBB279",
      300: "#E1D4BB",
      400: "#EEEEEE",
    },
  },
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles
              }
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label": {
              ...activeLabelStyles
            },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top"
            }
          }
        }
      }
    }
  }
});


export const { chains, provider } = configureChains(
  [BuildBear],
  [publicProvider()]
)

/*const walletConnect = new WalletConnectConnector({
  chains,
  options: {
    projectId: '708d0b2905402255a915c4602d66c679',
  }
}) */

const metamask = new MetaMaskConnector({
  chains,
  options: {
  }
})

const client = createClient({
  autoConnect: true,
  connectors: [
    metamask,
  ],
  provider,
})

export default function App({ Component, pageProps }: any) {
  return (
    <ChakraProvider theme={customTheme}>
      <React.StrictMode>
        <WagmiConfig client={client}>
          <Head>
            <title>Fantom Grants</title>
            <link
              rel="icon"
              href={logo.src}
              type="image/<generated>"
              sizes="<generated>"
            />
          </Head>
          <Layout >
            <Component {...pageProps} />
          </Layout>
        </WagmiConfig>
      </React.StrictMode>
    </ChakraProvider>)
}