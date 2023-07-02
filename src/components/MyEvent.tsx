import {
    Box,
    Stack,
    Link as ChakraLink,
    useColorModeValue,
    Flex,
    Text,
    Grid,
    HStack,
    Icon,
    chakra,
    useToast,
} from '@chakra-ui/react';
import Countdown from 'react-countdown';
import { Fragment, useState } from 'react';
import { FaRegClock } from 'react-icons/fa';
import Link from 'next/link';
import { Events } from '@prisma/client';
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { abi, contract_address } from './Helpers/contract';

export default function MyEvents({ value }: { value: Events }) {
    const { description, duration, fundingpool, id, name, organization, nftsecurity, alreadyDistributed } = value
    var currentTime = Date.now();
    const expired = duration * 1000 < currentTime

    const toast = useToast()

    const [eventData, setEventData] = useState<{ distibuted: boolean }>({ distibuted: false })

    const { } = useContractRead({
        abi: abi,
        address: contract_address,
        functionName: 'eventByIndex',
        args: [id],
        onSuccess(data) {
            const { alreadyDistributed } = data
            setEventData({ ...eventData, distibuted: alreadyDistributed })
        },
    })
    const { config } = usePrepareContractWrite({
        abi: abi,
        address: contract_address,
        functionName: 'distribute',
        args: [id],
    })

    const { writeAsync, data } = useContractWrite({
        ...config,
        onSettled: (data, error) => {
            if (error) {
                toast({
                    title: error.name,
                    description: error.message,
                    status: 'error'
                })
            }
        }
    })

    useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
            if (data) {
                toast({
                    title: 'Succesfully Distributed the funds',
                    status: 'success'
                })
            }
        },
    })

    return (
        <Fragment>
            <Grid
                templateRows={{ base: 'auto auto', md: 'auto' }}
                w="100%"
                templateColumns={{ base: 'unset', md: '4fr 2fr 2fr' }}
                p={{ base: 2, sm: 4 }}
                gap={3}
                alignItems="center"
                _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
            >

                <Box gridColumnEnd={{ base: 'span 2', md: 'unset' }}>
                    <chakra.h3 as={ChakraLink} isExternal fontWeight="bold" fontSize="lg">
                        {name}
                    </chakra.h3>
                    <Text
                        fontWeight="medium"
                        fontSize="xs"
                        color={'gray.600'}
                    >
                        Pool Fund: {fundingpool.toFixed(4)} FTM
                    </Text>
                    {
                        expired &&
                        (<Text
                            fontWeight="medium"
                            fontSize="xs"
                            color={nftsecurity ? 'green.800' : 'red.800'}
                        >
                            This Event is already expired
                        </Text>)
                    }
                    {
                        (!eventData.distibuted && expired) ?
                            (<Text
                                fontWeight="medium"
                                fontSize="xs"
                                color={nftsecurity ? 'green.800' : 'red.800'}
                            >
                                This event requires you to distribute the funds
                            </Text>) :
                            (expired && <Text
                                fontWeight="medium"
                                fontSize="xs"
                                color={'green.500'}
                            >
                                ✔️ Funds already distributed
                            </Text>)
                    }

                </Box>
                <HStack
                    spacing={{ base: 0, sm: 3 }}
                    alignItems="center"
                    fontWeight="medium"
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    color={useColorModeValue('gray.600', 'gray.300')}
                >
                    <Flex p={1} alignItems="center">
                        <Icon as={FaRegClock} w={3} h={3} mr={2} />
                        <chakra.span>
                            <Countdown date={duration * 1000} />
                        </chakra.span>
                    </Flex>
                </HStack>
                <Stack
                    spacing={2}
                    direction="row"
                    fontSize='xs'
                    justifySelf="flex-end"
                    alignItems="center"
                >
                    <Label onClick={async () => {
                        if (eventData.distibuted) {
                            toast({
                                title: "Already Distributed",
                                status: "info"
                            })
                            return
                        }
                        if (!expired) {
                            toast({
                                title: "Event is not yet ended",
                                status: "info"
                            })
                            return
                        }
                        try {
                            await writeAsync?.()
                        } catch (error) {

                        }
                    }} label={"Distribute"} />
                    <Link
                        href={`/events/${id}`}>
                        <Label label={"View"} />
                    </Link>
                </Stack>
            </Grid>
        </Fragment >
    )
}

const Label = ({ label, onClick }: { label: string, onClick?: () => void }) => {
    return (
        <chakra.p
            as={ChakraLink}
            _hover={{ bg: useColorModeValue('gray.400', 'gray.600') }}
            p={1}
            rounded="md"
            onClick={onClick}
        >
            {label}
        </chakra.p>
    );
};