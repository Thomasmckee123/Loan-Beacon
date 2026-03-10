"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateCompany } from "@/hooks";
import { useSnackbar } from "@/app/components/Snackbar";
import Link from "next/link";
import { countryOptions } from "@/lib/countries";
import { Input } from "@/app/components/InputField";
import { motion } from "framer-motion";
import { ArrowLeft, Building2 } from "lucide-react";

export default function NewCompanyPage() {
  const router = useRouter();
  const createCompanyMutation = useCreateCompany();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size: "",
    location: "",
    website: "",
  });

  const industries = [
    "Technology",
    "Manufacturing",
    "Healthcare",
    "Retail",
    "Energy",
    "Finance",
    "Real Estate",
    "Transportation",
    "Other",
  ];

  const companySizes = ["Small", "Mid-Market", "Large", "Enterprise"];

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
    createCompanyMutation.mutate(
      {
        name: formData.name,
        industry: formData.industry,
        size: formData.size,
        location: formData.location,
        website: formData.website,
      },
      {
        onSuccess: () => {
          showSnackbar("Company created successfully!");
          router.push("/dashboard/companies");
        },
        onError: (error) => {
          console.error("Error creating company:", error);
          showSnackbar("Failed to create company. Please try again.", "error");
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
          href="/dashboard/companies"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors duration-200"
        >
          <ArrowLeft size={14} />
          Back to Companies
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-lg">
          {/* Card header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-blue-900 rounded-md flex items-center justify-center">
                <Building2 className="size-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-lg font-medium text-blue-900">
                  Add New Company
                </h1>
                <p className="text-sm text-gray-500">
                  Add a company to your portfolio to track its loans
                </p>
              </div>
            </div>
          </div>

          {/* Form body */}
          <div className="p-6 space-y-6">
            {/* Company details */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Company Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input>
                  <Input.Text
                    id="company-nameID"
                    name="name"
                    placeholder="Acme Corp"
                    className="bg-white"
                    label="Company Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Input>
                <Input>
                  <Input.Select
                    id="company-industryID"
                    label="Industry"
                    placeholder="Select industry"
                    value={formData.industry}
                    options={industries}
                    onChange={(value) =>
                      setFormData({ ...formData, industry: value })
                    }
                  />
                </Input>
                <Input>
                  <Input.Select
                    id="company-size"
                    label="Company Size"
                    placeholder="Select size"
                    value={formData.size}
                    options={companySizes}
                    onChange={(value) =>
                      setFormData({ ...formData, size: value })
                    }
                  />
                </Input>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Location & web */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Location & Website
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input>
                  <Input.Select
                    id="location"
                    placeholder="Select country"
                    label="Country"
                    value={formData.location}
                    options={countryOptions.map((c) => c.label)}
                    onChange={(value) =>
                      setFormData({ ...formData, location: value })
                    }
                  />
                </Input>
                <Input>
                  <Input.Text
                    id="website"
                    name="website"
                    placeholder="https://..."
                    className="bg-white"
                    label="Website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </Input>
              </div>
            </div>
          </div>

          {/* Footer with actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <Link
              href="/dashboard/companies"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createCompanyMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-navy-800 border border-transparent rounded-md shadow-sm hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {createCompanyMutation.isPending ? "Adding..." : "Add Company"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
