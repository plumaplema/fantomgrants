import {
    Box,
    FormControl,
    Input,
    Stack,
    Button,
    Text,
    useToast,
    Textarea,
    // Import Textarea component
    FormLabel,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useEventIndex, useEventStorage } from '../../../storage';

interface FormData {
    name: string;
    description: string;
    organization: string;
    date: string
}

export default function EventInfo() {
    const toast = useToast();
    const { setEventInformation } = useEventStorage()
    const { setIndex } = useEventIndex()
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            description: '',
            organization: '',
        },
    });

    const { date } = watch()
    const onSubmit = async (data: FormData) => {
        // Handle form submission
        const { description, name, organization, date } = data
        const endTime = new Date(date).getTime() / 1000;
        setEventInformation({ description, endTime, name, organization })
        setIndex(1)
    };

    const currentDate = new Date();

    const currentPlusOneHour = new Date(currentDate.getTime() + 60 * 60 * 1000);

    const minDate = currentPlusOneHour.toISOString().slice(0, -8); // Remove the timezone offset from the ISO string

    return (
        <Box rounded={'lg'} bg={'white'} p={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <FormControl variant={'floating'} id="title">
                        <Input
                            {...register('name', { required: true })}
                            type="text"
                        />
                        <FormLabel>Event Title</FormLabel>
                        {errors.name && (
                            <Text fontSize={'xs'} color={'red.500'}>
                                Name is required
                            </Text>
                        )}
                    </FormControl>

                    <FormControl variant={'floating'} id="description">
                        <Textarea
                            {...register('description', { required: true })}
                            resize="vertical"
                        />
                        <FormLabel>Description</FormLabel>
                        {errors.description && (
                            <Text fontSize={'xs'} color={'red.500'}>
                                Description is required
                            </Text>
                        )}
                    </FormControl>

                    <FormControl variant={'floating'} id="organization">

                        <Input
                            {...register('organization', { required: true })}
                            colorScheme="facebook"
                            size="md"
                            type="text"
                        />
                        <FormLabel>Organization</FormLabel>
                        {errors.organization && (
                            <Text fontSize={'xs'} color={'red.500'}>
                                Organization is required
                            </Text>
                        )}
                    </FormControl>
                    <FormControl variant={'floating'} id="date">
                        <Input
                            {...register('date', { required: true })}
                            min={minDate} // Set the min attribute to restrict the date selection
                            type="datetime-local"
                        />
                        <FormLabel>End Date</FormLabel>
                        {errors.date && (
                            <Text fontSize={'xs'} color={'red.500'}>
                                Date is required
                            </Text>
                        )}
                    </FormControl>

                    <Stack spacing={10}>
                        <Button
                            loadingText={'Uploading the Video'}
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{ bg: 'blue.500' }}
                            type="submit"
                        >
                            Next Step
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Box>
    );
}
