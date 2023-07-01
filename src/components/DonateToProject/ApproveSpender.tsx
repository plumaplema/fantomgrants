import {
    Box,
    FormControl,
    Stack,
    Button,
    Text,
    NumberInput,
    NumberInputField,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputStepper,
    useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { TokensResult } from '@/components/Helpers/FormsField';
import { erc20ABI, useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useDebounce } from 'usehooks-ts';
import { BigNumber, ethers } from 'ethers';
import { contract_address } from '../Helpers/contract';
import { useDonateProject } from '../../../storage';
import { useState } from 'react';


export default function ApprovedSpender({ tokenResult, price, projectId }: { tokenResult: TokensResult, price: number, projectId: number }) {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<{ fund: number }>({
        defaultValues: {
            fund: 0
        }
    });

    const { setFund, setIndex, setprojectIndex } = useDonateProject()
    const toast = useToast()
    const [loading, setloading] = useState<boolean>(false)

    const { address } = useAccount()

    const { data } = useContractRead({
        abi: erc20ABI,
        address: tokenResult.tokens?.Address,
        functionName: 'balanceOf',
        args: [address as `0x${string}`]
    })

    const balance = ethers.utils.formatEther(data ? data : BigNumber.from(0))

    const { fund } = watch()

    const debouncedamount = useDebounce(fund, 1000)

    const { config } = usePrepareContractWrite({
        abi: erc20ABI,
        address: tokenResult.tokens?.Address,
        functionName: 'approve',
        args: [contract_address, ethers.utils.parseEther((!isNaN(fund) && (fund as unknown as string !== '')) ? fund.toString() : '0')],
        enabled: Boolean(debouncedamount),
        onSettled(data, error) {
            console.log(data, error)
        },
    })

    const contractWrite = useContractWrite({
        ...config,
        onError: (err) => {
            toast({
                title: err.name,
                description: err.message,
                status: 'error'
            })
        }
    })

    useWaitForTransaction({
        hash: contractWrite.data?.hash,
        onSettled(data, error) {
            if (data) {
                toast({
                    title: 'Success',
                    status: 'success'
                })
                setFund(fund)
                setIndex(1)
                setprojectIndex(projectId)
            }
            setloading(false)
        },
    })

    const onSubmit = async () => {
        setloading(true)
        try {
            await contractWrite.writeAsync?.()
        } catch (error) {
            setloading(false)
        }
    }

    return (
        <Box rounded={'lg'} bg={'white'} p={2}>
            <Text p={2} fontSize={'sm'}>Token Balance: <Text fontSize={'xs'} fontWeight={'bold'}>{balance} {tokenResult.tokens?.Symbol}</Text></Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <FormControl>
                        <Text fontSize={'sm'} fontWeight={'bold'}>
                            Fund
                        </Text>

                        <NumberInput
                            variant={'filled'}
                            colorScheme='gray'
                            size={'md'}
                            defaultValue={0}
                            max={parseFloat(balance)}
                            min={0.0001}
                            step={0.001}
                        >
                            <NumberInputField
                                {...register('fund', { required: true })}
                                placeholder={"Fund Event"}
                            />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Text as='i' fontSize={'2xs'}>
                            Approximately {(debouncedamount * price).toFixed(3)} USD
                        </Text>

                    </FormControl>
                    <Stack spacing={10}>
                        <Button
                            isLoading={loading}
                            bg={'blue.400'}
                            color={'white'}
                            isDisabled={contractWrite.writeAsync == undefined}
                            _hover={{ bg: 'blue.500' }}
                            type="submit"
                        >
                            Approve Contract Spender
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Box >
    );
}
