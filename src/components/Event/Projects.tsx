import { Fragment } from 'react';
import {
    Container,
    Box,
    chakra,
    Flex,
    Stack,
    VStack,
    HStack,
    Text,
    Grid,
    Icon,
    Link as ChakraLink,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { FaRegComment } from 'react-icons/fa';
import { useContractRead, useContractReads } from 'wagmi';
import { abi, contract_address } from '../Helpers/contract';
import { BigNumber, ethers } from 'ethers';
import ContributorProject from '../Tenders/Contributors/CotributorsProject';
import useSWR from 'swr';
import Comments from '../Tenders/Comments/Comments';
import { Comment } from '@prisma/client';
import { useEventsData, useFundingStorage } from '../../../storage';
import { AiOutlineHeart } from 'react-icons/ai';
import DonateToProject from '../DonateToProject/Main';
import { TokensResult } from '../Helpers/FormsField';
import Link from 'next/link';

const Projects = ({ price, tokenResults, categoryId, expired }: { expired: boolean, categoryId: number, price: number, tokenResults: TokensResult }) => {

    const { setAllProjects } = useFundingStorage()

    const { tokenPrice, tokenResult } = useEventsData()

    const { data } = useContractRead({
        abi: abi,
        address: contract_address,
        functionName: 'getAllProjects',
        args: [BigNumber.from(categoryId ? categoryId : '0')],
        onSuccess(data) {
            setAllProjects(data)
        },
        scopeKey: 'getallprojects'
    })

    return (
        <Container maxW="5xl" p={{ base: 5, md: 10 }}>
            <Flex justify="left" mb={3}>
                <chakra.h3 fontSize="2xl" fontWeight="bold" textAlign="center">
                    Projects
                </chakra.h3>
            </Flex>
            <VStack border="1px solid" borderColor="gray.400" rounded="md" overflow="hidden" spacing={0}>
                {data?.map((project, index) => {
                    return (<Project expired={expired} tokenResult={tokenResult as TokensResult} price={price} key={index} categoryId={categoryId} projectId={project.index.toNumber()} project={project} />)
                })}
            </VStack>
        </Container>
    );
};

interface ProjectInterface {
    index: BigNumber;
    title: string;
    video_id: string;
    file_key: string;
    fundingTotal: BigNumber;
    fundingGoal: BigNumber;
    tax: BigNumber;
    owner: `0x${string}`;
}

const Project = ({ project, projectId, categoryId, price, tokenResult, expired }: { expired: boolean, tokenResult: TokensResult, price: number, project: ProjectInterface, projectId: number, categoryId: number }) => {

    const { tax, file_key, video_id } = project

    const fetcher = (url: string, projectId: number) => fetch(url).then(r => r.json())

    const commentsDisclosure = useDisclosure()

    const donationDisclosure = useDisclosure()

    const commentsData = useSWR(`/api/retrievecomments?projectID=${categoryId.toString() + projectId.toString()}`, fetcher, {
        refreshInterval: 2000
    })

    const commentsData_ = commentsData.data ? commentsData.data : {
        comments: []
    }
    const { totalFunding, setTotalFunding } = useFundingStorage()

    const comments: Comment[] = commentsData_.comment ? commentsData_.comment : []

    const { data, refetch } = useContractReads({
        contracts: [
            {
                abi: abi,
                address: contract_address,
                functionName: 'projectMatchFund',
                args: [BigNumber.from(categoryId), BigNumber.from(projectId)],
            },
            {
                abi: abi,
                address: contract_address,
                functionName: 'getAllContributions',
                args: [BigNumber.from(categoryId), BigNumber.from(projectId)]
            },
            {
                abi: abi,
                address: contract_address,
                functionName: 'categories',
                args: [BigNumber.from(categoryId)]
            },
        ],
        onSuccess(data) {
            const { fundingPool } = data[2]
            setTotalFunding(parseFloat(ethers.utils.formatEther(fundingPool)))
        },
    },)

    const { isOpen, onClose, onOpen } = useDisclosure()

    const projectMatchData = data?.[0]

    const allContributionsData = data?.[1]

    const poolShare = parseFloat(ethers.utils.formatEther(projectMatchData ? projectMatchData : '0'))
    const poolShareRateb = (poolShare / totalFunding) * 100
    return ((
        <Fragment>
            <DonateToProject refetch={refetch} tokenResult={tokenResult} projectIndex={projectId} price={price} onClose={donationDisclosure.onClose} isOpen={donationDisclosure.isOpen} eventData={project} categoryId={categoryId} />
            <Comments videoId={video_id} id={categoryId.toString() + projectId.toString()} owner={project.owner as string} comments={comments} title={project.title} isOpen={commentsDisclosure.isOpen} onClose={commentsDisclosure.onClose} />
            <ContributorProject tokenResult={tokenResult} data={allContributionsData} isOpen={isOpen} onClose={onClose} />
            <Grid
                templateRows={{ base: 'auto auto', md: 'auto' }}
                w="100%"
                templateColumns={{ base: 'unset', md: '4fr 2fr 2fr' }}
                p={{ base: 2, sm: 4 }}
                gap={3}
                alignItems="center"
                _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
            >
                <Box gridColumnEnd={{ base: 'span 2', md: 'unset' }}>
                    <chakra.h3 fontWeight="bold" fontSize="lg">
                        {project.title}
                    </chakra.h3>
                    <chakra.p
                        fontWeight="medium"
                        fontSize="sm"
                        color={useColorModeValue('gray.600', 'gray.300')}
                    >
                        Fund Recieve: {ethers.utils.formatEther(project.fundingTotal)} {tokenResult?.tokens?.Symbol}
                    </chakra.p>
                    <chakra.p
                        fontWeight="medium"
                        fontSize="sm"
                        color={useColorModeValue('gray.600', 'gray.300')}
                    >
                        Funding Pool Share: {poolShare.toFixed(2)} {tokenResult?.tokens?.Symbol} (<b style={{ color: 'blue' }}>{poolShareRateb.toFixed(3)} % </b>of Funding Pool)
                    </chakra.p>
                    <chakra.p
                        fontWeight="medium"
                        fontSize="sm"
                        color={useColorModeValue('gray.600', 'gray.300')}
                    >
                        Current Project Tax: {tax.toNumber() / 100} %
                    </chakra.p>
                    <HStack>
                        <chakra.p
                            fontWeight="medium"
                            fontSize="sm"
                            color={useColorModeValue('gray.600', 'gray.300')}
                        >
                            Project Document:
                        </chakra.p>
                        <Link legacyBehavior href={`https://data.thetaedgestore.com/api/v2/data/${file_key}`} passHref>
                            <a style={{ display: 'inline' }} target="_blank" rel="noopener noreferrer">
                                <Text as='u' noOfLines={1} fontSize={'sm'}>
                                    View Document
                                </Text>
                            </a>
                        </Link>
                    </HStack>

                </Box>
                <HStack
                    spacing={{ base: 0, sm: 3 }}
                    alignItems="center"
                    fontWeight="medium"
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    color={useColorModeValue('gray.600', 'gray.300')}
                >
                    <Flex p={1} alignItems="center">
                        <Icon as={FaRegComment} onClick={async () => {
                            commentsDisclosure.onOpen()
                        }} w={4} h={4} mr={2} />
                        <chakra.span fontSize={'xs'}>{commentsData.isLoading ? 0 : commentsData_.comment.length}</chakra.span>
                    </Flex>
                    <Flex onClick={onOpen} p={1} alignItems="center">
                        <Icon as={AiOutlineHeart} w={4} h={4} mr={2} />
                        <chakra.span>{allContributionsData ? allContributionsData.length : 0}</chakra.span>
                    </Flex>

                </HStack>
                <Stack
                    spacing={2}
                    direction="row"
                    fontSize={{ base: 'sm', sm: 'md' }}
                    justifySelf="flex-end"
                    alignItems="center"
                >
                    <chakra.p
                        as={ChakraLink}
                        _hover={{ bg: useColorModeValue('gray.400', 'gray.600') }}
                        p={1}
                        rounded="md"
                        onClick={async () => {
                            commentsDisclosure.onOpen()
                        }}
                    >
                        Watch Video
                    </chakra.p>
                    {
                        expired &&
                        (
                            <chakra.p
                                as={ChakraLink}
                                p={1}
                                rounded="md"
                                onClick={async () => {
                                    donationDisclosure.onOpen()
                                }}
                            >
                                Contribute
                            </chakra.p>
                        )
                    }

                </Stack>
            </Grid>
        </Fragment>
    ))
}

export default Projects;