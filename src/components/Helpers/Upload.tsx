import { ResultUpload } from "../ListTender/interface"
import { api_backend } from "./utils"

export const upload = async (formData: globalThis.FormData) => {
    const req = await fetch(`${api_backend}upload`, {
        method: 'POST',
        body: formData
    })
    const result: ResultUpload = await req.json()
    return result
}