"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface StatCardProps {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
  valueClassName?: string;
  labelClassName?: string;
  className?: string;
  variants?: Variants;
  onClick?: () => void;
}

const StatCard = ({
  value,
  label,
  icon,
  valueClassName = "text-gray-900",
  labelClassName = "text-gray-500",
  className = "bg-white",
  variants,
  onClick,
}: StatCardProps) => {
  return (
    <motion.div
      className={`p-2 rounded-lg shadow-lg ${onClick ? "cursor-pointer" : ""} ${className}`}
      variants={variants}
      onClick={onClick}
    >
      {icon ? (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="size-12 bg-blue-900 rounded-md flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div className="ml-4">
            <p className={`text-sm font-medium ${labelClassName}`}>{label}</p>
            <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
          <p className={`text-sm ${labelClassName}`}>{label}</p>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
