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
    List,
    ListItem,
    Text,
    ListIcon,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import AccountBalance from "../CreateEvent/Subcomponents/AccountBalance";
import {
    useAccount,
    useBalance,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { abi, contract_address } from "../Helpers/contract";
import { useState } from "react";
import { Projects } from "@prisma/client";
import { AiOutlineCheck } from "react-icons/ai";

type DonateFormData = {
    amount: string;
};

export default function DonateToProject({ isOpen, onClose, res, refetch, projectMatchrefetch, tax }: { tax: number, projectMatchrefetch: () => void, res: Projects | null, refetch: () => void, isOpen: boolean; onClose: () => void; id: string }) {
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

    const { eventsId, id } = res ? res : { eventsId: '', id: '' }

    const { amount } = watch()

    console.log(typeof (amount))

    const { config } = usePrepareContractWrite({
        abi: abi,
        address: contract_address,
        functionName: 'donateToProject',
        args: [eventsId, id],
        overrides: {
            value: ethers.utils.parseEther(amount == '' ? '0.0001' : (!Number.isNaN(Number(amount)) ? amount : '0.001'))
        },
        onSettled: (data, err) => {
            console.log(data, err)
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
            toast({
                title: "Success Donating to Project",
                status: 'success'
            })
            setloading(false)
            refetch()
            projectMatchrefetch()
            onClose()
        },
        onError(err) {
            toast({
                title: err.name,
                description: err.message,
                status: 'error'
            })
        },

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
                            <List>
                                <ListItem>
                                    <ListIcon as={AiOutlineCheck} />
                                    <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                                        Current Tax :&nbsp;
                                    </Text>
                                    <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                                        {tax / 100} %
                                    </Text>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={AiOutlineCheck} />
                                    <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                                        Goes to Project :&nbsp;
                                    </Text>
                                    <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                                        {(parseFloat(amount) - (parseFloat(amount) * tax / 10000)).toFixed(4)} FTM
                                    </Text>

                                </ListItem>
                                <ListItem>
                                    <ListIcon as={AiOutlineCheck} />
                                    <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                                        Goes to Public Pool :&nbsp;
                                    </Text>
                                    <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                                        {(parseFloat(amount) * tax / 10000).toFixed(4)} FTM
                                    </Text>
                                </ListItem>
                            </List>
                            <ModalFooter>
                                <Button isDisabled={!Boolean(writeAsync)} w={'100%'} colorScheme="green" isLoading={loading} type="submit" variant="outline">
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
