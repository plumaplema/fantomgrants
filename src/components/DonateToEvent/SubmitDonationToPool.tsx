import {
    Center,
    Stack,
    Flex,
    Button,
    SimpleGrid,
    useToast,
    List,
    ListIcon,
    ListItem,
    Text
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
    erc20ABI,
    useAccount, useContractRead, useContractReads,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction
} from 'wagmi';
import { BigNumber, ethers } from 'ethers';
import { abi, contract_address } from '../Helpers/contract';
import { useDonatePool } from '../../../storage';
import { MdCheckCircle } from 'react-icons/md';

interface TokensResult {
    "tokens"?:
    {
        "id": string,
        "Address": `0x${string}`,
        "Limit": number,
        "Symbol": string,
        "Logo": string,
        "ApiPrice": string
    }
    "message"?: string
}

export default function SubmitDonationToPool({ onClose, index, price, tokenResult }: { onClose: () => void, tokenResult: TokensResult, price: number, index: number }) {

    const { setIndex, fund, setCategoryIndex, categoryIndex } = useDonatePool()

    useEffect(() => {
        if (categoryIndex != index) {
            setIndex(0)
        }
    }, [])

    const { refetch } = useContractRead({
        abi: abi,
        address: contract_address,
        functionName: 'getAllCategories',
        scopeKey: 'allcategory'
    })

    const toast = useToast();


    const [loading, setLoading] = useState(false);

    const { address } = useAccount()

    const tokensData = useContractReads({
        contracts: [{
            abi: erc20ABI,
            address: tokenResult.tokens?.Address,
            functionName: 'allowance',
            args: [address as `0x${string}`, contract_address]
        }, {
            abi: erc20ABI,
            address: tokenResult.tokens?.Address,
            functionName: 'balanceOf',
            args: [address as `0x${string}`]
        }],
        enabled: address !== undefined
    })

    const tokenAllowance_ = tokensData.data?.[0] ? tokensData.data[0] : BigNumber.from(0)
    const tokenBalance_ = tokensData.data?.[1] ? tokensData.data[1] : BigNumber.from(1)
    const tokenAllowance = ethers.utils.formatEther(tokenAllowance_ ? tokenAllowance_ : BigNumber.from(0))
    const tokenBalance = ethers.utils.formatEther(tokenAllowance_ ? tokenBalance_ : BigNumber.from(0))
    const { config } = usePrepareContractWrite({
        abi: abi,
        address: contract_address,
        functionName: 'donateToPool',
        overrides: {
            value: BigNumber.from(1)
        },
        args: [BigNumber.from(index), ethers.utils.parseEther(fund.toString())]
    })

    const { data, writeAsync } = useContractWrite({
        ...config,
        onError(error, variables, context) {
            toast({
                title: error.name,
                description: error.message,
                status: "error",
                position: 'top'
            });
            setLoading(false)
        },
    })

    useWaitForTransaction({
        hash: data?.hash,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Success donating",
                status: "success",
                position: 'top'
            });
            setLoading(false)
            setIndex(0)
            onClose()
            refetch()
        }
    })

    return (
        <Center py={1}>
            <Flex flexDirection={'column'} w={'100%'}>
                <Stack mb={3} pt={10} align={'flex-start'}>
                    <List spacing={3}>
                        <ListItem>
                            <ListIcon as={MdCheckCircle} color='green.500' />
                            <Text display={'inline'}>Total Funding Pool: {fund} {tokenResult.tokens?.Symbol}</Text>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={MdCheckCircle} color='green.500' />
                            <Text display={'inline'}>Total Amount in USD: {fund * price} USD</Text>
                        </ListItem>
                    </List>
                </Stack>
                <SimpleGrid mt={2} columns={[1, 2]} spacing={2}>
                    <Button onClick={async () => {
                        if (parseFloat(tokenAllowance) < fund) {
                            toast({
                                title: "Error",
                                description: "The contract allowance for your account is less than the desired Funding Pool",
                                status: 'error'
                            })
                            return
                        }
                        if (fund > parseFloat(tokenBalance)) {
                            toast({
                                title: "Error",
                                description: `Your ${tokenResult?.tokens?.Symbol} Balance is less than desired Fund Pool amount`,
                                status: 'error'
                            })
                            return
                        }
                        try {
                            setLoading(true)
                            await writeAsync?.()
                        } catch (error) {
                            setLoading(false)
                        }
                    }} isLoading={loading} colorScheme='blue'>Finalize</Button>
                    <Button isDisabled={loading} onClick={() => {
                        setIndex(0)
                    }} colorScheme='red' >Reset</Button>
                </SimpleGrid>
            </Flex>
        </Center>
    );
}