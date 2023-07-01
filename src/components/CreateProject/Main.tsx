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
import UploadVideo from './UploadVideo';
import UploadFile from './UploadFile';
import Finalize from './Finalize';
import { useCreateProject } from '../../../storage';

export default function CreateProject({ isOpen, onClose, id }: { isOpen: boolean, onClose: () => void, id: number }) {
    const { setIndex, index } = useCreateProject()
    return (
        <Drawer isOpen={isOpen} placement="left" size={'sm'} onClose={onClose}>
            <DrawerOverlay >
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Text fontWeight={'extrabold'} fontSize={'md'} color={'black'}>
                            Create a Project
                        </Text>
                        <StepperEvent />
                    </DrawerHeader>
                    <DrawerBody>
                        {
                            (index == 0) && (<UploadVideo />)
                        }
                        {
                            (index == 1) && (<UploadFile />)
                        }
                        {
                            (index == 2) && (<Finalize categoryId={id} onClose={onClose} />)
                        }
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    );
}
