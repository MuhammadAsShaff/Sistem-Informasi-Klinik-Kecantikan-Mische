import React from 'react';
import { Users, ShoppingBag, CalendarCheck } from 'lucide-react';

const StatCard = ({ title, description, icon: Icon }) => (
  <div className="bg-white rounded-xl p-5 xl:p-6 flex items-center gap-3 xl:gap-4 shadow-sm flex-1 border border-gray-100">
    <div className="p-3 bg-gray-50 rounded-lg text-gray-700 shrink-0">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="font-semibold text-gray-800 text-[14px] xl:text-base whitespace-nowrap">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

const StatCards = ({ summary }) => {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  const stats = [
    { title: 'Customer Baru Bulan Ini', description: `${summary?.new_customers_this_month || 0} Customer`, icon: Users },
    { title: 'Total Penjualan Bulan Ini', description: formatRupiah(summary?.total_sales_this_month || 0), icon: ShoppingBag },
    { title: 'Reservasi Bulan Ini', description: `${summary?.reservations_this_month || 0} Reservasi`, icon: CalendarCheck },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatCards;
