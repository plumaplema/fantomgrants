import { Text, HStack } from '@chakra-ui/react';


export default function AccountBalance({ data }: { data: any | undefined }) {
    return (
        <HStack>
            <Text fontSize={'sm'}>Balance: </Text><Text fontSize={'xs'} fontWeight={'bold'}>{parseFloat(data?.formatted).toFixed(4)} FTM</Text>
        </HStack>
    );
}
