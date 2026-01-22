import {
  Package,
  Store,
  Truck,
  DollarSign,
} from 'lucide-react'

export const dashboardStats = [
  {
    label: 'Total Orders',
    value: 12430,
    icon: Package,
  },
  {
    label: 'Merchants',
    value: 320,
    icon: Store,
  },
  {
    label: 'Active Drivers',
    value: 128,
    icon: Truck,
  },
  {
    label: 'Revenue',
    value: 'EGP 1.2M',
    icon: DollarSign,
  },
]

export const ordersIntelligence = {
  total: 12480,
  deliveredRate: '87%',
  cancelledRate: '4.6%',
  trend: '+12%',
}

export const revenueIntelligence = {
  total: 'EGP 420K',
  avgOrder: 'EGP 34',
  growth: '+18%',
  comparedToLastMonth: '+EGP 64K',
}