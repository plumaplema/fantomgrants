import {
    chakra,
    Stack,
    Box,
    Button,
    useColorModeValue,
    Text,
    VStack,
    SimpleGrid,
    ListIcon,
    ListItem,
    List,
    useDisclosure,
} from '@chakra-ui/react';
import { BsEnvelopePaper, BsEye } from 'react-icons/bs';
import { Events, Projects } from '@prisma/client';
import { useState, useEffect } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { abi, contract_address } from '../Helpers/contract';
import { AiFillAlert, AiFillStop } from 'react-icons/ai';
import { BigNumber, ethers } from 'ethers';
import { useEventStorage } from '../../../storage';
import Countdown from 'react-countdown';
import { MdAdd } from 'react-icons/md';
import Donate from '../DonateToEvent/Donate';
import CreateProject from '../CreateProject/CreateProject';
import { useRouter } from 'next/router';
import ShowProjects from '../ShowProjects';
import ShowProjectsToUsers from '../ShowProjectsToUsers';

const Event = ({ res, verified, unverified }: { res: Events, verified: Array<Projects>, unverified: Array<Projects> }) => {
    const [eventId, seteventId] = useState<string>('0')

    const { price } = useEventStorage()

    const { address } = useAccount()
    const { name, description, organization, nftsecurity, fundingpool, duration, owner } = res

    const eventowned = address as string == owner
    const router = useRouter()

    useEffect(() => {
        if (router.isReady) {
            const { eventId } = router.query
            console.log(router.query)
            seteventId(eventId as string)
        }
    }, [router.isReady])

    var currentTime = Date.now();
    const expired = duration * 1000 < currentTime

    const { isLoading, data, refetch } = useContractRead({
        abi: abi,
        address: contract_address,
        functionName: 'eventByIndex',
        args: [eventId ? eventId : '0'],
        enabled: router.isReady,
    })

    const { isOpen, onClose, onOpen } = useDisclosure()

    const openCreateProject = useDisclosure()
    const openShowProject = useDisclosure()

    const increase = (parseFloat(ethers.utils.formatEther(data ? data.fundingPool : BigNumber.from(0))) - fundingpool) / fundingpool
    const increaseRate = (increase * 100).toFixed(2)

    return (
        <Box pb={8}>
            <Stack
                pos="relative"
                bgGradient={`linear(to-l, blue.500, blue.400 , cyan.400)`}
                height="250px"
                w="100%"
            ></Stack>
            {
                eventowned ? (<ShowProjects onClose={openShowProject.onClose} isOpen={openShowProject.isOpen} unverified={unverified} verified={verified} />) : (<ShowProjectsToUsers onClose={openShowProject.onClose} isOpen={openShowProject.isOpen} unverified={unverified} verified={verified} />)
            }
            <Donate refetch={refetch} isOpen={isOpen} onClose={onClose} id={eventId} />
            <CreateProject currentTax={data ? data.initialTax.toNumber() : 0} id={eventId} isOpen={openCreateProject.isOpen} onClose={openCreateProject.onClose} />
            <Box justifyContent={'center'} maxW="fit-content" p={4} isolation="isolate" zIndex={3} mt="-10rem" marginInline="auto">
                <Box
                    boxShadow={useColorModeValue(
                        '0 4px 6px rgba(160, 174, 192, 0.6)',
                        '0 4px 6px rgba(9, 17, 28, 0.9)'
                    )}
                    bg={useColorModeValue('white', 'gray.800')}
                    p={{ base: 4, sm: 8 }}
                    overflow="hidden"
                    rounded="2xl"
                >
                    <Stack pos="relative" zIndex={1} direction="column" spacing={5} textAlign="left">
                        <VStack>
                            <chakra.h1 fontSize="4xl" lineHeight={1} fontWeight="bold">
                                {name}
                            </chakra.h1>
                            <Text fontSize={'xs'}>
                                by: <b>{organization}</b>
                            </Text>
                            <Text color={'red.400'} fontWeight={'bold'} fontSize={'sm'}>
                                <Countdown date={duration * 1000} />
                            </Text>

                        </VStack>

                        <chakra.h1 textAlign={'justify'} textIndent={'30px'} color="gray.400" fontSize="md" maxW="600px" lineHeight={1.2}>
                            {description}
                        </chakra.h1>

                        <List>
                            <SimpleGrid columns={[1, 2]}>
                                <ListItem>
                                    <ListIcon as={AiFillAlert} color="green.400" />
                                    <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                                        Total Funding Pool :&nbsp;
                                    </Text>
                                    <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                                        {ethers.utils.formatEther(data ? data.fundingPool : BigNumber.from(0))} FTM
                                    </Text>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={AiFillAlert} color="green.400" />
                                    <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                                        Amount in USD :&nbsp;
                                    </Text>
                                    <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                                        {parseFloat(ethers.utils.formatEther(data ? data.fundingPool : BigNumber.from(0))) * (price ? price : 0)} USD
                                    </Text>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={AiFillAlert} color="green.400" />
                                    <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                                        Initial Tax :&nbsp;
                                    </Text>
                                    <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                                        {data ? data.initialTax.toNumber() / 100 : 0} %
                                    </Text>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={AiFillAlert} color="green.400" />
                                    <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                                        Tax Increment Rate :&nbsp;
                                    </Text>
                                    <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                                        {data ? data.taxIncrementRate.toNumber() / 100 : 0} %
                                    </Text>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={AiFillStop} color="green.400" />
                                    <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                                        Tax Capped :&nbsp;
                                    </Text>
                                    <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                                        {data ? data.taxCapped.toNumber() / 100 : 0} %
                                    </Text>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={AiFillAlert} color="green.400" />
                                    <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                                        NFT Whitelisting :&nbsp;
                                    </Text>
                                    <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                                        {nftsecurity ? data?.nftContract : "Disabled"}
                                    </Text>
                                </ListItem>
                            </SimpleGrid>
                        </List>
                        <Stack justifyContent={'center'} direction={{ base: 'column', md: 'row' }} spacing={3}>
                            <Button
                                h={10}
                                px={6}
                                color="white"
                                fontSize="md"
                                rounded="md"
                                onClick={openShowProject.onOpen}
                                leftIcon={<BsEye />}
                                lineHeight={1}
                                bg="blue.400"
                                _hover={{ bg: 'blue.600' }}
                            >
                                View Projects
                            </Button>
                            <Button
                                leftIcon={<MdAdd />}
                                rounded="md"
                                isDisabled={expired}
                                colorScheme="gray"
                                variant="solid"
                                onClick={onOpen}
                            >
                                Donate To Event
                            </Button>
                            {
                                !eventowned &&
                                (
                                    <Button
                                        leftIcon={<BsEnvelopePaper />}
                                        rounded="md"
                                        onClick={openCreateProject.onOpen}
                                        color="white"
                                        variant="solid"
                                        isDisabled={expired}
                                        colorScheme="purple"
                                        _hover={{ bg: 'purple.600' }}
                                    >
                                        Submit Project Proposal
                                    </Button>
                                )
                            }

                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default Event;