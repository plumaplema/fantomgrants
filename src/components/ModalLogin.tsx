import { Button, Flex, VStack, Image, Heading, Modal, ModalOverlay, ModalContent, useToast, ModalHeader, ModalCloseButton, ModalBody, Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";
import logo from '../pages/assets/Fantom.png';
import { useConnect } from "wagmi";
import { useState } from "react";
import metamaskicon from '../pages/assets/metamask.png';

export default function ModalLoginPage(modalData: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { isOpen, onClose } = modalData
    const [loading, setLoading] = useState<boolean>(false)
    const toast = useToast()
    const { connect, connectors } = useConnect({
        onError(error) {
            toast({
                title: error.name,
                description: error.message,
                duration: 2000,
                status: 'error'
            })
            setLoading(false)
            onClose()
        },
        onSuccess(data) {
            setLoading(false)
            onClose()
        }

    });

    return (
        <Modal size={'xl'} isOpen={isOpen} onClose={() => { onClose() }} isCentered>
            <ModalOverlay bg='none'
                backdropFilter='auto'
                backdropInvert='80%'
                backdropBlur='2px' />
            <ModalContent border={'2px solid rgba( 255, 255, 255, 0.18 )'} backgroundColor={'myPalette.200'} padding={2} >
                <ModalHeader>
                    <VStack spacing={2}>
                        <Flex borderRadius={50} position={'absolute'} top={-14} backgroundColor={'myPalette.200'}>
                            <Image src={logo.src} alt="ThetaStream Supply logo" h={100} />
                        </Flex>
                        <Heading mt={15} color={'black'} as="h1" size="lg">
                            Fantom Grants
                        </Heading>
                    </VStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack mb={4} spacing={4} align="stretch" w="100%">
                        {
                            connectors.map((connector, index) => {
                                if (connector.ready) {
                                    return (
                                        <Button
                                            color={'myPalette.400'}
                                            size="lg"
                                            bgColor={'myPalette.100'}
                                            disabled={!connector.ready}
                                            key={connector.id}
                                            variant={'outline'}
                                            leftIcon={(connector.name != 'MetaMask') ? <Image src={metamaskicon.src} h={'30px'} /> : <Image src={metamaskicon.src} h={'30px'} />}
                                            onClick={async () => {
                                                setLoading(true)
                                                connect({ connector })
                                                onClose()
                                            }}
                                        >
                                            Connect to {connector.name}
                                        </Button>
                                    )
                                }
                                return (<Alert key={index} status='error'>
                                    <AlertIcon />
                                    <AlertTitle fontSize={'md'}>Metamask not found!</AlertTitle>
                                    <AlertDescription fontSize={'sm'}>Error connecting to metamask wallet.</AlertDescription>
                                </Alert>)
                            })
                        }
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
