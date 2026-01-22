import { Plus, Eye } from "lucide-react";

const merchants = [
  {
    id: "MER-001",
    name: "Tech Store",
    orders: 1240,
    status: "Active",
    createdAt: "2025-11-12",
  },
  {
    id: "MER-002",
    name: "Fashion Hub",
    orders: 860,
    status: "Suspended",
    createdAt: "2025-10-03",
  },
  {
    id: "MER-003",
    name: "Gadget World",
    orders: 420,
    status: "Active",
    createdAt: "2025-09-21",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-500/20 text-green-400",
  Suspended: "bg-red-500/20 text-red-400",
};

export default function MerchantsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Merchants</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all merchants on the platform
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-primary hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Merchant
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-secondary p-4 text-gray-400">
        Filters will be added here
      </div>

      {/* Merchants Table */}
      <div className="overflow-hidden rounded-lg bg-secondary text-white">
        <table className="w-full border-collapse">
          <thead className="bg-primary/60 text-sm text-gray-300">
            <tr>
              <th className="px-4 py-3 text-right">Merchant ID</th>
              <th className="px-4 py-3 text-right">Name</th>
              <th className="px-4 py-3 text-right">Orders</th>
              <th className="px-4 py-3 text-right">Status</th>
              <th className="px-4 py-3 text-right">Created</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {merchants.map((merchant) => (
              <tr
                key={merchant.id}
                className="border-t border-primary/20 text-sm hover:bg-primary/40"
              >
                <td className="px-4 py-3 font-medium">
                  {merchant.id}
                </td>
                <td className="px-4 py-3">
                  {merchant.name}
                </td>
                <td className="px-4 py-3">
                  {merchant.orders}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      STATUS_STYLES[merchant.status]
                    }`}
                  >
                    {merchant.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {merchant.createdAt}
                </td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-2 text-accent hover:underline">
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}