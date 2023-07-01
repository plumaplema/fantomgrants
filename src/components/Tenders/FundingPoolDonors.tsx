import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useContractRead } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { abi, contract_address } from "../Helpers/contract";

interface FormData_ {
    amount: number
}

interface Props {
    title: string;
    index: BigNumber;
    description: string;
    fundingPool: BigNumber;
    duration: BigNumber;
    taxRate: BigNumber;
    taxIncrementRate: BigNumber;
    taxCapped: BigNumber;
    nftContract: `0x${string}`;
    value: number;
    price: number
}


export default function DonateToPool({ isOpen, onClose, price, index, eventData }: { isOpen: boolean, onClose: () => void, price: number, index: number, eventData: Props }) {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData_>({
        defaultValues: {
            amount: 0.01
        }
    });

    const { title } = eventData

    const { data } = useContractRead({
        abi: abi,
        address: contract_address,
        functionName: 'getAllContributionFundingPool',
        args: [eventData.index]
    })


    return (
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
            size={'md'}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{title}</DrawerHeader>

                <DrawerBody>

                </DrawerBody>

                <DrawerFooter>

                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    );
}
