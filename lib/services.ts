import fs from "fs"
import path from "path"
import { Service } from "@/types"

const DATA_FILE = path.join(process.cwd(), "data", "services.json")

export async function readServices(): Promise<Service[]> {
  if (process.env.DYNAMODB_TABLE_NAME) {
    const db = await import("./dynamodb")
    return db.readServices()
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8")
  return JSON.parse(raw) as Service[]
}

export async function findService(id: string): Promise<Service | undefined> {
  if (process.env.DYNAMODB_TABLE_NAME) {
    const db = await import("./dynamodb")
    return db.findService(id)
  }
  const services = await readServices()
  return services.find((s) => s.id === id)
}

export async function putService(service: Service): Promise<void> {
  if (process.env.DYNAMODB_TABLE_NAME) {
    const db = await import("./dynamodb")
    return db.putService(service)
  }
  const services = await readServices()
  const idx = services.findIndex((s) => s.id === service.id)
  if (idx >= 0) services[idx] = service
  else services.push(service)
  fs.writeFileSync(DATA_FILE, JSON.stringify(services, null, 2), "utf-8")
}

export async function deleteService(id: string): Promise<void> {
  if (process.env.DYNAMODB_TABLE_NAME) {
    const db = await import("./dynamodb")
    return db.deleteService(id)
  }
  const services = await readServices()
  const filtered = services.filter((s) => s.id !== id)
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8")
}
