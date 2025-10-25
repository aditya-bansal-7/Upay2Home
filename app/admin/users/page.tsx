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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage and monitor all platform users</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>
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
                  placeholder="Search by name, email, or phone..."
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
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Total users: {sampleUsers.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
        </CardContent>
      </Card>
    </div>
  )
}
