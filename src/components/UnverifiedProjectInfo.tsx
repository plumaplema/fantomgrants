import { Button, List, ListIcon, ListItem, SimpleGrid, Stack, VStack, chakra, Text, useDisclosure } from '@chakra-ui/react';
import { Projects } from '@prisma/client';
import { AiOutlineCheckSquare } from 'react-icons/ai';
import { BsEye } from 'react-icons/bs';
import DonateToProject from './Event/DonateToProject';
import { useContractReads } from 'wagmi';
import { abi, contract_address } from './Helpers/contract';
import { BigNumber, ethers } from 'ethers';
import { useState } from 'react';

interface Res {
    index: string;
    fundingTotal: number
    currentTax: number
    owner: `0x${string}`
    verified: boolean
}

function UnverifiedProjectInfo({ res, projectData, refetch }: { res: Projects | null, projectData: Res, refetch: () => void }) {
    const projectDonate = useDisclosure()

    const [data_, setData] = useState<{ projectFund: number, eventFund: number }>({ eventFund: 0, projectFund: 0 })

    const req = useContractReads({
        contracts: [
            {
                abi: abi,
                address: contract_address,
                functionName: 'projectMatchFund',
                args: [res ? res.eventsId : '', res ? res.id : '']
            },
            {
                abi: abi,
                address: contract_address,
                functionName: 'getTotalPoolFund',
                args: [res ? res.eventsId : '']
            }
        ],
        onSettled(data, error) {
            if (data) {
                const data_ = data as [BigNumber | null, BigNumber | null]
                setData({
                    projectFund: parseFloat(ethers.utils.formatEther(data_[0] ? data_[0] : BigNumber.from(0))),
                    eventFund: parseFloat(ethers.utils.formatEther(data_[1] ? data_[1] : BigNumber.from(0)))
                })
            }
        },
    })

    return (
        <Stack pos="relative" zIndex={1} direction="column" spacing={5} textAlign="left">
            <DonateToProject tax={projectData.currentTax} projectMatchrefetch={req.refetch} res={res} refetch={refetch} isOpen={projectDonate.isOpen} onClose={projectDonate.onClose} id='' />
            <VStack>
                <chakra.h1 fontSize="4xl" lineHeight={1} fontWeight="bold">
                    {res?.projectTitle}
                </chakra.h1>
                <Text fontSize={'xs'}>
                    by: <b>{res?.name}</b>
                </Text>

            </VStack>

            <chakra.h1 textAlign={'justify'} textIndent={'30px'} color="gray.400" fontSize="md" maxW="600px" lineHeight={1.2}>
                {res?.projectDescription}
            </chakra.h1>

            <List>
                <SimpleGrid columns={[1, 2]}>
                    <ListItem>
                        <ListIcon as={AiOutlineCheckSquare} color="green.400" />
                        <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                            Current Tax :&nbsp;
                        </Text>
                        <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                            {projectData.currentTax / 100} %
                        </Text>
                    </ListItem>
                    <ListItem>
                        <ListIcon as={AiOutlineCheckSquare} color="green.400" />
                        <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                            Funding Recieve :&nbsp;
                        </Text>
                        <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                            {projectData.fundingTotal} FTM
                        </Text>
                    </ListItem>
                    <ListItem>
                        <ListIcon as={AiOutlineCheckSquare} color="green.400" />
                        <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                            Funding Pool Share :&nbsp;
                        </Text>
                        <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                            {data_.projectFund.toFixed(2)} FTM  {<b style={{ color: 'red' }}>({((data_.projectFund / data_.eventFund) * 100).toFixed(3)} %)</b>}
                        </Text>
                    </ListItem>
                    <ListItem>
                        <ListIcon as={AiOutlineCheckSquare} color="green.400" />
                        <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                            Total Funds To Recieve :&nbsp;
                        </Text>
                        <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                            {(data_.projectFund + projectData.fundingTotal).toFixed(4)} FTM
                        </Text>
                    </ListItem>

                </SimpleGrid>
            </List>
            <SimpleGrid spacing={2} columns={[1]}>
                <Button
                    leftIcon={<BsEye />}
                    rounded="md"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => {
                        window.open(res?.projectLink)
                    }}
                >
                    View Project Link
                </Button>

            </SimpleGrid>

        </Stack>
    )
}

export default UnverifiedProjectInfo