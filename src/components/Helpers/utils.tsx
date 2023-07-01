import { ethers } from "ethers";

export const api_backend = "https://plankton-app-hcsr9.ondigitalocean.app/"

export function generateRandomString(length: number) {
    const randomBytes = ethers.utils.randomBytes(length);
    const randomString = ethers.utils.hexlify(randomBytes);
    return randomString;
}