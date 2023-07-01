import {
    chakra,
    Container,
    Stack,
    HStack,
    Text,
    useColorModeValue,
    Image,
    Skeleton,
    Box,
    Link as ChakraLink,
    Icon,
} from '@chakra-ui/react';
// Here we have used react-icons package for the icons
import { GoChevronRight } from 'react-icons/go';
import quadrathetagrant from '../../pages/assets/thetagrant.png';
import { MdBolt } from 'react-icons/md';
import { useRouter } from 'next/router';

const HeroSection = () => {
    const router = useRouter()
    return (
        <Container maxW="6xl" px={{ base: 6, md: 3 }} py={20}>
            <Stack direction={{ base: 'column', md: 'row' }} justifyContent="center">
                <Stack direction="column" spacing={6} justifyContent="center" maxW="480px">
                    <HStack
                        as={ChakraLink}
                        p={1}
                        rounded="full"
                        fontSize="sm"
                        w="max-content"
                        bg={useColorModeValue('gray.300', 'gray.700')}
                    >
                        <Box
                            py={1}
                            px={2}
                            lineHeight={1}
                            rounded="full"
                            color="white"
                            bgGradient="linear(to-l, #0ea5e9,#2563eb)"
                        >
                            {`What's new`}
                        </Box>
                        <HStack spacing={1} alignItems="center" justifyContent="center">
                            <Text lineHeight={1}>See our recent updates</Text>
                            <Icon as={GoChevronRight} w={4} h={4} />
                        </HStack>
                    </HStack>
                    <chakra.h1 fontSize="5xl" lineHeight={1} fontWeight="bold" textAlign="left">
                        Quadra Theta <br />
                        <chakra.span color="teal">Grants</chakra.span>
                    </chakra.h1>
                    <Text
                        fontSize="1.2rem"
                        textAlign="left"
                        lineHeight="1.375"
                        fontWeight="400"
                        color="gray.500"
                    >
                        Quadra Theta Grants is a Funding Application that utilizes Quadratic Funding to prioritize projects supported by the community.
                    </Text>
                    <HStack
                        spacing={{ base: 0, sm: 2 }}
                        mb={{ base: '3rem !important', sm: 0 }}
                        flexWrap="wrap"
                    >
                        <chakra.button
                            w={{ base: '100%', sm: 'auto' }}
                            h={12}
                            px={6}
                            color="white"
                            rounded="md"
                            mb={{ base: 2, sm: 0 }}
                            zIndex={5}
                            lineHeight={1}
                            bgGradient="linear(to-l, #0ea5e9,#2563eb)"
                            _hover={{ bgGradient: 'linear(to-l, #0ea5e9,#2563eb)', opacity: 0.9 }}
                        >
                            <chakra.span> Explore Events </chakra.span>

                            <Icon as={MdBolt} h={4} w={4} ml={1} />
                        </chakra.button>
                        <Box
                            justifyContent="center"
                            textAlign={'center'}
                            bg={useColorModeValue('white', 'gray.800')}
                            w={{ base: '100%', sm: 'auto' }}
                            border="1px solid"
                            borderColor="gray.300"
                            p={3}
                            lineHeight={1.18}
                            rounded="md"
                            boxShadow="md"
                            as={ChakraLink}
                            onClick={() => {
                                window.open('https://www.youtube.com/watch?v=HJljTtLnymE', '_blank', 'noopener,noreferrer');

                            }}
                            zIndex={55555555}
                        >
                            What is Quadratic Funding
                        </Box>
                    </HStack>
                </Stack>
                <Box ml={{ base: 0, md: 5 }} pos="relative">
                    <DottedBox />
                    <Image
                        w="95%"
                        h="95%"
                        src={quadrathetagrant.src}
                        rounded="md"
                        fallback={<Skeleton />}
                    />
                </Box>
            </Stack>
        </Container>
    );
};

function DottedBox() {
    return (
        <Box position="absolute" left="-45px" top="-30px" height="full" maxW="700px" zIndex={-1}>
            <svg
                color={useColorModeValue('rgba(55,65,81, 0.1)', 'rgba(55,65,81, 0.7)')}
                width="350"
                height="420"
                fill="none"
            >
                <defs>
                    <pattern
                        id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
                    </pattern>
                </defs>
                <rect width="404" height="404" fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"></rect>
            </svg>
        </Box>
    );
}

export default HeroSection;