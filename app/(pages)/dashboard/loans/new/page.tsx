"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanies, useCreateLoan } from "@/hooks";
import { useSnackbar } from "@/app/components/Snackbar";
import Link from "next/link";
import { Input } from "@/app/components/InputField";
import { motion } from "framer-motion";
import { ArrowLeft, Banknote } from "lucide-react";
import LoadingSpinner from "@/app/components/loadingSpinner";

export default function NewLoanPage() {
  const router = useRouter();
  const { data: companiesData = [], isPending: loading } = useCompanies();
  const createLoanMutation = useCreateLoan();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    companyId: "",
    loanType: "",
    amount: "",
    currency: "USD",
    lender: "",
    originationDate: "",
    maturityDate: "",
    interestRate: "",
    notes: "",
  });

  const loanTypes = [
    "Term Loan",
    "Revolving Credit",
    "Bridge Loan",
    "Equipment Financing",
    "Line of Credit",
    "SBA Loan",
    "Real Estate Loan",
  ];

  const currencies = ["USD", "EUR", "GBP", "CAD"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createLoanMutation.mutate(
      {
        companyId: formData.companyId,
        loanType: formData.loanType,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        lender: formData.lender,
        originationDate: formData.originationDate,
        maturityDate: formData.maturityDate,
        interestRate: parseFloat(formData.interestRate),
        notes: formData.notes,
      },
      {
        onSuccess: () => {
          showSnackbar("Loan created successfully!");
          router.push("/dashboard/loans");
        },
        onError: (error: Error) => {
          console.error("Error creating loan:", error);
          const msg = error?.message || "Unknown error";
          showSnackbar(`Failed to create loan: ${msg}`, "error");
        },
      },
    );
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="mb-4">
        <Link
          href="/dashboard/loans"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors duration-200"
        >
          <ArrowLeft size={14} />
          Back to Loans
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-900 rounded-md flex items-center justify-center">
                  <Banknote className="size-5 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-lg font-medium text-blue-900">
                    Add New Loan
                  </h1>
                  <p className="text-sm text-gray-500">
                    Track maturity dates and refinancing opportunities
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Loan Identity
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input>
                    <Input.Select
                      id="companyId"
                      label="Company"
                      placeholder="Select company"
                      value={(() => {
                        const selected = companiesData.find(
                          (c) => c.id === formData.companyId,
                        );
                        return selected
                          ? `${selected.name} (${selected.industry})`
                          : "";
                      })()}
                      options={companiesData.map(
                        (c) => `${c.name} (${c.industry})`,
                      )}
                      onChange={(value) => {
                        const company = companiesData.find(
                          (c) => `${c.name} (${c.industry})` === value,
                        );
                        setFormData({
                          ...formData,
                          companyId: company?.id ?? "",
                        });
                      }}
                    />
                  </Input>
                  <Input>
                    <Input.Select
                      id="loanType"
                      label="Loan Type"
                      placeholder="Select loan type"
                      value={formData.loanType}
                      options={loanTypes}
                      onChange={(value) =>
                        setFormData({ ...formData, loanType: value })
                      }
                    />
                  </Input>
                  <Input>
                    <Input.Text
                      id="lender"
                      name="lender"
                      label="Lender"
                      placeholder="First National Bank"
                      className="bg-white"
                      required
                      value={formData.lender}
                      onChange={handleChange}
                    />
                  </Input>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Financial details */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Financial Details
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input>
                    <Input.Text
                      id="amount"
                      type="number"
                      name="amount"
                      label="Loan Amount"
                      placeholder="50000000"
                      className="bg-white"
                      required
                      value={formData.amount}
                      onChange={handleChange}
                    />
                  </Input>
                  <Input>
                    <Input.Select
                      id="currency"
                      label="Currency"
                      value={formData.currency}
                      options={currencies}
                      onChange={(value) =>
                        setFormData({ ...formData, currency: value })
                      }
                    />
                  </Input>
                  <Input>
                    <Input.Text
                      id="interestRate"
                      type="number"
                      name="interestRate"
                      label="Interest Rate (%)"
                      placeholder="5.25"
                      step="0.01"
                      className="bg-white"
                      required
                      value={formData.interestRate}
                      onChange={handleChange}
                    />
                  </Input>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Terms & notes */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Terms & Notes
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input>
                    <Input.Text
                      id="originationDate"
                      type="date"
                      name="originationDate"
                      label="Origination Date"
                      className="bg-white"
                      required
                      value={formData.originationDate}
                      onChange={handleChange}
                    />
                  </Input>
                  <Input>
                    <Input.Text
                      id="maturityDate"
                      type="date"
                      name="maturityDate"
                      label="Maturity Date"
                      className="bg-white"
                      required
                      value={formData.maturityDate}
                      onChange={handleChange}
                    />
                  </Input>
                  <Input>
                    <Input.Text
                      id="notes"
                      name="notes"
                      label="Notes"
                      placeholder="Optional details..."
                      className="bg-white"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </Input>
                </div>
              </div>
            </div>

            {/* Footer with actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Link
                href="/dashboard/loans"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={createLoanMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-navy-800 border border-transparent rounded-md shadow-sm hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {createLoanMutation.isPending ? "Adding..." : "Add Loan"}
              </button>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  );
}
