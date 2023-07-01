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

export default function ContributorProject({ isOpen, onClose, data, tokenResult }: { tokenResult: TokensResult, isOpen: boolean, onClose: () => void, data: Data }) {
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
                <DrawerHeader>Supporters</DrawerHeader>
                <DrawerBody>
                    <TableContainer>
                        <Table size="sm">
                            <Thead>
                                <Tr fontWeight={'bold'}>
                                    <Th>Address</Th>
                                    <Th>Amount</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data?.map((network, index) => (
                                    (ethers.utils.formatEther(network.amount) != '0.0') &&
                                    (<Tr key={index}>
                                        <Td fontSize="2xs">{network.contributor}</Td>
                                        <Td fontSize="2xs">{ethers.utils.formatEther(network.amount)} {tokenResult?.tokens?.Symbol}</Td>
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
