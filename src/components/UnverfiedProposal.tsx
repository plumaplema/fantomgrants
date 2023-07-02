import { Tr, Td, Button, useToast } from '@chakra-ui/react'
import { Projects } from '@prisma/client'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { abi, contract_address } from './Helpers/contract'
import Link from 'next/link'

function UnverfiedProposal({ project, refetch }: { project: Projects, refetch: () => void }) {
    const { id, eventsId, projectTitle } = project

    const toast = useToast()

    const { config } = usePrepareContractWrite({
        abi: abi,
        address: contract_address,
        functionName: 'verifyProject',
        args: [eventsId, id],
    })

    const { writeAsync, data } = useContractWrite({
        ...config,
        onError(err) {
            toast({
                title: err.name,
                description: err.message,
                status: 'error'
            })
        },
    })

    useWaitForTransaction({
        hash: data?.hash,
        onSuccess: async (data) => {
            try {
                const payload: { projectId: string } = { projectId: id }
                const res = await fetch('/api/updateverified', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                })
                const result: { success: boolean } = await res.json()
                if (!result) {
                    toast({
                        title: "Error",
                        description: 'Error in updating the pool fund in database'
                    })
                } else {
                    toast({
                        title: "Success Verifying"
                    })
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: 'Error in updating the pool fund in database'
                })
            }
            refetch()
        }
    })
    return (
        <Tr>
            <Td color={'blue.500'} fontWeight={'bold'} _hover={{
                color: 'blue.200'
            }} fontSize="sm">
                <Link href={`/projects/unverified/${id}`}>
                    {projectTitle}
                </Link>
            </Td>
            <Td>
                <Button onClick={async () => {
                    try {
                        await writeAsync?.()
                    } catch (err) {

                    }
                }} fontSize={'xs'} size={'md'} variant={'outline'} colorScheme="green">Verify Proposal</Button>
            </Td>
        </Tr>
    )
}

export default UnverfiedProposal