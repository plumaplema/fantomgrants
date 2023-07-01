import {
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
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { Projects } from "@prisma/client";
import VerifiedProposal from "./VerifiedProposal";

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
                                            <Tr >
                                                <Th fontSize={'xs'}>Project Title</Th>
                                                <Th fontSize={'xs'}>Pool Shares</Th>
                                                <Th fontSize={'xs'}>Pool Shares Rate</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {verified.map((event, index) => (
                                                <VerifiedProposal key={index} event={event} />
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
