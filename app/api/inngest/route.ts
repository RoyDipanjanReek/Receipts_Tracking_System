
import { inngest } from "@/ingest/client"
import {serve} from "inngest/next"
import {extractAndSavedPDF} from '@/ingest/agent'

export const {GET, POST, PUT} = serve({
    client: inngest,
    functions: [
        extractAndSavedPDF
    ],
}) 