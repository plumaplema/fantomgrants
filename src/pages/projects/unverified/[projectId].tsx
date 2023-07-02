import { abi, contract_address } from '@/components/Helpers/contract';
import UnverifiedProjectInfo from '@/components/UnverifiedProjectInfo';
import { Box, Stack, Flex, useColorModeValue } from '@chakra-ui/react';
import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useContractRead } from 'wagmi';

interface DataType {
    fundingPool: number,
    duration: number,
    index: string
    initialTax: number,
    taxCapped: number,
    taxIncrementRate: number,
    nftContract: `0x${string}`,
    owner: `0x${string}`
}

const prisma = new PrismaClient();

const EventId = ({ res }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter()
    const [projectId, setprojectId] = useState<string>('0')

    useEffect(() => {
        if (router.isReady) {
            const { projectId } = router.query
            console.log(router.query)
            setprojectId(projectId as string)
        }
    }, [router.isReady])

    const [projectData, setProjectData] = useState<{
        index: string;
        fundingTotal: number
        currentTax: number
        owner: `0x${string}`
        verified: boolean
    }>({
        currentTax: 0, fundingTotal: 0, index: '', owner: contract_address, verified: false
    })

    const { data, refetch } = useContractRead({
        abi: abi,
        address: contract_address,
        functionName: 'getAllProjects',
        args: [res ? res.eventsId : ''],
        onSuccess(data) {
            data.map((project, key) => {
                if (project.index == projectId) {
                    setProjectData({
                        currentTax: project.currentTax.toNumber(),
                        fundingTotal: parseFloat(ethers.utils.formatEther(project.fundingTotal)),
                        index: project.index,
                        owner: project.owner,
                        verified: project.verified
                    });
                }
            });
        }
    });


    return (
        <Flex flexDirection={'column'} w={'100%'}>
            <Box pb={8}>
                <Stack
                    pos="relative"
                    bgGradient={`linear(to-l, red.500, red.400 , blue.400)`}
                    height="250px"
                    w="100%"
                ></Stack>
                <Box justifyContent={'center'} maxWidth={'fit-content'} minWidth={['95%', '60%']} p={4} isolation="isolate" zIndex={3} mt="-10rem" marginInline="auto">
                    <Box
                        boxShadow={useColorModeValue(
                            '0 4px 6px rgba(160, 174, 192, 0.6)',
                            '0 4px 6px rgba(9, 17, 28, 0.9)'
                        )}
                        bg={useColorModeValue('white', 'gray.800')}
                        p={{ base: 4, sm: 8 }}
                        overflow="hidden"
                        rounded="2xl"
                    >
                        <UnverifiedProjectInfo refetch={refetch} projectData={projectData} res={res} />
                    </Box>
                </Box>
            </Box>
        </Flex>

    );
};

export default EventId;

export const getServerSideProps = async (context: any) => {
    const { query } = context;
    // Access query parameters from the `query` object
    const { projectId } = query;

    const res = await prisma.projects.findUnique({
        where: {
            id: projectId
        }
    })

    return { props: { res } }
}