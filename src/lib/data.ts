// تعريف شكل الشحنة هنا ليكون الملف مستقلاً
export interface Shipment {
  id: string;
  trackingNumber: string;
  status: "In Transit" | "Delivered" | "Pending" | "Out for Delivery";
  origin: string;
  destination: string;
  eta: string;
  type: string;
}

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: "123",
    trackingNumber: "SW-849201",
    status: "In Transit",
    origin: "New York, NY",
    destination: "Austin, TX",
    eta: "Today, 4:00 PM",
    type: "Electronics",
  },
  {
    id: "124",
    trackingNumber: "SW-392011",
    status: "Delivered",
    origin: "Chicago, IL",
    destination: "Miami, FL",
    eta: "Delivered Yesterday",
    type: "Documents",
  },
  {
    id: "125",
    trackingNumber: "SW-928371",
    status: "Pending",
    origin: "San Francisco, CA",
    destination: "Seattle, WA",
    eta: "Est. Dec 12",
    type: "Furniture",
  },
  {
    id: "126",
    trackingNumber: "SW-112233",
    status: "Out for Delivery",
    origin: "Local Warehouse",
    destination: "123 Main St",
    eta: "Within 2 hours",
    type: "Perishables",
  },
];
