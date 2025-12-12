import { motion } from "framer-motion";
import { MOCK_SHIPMENTS } from "@/lib/data";
import ShipmentCard from "@/components/ShipmentCard";
import { Bell, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const activeShipments = MOCK_SHIPMENTS.filter(s => s.status !== "Delivered");
  const deliveredShipments = MOCK_SHIPMENTS.filter(s => s.status === "Delivered");

  return (
    <div className="pb-24 pt-6 px-4 md:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Good Morning, Alex</p>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6 text-foreground" />
          <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-background" />
        </Button>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search tracking number..." 
          className="pl-10 h-12 bg-card border-none shadow-sm text-base"
        />
        <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-10 w-10">
          <Filter className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg shadow-primary/20"
        >
          <div className="text-3xl font-bold font-display">{activeShipments.length}</div>
          <div className="text-sm opacity-80">Active Shipments</div>
        </motion.div>
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="bg-card p-4 rounded-2xl shadow-sm border border-border"
        >
          <div className="text-3xl font-bold font-display text-foreground">{deliveredShipments.length}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </motion.div>
      </div>

      {/* Active Shipments List */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold font-display">In Progress</h2>
          <Button variant="link" className="text-primary p-0 h-auto">See All</Button>
        </div>
        <div className="space-y-4">
          {activeShipments.map((shipment, i) => (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ShipmentCard shipment={shipment} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity (Delivered) */}
      <section>
        <h2 className="text-lg font-semibold font-display mb-4">Recent History</h2>
        <div className="space-y-4">
          {deliveredShipments.map((shipment, i) => (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
            >
              <ShipmentCard shipment={shipment} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
