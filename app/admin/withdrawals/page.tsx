"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, XCircle, Clock, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Status = "PENDING" | "COMPLETED" | "FAILED";
type Item = {
  id: string;
  user: { name: string; email: string };
  amountInr: number;
  method: string;
  accountDetails: string;
  status: Status;
  requestDate: string;
  providerRef?: string | null;
  remarks?: string | null;
};

export default function WithdrawalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<{
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: number;
  }>({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0,
  });
  const [cursorNext, setCursorNext] = useState<string | null>(null);
  const [cursorPrev, setCursorPrev] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Item | null>(null);
  const [partialAmount, setPartialAmount] = useState<number | undefined>(undefined);
  const [action, setAction] = useState<"approve" | "reject" | "partial" | null>(
    null
  );
  const [pendingAction, setPendingAction] = useState(false);

  const [viewingId, setViewingId] = useState<string | null>(null);
  const [viewData, setViewData] = useState<any | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  async function openView(id: string) {
    setViewingId(id);
    setViewLoading(true);
    setViewError(null);
    setViewData(null);
    try {
      const res = await fetch(`/api/admin/inr-withdrawals/${id}/view`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load details");
      const json = await res.json();
      setViewData(json);
    } catch (e: any) {
      setViewError(e.message || "Failed to load details");
    } finally {
      setViewLoading(false);
    }
  }

  const pageSize = 10;

  const fetchList = async (c?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/admin/inr-withdrawals", window.location.origin);
      if (searchTerm) url.searchParams.set("q", searchTerm);
      if (statusFilter !== "All") url.searchParams.set("status", statusFilter);
      url.searchParams.set("pageSize", String(pageSize));
      if (c) url.searchParams.set("cursor", c);
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setItems(json.items || []);
      setCursorNext(json.nextCursor || null);
      setCursorPrev(json.prevCursor || null);
      setStats(
        json.stats || { pending: 0, approved: 0, rejected: 0, totalAmount: 0 }
      );
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchList(null);
  };

  const handleAction = (
    request: Item,
    actionType: "approve" | "reject" | "partial"
  ) => {
    setSelectedRequest(request);
    setAction(actionType);
    setShowModal(true);
  };

  const submitAction = async (reason?: string) => {
    if (!selectedRequest || !action) return;
    setPendingAction(true);
    try {
      const res = await fetch(
        `/api/admin/inr-withdrawals/${selectedRequest.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, reason, partialAmount }),
        }
      );
      if (!res.ok) throw new Error("Failed to update");
      setShowModal(false);
      setSelectedRequest(null);
      setAction(null);
      await fetchList(null);
    } catch (e: any) {
      alert(e.message || "Failed to update");
    } finally {
      setPendingAction(false);
    }
  };

  const StatusBadge = ({ s }: { s: Status }) => {
    const cls =
      s === "PENDING"
        ? "bg-yellow-100 text-yellow-800"
        : s === "COMPLETED"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
        {s === "COMPLETED"
          ? "Approved"
          : s === "FAILED"
          ? "Rejected"
          : "Pending"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Withdrawal Requests
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage and process user withdrawal requests
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {stats.approved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {stats.rejected}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              ₹{stats.totalAmount.toLocaleString("en-IN")}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={onSearch}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by user name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm">
              <option value="All">All</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Approved</option>
              <option value="FAILED">Rejected</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg border border-border px-4 py-2 text-foreground hover:bg-secondary transition-colors text-sm">
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  fetchList(null);
                }}
                className="rounded-lg bg-muted px-4 py-2 text-foreground text-sm">
                Reset
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Requests ({items.length})
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Paginated results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Method
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Account
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((req) => (
                      <tr
                        key={req.id}
                        className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">
                              {req.user.name || "-"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {req.user.email || "-"}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          ₹{req.amountInr.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4">{req.method}</td>
                        <td className="py-3 px-4 font-mono text-xs">
                          {req.accountDetails}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge s={req.status} />
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(req.requestDate).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          {req.status === "PENDING" ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openView(req.id)}
                                className="px-3 py-1 rounded-lg bg-muted hover:bg-secondary transition-colors text-xs font-semibold">
                                View
                              </button>
                              <button
                                onClick={() => handleAction(req, "partial")}
                                className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors text-xs font-semibold">
                                Partial
                              </button>

                              <button
                                onClick={() => handleAction(req, "approve")}
                                className="px-3 py-1 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors text-xs font-semibold">
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(req, "reject")}
                                className="px-3 py-1 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition-colors text-xs font-semibold">
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4">
                {items.map((req) => (
                  <div
                    key={req.id}
                    className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground">
                          {req.user.name || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {req.user.email || "-"}
                        </p>
                      </div>
                      <StatusBadge s={req.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-semibold">
                          ₹{req.amountInr.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Method</p>
                        <p className="font-semibold text-xs">{req.method}</p>
                      </div>
                    </div>
                    {req.status === "PENDING" && (
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <button
                          onClick={() => handleAction(req, "approve")}
                          className="flex-1 px-3 py-2 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors text-xs font-semibold">
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(req, "reject")}
                          className="flex-1 px-3 py-2 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition-colors text-xs font-semibold">
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => fetchList(cursorPrev)}
                  disabled={!cursorPrev}
                  className="px-3 py-2 rounded bg-muted disabled:opacity-50">
                  Previous
                </button>
                <button
                  onClick={() => fetchList(cursorNext)}
                  disabled={!cursorNext}
                  className="px-3 py-2 rounded bg-muted disabled:opacity-50">
                  Next
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {action === "approve"
                  ? "Approve Withdrawal"
                  : action === "partial"
                  ? "Partial Payment"
                  : "Reject Withdrawal"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">User</p>
                <p className="font-semibold">
                  {selectedRequest.user.name || "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedRequest.user.email || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-semibold">
                  ₹{selectedRequest.amountInr.toLocaleString("en-IN")}
                </p>
              </div>
              {action === "reject" && (
                <div>
                  <label className="text-sm font-medium">
                    Reason (optional)
                  </label>
                  <textarea
                    placeholder="Enter reason for rejection..."
                    className="w-full mt-2 rounded-lg border border-border bg-background p-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    rows={3}
                    onChange={(e) => (selectedRequest.remarks = e.target.value)}
                  />
                </div>
              )}
              {action === "partial" && (
                <div>
                  <label className="text-sm font-medium">
                    Partial Amount (INR)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter partial amount..."
                    className="w-full mt-2 rounded-lg border border-border bg-background p-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    onChange={(e) =>
                    (setPartialAmount(Number(e.target.value)))
                    }
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-foreground hover:bg-secondary transition-colors text-sm"
                  disabled={pendingAction}>
                  Cancel
                </button>
                <button
                  onClick={() =>
                    submitAction(selectedRequest.remarks || undefined)
                  }
                  className={`flex-1 rounded-lg px-4 py-2 text-white font-semibold transition-colors text-sm ${
                    action === "approve"
                      ? "bg-green-600 hover:bg-green-700":
                    action === "partial"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  disabled={pendingAction}>
                  {pendingAction
                    ? "Processing..."
                    : action === "approve"
                    ? "Approve"
                    : action === "partial"
                    ? "Partial Pay"
                    : "Reject"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {viewingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col">
            {/* Sticky header */}
            <CardHeader className="shrink-0 border-b border-border">
              <CardTitle>Withdrawal details</CardTitle>
              <CardDescription className="text-xs">
                ID: <span className="font-mono">{viewingId}</span>
              </CardDescription>
            </CardHeader>

            {/* Scrollable content */}
            <CardContent className="flex-1 overflow-y-auto px-6 py-4">
              {viewLoading ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-6 bg-muted rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : viewError ? (
                <div className="text-red-600">{viewError}</div>
              ) : viewData ? (
                <div className="space-y-6">
                  <Section title="Transaction">
                    <Field label="Status" value={String(viewData.status)} />
                    <Field
                      label="INR Amount"
                      value={`₹${Number(viewData.inrAmount || 0).toLocaleString(
                        "en-IN"
                      )}`}
                    />
                    {"usdtAmount" in viewData && viewData.usdtAmount && (
                      <Field
                        label="USDT Amount"
                        value={String(viewData.usdtAmount)}
                      />
                    )}
                    {"effectiveRate" in viewData && viewData.effectiveRate && (
                      <Field
                        label="Effective Rate"
                        value={String(viewData.effectiveRate)}
                      />
                    )}
                    <Field
                      label="Transaction Hash"
                      value={viewData.relatedDepositId || "-"}
                      mono
                      copyValue={viewData.relatedDepositId || ""}
                    />
                    <Field
                      label="Created At"
                      value={new Date(viewData.createdAt).toLocaleString()}
                    />
                  </Section>

                  <Section title="User">
                    <Field label="Name" value={viewData.user?.name || "-"} />
                    <Field
                      label="Email"
                      value={viewData.user?.email || "-"}
                      mono
                      copyValue={viewData.user?.email || ""}
                    />
                    <Field
                      label="User Since"
                      value={
                        viewData.user?.createdAt
                          ? new Date(viewData.user.createdAt).toLocaleString()
                          : "-"
                      }
                    />
                  </Section>

                  <Section title="Payout Profile">
                    <Field
                      label="Type"
                      value={viewData.payoutProfile?.type || "-"}
                    />
                    <Field
                      label="UPI VPA"
                      value={viewData.payoutProfile?.upiVpa || "-"}
                      mono
                      copyValue={viewData.payoutProfile?.upiVpa || ""}
                    />
                    <Field
                      label="Bank"
                      value={viewData.payoutProfile?.bankName || "-"}
                      copyValue={viewData.payoutProfile?.bankName || ""}
                    />
                    <Field
                      label="Account Number"
                      value={viewData.payoutProfile?.accountNumber}
                      // Copy the full account number, not the masked one
                      mono
                      copyValue={viewData.payoutProfile?.accountNumber || ""}
                    />
                    <Field
                      label="IFSC"
                      value={viewData.payoutProfile?.ifsc || "-"}
                      mono
                      copyValue={viewData.payoutProfile?.ifsc || ""}
                    />
                    <Field
                      label="Branch"
                      value={viewData.payoutProfile?.branch || "-"}
                    />
                    <Field
                      label="Created At"
                      value={
                        viewData.payoutProfile?.createdAt
                          ? new Date(
                              viewData.payoutProfile.createdAt
                            ).toLocaleString()
                          : "-"
                      }
                    />
                  </Section>
                </div>
              ) : null}
            </CardContent>

            {/* Sticky footer */}
            <div className="px-6 py-4 border-t border-border shrink-0">
              <button
                onClick={() => {
                  setViewingId(null);
                  setViewData(null);
                  setViewError(null);
                }}
                className="w-full rounded-lg bg-muted px-4 py-2 text-foreground text-sm hover:bg-secondary transition-colors"
                disabled={viewLoading}>
                Close
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <div className="divide-y divide-border border border-border rounded-lg">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
  copyValue,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyValue?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op; could show toast
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <p
          className={`text-xs font-medium text-foreground text-right break-all ${
            mono ? "font-mono" : ""
          }`}>
          {value}
        </p>
        {copyValue ? (
          <button
            onClick={onCopy}
            className="text-xs px-2 py-1 border border-border rounded hover:bg-muted transition-colors"
            title="Copy">
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
