"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanies, useCreateLoan } from "@/hooks";
import { useSnackbar } from "@/app/components/Snackbar";
import Link from "next/link";
import { Button } from "@/app/components/Buttons";
import { Input } from "@/app/components/InputField";

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
    "Equipment Financing",
    "Project Finance",
    "Bridge Loan",
    "Mezzanine Debt",
    "Working Capital",
    "Other",
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
        onError: (error) => {
          console.error("Error creating loan:", error);
          showSnackbar("Failed to create loan. Please try again.", "error");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/loans"
          className="text-navy-700 hover:text-navy-600 flex items-center"
        >
          ← Back to Loans
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Loan</h1>
        <p className="text-gray-600">
          Enter loan details to track maturity dates and refinancing
          opportunities
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-800"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
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
              </div>
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
            </div>

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

            <Input>
              <Input.Text
                id="notes"
                name="notes"
                label="Notes"
                placeholder="Additional notes about the loan purpose, special terms, etc..."
                className="bg-white"
                value={formData.notes}
                onChange={handleChange}
              />
            </Input>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="cancel" href="/dashboard/loans">
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createLoanMutation.isPending}
              loadingText="Adding..."
            >
              Add Loan
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
