export function OrderFilters() {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-secondary p-4 md:flex-row md:items-center">
      <input
        type="text"
        placeholder="Search orders..."
        className="w-full rounded-md bg-primary/60 px-4 py-2 text-sm text-white placeholder-gray-400 outline-none md:max-w-xs"
      />
      <select className="w-full rounded-md bg-primary/60 px-4 py-2 text-sm text-white outline-none md:max-w-xs">
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Transit">In Transit</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <input
        type="date"
        className="w-full rounded-md bg-primary/60 px-4 py-2 text-sm text-white outline-none md:max-w-xs"
      />
    </div>
  );
}