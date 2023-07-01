import { BigNumber } from 'ethers';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DataItem {
    index: BigNumber;
    title: string;
    video_id: string;
    file_key: string;
    fundingTotal: BigNumber;
    fundingGoal: BigNumber;
    tax: BigNumber;
    owner: `0x${string}`;
}

interface DataItemContributions {
    contributor: `0x${string}`;
    amount: BigNumber;
}

type ProjectContributors = ReadonlyArray<DataItemContributions> | undefined

type Project = ReadonlyArray<DataItem> | undefined;

interface EventInform {
    id?: string,
    name?: string,
    organization?: string,
    description?: string,
    endTime?: number,
    fundingpool?: number,
    nftsecurity?: boolean,
    nftcontract?: string
    taxCapped?: number
    taxRate?: number
    taxIncrementRate?: number,
    price?: number
}

interface EventInformation {
    id?: string,
    name?: string,
    organization?: string,
    description?: string,
    endTime?: number,
    fundingpool?: number,
    nftsecurity?: boolean,
    nftcontract?: string
    taxCapped?: number
    taxRate?: number
    taxIncrementRate?: number
    price?: number
    setEventInformation: (data: EventInform) => void
}

export const useEventStorage = create<EventInformation>()(persist(
    (set) => ({
        setEventInformation(data) {
            set((prevState) => ({
                ...prevState,
                ...data,
            }));
        },
    }),
    {
        name: "EventInformation",
    }
));

interface EventIndex {
    index: 0 | 1 | 2,
    setIndex: (index: 0 | 1 | 2) => void
}

export const useEventIndex = create<EventIndex>()(persist(
    (set) => ({
        index: 0,
        setIndex(index) {
            set({ index: index })
        },
    }),
    {
        name: "EventIndex",
    }
));