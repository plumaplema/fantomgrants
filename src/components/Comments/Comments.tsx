import {
    Avatar,
    Badge,
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Textarea,
    Flex,
    Text,
    Button,
    HStack,
    useToast, AspectRatio
} from "@chakra-ui/react";
import { Comment } from "@prisma/client";
import { useAccount } from "wagmi";
import { useForm } from 'react-hook-form';
import { useState } from "react";

export default function Comments({ isOpen, onClose, title, comments, owner, id, videoId }: { videoId: string, id: string, owner: string, comments: Comment[], isOpen: boolean, onClose: () => void, title: string }) {
    const { address } = useAccount()
    const toast = useToast()
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const onSubmit = async (data: any) => {
        setloading(true)
        try {
            const res = await fetch('/api/addcomment', {
                method: 'POST',
                body: JSON.stringify({
                    address: address, comment: data.comment, projectID: id
                })
            })
            const comments = await res.json()
            console.log(comments)
            toast({
                title: comments.success ? "Succes" : "Error",
                description: comments.comment,
                status: comments.success ? "success" : "error"
            })
            reset()
        } catch (error) {
            toast({
                title: "Error",
                status: "error"
            })
            reset()
        }

        setloading(false)

    };

    const [loading, setloading] = useState(false)

    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            size={'md'}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{title}</DrawerHeader>
                <DrawerBody>
                    <Box
                        position={'relative'}
                        height={'200px'}
                        rounded={'2xl'}
                        boxShadow={'2xl'}
                        width={'full'}
                        overflow={'hidden'}>
                        <AspectRatio w='100%' h={"100%"} ratio={6 / 5}>
                            <iframe
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                src={`https://player.thetavideoapi.com/video/${videoId}`}
                            />
                        </AspectRatio>
                    </Box>
                    <Text mt={3} fontSize={'sm'} fontWeight={'bold'}>Comments</Text>
                    {
                        comments.reverse().map((values, index) => {
                            const date = new Date(values.date);
                            const currentDate = new Date();
                            const timeDiff = currentDate.getTime() - date.getTime(); // Calculate time difference in milliseconds
                            const secondsDiff = Math.floor(timeDiff / 1000); // Convert to seconds

                            const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

                            let formattedTime;

                            if (secondsDiff < 60) {
                                formattedTime = rtf.format(-secondsDiff, 'second');
                            } else if (secondsDiff < 3600) {
                                const minutesDiff = Math.floor(secondsDiff / 60);
                                formattedTime = rtf.format(-minutesDiff, 'minute');
                            } else if (secondsDiff < 86400) {
                                const hoursDiff = Math.floor(secondsDiff / 3600);
                                formattedTime = rtf.format(-hoursDiff, 'hour');
                            } else if (secondsDiff < 604800) {
                                const daysDiff = Math.floor(secondsDiff / 86400);
                                formattedTime = rtf.format(-daysDiff, 'day');
                            } else {
                                const weeksDiff = Math.floor(secondsDiff / 604800);
                                formattedTime = rtf.format(-weeksDiff, 'week');
                            }
                            return (
                                <Flex key={index} margin={2} rounded={'md'} p={3} bgColor={'gray.200'}>
                                    <Avatar src="https://pbs.twimg.com/profile_images/932868157261225984/jxOQobOB_400x400.jpg" size='sm' name={values.address} color={'red.900'} />
                                    <Box ml='3'>
                                        <HStack>
                                            <Text display={'inline'} noOfLines={1} w={'50%'} fontSize={'2xs'} color={'blue.700'} fontWeight={'black'} >
                                                {values.address}
                                            </Text>
                                            {
                                                (owner == values.address) &&
                                                (<Badge display={'inline'} variant={'outline'} fontSize={'2xs'} ml='1' colorScheme='red'>
                                                    Project Owner
                                                </Badge>)
                                            }
                                        </HStack>
                                        <Text fontSize='xs'>{values.value}</Text>
                                        <Text fontSize='2xs' color={'blackAlpha.600'}>{formattedTime}</Text>
                                    </Box>
                                </Flex>)
                        })
                    }
                </DrawerBody>

                <DrawerFooter>
                    <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
                        <HStack w={'100%'} spacing={3}>
                            <Textarea
                                size={'sm'}
                                placeholder='Enter Comment'
                                {...register('comment', { required: true })}
                            />
                            <Button isLoading={loading} type="submit" h='1.75rem' size='sm' colorScheme="blue">
                                Submit
                            </Button>
                        </HStack>
                        {errors.comment && <Text color="red">Comment is required</Text>}
                    </form>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    );
}
