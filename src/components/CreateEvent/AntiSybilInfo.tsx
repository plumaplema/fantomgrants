import {
    Box,
    FormControl,
    Input,
    Checkbox,
    Stack,
    Button,
    Text,
    NumberInput,
    NumberInputField,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputStepper,
    SimpleGrid,
    Divider,
    Tag,
    TagLabel,
    FormLabel,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FORMDATA, numberFields } from '@/components/Helpers/FormsField';
import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import AccountBalance from './Subcomponents/AccountBalance';
import { useEventIndex, useEventStorage } from '../../../storage';

export default function ApprovedContract() {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FORMDATA>({
        defaultValues: {
            taxCapped: 50,
            taxIncrementRate: 0.01,
            taxRate: 0,
        }
    });

    const { address } = useAccount()

    const { data } = useBalance({ address: address, formatUnits: 'ether' })

    const [showNftAddress, setShowNftAddress] = useState(false);

    const { setEventInformation } = useEventStorage()

    const { setIndex } = useEventIndex()

    const { nftContractAddress } = watch();

    const onSubmit = async (data: FORMDATA) => {
        const { taxCapped, taxIncrementRate, taxRate, fundPool, nftContractAddress } = data
        console.log(typeof (taxCapped), typeof (fundPool))
        if (nftContractAddress && showNftAddress) {
            setEventInformation({ fundingpool: fundPool, nftcontract: nftContractAddress, taxCapped, taxIncrementRate, taxRate, nftsecurity: true })
            setIndex(2)
            return
        }
        setEventInformation({ fundingpool: fundPool, nftcontract: "0x0000000000000000000000000000000000000000", taxCapped, taxIncrementRate, taxRate, nftsecurity: false })
        setIndex(2)
    };

    return (
        <Box rounded={'lg'} bg={'white'} p={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <AccountBalance data={data} />
                    <SimpleGrid columns={1} spacing={5}>
                        {numberFields.map((field) => (
                            <FormControl variant={'floating'} id={field.id} key={field.id}>
                                {
                                    (field.type === "number") && (
                                        <NumberInput
                                            max={field.max}
                                            min={field.min}
                                            step={field.step}
                                        >
                                            <NumberInputField
                                                {...register(field.id, { required: field.required })}
                                            />
                                            <FormLabel>{field.label}</FormLabel>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    )
                                }

                                <Text fontSize={'9px'} color={'gray.700'}>
                                    {field.helperText}
                                </Text>
                                {
                                    errors[field.id] && (
                                        <Text fontSize={'xs'} color={'red.500'}>
                                            {field.label} is required
                                        </Text>
                                    )
                                }
                            </FormControl>
                        ))}
                        <FormControl variant={'floating'}>

                            <NumberInput
                                max={data ? parseFloat(data.formatted) - 0.005 : 0}
                                min={1}
                                step={0.0000000001}
                                defaultValue={1}
                            >
                                <NumberInputField
                                    {...register('fundPool', { required: true })}
                                />
                                <FormLabel>Pool Fund</FormLabel>
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Text fontSize={'9px'} color={'gray.700'}>
                                This is the Pool Fund where projects will be sharing of by quadratic funding
                            </Text>
                            {
                                errors['fundPool'] && (
                                    <Text fontSize={'xs'} color={'red.500'}>
                                        Fund Pool is required
                                    </Text>
                                )
                            }
                        </FormControl>
                    </SimpleGrid>

                    <Divider />
                    <FormControl>
                        <Checkbox
                            onChange={(e) => {
                                reset({ nftContractAddress })
                                setShowNftAddress(e.target.checked)
                            }}
                            colorScheme="blue"
                            fontWeight={'bold'}
                            fontSize={'xs'}
                        >
                            <Tag size={'sm'} variant='outline' colorScheme='blue' color={'black'}>
                                <TagLabel>Enable NFT WhiteListing</TagLabel>
                            </Tag>
                        </Checkbox>
                    </FormControl>
                    {showNftAddress && (
                        <FormControl variant={'floating'} id="nftContractAddress">
                            <Input
                                {...register('nftContractAddress', { required: showNftAddress ? true : false })}
                                type="text"
                            />
                            <FormLabel>NFT Contract Address</FormLabel>
                            {errors.nftContractAddress && (
                                <Text fontSize={'xs'} color={'red.500'}>
                                    NFT contract address is required
                                </Text>
                            )}
                            <Text fontSize={'2xs'} color={'gray.700'}>
                                Enter NFT collection address to enable whitelist user/organization who can participate in the event
                            </Text>
                        </FormControl>
                    )}
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
        </Box >
    );
}
