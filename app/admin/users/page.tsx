"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Edit2, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    status: "Active",
    joinDate: "2024-01-01",
    balance: "$1,250",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+91 9876543211",
    status: "Active",
    joinDate: "2024-01-05",
    balance: "$2,500",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+91 9876543212",
    status: "Inactive",
    joinDate: "2023-12-15",
    balance: "$500",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+91 9876543213",
    status: "Active",
    joinDate: "2024-01-10",
    balance: "$3,200",
  },
  {
    id: 5,
    name: "Tom Brown",
    email: "tom@example.com",
    phone: "+91 9876543214",
    status: "Suspended",
    joinDate: "2023-11-20",
    balance: "$0",
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+91 9876543215",
    status: "Active",
    joinDate: "2024-01-12",
    balance: "$1,800",
  },
  {
    id: 7,
    name: "David Wilson",
    email: "david@example.com",
    phone: "+91 9876543216",
    status: "Active",
    joinDate: "2024-01-08",
    balance: "$2,100",
  },
  {
    id: 8,
    name: "Lisa Anderson",
    email: "lisa@example.com",
    phone: "+91 9876543217",
    status: "Inactive",
    joinDate: "2023-12-01",
    balance: "$750",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredUsers = sampleUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "All" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage and monitor all platform users</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition-opacity w-full md:w-auto justify-center md:justify-start"
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Users ({filteredUsers.length})</CardTitle>
          <CardDescription className="text-xs md:text-sm">Total users: {sampleUsers.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Balance</th>
                  <th className="text-left py-3 px-4 font-semibold">Join Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">{user.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "Inactive"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">{user.balance}</td>
                    <td className="py-3 px-4 text-muted-foreground">{user.joinDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "Inactive"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Balance</p>
                    <p className="font-medium">{user.balance}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                  <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors text-sm">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-red-100 rounded-lg transition-colors text-sm">
                    <Trash2 className="h-4 w-4 text-red-600" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
