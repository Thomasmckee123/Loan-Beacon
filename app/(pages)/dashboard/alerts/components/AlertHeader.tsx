import { Stats } from "@/app/components/StatCards";
import { Bell, CheckCircle, XCircle } from "lucide-react";
import { containerVariants, itemVariants } from "../utils/utils";

interface AlertHeaderProps {
  id: string;
  loanId: string;
  alertType: string;
  daysBeforeMaturity: number;
  sentSuccessfully: boolean;
  sentAt: string | null;
  createdAt: string;
}

export const AlertHeader = ({
  alertList,
}: {
  alertList: AlertHeaderProps[];
}) => {
  return (
    <Stats
      stats={[
        {
          value: alertList.length,
          label: "Total Alerts",
          icon: <Bell className="w-6 h-6 text-white" />,
        },
        {
          value: alertList.filter((a) => a.sentSuccessfully).length,
          label: "Sent Successfully",
          icon: <CheckCircle className="w-6 h-6 text-white" />,
          className: "bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500",
          valueClassName: "text-green-600",
          labelClassName: "text-green-700",
        },
        {
          value: alertList.filter((a) => !a.sentSuccessfully).length,
          label: "Failed",
          icon: <XCircle className="w-6 h-6 text-white" />,
          className: "bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500",
          valueClassName: "text-red-600",
          labelClassName: "text-red-700",
        },
      ]}
      containerVariants={containerVariants}
      itemVariants={itemVariants}
    />
  );
};
