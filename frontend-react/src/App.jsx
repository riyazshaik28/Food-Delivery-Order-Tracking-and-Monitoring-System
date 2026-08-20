import { useEffect, useState } from 'react'
import {
  ChefHat,
  CheckCircle2,
  PackageCheck,
  RefreshCw,
  Route,
  Truck,
  PlusCircle,
  CircleDashed,
} from 'lucide-react'

const statusOrder = ['preparing', 'picked_up', 'in_transit', 'delivered']

const statusStyles = {
  preparing: 'bg-amber-100 text-amber-700 ring-amber-200',
  picked_up: 'bg-sky-100 text-sky-700 ring-sky-200',
  in_transit: 'bg-violet-100 text-violet-700 ring-violet-200',
  delivered: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
}

const defaultSummary = {
  date: '',
  by_status: {
    preparing: 0,
    picked_up: 0,
    in_transit: 0,
    delivered: 0,
  },
  total_orders: 0,
}

const defaultForm = {
  customer_name: '',
  delivery_address: '',
  items: '',
  status: 'preparing',
}

function formatDate(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function humanizeStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function App() {
  const [orders, setOrders] = useState([])
  const [summary, setSummary] = useState(defaultSummary)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(defaultForm)
  const [creating, setCreating] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError('')
      const [ordersResponse, summaryResponse] = await Promise.all([
        fetch('/orders/allorders'),
        fetch('/status/order_daily'),
      ])

      if (!ordersResponse.ok || !summaryResponse.ok) {
        throw new Error('Failed to load dashboard data')
      }

      const ordersData = await ordersResponse.json()
      const summaryData = await summaryResponse.json()

      setOrders(ordersData)
      setSummary(summaryData)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const activeOrders = orders.filter((order) => order.status !== 'delivered').length

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleCreateOrder = async (event) => {
    event.preventDefault()
    setCreating(true)
    setError('')

    try {
      const response = await fetch('/orders/createorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Unable to create order')
      }

      setForm(defaultForm)
      await loadDashboard()
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setCreating(false)
    }
  }

  const handleStatusUpdate = async (orderId, nextStatus) => {
    setUpdatingId(orderId)
    setError('')

    try {
      const response = await fetch(`/status/order/${orderId}?new_status=${nextStatus}`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Unable to update order status')
      }

      await loadDashboard()
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-soft">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">Operations</p>
              <h1 className="text-lg font-bold text-slate-900">SwiftTrack</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              Live tracking active
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-600 p-6 text-white shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-300">Food delivery command center</p>
                <h2 className="mt-3 text-3xl font-bold">Order monitoring dashboard</h2>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-200">Today</p>
                <p className="mt-1 text-sm font-semibold">{summary.date || '—'}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Active orders</p>
                <p className="mt-2 text-3xl font-bold">{activeOrders}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-200">On route</p>
                <p className="mt-2 text-3xl font-bold">{summary.by_status.in_transit}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Delivered</p>
                <p className="mt-2 text-3xl font-bold">{summary.by_status.delivered}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Dispatch summary</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">Today’s volume</h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <Route className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {statusOrder.map((status) => (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                    <span>{humanizeStatus(status)}</span>
                    <span className="font-semibold text-slate-800">{summary.by_status[status]}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${status === 'preparing' ? 'bg-amber-400' : status === 'picked_up' ? 'bg-sky-400' : status === 'in_transit' ? 'bg-violet-400' : 'bg-emerald-400'}`}
                      style={{
                        width: `${Math.max(10, (summary.by_status[status] / Math.max(summary.total_orders, 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<ChefHat className="h-5 w-5" />} label="Preparing" value={summary.by_status.preparing} tone="bg-amber-100 text-amber-600" />
          <MetricCard icon={<PackageCheck className="h-5 w-5" />} label="Picked up" value={summary.by_status.picked_up} tone="bg-sky-100 text-sky-600" />
          <MetricCard icon={<Route className="h-5 w-5" />} label="In transit" value={summary.by_status.in_transit} tone="bg-violet-100 text-violet-600" />
          <MetricCard icon={<CheckCircle2 className="h-5 w-5" />} label="Delivered" value={summary.by_status.delivered} tone="bg-emerald-100 text-emerald-600" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">Live order list</p>
                <h3 className="text-xl font-bold text-slate-900">Recent deliveries</h3>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                {loading ? 'Loading...' : `${orders.length} orders`}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Updated</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && orders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-sm text-slate-500">
                        No orders available. Create your first delivery.
                      </td>
                    </tr>
                  )}

                  {orders
                    .slice()
                    .sort((a, b) => new Date(b.Updated_at || b.Created_at) - new Date(a.Updated_at || a.Created_at))
                    .map((order) => {
                      const nextStatuses = statusOrder.slice(statusOrder.indexOf(order.status) + 1)
                      const nextStatus = nextStatuses[0]

                      return (
                        <tr key={order.id} className="border-b border-slate-100 align-top text-sm text-slate-700">
                          <td className="py-4 pr-4">
                            <div>
                              <p className="font-semibold text-slate-900">{order.customer_name}</p>
                              <p className="mt-1 text-xs text-slate-500">#{order.id}</p>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="line-clamp-2 max-w-[220px] text-slate-600">{order.items}</span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[order.status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
                              {humanizeStatus(order.status)}
                            </span>
                          </td>
                          <td className="py-4 pr-4 text-slate-500">{formatDate(order.Updated_at || order.Created_at)}</td>
                          <td className="py-4 text-right">
                            {nextStatus ? (
                              <button
                                type="button"
                                onClick={() => handleStatusUpdate(order.id, nextStatus)}
                                className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={updatingId === order.id}
                              >
                                {updatingId === order.id ? 'Updating...' : humanizeStatus(nextStatus)}
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">Final</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Create order</p>
                <h3 className="text-xl font-bold text-slate-900">New delivery</h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <PlusCircle className="h-5 w-5" />
              </div>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Customer name</label>
                <input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Delivery address</label>
                <input
                  name="delivery_address"
                  value={form.delivery_address}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  placeholder="302 Lake Avenue"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Order items</label>
                <textarea
                  name="items"
                  rows="3"
                  value={form.items}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  placeholder="2 burgers, 1 coke, 1 fries"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Initial status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                >
                  {statusOrder.map((status) => (
                    <option key={status} value={status}>
                      {humanizeStatus(status)}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={creating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? <CircleDashed className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {creating ? 'Saving order...' : 'Save order'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

function MetricCard({ icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>{icon}</div>
      </div>
    </div>
  )
}

export default App
