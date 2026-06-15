import React from 'react';
import WelcomeBanner from './WelcomeBanner';
import StatCards from './StatCards';
import CustomerChart from './CustomerChart';
import TopProductsChart from './TopProductsChart';
import TreatmentPieChart from './TreatmentPieChart';
import SalesLineChart from './SalesLineChart';
import { useDashboard } from '../hooks/useDashboard';

export default function Dashboard() {
  const { dashboardData, loading, error } = useDashboard();

  if (loading) {
    return <div className="p-6 bg-[#F9FAFB] min-h-screen flex justify-center items-center">Memuat Dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 bg-[#F9FAFB] min-h-screen flex justify-center items-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      <WelcomeBanner />
      <StatCards summary={dashboardData?.summary} />
      
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <CustomerChart data={dashboardData?.charts?.customer_growth_per_month} />
        <TopProductsChart data={dashboardData?.top_products} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <TreatmentPieChart data={dashboardData?.charts?.treatment_comparison} />
        <SalesLineChart data={dashboardData?.charts?.sales_growth_per_month} />
      </div>
    </div>
  );
}
