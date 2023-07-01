import { Text, List, ListIcon, ListItem } from '@chakra-ui/react';
import { AiOutlineCheck } from 'react-icons/ai';
import { IconType } from 'react-icons';
import { useEventStorage } from '../../../../storage';

interface ListItemInterface {
    icon: IconType;
    label: string;
    item: string | number | undefined;
}

export default function ListFinalize() {
    const { name, organization, description, fundingpool, price, nftcontract, nftsecurity } = useEventStorage();

    const items: ListItemInterface[] = [
        { icon: AiOutlineCheck, label: "Title", item: name },
        { icon: AiOutlineCheck, label: "Organization", item: organization },
        { icon: AiOutlineCheck, label: "Description", item: description },
        { icon: AiOutlineCheck, label: "Funding Pool", item: fundingpool },
        { icon: AiOutlineCheck, label: "Amount in USD", item: (fundingpool ? fundingpool : 0) * (price ? price : 0) },
        { icon: AiOutlineCheck, label: "NFT Contract", item: nftcontract }
    ];

    return (
        <List spacing={1}>
            {items.map((value, key) => {
                if (value.label === 'NFT Contract' && !nftsecurity) {
                    return null;
                }

                return (
                    <ListItem key={key}>
                        <ListIcon as={value.icon} color="green.400" />
                        <Text display={'inline'} fontSize={'xs'} fontWeight={'bold'}>
                            {value.label} :&nbsp;
                        </Text>
                        <Text noOfLines={1} display={'inline'} fontSize={'xs'}>
                            {value.item}
                        </Text>
                    </ListItem>
                );
            })}
        </List>
    );
}
