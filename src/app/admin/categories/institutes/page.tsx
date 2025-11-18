/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// src/app/admin/categories/institutes/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { CategoryBreadcrumb } from "@/components/categories/CategoryBreadcrumb";
import { CategoryToolbar } from "@/components/categories/CategoryToolbar";
import { DeleteConfirmDialog } from "@/components/categories/DeleteConfirmDialog";
import { institutesService } from "@/services/categoryService";
import {
    Institute,
    CreateInstituteDto,
    UpdateInstituteDto,
} from "@/types/categories";
import { useApi } from "@/hooks/useApi";
import { Pencil, Trash2, X, ShieldCheck, ShieldAlert, ChevronDown } from "lucide-react";
import { TableSkeleton } from "@/components/kyc-management/states/TableSkeleton";
import { EmptyState } from "@/components/kyc-management/states/EmptyState";
import { ErrorState } from "@/components/kyc-management/states/ErrorState";

const InstitutesPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");
    const [sort, setSort] = useState<'name_asc' | 'name_desc' | 'usageCount_desc' | 'createdAt_asc' | 'createdAt_desc'>('createdAt_desc');
    const [sortByCreator, setSortByCreator] =
        useState<"jobseeker" | "admin" | "other" | "">("");


    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingInstitute, setEditingInstitute] = useState<Institute | null>(
        null
    );

    const [formData, setFormData] = useState<CreateInstituteDto>({
        name: "",
        area: "",
        city: "",
        state: "",
        country: "India",
        type: "",
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingInstitute, setDeletingInstitute] =
        useState<Institute | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const { loading, error, execute } = useApi({
        onSuccess: (response) => {
            // backend returns: { items, total, page, pageSize, totalPages }
            if (!response) {
                setInstitutes([]);
                setTotalPages(1);
                return;
            }
            setInstitutes(response.items || []);
            setTotalPages(response.totalPages || 1);
        },
    });

    const loadInstitutes = () => {
        execute(() =>
            institutesService.getAll({
                page,
                pageSize,
                filter,
                sort,
                sortByCreator,
            })
        );
    };

    useEffect(() => {
        loadInstitutes();
    }, [page, pageSize, filter, sort, sortByCreator]);

    // local search across current page (client side)
    const filteredList = institutes.filter((ins) =>
        ins.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ins.city || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddNew = () => {
        setFormMode("create");
        setEditingInstitute(null);
        setFormData({
            name: "",
            area: "",
            city: "",
            state: "",
            country: "India",
            type: "",
        });
        setFormErrors({});
        setIsFormOpen(true);
    };

    const handleEdit = (institute: Institute) => {
        setFormMode("edit");
        setEditingInstitute(institute);
        setFormData({
            name: institute.name,
            area: institute.area || "",
            city: institute.city || "",
            state: institute.state || "",
            country: institute.country || "India",
            type: institute.type || "",
        });
        setFormErrors({});
        setIsFormOpen(true);
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) errors.name = "Institute name is required";
        if (formData.name.length > 200) errors.name = "Name too long";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (formMode === "create") {
                await institutesService.create(formData);
            } else if (editingInstitute) {
                // include isVerified change if toggled
                const payload: UpdateInstituteDto = { ...formData };
                // ensure we preserve isVerified if editing — we'll set from formData? we'll add isVerified toggle in modal below
                await institutesService.update(editingInstitute.id, payload);
            }

            setIsFormOpen(false);
            loadInstitutes();
        } catch (err) {
            alert("Failed to save institute");
        }
    };

    const handleDeleteClick = (institute: Institute) => {
        setDeletingInstitute(institute);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingInstitute) return;
        setIsDeleting(true);

        try {
            await institutesService.delete(deletingInstitute.id);
            setDeleteDialogOpen(false);
            loadInstitutes();
        } catch (err) {
            alert("Failed to delete institute");
        } finally {
            setIsDeleting(false);
        }
    };

    // Quick verify/unverify button
    const toggleVerifyQuick = async (ins: Institute) => {
        setIsVerifying(true);
        try {
            await institutesService.verify(ins.id, !ins.isVerified);
            loadInstitutes();
        } catch (err) {
            alert("Failed to update verification");
        } finally {
            setIsVerifying(false);
        }
    };

    // Pagination helpers
    const goToNext = () => setPage((p) => Math.min(p + 1, totalPages));
    const goToPrev = () => setPage((p) => Math.max(p - 1, 1));

    return (
        <div className="p-6">
            <CategoryBreadcrumb categoryLabel="Institutes Management" />

            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Institutes Management
            </h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CategoryToolbar
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                onAddNew={handleAddNew}
                                addButtonText="Add Institute"
                            />
                        </div>

                        {/* Filters & Sort */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <select
                                    value={sortByCreator}
                                    onChange={(e) => {
                                        setSortByCreator(e.target.value as any);
                                        setPage(1);
                                    }}
                                    className="border py-2 pl-3 pr-9 rounded appearance-none"
                                >
                                    <option value="">Sort by Creator</option>
                                    <option value="jobseeker">Jobseeker First</option>
                                    <option value="admin">Admin First</option>
                                    <option value="other">Other First</option>
                                </select>
                                <ChevronDown
                                    size={18}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={filter}
                                    onChange={(e) => { setFilter(e.target.value as any); setPage(1); }}
                                    className="border rounded py-2 pl-3 pr-10 appearance-none w-full">
                                    <option value="all">All</option>
                                    <option value="verified">Verified</option>
                                    <option value="unverified">Unverified</option>
                                </select>
                                <ChevronDown
                                    size={18}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={sort}
                                    onChange={(e) => {
                                        setSort(e.target.value as any);
                                        setPage(1);
                                    }}
                                    className="border py-2 pl-3 pr-9 rounded appearance-none"
                                >
                                    <option value="name_asc">Name A → Z</option>
                                    <option value="name_desc">Name Z → A</option>
                                    <option value="usageCount_desc">Usage Count (high → low)</option>
                                    <option value="createdAt_desc">Created (new → old)</option>
                                    <option value="createdAt_asc">Created (old → new)</option>
                                </select>

                                <ChevronDown
                                    size={18}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="border py-2 pl-3 pr-9 rounded appearance-none"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>

                                <ChevronDown
                                    size={18}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                                />
                            </div>

                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left">City</th>
                                <th className="px-6 py-3 text-left">State</th>
                                <th className="px-6 py-3 text-left">Type</th>
                                <th className="px-6 py-3 text-left">Verified</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <TableSkeleton />
                            ) : error ? (
                                <ErrorState onRetry={loadInstitutes} />
                            ) : filteredList.length === 0 ? (
                                <EmptyState />
                            ) : (
                                filteredList.map((ins) => (
                                    <tr key={ins.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm">{ins.name}</td>
                                        <td className="px-6 py-4 text-sm">{ins.city || "-"}</td>
                                        <td className="px-6 py-4 text-sm">{ins.state || "-"}</td>
                                        <td className="px-6 py-4 text-sm">{ins.type || "-"}</td>

                                        <td className="px-6 py-4">
                                            {ins.isVerified ? (
                                                <span className="inline-flex items-center gap-1 text-green-600">
                                                    <ShieldCheck className="w-4 h-4" /> Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-yellow-600">
                                                    <ShieldAlert className="w-4 h-4" /> Unverified
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(ins)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => toggleVerifyQuick(ins)}
                                                    className="p-2 text-amber-700 hover:bg-amber-100 rounded"
                                                    title={ins.isVerified ? "Unverify" : "Verify"}
                                                    disabled={isVerifying}
                                                >
                                                    {ins.isVerified ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(ins)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer */}
                <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={goToPrev} disabled={page <= 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                        <button onClick={goToNext} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                                {formMode === "create" ? "Add New Institute" : "Edit Institute"}
                            </h3>
                            <button onClick={() => setIsFormOpen(false)}>
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {/* NAME */}
                            <div>
                                <label className="block mb-1 font-medium">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                                {formErrors.name && (
                                    <p className="text-red-600 text-sm">{formErrors.name}</p>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block mb-1 font-medium">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) =>
                                        setFormData({ ...formData, city: e.target.value })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className="block mb-1 font-medium">State</label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) =>
                                        setFormData({ ...formData, state: e.target.value })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block mb-1 font-medium">Country</label>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) =>
                                        setFormData({ ...formData, country: e.target.value })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            {/* Type */}
                            <div>
                                <label className="block mb-1 font-medium">Institute Type</label>
                                <select
                                    value={formData.type || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: e.target.value || null })
                                    }
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Type</option>
                                    <option value="UNIVERSITY">University</option>
                                    <option value="COLLEGE">College</option>
                                    <option value="INSTITUTE">Institute</option>
                                    <option value="POLYTECHNIC">Polytechnic</option>
                                    <option value="SCHOOL">School</option>
                                </select>
                            </div>


                            {/* Verified checkbox (toggle) */}
                            {formMode === 'edit' && editingInstitute && (
                                <div className="flex items-center gap-2">
                                    <input
                                        id="isVerified"
                                        type="checkbox"
                                        checked={editingInstitute.isVerified}
                                        onChange={async (e) => {
                                            // update immediately
                                            const newVal = e.target.checked;
                                            setIsVerifying(true);
                                            try {
                                                await institutesService.verify(editingInstitute.id, newVal);
                                                // update local editingInstitute
                                                setEditingInstitute({ ...editingInstitute, isVerified: newVal });
                                                loadInstitutes();
                                            } catch {
                                                alert('Failed to update verification');
                                            } finally {
                                                setIsVerifying(false);
                                            }
                                        }}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="isVerified" className="text-sm">Verified</label>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    {formMode === "create" ? "Create" : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                title="Delete Institute"
                message="Are you sure you want to delete this institute?"
                itemName={deletingInstitute?.name}
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default InstitutesPage;
