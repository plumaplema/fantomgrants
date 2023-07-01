import {
    Flex
} from '@chakra-ui/react';
import Event from '../../components/Event/Event';
import { PrismaClient } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';

interface DataType {
    fundingPool: number,
    duration: number,
    index: string
    initialTax: number,
    taxCapped: number,
    taxIncrementRate: number,
    nftContract: `0x${string}`,
    owner: `0x${string}`
}

const prisma = new PrismaClient();

const EventId = ({ res, unverified, verified }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <Flex flexDirection={'column'} w={'100%'}>
            {
                (res !== null) &&
                <Event unverified={unverified} verified={verified} res={res} />
            }
        </Flex>
    );
};

export default EventId;

export const getServerSideProps = async (context: any) => {
    const { query } = context;
    // Access query parameters from the `query` object
    const { eventId } = query;
    console.log(eventId)
    const res = await prisma.events.findUnique({
        where: {
            id: eventId
        }
    })
    const verified = await prisma.projects.findMany({
        where: {
            eventsId: eventId,
            verified: true
        }
    })
    const unverified = await prisma.projects.findMany({
        where: {
            eventsId: eventId,
            verified: false
        }
    })

    return { props: { res, verified, unverified } }
}