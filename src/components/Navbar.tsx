import {
    useDisclosure,
    chakra,
    Flex,
    VisuallyHidden,
    HStack,
    Button,
    IconButton,
    VStack,
    CloseButton,
    Box,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import ModalLoginPage from './ModalLogin';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

const Nav = () => {
    const mobileNav = useDisclosure();
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { isDisconnected, isConnected, address } = useAccount()
    const { chain } = useNetwork()
    const { disconnectAsync } = useDisconnect()

    const islogged = isConnected && chain

    return (
        <React.Fragment>
            <chakra.header
                bg={'myPallete.400'}
                zIndex={1}
                w="full"
                px={{
                    base: 2,
                    sm: 4,
                }}
                py={4}
                shadow="md"
            >
                <ModalLoginPage isOpen={isOpen} onClose={onClose} />
                <Flex alignItems="center" justifyContent="space-between" mx="auto">
                    <Flex>
                        <chakra.a
                            href="/"
                            title="Choc Home Page"
                            display="flex"
                            alignItems="center"
                        >
                            <VisuallyHidden>Choc</VisuallyHidden>
                        </chakra.a>
                        <chakra.h1 color={'black'} fontSize="xl" fontWeight="medium" ml="2">
                            Fantom Grants
                        </chakra.h1>
                    </Flex>
                    <HStack display="flex" alignItems="center" spacing={1}>
                        <HStack
                            spacing={1}
                            mr={1}
                            color="myPalette.100"
                            display={{
                                base: "none",
                                md: "inline-flex",
                            }}
                        >
                            {
                                (islogged) ?
                                    (<React.Fragment>
                                        <Link href={'/'}>
                                            <Button _hover={{ bgColor: 'myPalette.300' }} color={'black'} variant="ghost">Home</Button>
                                        </Link>
                                        <Link href={'/events'}>
                                            <Button _hover={{ bgColor: 'myPalette.300' }} color={'black'} variant="ghost">Browse Events</Button>
                                        </Link>
                                        <Button color={'white'} bgColor={'red.700'} onClick={() => { disconnectAsync() }} variant="outline">Disconnect</Button>
                                    </React.Fragment>) :
                                    (<Button bgColor={'green.700'} color={'white'} onClick={onOpen} variant="outline">Connect Wallet</Button>)
                            }
                        </HStack>
                        <Box
                            display={{
                                base: "inline-flex",
                                md: "none",
                            }}
                        >
                            <IconButton
                                display={{
                                    base: "flex",
                                    md: "none",
                                }}
                                aria-label="Open menu"
                                fontSize="20px"
                                color="gray.800"
                                _dark={{
                                    color: "inherit",
                                }}
                                variant="ghost"
                                icon={<AiOutlineMenu />}
                                onClick={mobileNav.onOpen}
                            />

                            <VStack
                                pos="absolute"
                                top={0}
                                left={0}
                                right={0}
                                display={mobileNav.isOpen ? "flex" : "none"}
                                flexDirection="column"
                                p={2}
                                pb={4}
                                m={2}
                                bg={'myPalette.200'}
                                spacing={3}
                                rounded="sm"
                                shadow="sm"
                            >
                                <CloseButton
                                    aria-label="Close menu"
                                    onClick={mobileNav.onClose}
                                />
                                {
                                    (islogged) ?
                                        (<React.Fragment>
                                            <Link href={'/'}>
                                                <Button _hover={{ bgColor: 'myPalette.300' }} color={'black'} variant="ghost">Home</Button>
                                            </Link>
                                            <Link href={'/events'}>
                                                <Button _hover={{ bgColor: 'myPalette.300' }} color={'black'} variant="ghost">Browse Events</Button>
                                            </Link>
                                            <Button color={'white'} bgColor={'red.700'} onClick={() => { disconnectAsync() }} variant="outline">Disconnect</Button>
                                        </React.Fragment>) :
                                        (<Button bgColor={'green.700'} color={'white'} onClick={onOpen} variant="outline">Connect Wallet</Button>)
                                }


                            </VStack>
                        </Box>
                    </HStack>
                </Flex>
            </chakra.header>
        </React.Fragment>
    );
};

export default Nav
