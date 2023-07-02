import {
    Container,
    Flex,
    VStack,
    useDisclosure,
    Button,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Divider,
} from '@chakra-ui/react';
import { AiOutlinePlus } from 'react-icons/ai';
import CreateEvent from '@/components/CreateEvent/Main';
import { Events, PrismaClient } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';
import EventCategory from '@/components/EventCategory';
import { useEffect, useState } from 'react';
import { useEventStorage } from '../../storage';
import React from 'react';
import { useAccount } from 'wagmi';
import useSWR from 'swr';
import MyEvents from '@/components/MyEvent';

const prisma = new PrismaClient();

export default function Event({ expired, ongoing }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { address } = useAccount()

    const fetcher = (url: string, address: `0x${string}` | undefined) => fetch(url, {
        method: 'POST',
        body: JSON.stringify({ address })
    }).then((res) => res.json())

    const { data, error, isLoading } = useSWR(
        "myevents",
        () => fetcher('/api/myevents', address)
    );

    const { success, msg }: { success: boolean, msg: Events[] } = data ? data : { success: false, msg: '' }

    const { setEventInformation } = useEventStorage()


    const [myevents, setmyevents] = useState<{ success: boolean, msg: string }>({ msg: '', success: false })

    useEffect(() => {
        const fetchData = async () => {
            let price = { price: '0' };
            try {
                const res = await fetch('https://api.binance.com/api/v3/avgPrice?symbol=FTMUSDT');
                const price_result = await res.json();
                price = price_result;
            } catch (error) {
                console.error(error);
            }
            setEventInformation({
                price: parseFloat(price.price)
            });
        };

        fetchData();
    }, []);



    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Container maxW="5xl" p={{ base: 5, md: 10 }}>
            <CreateEvent onClose={
                onClose
            } isOpen={isOpen} />
            <Tabs isFitted variant={'enclosed-colored'}>
                <TabList>
                    <Tab fontSize={'xs'}>🟢 Ongoing</Tab>
                    <Tab fontSize={'xs'}>❌ Expired</Tab>
                    <Tab fontSize={'xs'}>💼 My Events</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel p={2}>
                        <Flex justify="space-between" mb={3}>
                            <Button onClick={onOpen} leftIcon={<AiOutlinePlus />} bgColor={'blue.800'} color={'white'} variant="outline">
                                Host Event
                            </Button>
                        </Flex>
                        <VStack border="1px solid" borderColor="gray.400" rounded="md" overflow="hidden" spacing={2}>
                            {
                                ongoing.map((value, key) => {
                                    return (
                                        <React.Fragment key={key}>
                                            <EventCategory value={value} key={key} />
                                            <Divider w={'95%'} />
                                        </React.Fragment>)
                                })
                            }
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <VStack border="1px solid" borderColor="gray.400" rounded="md" overflow="hidden" spacing={0}>
                            {
                                expired.map((value, key) => {

                                    return (<React.Fragment key={key}>
                                        <EventCategory value={value} key={key} />
                                        <Divider w={'95%'} />
                                    </React.Fragment>)
                                })
                            }
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <VStack border="1px solid" borderColor="gray.400" rounded="md" overflow="hidden" spacing={0}>
                            {
                                !isLoading &&
                                msg.map((value, key) => {

                                    return (<React.Fragment key={key}>
                                        <MyEvents value={value} key={key} />
                                        <Divider w={'95%'} />
                                    </React.Fragment>)
                                })
                            }
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}

export const getServerSideProps = async () => {
    const currentTime = new Date().getTime();
    const ongoing = await prisma.events.findMany({
        where: {
            duration: {
                gt: parseInt((currentTime / 1000).toFixed(0))
            },
        },
        orderBy: [{
            duration: 'asc'
        }]
    })
    const expired = await prisma.events.findMany({
        where: {
            duration: {
                lt: parseInt((currentTime / 1000).toFixed(0))
            },
        },
    })


    return { props: { ongoing, expired } }
}