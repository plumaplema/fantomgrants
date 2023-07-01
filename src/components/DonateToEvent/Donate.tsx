import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import AccountBalance from "../CreateEvent/Subcomponents/AccountBalance";
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { abi, contract_address } from "../Helpers/contract";
import { useState } from "react";

type DonateFormData = {
    amount: string;
};

export default function Donate({ isOpen, onClose, id, refetch }: { refetch: () => void, isOpen: boolean; onClose: () => void; id: string }) {
    const { address } = useAccount();
    const { data } = useBalance({ address: address, formatUnits: "ether" });
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined)
    const [loading, setloading] = useState<boolean>(false)
    const toast = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<DonateFormData>({
        defaultValues: {
            amount: '1.00'
        }
    });

    const [poolFund, setPoolFund] = useState<number>(0)

    const { amount } = watch()

    console.log(typeof (amount))

    useContractRead({
        abi: abi,
        address: contract_address,
        functionName: 'getTotalPoolFund',
        args: [id],
        onSettled(data) {
            const balance = parseFloat(ethers.utils.formatEther(data ? data : BigNumber.from(0)))
            setPoolFund(balance)
        }
    })

    const { config } = usePrepareContractWrite({
        abi: abi,
        address: contract_address,
        functionName: 'donateToPool',
        args: [id],
        overrides: {
            value: ethers.utils.parseEther(amount == '' ? '0.0001' : (!Number.isNaN(Number(amount)) ? amount : '0.001'))
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
            onClose()
        },
    })

    useWaitForTransaction({
        hash: hash,
        onSuccess: async (data) => {
            try {
                const payload: { eventId: string, fundingPool: number } = { eventId: id, fundingPool: poolFund + parseFloat(amount as unknown as string) }
                const res = await fetch('/api/updatefundpool', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                })
                const result: { success: boolean } = await res.json()
                if (!result) {
                    toast({
                        title: "Error",
                        description: 'Error in updating the pool fund in database'
                    })
                } else {
                    toast({
                        title: "Success Donating"
                    })
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: 'Error in updating the pool fund in database'
                })
            }
            setloading(false)
            refetch()
            onClose()
        }
    })

    const onSubmit: SubmitHandler<DonateFormData> = async (data) => {
        setloading(true)
        try {
            await writeAsync?.()
        } catch (err) {

        }
    };

    return (
        <Modal size={'xs'} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Donate</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={10}>
                        <AccountBalance data={data} />
                        <form style={{ padding: 0 }} onSubmit={handleSubmit(onSubmit)}>
                            <FormControl variant={"floating"}>
                                <NumberInput
                                    max={data ? parseFloat(data.formatted) - 0.005 : 0}
                                    min={0.001}
                                    step={0.0000000001}
                                    w={'100%'}
                                    defaultValue={1}
                                >
                                    <NumberInputField
                                        w={'100%'}
                                        {...register("amount", { required: true })}
                                    />
                                    <FormLabel>Amount</FormLabel>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                {errors.amount && (
                                    <span role="alert">Amount is required.</span>
                                )}
                            </FormControl>
                            <ModalFooter>
                                <Button w={'100%'} colorScheme="green" isLoading={loading} type="submit" variant="outline">
                                    Donate Now
                                </Button>
                            </ModalFooter>
                        </form>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
