import { Container, Box, chakra, Text, Icon, SimpleGrid } from '@chakra-ui/react';
// Here we have used react-icons package for the icons
import { MdOutlinePersonPin, MdPermDeviceInformation, MdOutlineFlashlightOn } from 'react-icons/md';
import { SiMinds } from 'react-icons/si';
import { IconType } from 'react-icons';

interface IFeature {
    heading: string;
    content: string;
    icon: IconType;
}

const features: IFeature[] = [
    {
        heading: 'Quadratic Funding',
        content:
            'Utilize the power of Quadratic Funding to allocate grants in a fair and community-driven manner.',
        icon: MdOutlineFlashlightOn
    },
    {
        heading: 'Community Engagement',
        content: `Foster community involvement by allowing users to contribute and support their favorite projects.`,
        icon: SiMinds
    },
    {
        heading: 'Decentralized Architecture',
        content:
            ' Leverage smart contracts on the Theta network for a decentralized funding platform, ensuring security, trust, and immutability.',
        icon: MdPermDeviceInformation
    },
    {
        heading: 'Video Explanations',
        content: `Allow project owners to upload videos explaining their projects, providing a more engaging and personal way to present their ideas to the community.`,
        icon: MdOutlinePersonPin
    },
    {
        heading: 'Anti-Sybil Attack Protection',
        content: `Implement mechanisms to prevent Sybil attacks, ensuring that each participant's influence on funding decisions is proportional to their genuine support.`,
        icon: MdOutlinePersonPin
    },
    {
        heading: 'Event Hosting',
        content: `Provide a platform for everyone to host events focused on various causes such as environmental conservation, healthcare, education, and more.`,
        icon: MdOutlinePersonPin
    }
];

const Features = () => {
    return (
        <Container maxW="6xl" p={{ base: 5, md: 10 }}>
            <chakra.h3 fontSize="4xl" fontWeight="bold" mb={3} textAlign="center">
                Features
            </chakra.h3>
            <SimpleGrid columns={{ base: 1, md: 2 }} placeItems="center" spacing={16} mt={12} mb={4}>
                {features.map((feature, index) => (
                    <Box key={index} textAlign="center">
                        <Icon as={feature.icon} w={10} h={10} color="blue.400" />
                        <chakra.h3 fontWeight="semibold" fontSize="2xl">
                            {feature.heading}
                        </chakra.h3>
                        <Text fontSize="md">{feature.content}</Text>
                    </Box>
                ))}
            </SimpleGrid>
        </Container>
    );
};

export default Features;