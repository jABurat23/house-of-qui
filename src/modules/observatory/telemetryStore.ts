import { TelemetryRecord } from "./telemetryTypes"

class TelemetryStore {

  private records: Map<string, TelemetryRecord> = new Map()

  update(record: TelemetryRecord) {
    this.records.set(record.projectId, record)
  }

  get(projectId: string) {
    return this.records.get(projectId)
  }

  list() {
    return Array.from(this.records.values())
  }

}

export const observatory = new TelemetryStore()