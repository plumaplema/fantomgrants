import { Tr, Td } from '@chakra-ui/react';
import { Projects } from '@prisma/client';
import { BigNumber, ethers } from 'ethers';
import Link from 'next/link';
import { useState } from 'react';
import { useContractReads } from 'wagmi';
import { abi, contract_address } from './Helpers/contract';

function VerifiedProposal({ event }: { event: Projects }) {
    const [data_, setData] = useState<{ projectFund: number, eventFund: number }>({ eventFund: 0, projectFund: 0 })

    const req = useContractReads({
        contracts: [
            {
                abi: abi,
                address: contract_address,
                functionName: 'projectMatchFund',
                args: [event.eventsId, event.id]
            },
            {
                abi: abi,
                address: contract_address,
                functionName: 'getTotalPoolFund',
                args: [event.eventsId]
            }
        ],
        onSettled(data, error) {
            if (data) {
                const data_ = data as [BigNumber, BigNumber]
                setData({
                    projectFund: parseFloat(ethers.utils.formatEther(data_[0])),
                    eventFund: parseFloat(ethers.utils.formatEther(data_[1]))
                })
            }
        },
    })
    return (
        <Tr>

            <Td color={'blue.500'} fontWeight={'bold'} _hover={{
                color: 'blue.200'
            }} fontSize="sm">
                <Link href={`/projects/${event.id}`}>
                    {event.projectTitle}
                </Link>
            </Td>

            <Td fontSize={'sm'}>
                {(data_.projectFund).toFixed(4)} FTM
            </Td>
            <Td fontSize={'sm'}>
                {((data_.projectFund / data_.eventFund) * 100).toFixed(3)} %
            </Td>
        </Tr >
    )
}

export default VerifiedProposal