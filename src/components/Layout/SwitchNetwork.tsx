import { Box, Heading, Text, Button, useToast } from '@chakra-ui/react';
import { useSwitchNetwork } from 'wagmi';

export default function SwitchNetwork() {
    const toast = useToast()
    const { switchNetworkAsync } = useSwitchNetwork({
        chainId: 9305,
        onSuccess(data, variables, context) {
            toast({
                status: 'success',
                title: 'Success',
                description: 'Change network success'
            })
        },
        onError(error, variables, context) {
            toast({
                title: error.name,
                status: 'error'
            })
        },
    })
    return (
        <Box h={'100vh'} textAlign="center" justifyContent={'center'} alignItems={'center'} py={10} px={6}>
            <Heading
                display="inline-block"
                as="h2"
                size="2xl"
                pt={5}
                bgGradient="linear(to-r, whiteAlpha.600, whiteAlpha.900)"
                backgroundClip="text">
                Error Network
            </Heading>
            <Text color={'myPalette.400'} fontSize="18px" mt={3} mb={2}>
                You are using a different network
            </Text>
            <Text color={'gray.900'} mb={6}>
                Switch to Theta Tesnet Network
            </Text>
            {
                switchNetworkAsync &&
                (<Button
                    colorScheme="teal"
                    color="white"
                    onClick={async () => {
                        try {
                            await switchNetworkAsync?.()
                        } catch (error) {
                        }
                    }}
                    variant="outline">
                    Switch Network
                </Button>)
            }

        </Box>
    );
}