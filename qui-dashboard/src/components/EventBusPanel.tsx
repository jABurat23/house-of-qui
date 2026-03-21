import { useEffect, useState } from "react"
import { socket } from "../api/socket"
import { api } from "../api/client"

interface ImperialEvent {
    id: string
    source: string
    type: string
    payload: any
    timestamp: string
}

export default function EventBusPanel() {
    const [events, setEvents] = useState<ImperialEvent[]>([])

    useEffect(() => {
        // Initial load
        api.get("/communication/bus?limit=10").then(res => {
            setEvents(res.data.map((e: any) => ({
                id: e.id,
                source: e.sourceProjectId,
                type: e.eventType,
                payload: e.payload,
                timestamp: e.createdAt
            })))
        })

        const handleNewEvent = (event: ImperialEvent) => {
            setEvents(prev => [event, ...prev].slice(0, 15))
        }

        socket.on("imperial_event", handleNewEvent)

        return () => {
            socket.off("imperial_event")
        }
    }, [])

    return (
        <div style={{ backgroundColor: "#121212", border: "1px solid #333", borderRadius: "8px", padding: "12px", color: "#eee" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#64b5f6", display: "flex", alignItems: "center" }}>
                📡 Imperial Bus Live Feed
                <span style={{ marginLeft: "10px", width: "8px", height: "8px", backgroundColor: "#4caf50", borderRadius: "50%", display: "inline-block" }}></span>
            </h3>

            <div style={{ maxHeight: "300px", overflowY: "auto", fontSize: "12px" }}>
                {events.length === 0 ? (
                    <p style={{ color: "#666" }}>Waiting for signals on the bus...</p>
                ) : (
                    events.map(event => (
                        <div key={event.id} style={{ padding: "8px", borderBottom: "1px solid #222", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#ff9800" }}>{event.type}</span>
                                <span style={{ color: "#666" }}>{new Date(event.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div>
                                <span style={{ color: "#888" }}>Source: </span>
                                <span style={{ color: "#4caf50" }}>{event.source.substring(0, 8)}...</span>
                            </div>
                            <pre style={{ margin: "4px 0 0 0", padding: "4px", backgroundColor: "#000", borderRadius: "3px", overflowX: "auto", fontSize: "10px", color: "#aaa" }}>
                                {JSON.stringify(event.payload, null, 2)}
                            </pre>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
