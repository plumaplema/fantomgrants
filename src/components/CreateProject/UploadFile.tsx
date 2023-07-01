import { Box, FormControl, Input, Stack, Button, Text, Tooltip, Tag, TagLabel, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useCreateProject } from '../../../storage';
import { useAccount, useSignMessage } from 'wagmi';

interface FORMDATA {
    file: FileList
}

export default function UploadFile() {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FORMDATA>();

    const [date, setDate] = useState<string>()

    useEffect(() => {
        const timestamp = Date.now().toString()
        setDate(timestamp)
    }, [])

    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const { setFileKey, setIndex } = useCreateProject()

    const { address } = useAccount()

    const { file } = watch()

    const { data, isError, isLoading, isSuccess, signMessageAsync } = useSignMessage({
        message: `Theta EdgeStore Call ${date}`,
        onSuccess(data, variables, context) {
            var url = 'https://api.thetaedgestore.com/api/v2/data';
            const filesToUpload = file[0]
            var formData = new FormData();
            formData.append('file', filesToUpload);
            const auth_token = date + "." + address + "." + data;
            fetch(url, {
                method: 'POST',
                headers: {
                    'x-theta-edgestore-auth': auth_token
                },
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Request failed with status code ' + response.status);
                    }
                })
                .then(data => {
                    setFileKey(data.key)
                    setIndex(2)
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            setLoading(false)
        },
        onError(error, variables, context) {
            toast({
                title: error.name,
                description: error.message,
                status: 'error'
            })
            setLoading(false)
        },
    })


    const onSubmit = async (data: FORMDATA) => {
        setLoading(true)
        try {
            await signMessageAsync()
        } catch (error) {
        }
    };

    return (
        <Box rounded={'lg'} bg={'white'} p={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <FormControl>
                        <Tooltip label={'Upload a short video explaining the event'}>
                            <Tag size={'sm'} variant='outline' colorScheme='blue' color={'black'}>
                                <TagLabel>Upload Supporting Document</TagLabel>
                            </Tag>
                        </Tooltip>
                        <Input
                            size={'xs'}
                            paddingBottom={2}
                            variant={'unstyled'}
                            accept="application/pdf"
                            type="file"
                            {...register("file", { required: true })}
                        />
                        {errors.file && (
                            <Text fontSize={'xs'} color={'red.500'}>
                                This field is required
                            </Text>
                        )}
                    </FormControl>
                    <Stack spacing={10}>
                        <Button
                            loadingText={'Uploading the Document'}
                            bg={'blue.400'}
                            isLoading={loading}
                            color={'white'}
                            _hover={{ bg: 'blue.500' }}
                            type="submit"
                        >
                            Upload Document
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Box>
    );
}
