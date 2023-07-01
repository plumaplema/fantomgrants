import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Text,
} from '@chakra-ui/react';
import StepperEvent from './Stepper';
import { useDonateProject } from '../../../storage';
import { BigNumber } from 'ethers';
import { TokensResult } from '../Helpers/FormsField';
import ApprovedSpender from './ApproveSpender';
import SubmitDonationToPool from './SubmitDonationToProject';

interface FormData_ {
    amount: number
}

interface ProjectInterface {
    index: BigNumber;
    title: string;
    video_id: string;
    file_key: string;
    fundingTotal: BigNumber;
    fundingGoal: BigNumber;
    tax: BigNumber;
    owner: `0x${string}`;
}

export default function DonateToProject({ isOpen, onClose, price, categoryId, eventData, tokenResult, projectIndex, refetch }: { refetch: () => void, projectIndex: number, categoryId: number, isOpen: boolean, onClose: () => void, price: number, eventData: ProjectInterface, tokenResult: TokensResult }) {
    const { index } = useDonateProject()
    const project = eventData
    return (
        <Drawer isOpen={isOpen} placement="left" size={'sm'} onClose={onClose}>
            <DrawerOverlay >
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Text fontWeight={'extrabold'} fontSize={'md'} color={'black'}>
                            Donate to {eventData.title} project
                        </Text>
                        <StepperEvent />
                    </DrawerHeader>
                    <DrawerBody>
                        {
                            index == 0 && <ApprovedSpender projectId={projectIndex} price={parseFloat(price as unknown as string)} tokenResult={tokenResult} />
                        }
                        {
                            index == 1 && <SubmitDonationToPool taxRate={project.tax.toNumber()} refetch={refetch} categoryIndex={categoryId} tokenResult={tokenResult} price={price} projectId={projectIndex} onClose={onClose} />
                        }
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    );
}
