import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Home from "@/pages";
import { useAccount, useNetwork, useDisconnect } from "wagmi";
import SwitchNetwork from "./SwitchNetwork";


export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [hasMounted, setHasMounted] = useState(false);

    // Hooks
    useEffect(() => {
        setHasMounted(true);
    }, [])

    const { isDisconnected, isConnected, address } = useAccount()
    const { chain } = useNetwork()
    const { disconnectAsync } = useDisconnect()

    const incorrectChain = chain?.id != 4002

    const islogged = isConnected && chain

    // Render
    if (!hasMounted) return null;

    if (incorrectChain && islogged) {
        return (
            <Flex bg={'myPalette.200'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                <SwitchNetwork />
            </Flex>
        )
    }

    return (
        <Flex justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
            <Navbar />
            {
                islogged ?
                    (children) :
                    <Home />
            }
            <Footer />
        </Flex>

    )
}