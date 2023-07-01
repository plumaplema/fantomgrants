import {
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Table,
    TableContainer,
    Tabs,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { Projects } from "@prisma/client";
import Link from "next/link";

type CreateProjectData = {
    projectTitle: string;
    projectDescription: string;
    name: string;
    projectLink: string;
};

export default function ShowProjectsToUsers({
    verified,
    unverified,
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
    verified: Array<Projects>;
    unverified: Array<Projects>;
}) {
    return (
        <Drawer size="lg" isOpen={isOpen} onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader fontSize={"sm"}>Proposals</DrawerHeader>
                <DrawerCloseButton />
                <DrawerBody>
                    <Tabs isFitted variant={"enclosed-colored"}>
                        <TabList>
                            <Tab fontSize={"xs"}>✔️ Verified</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel p={2}>
                                <TableContainer>
                                    <Table size="lg">
                                        <Thead>
                                            <Tr fontSize={'xs'} >
                                                <Th>Project Title</Th>
                                                <Th>Funds</Th>
                                                <Th>Pool Shares</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {verified.map((event, index) => (
                                                <Tr key={index}>
                                                    <Link href={`/projects/${event.id}`}>
                                                        <Td _hover={{
                                                            color: 'blue.700'
                                                        }} fontWeight={'bold'} fontSize="sm">{event.projectTitle}</Td>
                                                    </Link>

                                                    <Td fontSize="sm">{event.projectFunds}</Td>
                                                    <Td>
                                                        <Box
                                                            w="100%"
                                                            rounded="md"
                                                        >
                                                            <Box
                                                                w={100}
                                                                h={2}
                                                                bg="blue.400"
                                                                rounded="md"
                                                            ></Box>
                                                        </Box>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
