import { Box, FormControl, Input, Stack, Button, Text, Tooltip, Tag, TagLabel, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { upload } from '../Helpers/Upload';
import { useCreateProject } from '../../../storage';

interface FORMDATA {
    title: string,
    video: FileList
}

export default function UploadVideo() {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FORMDATA>({
        defaultValues: {
            title: '',
        }
    });

    const toast = useToast()

    const [loading, setLoading] = useState(false)
    const { setVideoId, setIndex } = useCreateProject()

    const onSubmit = async (data: FORMDATA) => {
        setLoading(true)
        let result;
        try {
            const { title, video } = data
            const formData = new FormData();
            formData.append("file", video[0]);
            result = await upload(formData)
            const { id } = result.msg.body.videos[0]
            setVideoId(title, id)
            setIndex(1)
        } catch (error) {
            toast({
                title: 'Error in Theta Video API',
                description: result?.msg.message,
                status: 'error'
            })
        }
        setLoading(false)
    };

    return (
        <Box rounded={'lg'} bg={'white'} p={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <FormControl>
                        <Tag size={'sm'} variant='outline' colorScheme='blue' color={'black'}>
                            <TagLabel>Title</TagLabel>
                        </Tag>
                        <Input
                            {...register('title', { required: true })}
                            placeholder={"Project Title"}
                            variant={'filled'}
                            colorScheme='gray'
                            size={'md'}
                            type='text'
                        />
                    </FormControl>
                    <FormControl id="video">
                        <Tooltip label={'Upload a short video explaining the event'}>
                            <Tag size={'sm'} variant='outline' colorScheme='blue' color={'black'}>
                                <TagLabel>Upload Video Advertisement</TagLabel>
                            </Tag>
                        </Tooltip>
                        <Input
                            size={'xs'}
                            paddingBottom={2}
                            variant={'unstyled'}
                            accept="video/*"
                            type="file"
                            {...register("video", { required: true })}
                        />
                        {errors.video && (
                            <Text fontSize={'xs'} color={'red.500'}>
                                This field is required
                            </Text>
                        )}
                    </FormControl>
                    <Stack spacing={10}>
                        <Button
                            loadingText={'Uploading the Video'}
                            bg={'blue.400'}
                            isLoading={loading}
                            color={'white'}
                            _hover={{ bg: 'blue.500' }}
                            type="submit"
                        >
                            Upload Video
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Box>
    );
}
