"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { StatCard } from "@/app/components/StatCard";

export interface StatItem {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
  valueClassName?: string;
  labelClassName?: string;
  className?: string;
  onClick?: () => void;
}

interface StatsProps {
  stats: StatItem[];
  containerVariants?: Variants;
  itemVariants?: Variants;
}

const colsMap: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

const Stats = ({ stats, containerVariants, itemVariants }: StatsProps) => {
  const colClass = colsMap[stats.length] ?? "md:grid-cols-4";

  return (
    <motion.div
      className={`grid grid-cols-1 ${colClass} gap-6`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          value={stat.value}
          label={stat.label}
          icon={stat.icon}
          valueClassName={stat.valueClassName}
          labelClassName={stat.labelClassName}
          className={stat.className}
          variants={itemVariants}
          onClick={stat.onClick}
        />
      ))}
    </motion.div>
  );
};

export default Stats;
