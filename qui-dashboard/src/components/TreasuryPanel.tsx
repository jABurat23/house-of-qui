import { useEffect, useState } from "react"
import { socket } from "../api/socket"

interface WalletUpdate {
  projectId: string
  balance: number
  lastTransaction: {
    type: string
    amount: number
    description: string
  }
  timestamp: string
}

export default function TreasuryPanel() {
  const [wallets, setWallets] = useState<Record<string, { balance: number, lastTx?: any }>>({})

  useEffect(() => {
    const handleUpdate = (data: WalletUpdate) => {
      setWallets(prev => ({
        ...prev,
        [data.projectId]: {
          balance: data.balance,
          lastTx: data.lastTransaction
        }
      }))
    }

    socket.on("wallet_update", handleUpdate)

    // Initial load for demo (just get one project or keep it dynamic)
    return () => {
      socket.off("wallet_update")
    }
  }, [])

  const walletList = Object.entries(wallets)

  if (walletList.length === 0) return (
    <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: "8px", padding: "16px", color: "#666" }}>
      💰 Imperial Treasury: Initializing billing cycle...
    </div>
  )

  return (
    <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #ffd700", borderRadius: "8px", padding: "16px", color: "#eee" }}>
      <h3 style={{ margin: "0 0 16px 0", color: "#ffd700", display: "flex", alignItems: "center" }}>
        💰 Imperial Treasury: Qui Credits
      </h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {walletList.map(([id, info]) => (
          <div key={id} style={{ backgroundColor: "#252525", padding: "10px", borderRadius: "6px", border: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#aaa" }}>Project ID: {id.split('-')[0]}...</div>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#ffd700" }}>{Number(info.balance).toFixed(2)} Q</div>
            </div>
            {info.lastTx && (
              <div style={{ textAlign: "right", fontSize: "11px" }}>
                <div style={{ color: info.lastTx.type === 'debit' ? '#ef5350' : '#81c784' }}>
                  {info.lastTx.type === 'debit' ? '-' : '+'}{info.lastTx.amount.toFixed(2)} Q
                </div>
                <div style={{ color: "#666", fontSize: "9px" }}>{info.lastTx.description}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: "12px", fontSize: "10px", color: "#555", fontStyle: "italic" }}>
        Billing cycles occur every 30 seconds of imperial uptime.
      </div>
    </div>
  )
}
