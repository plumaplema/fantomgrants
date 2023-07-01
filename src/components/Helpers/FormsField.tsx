import { IconType } from 'react-icons';
import { AiOutlinePercentage, AiOutlinePlus, AiOutlineStop } from 'react-icons/ai';

export interface FORMDATA {
    title: string;
    description: string;
    duration: number;
    taxRate: number;
    taxIncrementRate: number;
    taxCapped: number;
    fundPool: number;
    nftContractAddress: `0x${string}`;
    video: FileList
    tokenAddress: `0x${string}`
}
export const inputFields: {
    id: keyof FORMDATA;
    label: string;
    placeholder: string;
    type: string;
    default?: number;
    min?: number;
    max?: number;
    step?: number;
    required: boolean;
    helperText: string;
}[] = [
        {
            id: 'title',
            label: 'Title of the event',
            placeholder: 'Save Planet, Animal Welfare, Technology, Health',
            type: 'text',
            required: true,
            helperText: 'Title of the event you want to host',
        },
        {
            id: 'description',
            label: 'Description',
            placeholder: 'Short description',
            type: 'text',
            required: true,
            helperText: 'A short description about the event',
        },
        {
            id: 'duration',
            label: 'Duration in hours',
            type: 'number',
            default: 0,
            min: 1,
            max: 1000,
            step: 1,
            placeholder: '100',
            required: true,
            helperText: 'Total number of hours the event will run (minimum: 1, max: 1000)',
        }
    ];

export const numberFields: {
    id: keyof FORMDATA;
    label: string;
    placeholder: string;
    type: string;
    default?: number;
    min?: number;
    max?: number;
    step?: number;
    required: boolean;
    icon: IconType
    helperText: string;
}[] = [
        {
            id: 'taxRate',
            label: 'Tax Rate',
            type: 'number',
            placeholder: '0%',
            required: true,
            icon: AiOutlinePercentage,
            default: 1,
            min: 0,
            max: 2,
            step: 1,
            helperText: 'The starting tax rate of each project (minimum: 0, maximum: 2)',
        },
        {
            id: 'taxIncrementRate',
            label: 'Tax Increment Rate',
            placeholder: '1',
            type: 'number',
            default: 1,
            min: 0.01,
            max: 2,
            step: 0.01,
            icon: AiOutlinePlus,
            required: true,
            helperText: 'The tax rate that will be added for every unique donor (minimum: 0.01, maximum: 2)',
        },
        {
            id: 'taxCapped',
            label: 'Tax Capped',
            placeholder: '50',
            type: 'number',
            default: 50,
            min: 10,
            max: 50,
            step: 1,
            required: true,
            icon: AiOutlineStop,
            helperText: 'The tax capping (minimum: 10, maximum: 50)',
        }
    ];

export interface TokensResult {
    "tokens"?:
    {
        "id": string,
        "Address": `0x${string}`,
        "Limit": number,
        "Symbol": string,
        "Logo": string,
        "ApiPrice": string
    }
    "message"?: string
}