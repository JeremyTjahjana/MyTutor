"use client";

import type { LucideIcon } from "lucide-react";

type DashboardStat = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
};

export default function DashboardStatCards({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-[var(--gelap)]/5 hover:shadow-md transition-shadow min-w-0"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-[var(--gelap)]/60 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-[var(--biru)]">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
