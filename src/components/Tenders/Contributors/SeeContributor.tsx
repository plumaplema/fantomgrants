import { TokensResult } from "@/components/Helpers/FormsField";
import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";

interface ContributorsInterface {
    contributor: `0x${string}`;
    amount: BigNumber;
}

type Data = readonly ContributorsInterface[] | undefined;

export default function SeeContributor({ isOpen, onClose, data, token, price }: { price: number, token: TokensResult, isOpen: boolean, onClose: () => void, data: Data }) {
    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            size={'sm'}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Contributors</DrawerHeader>
                <DrawerBody>
                    <TableContainer>
                        <Table size="sm">
                            <Thead>
                                <Tr fontWeight="900">
                                    <Th>Address</Th>
                                    <Th>Amount Token</Th>
                                    <Th>Amount USD</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data?.map((network, index) => (
                                    (ethers.utils.formatEther(network.amount) != '0.0') &&
                                    (<Tr key={index}>
                                        <Td fontSize="sm" noOfLines={1} w={'100px'}>{network.contributor}</Td>
                                        <Td fontSize="sm">{ethers.utils.formatEther(network.amount)} {token?.tokens?.Symbol}</Td>
                                        <Td fontSize="sm">{(parseFloat(ethers.utils.formatEther(network.amount)) * price).toFixed(3)} USD</Td>
                                    </Tr>)
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </DrawerBody>

                <DrawerFooter>

                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    );
}
