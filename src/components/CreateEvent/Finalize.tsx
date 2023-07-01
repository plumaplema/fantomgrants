import { Center, Stack, Flex, Button, SimpleGrid, useToast } from '@chakra-ui/react';
import { useEventIndex, useEventStorage } from '../../../storage';
import { IconType } from 'react-icons';
import { BigNumber, ethers } from 'ethers';
import { useRouter } from 'next/router';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount } from 'wagmi';
import { abi, contract_address } from '../Helpers/contract';
import { useEffect, useState } from 'react';
import { Events } from '@prisma/client';
import ListFinalize from './Subcomponents/ListFinalize';
import { generateRandomString } from '../Helpers/utils';

interface ListItemInterface {
    icon: IconType,
    label: string,
    item: string | number | undefined
}

export default function Finalize({ onClose }: { onClose: () => void }) {
    const [loading, setloading] = useState<boolean>(false)
    const [id, setId] = useState<string | undefined>(undefined)

    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined)

    useEffect(() => {
        const randId = generateRandomString(30)
        setId(randId)
    }, [])

    const { name, organization, description, fundingpool, price, endTime, nftcontract, taxCapped, taxIncrementRate, taxRate } = useEventStorage()

    const { setIndex } = useEventIndex()

    const { address } = useAccount()

    const toast = useToast()

    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }

    const { config } = usePrepareContractWrite({
        abi: abi,
        address: contract_address,
        functionName: 'addEvent',
        args: [id ? id : '', BigNumber.from(endTime ? endTime : 0), BigNumber.from((taxRate ? taxRate : 0) * 100), BigNumber.from((taxIncrementRate ? taxIncrementRate : 0) * 100), BigNumber.from((taxCapped ? taxCapped : 0) * 100), nftcontract as `0x${string}`],
        overrides: {
            value: ethers.utils.parseEther(fundingpool ? fundingpool as unknown as string : '0')
        },
        onError(err) {
            console.log(err)
        },
        onSuccess(data) {
            console.log(data)
        }
    })

    const { writeAsync } = useContractWrite({
        ...config,
        onSuccess(data) {
            setHash(data.hash)
        },
        onError(err) {
            toast({
                title: err.name,
                description: err.message,
                status: 'error'
            })
            setloading(false)
        },
    })

    useWaitForTransaction({
        hash: hash,
        onSuccess: async (data) => {
            const datas: Events = {
                owner: address as string,
                alreadyDistributed: false, description: description ? description : '', duration: endTime ? endTime : 100, fundingpool: fundingpool ? parseFloat(fundingpool as unknown as string) : 0,
                id: id ? id : '', name: name ? name : '', nftsecurity: false, organization: organization ? organization : ''
            }
            await fetch('/api/addevent', {
                body: JSON.stringify(datas),
                method: 'POST'
            }).then(res => res.json().then(res => {
                if (res.success) {
                    toast({
                        title: "Success creating an event",
                        status: 'success'
                    })
                    setIndex(0)
                    refreshData()
                    onClose()
                } else {
                    toast({
                        title: "Error creating an event",
                        status: 'error'
                    })

                }
            })).catch(err => {
                toast({
                    title: "Error creating an event",
                    status: 'error'
                })
                setloading(false)
            })
            setloading(false)
        },
        onError(err) {
            toast({
                title: err.name,
                description: err.message,
                status: 'error'
            })
            setloading(false)
        },
    })

    return (
        <Center py={1}>
            <Flex flexDirection={'column'} w={'100%'}>
                <Stack pt={10} align={'flex-start'}>
                    <ListFinalize />
                </Stack>
                <SimpleGrid mt={2} columns={[1]} spacing={2}>
                    <Button isLoading={loading} loadingText={"Please Wait"} isDisabled={writeAsync ? false : true} onClick={async () => {
                        setloading(true)
                        try {
                            console.log(1)
                            await writeAsync?.()
                        } catch (error) {
                            console.log(error)
                            setId(undefined)
                            setloading(false)
                        }
                    }} colorScheme='blue'>Finalize</Button>
                </SimpleGrid>
            </Flex>
        </Center>
    );
}