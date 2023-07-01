import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text,
    ModalFooter,
    FormControl,
    FormLabel,
    useToast,
    Input,
    Textarea,
    Stack,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { abi, contract_address } from "../Helpers/contract";
import { useEffect, useState } from "react";
import { generateRandomString } from "../Helpers/utils";
import { Projects } from "@prisma/client";
import { useRouter } from "next/router";

type CreateProjectData = {
    projectTitle: string,
    projectDescription: string,
    name: string,
    projectLink: string,
};

export default function CreateProject({ isOpen, onClose, id, currentTax }: { currentTax: number, isOpen: boolean; onClose: () => void; id: string }) {

    const toast = useToast()

    const [loading, setloading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<CreateProjectData>();

    const [projectId, setprojectId] = useState<string>('')

    useEffect(() => {
        const id = generateRandomString(25)
        setprojectId(id)
    }, [])

    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }

    const { address } = useAccount()

    const { name, projectDescription, projectLink, projectTitle } = watch()

    const { config } = usePrepareContractWrite({
        abi: abi,
        address: contract_address,
        functionName: 'submitProject',
        args: [id, projectId],
        onSettled: (data, error) => {
            console.log(data, error)
        }
    })

    const { writeAsync, data } = useContractWrite({
        ...config,
        onSettled(data, error) {
            if (error) {
                toast({
                    title: error.name,
                    description: error.message,
                    status: 'error'
                })
                onClose()
            }
        }
    })

    useWaitForTransaction({
        hash: data?.hash,
        onSettled: async (data, error) => {
            if (data) {
                const datas: Projects = {
                    currentTax,
                    eventsId: id,
                    id: projectId,
                    name: name,
                    owner: address as string,
                    projectDescription,
                    projectFunds: 0,
                    projectLink,
                    projectTitle,
                    verified: false
                };
                await fetch('/api/addproject', {
                    body: JSON.stringify(datas),
                    method: 'POST'
                }).then(res => res.json().then(res => {
                    if (res.success) {
                        toast({
                            title: "Success submitting the proposal",
                            status: 'success'
                        });
                        refreshData();
                        onClose();
                    } else {
                        toast({
                            title: "Error submitting a proposal",
                            status: 'error'
                        });
                    }
                }));
            }
        }
    })

    const onSubmit: SubmitHandler<CreateProjectData> = async (data) => {
        try {
            console.log(writeAsync)
            await writeAsync?.()
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Modal size={'md'} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={'sm'}>📝 Create Proposal</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form style={{ padding: 0 }} onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={4}>
                            <FormControl variant={'floating'} id="organization">
                                <Input
                                    {...register('projectTitle', { required: true })}
                                    colorScheme="facebook"
                                    size="sm"
                                    type="text"
                                />
                                <FormLabel size={'sm'}>Proposal Title</FormLabel>
                                <Text fontSize={'9px'} color={'gray.700'}>
                                    Proposal title
                                </Text>
                                {errors.name && (
                                    <Text fontSize={'xs'} color={'red.500'}>
                                        This is Required
                                    </Text>
                                )}
                            </FormControl>
                            <FormControl variant={'floating'} id="description">
                                <Textarea
                                    {...register('projectDescription', { required: true })}
                                    resize="vertical"
                                    size={'sm'}
                                />
                                <FormLabel size={'sm'}>Description</FormLabel>
                                <Text fontSize={'9px'} color={'gray.700'}>
                                    Description about your proposal
                                </Text>
                                {errors.projectDescription && (
                                    <Text fontSize={'xs'} color={'red.500'}>
                                        Description is required
                                    </Text>
                                )}
                            </FormControl>
                            <FormControl variant={'floating'} id="organization">
                                <Input
                                    {...register('name', { required: true })}
                                    colorScheme="facebook"
                                    size="sm"
                                    type="text"
                                />
                                <FormLabel size={'sm'}>Name</FormLabel>
                                <Text fontSize={'9px'} color={'gray.700'}>
                                    Your Complete Name
                                </Text>
                                {errors.name && (
                                    <Text fontSize={'xs'} color={'red.500'}>
                                        Organization is required
                                    </Text>
                                )}
                            </FormControl>
                            <FormControl variant={'floating'} id="organization">
                                <Input
                                    {...register('projectLink', { required: true })}
                                    colorScheme="facebook"
                                    size="sm"
                                    type="text"
                                />
                                <FormLabel size={'sm'}>Proposal Link</FormLabel>
                                <Text fontSize={'9px'} color={'gray.700'}>
                                    Website to your proposal
                                </Text>
                                {errors.projectLink && (
                                    <Text fontSize={'xs'} color={'red.500'}>
                                        Proposal Link is required
                                    </Text>
                                )}
                            </FormControl>
                        </Stack>
                        <ModalFooter>
                            <Button colorScheme="green" type="submit" variant="outline">
                                Submit Proposal
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
