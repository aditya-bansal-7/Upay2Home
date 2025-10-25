"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Clock, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const withdrawalRequests = [
  {
    id: 1,
    user: "John Doe",
    email: "john@example.com",
    amount: "$500",
    method: "Bank Transfer",
    status: "Pending",
    requestDate: "2024-01-15",
    accountDetails: "****1234",
  },
  {
    id: 2,
    user: "Jane Smith",
    email: "jane@example.com",
    amount: "$1,200",
    method: "USDT Wallet",
    status: "Approved",
    requestDate: "2024-01-14",
    accountDetails: "0x742d...f42e",
  },
  {
    id: 3,
    user: "Mike Johnson",
    email: "mike@example.com",
    amount: "$750",
    method: "Bank Transfer",
    status: "Rejected",
    requestDate: "2024-01-13",
    accountDetails: "****5678",
  },
  {
    id: 4,
    user: "Sarah Williams",
    email: "sarah@example.com",
    amount: "$2,000",
    method: "USDT Wallet",
    status: "Pending",
    requestDate: "2024-01-12",
    accountDetails: "0x8f3C...42C3",
  },
  {
    id: 5,
    user: "Tom Brown",
    email: "tom@example.com",
    amount: "$300",
    method: "Bank Transfer",
    status: "Approved",
    requestDate: "2024-01-11",
    accountDetails: "****9012",
  },
]

export default function WithdrawalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedRequest, setSelectedRequest] = useState<(typeof withdrawalRequests)[0] | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)

  const filteredRequests = withdrawalRequests.filter((req) => {
    const matchesSearch =
      req.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || req.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    pending: withdrawalRequests.filter((r) => r.status === "Pending").length,
    approved: withdrawalRequests.filter((r) => r.status === "Approved").length,
    rejected: withdrawalRequests.filter((r) => r.status === "Rejected").length,
    totalAmount: withdrawalRequests.reduce((sum, r) => sum + Number.parseInt(r.amount.replace(/[$,]/g, "")), 0),
  }

  const handleAction = (request: (typeof withdrawalRequests)[0], actionType: "approve" | "reject") => {
    setSelectedRequest(request)
    setAction(actionType)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Withdrawal Requests</h1>
        <p className="text-muted-foreground">Manage and process user withdrawal requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by user name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Requests ({filteredRequests.length})</CardTitle>
          <CardDescription>Total requests: {withdrawalRequests.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">User</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Method</th>
                  <th className="text-left py-3 px-4 font-semibold">Account</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{req.user}</div>
                        <div className="text-xs text-muted-foreground">{req.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold">{req.amount}</td>
                    <td className="py-3 px-4">{req.method}</td>
                    <td className="py-3 px-4 font-mono text-xs">{req.accountDetails}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          req.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : req.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{req.requestDate}</td>
                    <td className="py-3 px-4">
                      {req.status === "Pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAction(req, "approve")}
                            className="px-3 py-1 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors text-xs font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(req, "reject")}
                            className="px-3 py-1 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition-colors text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{action === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">User</p>
                <p className="font-semibold">{selectedRequest.user}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-semibold">{selectedRequest.amount}</p>
              </div>
              {action === "reject" && (
                <div>
                  <label className="text-sm font-medium">Reason (optional)</label>
                  <textarea
                    placeholder="Enter reason for rejection..."
                    className="w-full mt-2 rounded-lg border border-border bg-background p-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowModal(false)
                    alert(`Withdrawal ${action === "approve" ? "approved" : "rejected"}`)
                  }}
                  className={`flex-1 rounded-lg px-4 py-2 text-white font-semibold transition-colors ${
                    action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {action === "approve" ? "Approve" : "Reject"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
