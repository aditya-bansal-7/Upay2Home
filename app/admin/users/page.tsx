"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Search, Plus, Edit2, Trash2, Eye, Ban, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter, useSearchParams } from "next/navigation"

// Types
interface User {
  id: string
  name: string | null
  email: string | null
  userId: string | null
  isBlocked: boolean
  role: string
  usdtBalance: string
  inrBalance: string
  createdAt: string
}

export default function UsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize from URL once
  const initialSearch = searchParams.get("search") || ""
  const initialStatus = searchParams.get("status") || "All"
  const initialPage = parseInt(searchParams.get("page") || "1")
  const [refetch, setRefetch] = useState(false)

  // UI state (search input is local to avoid focus loss)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [page, setPage] = useState(initialPage)

  // Data state
  const [resultsLoading, setResultsLoading] = useState(true) // only results area
  const [users, setUsers] = useState<User[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const isFirstLoad = useRef(true)

  // Debounce searchTerm -> debouncedSearch
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      // reset to first page when search changes
      setPage(1)
    }, 450)
    return () => clearTimeout(id)
  }, [searchTerm])

  // Fetch users when debouncedSearch, statusFilter or page changes
  useEffect(() => {
    let mounted = true
    async function fetchUsers() {
      setResultsLoading(true)
      try {
        const params = new URLSearchParams()
        params.set("page", String(page))
        if (debouncedSearch) params.set("search", debouncedSearch)
        if (statusFilter) params.set("status", statusFilter)
        const res = await fetch(`/api/admin/users?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        if (!mounted) return
        setUsers(data.users || [])
        setTotalPages(data.totalPages || 1)
        setTotal(data.total || 0)
        // reflect current filters in URL without causing navigation flicker
        try {
          const url = new URL(window.location.href)
          url.searchParams.set("page", String(page))
          if (debouncedSearch) url.searchParams.set("search", debouncedSearch)
          else url.searchParams.delete("search")
          if (statusFilter && statusFilter !== "All") url.searchParams.set("status", statusFilter)
          else url.searchParams.delete("status")
          router.replace(url.pathname + url.search) // client replace
        } catch {
          // ignore
        }
      } catch (err) {
        // keep header/search visible; optionally show toast
        console.error(err)
      } finally {
        if (!mounted) return
        setResultsLoading(false)
        isFirstLoad.current = false
      }
    }

    fetchUsers()
    return () => { mounted = false }
  }, [debouncedSearch, statusFilter, page, router,refetch])

  // actions
  async function handleAction(userId: string, action: "block" | "unblock" | "delete") {
    if (action === "delete" && !confirm("Are you sure you want to delete this user?")) return
    setActionLoadingId(userId)
    try {
      const method = action === "delete" ? "DELETE" : "PATCH"
      const body = action === "delete" ? undefined : JSON.stringify({ action })
      const res = await fetch(`/api/admin/users/${userId}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body,
      })
      if (!res.ok) throw new Error("Action failed")
      // refetch current page
      setResultsLoading(true)
      setRefetch((r) => !r)
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoadingId(null)
    }
  }

  // UI: always render header and search area (static)
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage and monitor all platform users</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or user id..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option>All</option>
            <option>Active</option>
            <option>Blocked</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Users ({total})</CardTitle>
          <CardDescription className="text-xs md:text-sm">Showing page {page} of {totalPages}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Results area: show skeleton while fetching, otherwise table/cards */}
          {resultsLoading ? (
            <div className="space-y-4">
              {/* Desktop skeleton */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">User Id</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      {/* <th className="text-left py-3 px-4 font-semibold">Balance</th> */}
                      <th className="text-left py-3 px-4 font-semibold">Join Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-3 px-4"><Skeleton className="h-6 w-36" /></td>
                        <td className="py-3 px-4"><Skeleton className="h-6 w-48" /></td>
                        <td className="py-3 px-4"><Skeleton className="h-6 w-32" /></td>
                        <td className="py-3 px-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                        {/* <td className="py-3 px-4"><Skeleton className="h-6 w-20" /></td> */}
                        <td className="py-3 px-4"><Skeleton className="h-6 w-28" /></td>
                        <td className="py-3 px-4"><Skeleton className="h-6 w-32" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile skeleton */}
              <div className="md:hidden space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-3 w-32 mt-2" />
                      </div>
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">User Id</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      {/* <th className="text-left py-3 px-4 font-semibold">Balance</th> */}
                      <th className="text-left py-3 px-4 font-semibold">Join Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="py-3 px-4 font-medium">{user.name ?? "—"}</td>
                        <td className="py-3 px-4 text-muted-foreground">{user.email ?? "—"}</td>
                        <td className="py-3 px-4">{user.userId ?? "—"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              user.isBlocked
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        {/* <td className="py-3 px-4 font-semibold">₹{Number(user.inrBalance ?? 0).toLocaleString()}</td> */}
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            {/* <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Edit">
                              <Edit2 className="h-4 w-4" />
                            </button> */}

                            {user.isBlocked ? (
                              <button
                                onClick={() => handleAction(user.id, "unblock")}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                title="Unblock"
                                disabled={actionLoadingId === user.id}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAction(user.id, "block")}
                                className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                                title="Block"
                                disabled={actionLoadingId === user.id}
                              >
                                <Ban className="h-4 w-4 text-yellow-600" />
                              </button>
                            )}

                            <button
                              onClick={() => handleAction(user.id, "delete")}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                              disabled={actionLoadingId === user.id}
                            >
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
                {users.map((user) => (
                  <div key={user.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground">{user.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{user.email ?? "—"}</p>
                      </div>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          user.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">UserId</p>
                        <p className="font-medium">{user.userId ?? "—"}</p>
                      </div>
                      {/* <div>
                        <p className="text-muted-foreground">Balance</p>
                        <p className="font-medium">₹{Number(user.inrBalance ?? 0).toLocaleString()}</p>
                      </div> */}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                      {/* <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors text-sm">
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button> */}
                      <button
                        onClick={() => handleAction(user.id, "delete")}
                        className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-red-100 rounded-lg transition-colors text-sm"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
