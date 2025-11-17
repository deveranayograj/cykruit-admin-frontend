/* eslint-disable react-hooks/exhaustive-deps */
// src/app/admin/categories/certifications/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { CategoryBreadcrumb } from '@/components/categories/CategoryBreadcrumb';
import { CategoryToolbar } from '@/components/categories/CategoryToolbar';
import { DeleteConfirmDialog } from '@/components/categories/DeleteConfirmDialog';
import { certificationsService } from '@/services/categoryService';
import { Certification, CreateCertificationDto, UpdateCertificationDto } from '@/types/categories';
import { useApi } from '@/hooks/useApi';
import { Pencil, Trash2, X } from 'lucide-react';
import { TableSkeleton } from '@/components/kyc-management/states/TableSkeleton';
import { EmptyState } from '@/components/kyc-management/states/EmptyState';
import { ErrorState } from '@/components/kyc-management/states/ErrorState';

const CertificationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [formData, setFormData] = useState<CreateCertificationDto>({
    name: '',
    organization: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCertification, setDeletingCertification] = useState<Certification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { loading, error, execute } = useApi({
    onSuccess: (response) => {
      setCertifications(response || []);
    }
  });

  const loadCertifications = () => {
    execute(() => certificationsService.getAll());
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCertifications(certifications);
    } else {
      const filtered = certifications.filter((cert) =>
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.organization?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCertifications(filtered);
    }
  }, [searchQuery, certifications]);

  const handleAddNew = () => {
    setFormMode('create');
    setEditingCertification(null);
    setFormData({ name: '', organization: '', description: '' });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleEdit = (certification: Certification) => {
    setFormMode('edit');
    setEditingCertification(certification);
    setFormData({
      name: certification.name,
      organization: certification.organization || '',
      description: certification.description || ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Certification name is required';
    } else if (formData.name.length > 150) {
      errors.name = 'Name must be 150 characters or less';
    }

    if (formData.organization && formData.organization.length > 150) {
      errors.organization = 'Organization must be 150 characters or less';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be 500 characters or less';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (formMode === 'create') {
        await certificationsService.create(formData);
        
      } else if (editingCertification) {
        await certificationsService.update(editingCertification.id, formData as UpdateCertificationDto);
        
      }
      
      setIsFormOpen(false);
      loadCertifications();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      alert(`Failed to ${formMode} certification: ${errorMessage}`);
    }
  };

  const handleDeleteClick = (certification: Certification) => {
    setDeletingCertification(certification);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCertification) return;
    
    setIsDeleting(true);
    try {
      await certificationsService.delete(deletingCertification.id);
      setDeleteDialogOpen(false);
      loadCertifications();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      alert(`Failed to delete certification: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <CategoryBreadcrumb categoryLabel="Certifications Management" />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Certifications Management</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <CategoryToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddNew={handleAddNew}
          addButtonText="Add Certification"
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <TableSkeleton />
              ) : error ? (
                <ErrorState onRetry={loadCertifications} />
              ) : filteredCertifications.length === 0 ? (
                <EmptyState />
              ) : (
                filteredCertifications.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{cert.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{cert.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cert.organization || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{cert.description || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(cert)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(cert)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Delete">
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
      </div>

      {/* Form Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {formMode === 'create' ? 'Add New Certification' : 'Edit Certification'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certification Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., CISSP, CEH, AWS Certified"
                    maxLength={150}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.organization ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., ISC2, EC-Council, AWS"
                    maxLength={150}
                  />
                  {formErrors.organization && <p className="mt-1 text-sm text-red-600">{formErrors.organization}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of the certification"
                    rows={3}
                    maxLength={500}
                  />
                  {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {formMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="Delete Certification"
        message="Are you sure you want to delete this certification? This action cannot be undone."
        itemName={deletingCertification?.name}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CertificationsPage;