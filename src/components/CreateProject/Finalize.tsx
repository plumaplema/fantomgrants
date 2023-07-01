import {
    Box,
    Center,
    Text,
    Stack,
    AspectRatio,
    List,
    ListIcon,
    ListItem,
    Flex,
    Button,
    HStack,
    SimpleGrid,
    useToast,
    Skeleton,
} from '@chakra-ui/react';
import { AiOutlineCheck } from 'react-icons/ai';
import { useCreateProject } from '../../../storage';
import { useState } from 'react';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import { id } from 'ethers/lib/utils.js';
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { abi, contract_address } from '../Helpers/contract';
import useSWR from 'swr';
import { api_backend } from '../Helpers/utils';

export default function Finalize({ onClose, categoryId }: { onClose: () => void, categoryId: number }) {
    const { filekey, videoId, title, setIndex, fundGoal } = useCreateProject()

    const toast = useToast()

    console.log(categoryId)
    const [loading, setLoading] = useState(false);

    const { refetch } = useContractRead({
        abi: abi,
        address: contract_address,
        functionName: 'getAllProjects',
        args: [BigNumber.from(categoryId)],
        scopeKey: 'getallprojects',
    })

    console.log(BigNumber.from(categoryId), title, videoId, filekey, BigNumber.from(fundGoal))
    const { config } = usePrepareContractWrite({
        abi: abi,
        address: contract_address,
        functionName: 'addProject',
        args: [BigNumber.from(categoryId), title, videoId, filekey, BigNumber.from(fundGoal)],
        enabled: id != undefined ? true : false,
        onSettled: (data, error) => {
            console.log(data, error)
        },
        onError(err) {
            toast({
                title: err.name,
                description: err.message,
                status: 'error'
            })
        },
    })

    const { data, writeAsync } = useContractWrite({
        ...config,
        onError(err) {
            toast({
                title: err.name,
                description: err.message,
                status: 'error'
            })
        }
    })

    useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            toast({
                title: "Success",
                description: "Success creating a project",
                status: 'success'
            })
            setLoading(false)
            refetch()
            setIndex(0)
        },
        onError(err) {
            toast({
                title: err.name,
                description: err.message,
                status: 'error'
            })
            setLoading(false)
        },
    })

    const fetcher = (url: string) => fetch(url).then(r => r.json())

    const req = useSWR(`${api_backend}status?video_id=${videoId}`, fetcher, {
        refreshInterval: 2000
    })


    return (
        <Center py={1}>
            <Flex flexDirection={'column'} w={'100%'}>
                <Box
                    position={'relative'}
                    height={'200px'}
                    rounded={'2xl'}

                    boxShadow={'2xl'}
                    width={'full'}
                    overflow={'hidden'}>
                    <AspectRatio w='100%' h={"100%"} ratio={6 / 5}>
                        {
                            (req.data?.status == 'success') ?
                                (<iframe
                                    style={{ width: "100%", height: '100%' }}
                                    src={`https://player.thetavideoapi.com/video/${videoId}`}
                                />) :
                                (
                                    <Skeleton />
                                )
                        }
                    </AspectRatio>
                </Box>
                <Stack pt={10} align={'flex-start'}>
                    <List spacing={1}>
                        <ListItem>
                            <HStack>
                                <ListIcon as={AiOutlineCheck} color="green.400" />
                                <Text display={'inline'} fontSize={'sm'} fontWeight={'bold'}>Title: </Text>
                                <Text display={'inline'} noOfLines={1} fontSize={'sm'}> {title}</Text>
                            </HStack>
                        </ListItem>
                        <ListItem>
                            <HStack>
                                <ListIcon as={AiOutlineCheck} color="green.400" />
                                <Text display={'inline'} fontSize={'sm'} fontWeight={'bold'}>Document Link: </Text>
                                <Link legacyBehavior href={`https://data.thetaedgestore.com/api/v2/data/${filekey}`} passHref>
                                    <a target="_blank" rel="noopener noreferrer">
                                        <Text display={'inline'} as='u' noOfLines={1} fontSize={'sm'}>
                                            View Document
                                        </Text>
                                    </a>
                                </Link>

                            </HStack>
                        </ListItem>
                    </List>
                </Stack>
                <SimpleGrid mt={5} columns={[1, 2]} spacing={2}>
                    <Button isLoading={loading} onClick={async () => {
                        setLoading(true)
                        try {
                            console.log("running")
                            await writeAsync?.()
                        } catch (error) {
                            console.log(error)
                        }
                    }} colorScheme='blue'>Finalize</Button>
                    <Button onClick={() => {
                        setIndex(0)
                    }} isDisabled={loading} colorScheme='red' >Reset</Button>
                </SimpleGrid>
            </Flex>
        </Center>
    );
}