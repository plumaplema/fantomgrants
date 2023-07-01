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
import UnverfiedProposal from "./UnverfiedProposal";
import { useRouter } from "next/router";
import VerifiedProposal from "./VerifiedProposal";

type CreateProjectData = {
    projectTitle: string;
    projectDescription: string;
    name: string;
    projectLink: string;
};

export default function ShowProjects({
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

    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }
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
                            <Tab fontSize={"xs"}>❌ Unverified</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel p={2}>
                                <TableContainer>
                                    <Table variant={'striped'} size="md">
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
                            <TabPanel p={2}>
                                <TableContainer>
                                    <Table variant={'striped'} size="md">
                                        <Thead>
                                            <Tr fontWeight="900">
                                                <Th>Project Title</Th>
                                                <Th>Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {unverified.map((event, index) => (
                                                <UnverfiedProposal refetch={refreshData} project={event} key={index} />
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </DrawerBody>
            </DrawerContent>
        </Drawer >
    );
}
