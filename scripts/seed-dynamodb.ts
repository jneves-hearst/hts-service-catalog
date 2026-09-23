import { readFileSync } from "fs"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  type NativeAttributeValue,
} from "@aws-sdk/lib-dynamodb"

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME
if (!TABLE_NAME) {
  console.error("DYNAMODB_TABLE_NAME env var is required")
  process.exit(1)
}

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// Each row is written verbatim as a DynamoDB item, so type it as the record
// shape the DocumentClient marshals rather than as `any`.
type ServiceItem = Record<string, NativeAttributeValue>
const services: ServiceItem[] = JSON.parse(readFileSync("data/services.json", "utf-8"))

const chunks: ServiceItem[][] = []
for (let i = 0; i < services.length; i += 25) {
  chunks.push(services.slice(i, i + 25))
}

for (const chunk of chunks) {
  await client.send(
    new BatchWriteCommand({
      RequestItems: {
        [TABLE_NAME]: chunk.map((item) => ({
          PutRequest: { Item: item },
        })),
      },
    })
  )
}

console.log(`Seeded ${services.length} services into ${TABLE_NAME}`)
