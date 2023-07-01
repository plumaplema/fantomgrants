export interface ResultUpload {
    msg: {
        body: {
            videos: [{
                id: string
            }]
        },
        message?: string
    }
}

export type FormData_ = {
    name: string;
    description: string
    video: FileList;
    days: number
};

export type ContractData = {
    name: string;
    description: string
    videoId: string;
    days: number
    done: boolean
};

export interface SavedData {
    Tender_Name: string,
    Description: string,
    Video_Id: string,
    Days: number,
    Created: Date,
    addressId: string
}