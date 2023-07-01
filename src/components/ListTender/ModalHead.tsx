import React from 'react'
import { Flex, Heading, ModalHeader, VStack, Image } from '@chakra-ui/react'
import logo from '../../pages/assets/modallogo.png'

type Props = {
    title: string
}

export const ModalHead = (props: Props) => {
    return (
        <ModalHeader>
            <VStack spacing={5}>
                <Flex borderRadius={50} position={'absolute'} top={-14} backgroundColor={'white'}>
                    <Image src={logo.src} alt="ThetaStream Supply logo" h={100} />
                </Flex>
                <Heading mt={20} color={'black'} as="h1" size="lg">
                    {props.title}
                </Heading>
            </VStack>
        </ModalHeader>
    )
}
