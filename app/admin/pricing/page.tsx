import { Plus } from "lucide-react";

const pricing = [
  {
    zone: "Cairo",
    basePrice: "EGP 50",
    pricePerKm: "EGP 5",
    pricePerKg: "EGP 3",
    status: "Active",
  },
  {
    zone: "Giza",
    basePrice: "EGP 60",
    pricePerKm: "EGP 6",
    pricePerKg: "EGP 3",
    status: "Active",
  },
  {
    zone: "Alexandria",
    basePrice: "EGP 100",
    pricePerKm: "EGP 8",
    pricePerKg: "EGP 4",
    status: "Inactive",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-500/20 text-green-400",
  Inactive: "bg-gray-500/20 text-gray-400",
};

export default function PricingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pricing</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage delivery pricing rules
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-primary hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Zone Pricing
        </button>
      </div>

      {/* Pricing Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-secondary p-5 text-white">
          <p className="text-sm text-gray-400">Zones</p>
          <p className="mt-2 text-2xl font-bold">3</p>
        </div>

        <div className="rounded-lg bg-secondary p-5 text-white">
          <p className="text-sm text-gray-400">Active Pricings</p>
          <p className="mt-2 text-2xl font-bold">2</p>
        </div>

        <div className="rounded-lg bg-secondary p-5 text-white">
          <p className="text-sm text-gray-400">Avg Base Price</p>
          <p className="mt-2 text-2xl font-bold">EGP 38</p>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="overflow-hidden rounded-lg bg-secondary text-white">
        <table className="w-full border-collapse">
          <thead className="bg-primary/60 text-sm text-gray-300">
            <tr>
              <th className="px-4 py-3 text-right">Zone</th>
              <th className="px-4 py-3 text-right">Base Price</th>
              <th className="px-4 py-3 text-right">Price / KM</th>
              <th className="px-4 py-3 text-right">Price / KG</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>

          <tbody>
            {pricing.map((item) => (
              <tr
                key={item.zone}
                className="border-t border-primary/20 text-sm hover:bg-primary/40"
              >
                <td className="px-4 py-3 font-medium">
                  {item.zone}
                </td>
                <td className="px-4 py-3">
                  {item.basePrice}
                </td>
                <td className="px-4 py-3">
                  {item.pricePerKm}
                </td>
                <td className="px-4 py-3">
                  {item.pricePerKg}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      STATUS_STYLES[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="rounded-lg bg-secondary p-4 text-sm text-gray-400">
        Pricing rules can be extended per merchant, distance, weight, or
        delivery type in future phases.
      </div>
    </div>
  );
}