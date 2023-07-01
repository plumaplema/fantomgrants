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
import { useDonateProject, useFundingStorage } from '../../../storage';
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

export default function SubmitDonationToPool({ taxRate, onClose, projectId, price, tokenResult, categoryIndex, refetch }: { taxRate: number, refetch: () => void, categoryIndex: number, onClose: () => void, tokenResult: TokensResult, price: number, projectId: number }) {
    const taxRateinPercent = taxRate / 100
    console.log(taxRateinPercent)
    const { setIndex, fund, setprojectIndex, projectIndex } = useDonateProject()

    useEffect(() => {
        if (projectIndex != projectId) {
            setIndex(0)
        }
    }, [])

    const { setAllProjects } = useFundingStorage()

    const getAllProject = useContractRead({
        abi: abi,
        address: contract_address,
        functionName: 'getAllProjects',
        args: [BigNumber.from(categoryIndex)],
        onSuccess(data) {
            setAllProjects(data)
        },
        scopeKey: 'getallprojects'
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
    console.log(categoryIndex, projectId, fund)
    const { config } = usePrepareContractWrite({
        abi: abi,
        address: contract_address,
        functionName: 'donateToProject',
        overrides: {
            value: BigNumber.from(1)
        },
        args: [BigNumber.from(categoryIndex), BigNumber.from(projectId), ethers.utils.parseEther(fund.toString())]
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
            getAllProject.refetch()
        }
    })

    return (
        <Center py={1}>
            <Flex flexDirection={'column'} w={'100%'}>
                <Stack mb={3} align={'flex-start'}>
                    <List spacing={3}>
                        <ListItem>
                            <ListIcon as={MdCheckCircle} color='green.500' />
                            <Text display={'inline'}>Total amount: {fund} {tokenResult.tokens?.Symbol}</Text>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={MdCheckCircle} color='green.500' />
                            <Text display={'inline'}>Project tax rate: {taxRateinPercent} %</Text>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={MdCheckCircle} color='green.500' />
                            <Text color={"green.600"} display={'inline'}>Proceeds to project: {(fund - (taxRateinPercent / 100)).toFixed(6)} {tokenResult.tokens?.Symbol}</Text>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={MdCheckCircle} color='red.500' />
                            <Text color={"red.600"} display={'inline'}>Proceeds to public fund pool: {(fund - (fund - (taxRateinPercent / 100))).toFixed(6)} {tokenResult.tokens?.Symbol}</Text>
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