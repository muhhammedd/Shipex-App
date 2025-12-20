import { motion } from "framer-motion";
import { Package, Truck, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

export interface Shipment {
  id: string;
  trackingNumber: string;
  status: "In Transit" | "Delivered" | "Pending" | "Out for Delivery";
  origin: string;
  destination: string;
  eta: string;
  type: string;
}

export default function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const statusColors = {
    "In Transit": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Delivered": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "Pending": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "Out for Delivery": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <Link to={`/tracking/${shipment.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
      >
        <Card className="overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-full text-primary">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {shipment.trackingNumber}
                  </h3>
                  <p className="text-xs text-muted-foreground">{shipment.type}</p>
                </div>
              </div>
              <Badge variant="secondary" className={statusColors[shipment.status]}>
                {shipment.status}
              </Badge>
            </div>

            <div className="relative pl-4 border-l-2 border-dashed border-border ml-2 space-y-4">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-muted-foreground bg-background" />
                <p className="text-xs text-muted-foreground">From</p>
                <p className="text-sm font-medium text-foreground">{shipment.origin}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-primary" />
                <p className="text-xs text-muted-foreground">To</p>
                <p className="text-sm font-medium text-foreground">{shipment.destination}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>ETA: {shipment.eta}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
