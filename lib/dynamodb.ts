import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb"
import { Service } from "@/types"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME!

export async function readServices(): Promise<Service[]> {
  const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }))
  return (result.Items ?? []) as Service[]
}

export async function findService(id: string): Promise<Service | undefined> {
  const result = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { id } })
  )
  return result.Item as Service | undefined
}

export async function putService(service: Service): Promise<void> {
  await docClient.send(
    new PutCommand({ TableName: TABLE_NAME, Item: service })
  )
}

export async function deleteService(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
  )
}
