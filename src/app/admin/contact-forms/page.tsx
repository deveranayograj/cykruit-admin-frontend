/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/contact-forms/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/kyc-management/Breadcrumb"; // reuse or create specific
import { Pagination } from "@/components/kyc-management/Pagination";
import { contactFormService } from "@/services/contactFormService";
import { ContactFormRecord, ContactFormStatus } from "@/types/contactForm";
import { Toolbar } from "@/components/contact-form-management/Toolbar";
import { StatusBadge } from "@/components/contact-form-management/StatusBadge";
import { TableActions } from "@/components/contact-form-management/TableActions";
import { useApi } from "@/hooks/useApi";
import { EmptyState } from "@/components/kyc-management/states/EmptyState";
import { ErrorState } from "@/components/kyc-management/states/ErrorState";
import { TableSkeleton } from "@/components/kyc-management/states/TableSkeleton";
import { MessageDialog } from "@/components/contact-form-management/MessageDialog";
import { InfoTooltip } from "@/components/contact-form-management/InfoTooltip";

const ContactFormListContent: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | ContactFormStatus>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [records, setRecords] = useState<ContactFormRecord[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const pageLimit = 10;
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

    const searchParams = useSearchParams();

    const { loading, error, execute } = useApi({
        onSuccess: (response: any) => {
            const data = response?.data || [];
            setRecords(data);
            if (response.pagination) {
                setTotalPages(response.pagination.pages);
                setTotalRecords(response.pagination.total);
            }
        },
    });

    const loadData = () => {
        execute(() =>
            contactFormService.getContactForms({
                page: currentPage,
                limit: pageLimit,
                status: statusFilter === "all" ? undefined : statusFilter,
                search: searchQuery,
            })
        );
    };

    useEffect(() => {
        const statusParam = searchParams?.get("status");
        if (statusParam) setStatusFilter(statusParam.toUpperCase() as any);
        else setStatusFilter("all");
    }, [searchParams]);

    useEffect(() => {
        loadData();
    }, [currentPage, statusFilter]);

    useEffect(() => {
        const t = setTimeout(() => {
            setCurrentPage(1);
            loadData();
        }, 500);
        return () => clearTimeout(t);
    }, [searchQuery, statusFilter]);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });


    const handleUpdateStatus = async (id: string, status: ContactFormStatus, notes?: string) => {
        try {
            await contactFormService.updateStatus(id, { status, notes });
            alert("Status updated successfully");
            loadData();
        } catch (err: any) {
            alert(`Failed to update: ${err.message || "Unknown error"}`);
        }
    };

    const handleRetry = () => loadData();

    return (
        <div className="p-6">
            <Breadcrumb />
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Forms</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Toolbar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                    Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <TableSkeleton />
                            ) : error ? (
                                <ErrorState onRetry={handleRetry} />
                            ) : records.length === 0 ? (
                                <EmptyState />
                            ) : (
                                records.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{rec.fullName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{rec.email}</td>

                                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xl">
                                            <div
                                                className="line-clamp-2 cursor-pointer hover:underline hover:text-blue-600"
                                                onClick={() => setSelectedMessage(rec.message)}
                                            >
                                                {rec.message}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={rec.status} /></td>
                                        <td className="px-6 py-4 text-center">
                                            <InfoTooltip ip={rec.ipAddress} userAgent={rec.userAgent} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(rec.createdAt)}</td>

                                        <td className="px-6 py-4">
                                            <TableActions record={rec} onUpdateStatus={handleUpdateStatus} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && !error && records.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(p) => setCurrentPage(p)}
                        totalRecords={totalRecords}
                        pageSize={pageLimit}
                    />
                )}
                <MessageDialog
                    open={!!selectedMessage}
                    message={selectedMessage || ""}
                    onClose={() => setSelectedMessage(null)}
                />
            </div>
        </div>

    );
};

const Page: React.FC = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <ContactFormListContent />
    </Suspense>
);

export default Page;
