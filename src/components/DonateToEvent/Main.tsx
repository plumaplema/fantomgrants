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
import { useDonatePool } from '../../../storage';
import { ethers } from 'ethers';
import { TokensResult } from '../Helpers/FormsField';
import ApprovedSpender from './ApproveSpender';
import SubmitDonationToPool from './SubmitDonationToPool';

interface FormData_ {
    amount: number
}

interface Props {
    title: string;
    index: ethers.BigNumber;
    description: string;
    video_id: string;
    fundingPool: ethers.BigNumber;
    duration: ethers.BigNumber;
    taxRate: ethers.BigNumber;
    taxIncrementRate: ethers.BigNumber;
    taxCapped: ethers.BigNumber;
    nftContract: `0x${string}`;
}

export default function DonateToPool({ isOpen, onClose, price, index_, eventData, tokenResult }: { isOpen: boolean, onClose: () => void, price: number, index_: number, eventData: Props, tokenResult: TokensResult }) {
    const { setIndex, index } = useDonatePool()
    return (
        <Drawer isOpen={isOpen} placement="left" size={'sm'} onClose={onClose}>
            <DrawerOverlay >
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Text fontWeight={'extrabold'} fontSize={'md'} color={'black'}>
                            Donate to {eventData.title}
                        </Text>
                        <StepperEvent />
                    </DrawerHeader>
                    <DrawerBody>
                        {
                            index == 0 && <ApprovedSpender index={index_} price={parseFloat(price as unknown as string)} tokenResult={tokenResult} />
                        }
                        {
                            index == 1 && <SubmitDonationToPool tokenResult={tokenResult} price={price} index={index_} onClose={onClose} />
                        }
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    );
}
