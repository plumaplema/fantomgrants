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
} from '@chakra-ui/react';
import Countdown from 'react-countdown';
import { Fragment } from 'react';
import { FaRegClock } from 'react-icons/fa';
import Link from 'next/link';
import { Events } from '@prisma/client';

export default function EventCategory({ value }: { value: Events }) {
    const { description, duration, fundingpool, id, name, organization, nftsecurity } = value
    console.log(value)
    var currentTime = Date.now();
    const expired = duration * 1000 > currentTime
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
                    <chakra.p
                        fontWeight="medium"
                        fontSize="sm"
                        color={'gray.600'}
                    >
                        Organization: {organization}
                    </chakra.p>
                    <Text
                        fontWeight="medium"
                        fontSize="xs"
                        color={'gray.600'}
                    >
                        Pool Fund: {fundingpool.toFixed(4)} FTM
                    </Text>
                    <Text
                        fontWeight="medium"
                        fontSize="xs"
                        color={nftsecurity ? 'green.800' : 'red.800'}
                    >
                        NFT WhiteListing: {nftsecurity ? 'Enabled' : 'Disabled'}
                    </Text>

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
                    {expired && <Label label={"Donate"} />}
                    <Label label={"Contributors"} />
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