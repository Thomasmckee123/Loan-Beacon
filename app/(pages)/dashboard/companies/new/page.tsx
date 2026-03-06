"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateCompany } from "@/hooks";
import { useSnackbar } from "@/app/components/Snackbar";
import Link from "next/link";
import { Button } from "@/app/components/Buttons";
import Select from "react-select";
import { countryOptions } from "@/lib/countries";
import { Input } from "@/app/components/InputField";

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
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/companies"
          className="text-navy-700 hover:text-navy-600 flex items-center"
        >
          ← Back to Companies
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Company</h1>
        <p className="text-gray-600">
          Enter company information to add to your portfolio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input>
              <Input.Text
                id="company-nameID"
                placeholder="Company Name"
                className="bg-white"
                label="Comany"
                value={formData.name}
                onChange={handleChange}
              />
            </Input>
            <Input>
              <Input.Select
                id="company-industryID"
                label="Industry"
                value={formData.industry}
                options={industries}
                onChange={(value) =>
                  setFormData({ ...formData, industry: value })
                }
              />
            </Input>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input>
                <Input.Select
                  id="company-size"
                  label="Company Size"
                  value={formData.size}
                  options={companySizes}
                  onChange={(value) =>
                    setFormData({ ...formData, size: value })
                  }
                />
              </Input>
            </div>
            <div>
              <Input>
                <Input.Text
                  id="website"
                  placeholder="https://..."
                  className="bg-white"
                  label="Website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </Input>
            </div>
          </div>

          <div>
            <Input>
              <Input.Select
                id="location"
                placeholder="Country"
                label="Country"
                value={formData.location}
                options={countryOptions.map((c) => c.label)}
                onChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
              />
            </Input>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="cancel" href="/dashboard/companies">
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createCompanyMutation.isPending}
            loadingText="Adding..."
          >
            Add Company
          </Button>
        </div>
      </form>
    </div>
  );
}
