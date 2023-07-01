import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Text,
} from '@chakra-ui/react';
import StepperEvent from './Stepper';
import UploadVideo from './EventInfo';
import ApprovedContract from './AntiSybilInfo';
import Finalize from './Finalize';
import { useEventIndex } from '../../../storage';

export default function CreateEvent({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { setIndex, index } = useEventIndex()
    return (
        <Drawer isOpen={isOpen} placement="left" size={'sm'} onClose={onClose}>
            <DrawerOverlay >
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Text fontWeight={'extrabold'} fontSize={'md'} color={'black'}>
                            Host an Event
                        </Text>
                        <StepperEvent />
                    </DrawerHeader>
                    <DrawerBody>
                        {
                            (index == 0) && (<UploadVideo />)
                        }
                        {
                            (index == 1) && (<ApprovedContract />)
                        }
                        {
                            (index == 2) && (<Finalize onClose={onClose} />)
                        }
                    </DrawerBody>
                    {
                        (index != 0) &&
                        (
                            <DrawerFooter justifyContent={'start'} m={0} p={3}>
                                <Button onClick={() => setIndex(0)} colorScheme='red'>Reset</Button>
                            </DrawerFooter>
                        )
                    }
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    );
}
