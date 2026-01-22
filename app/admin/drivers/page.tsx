import { Plus, Eye } from "lucide-react";

const drivers = [
  {
    id: "DRV-101",
    name: "Ahmed Hassan",
    phone: "01012345678",
    orders: 320,
    status: "Available",
  },
  {
    id: "DRV-102",
    name: "Mohamed Salah",
    phone: "01198765432",
    orders: 210,
    status: "On Delivery",
  },
  {
    id: "DRV-103",
    name: "Omar Ali",
    phone: "01234567890",
    orders: 95,
    status: "Offline",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-green-500/20 text-green-400",
  "On Delivery": "bg-blue-500/20 text-blue-400",
  Offline: "bg-gray-500/20 text-gray-400",
};

export default function DriversPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Drivers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track delivery drivers
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-primary hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Driver
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-secondary p-4 text-gray-400">
        Filters will be added here
      </div>

      {/* Drivers Table */}
      <div className="overflow-hidden rounded-lg bg-secondary text-white">
        <table className="w-full border-collapse">
          <thead className="bg-primary/60 text-sm text-gray-300">
            <tr>
              <th className="px-4 py-3 text-right">Driver ID</th>
              <th className="px-4 py-3 text-right">Name</th>
              <th className="px-4 py-3 text-right">Phone</th>
              <th className="px-4 py-3 text-right">Orders</th>
              <th className="px-4 py-3 text-right">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver) => (
              <tr
                key={driver.id}
                className="border-t border-primary/20 text-sm hover:bg-primary/40"
              >
                <td className="px-4 py-3 font-medium">
                  {driver.id}
                </td>
                <td className="px-4 py-3">
                  {driver.name}
                </td>
                <td className="px-4 py-3">
                  {driver.phone}
                </td>
                <td className="px-4 py-3">
                  {driver.orders}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      STATUS_STYLES[driver.status]
                    }`}
                  >
                    {driver.status}
                  </span>
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