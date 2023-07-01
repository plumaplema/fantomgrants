import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";

interface ContributorsInterface {
    contributor: `0x${string}`;
    amount: BigNumber;
}

type Data = readonly ContributorsInterface[] | undefined;

export const data = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
];

export default function Calculator({ isOpen, onClose, title, categoryId }: { categoryId: number | string, isOpen: boolean, onClose: () => void, title: string }) {
    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            size={'md'}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Live Calculator</DrawerHeader>
                <DrawerBody>
                </DrawerBody>

                <DrawerFooter>

                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    );
}
