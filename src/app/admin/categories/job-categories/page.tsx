/* eslint-disable react-hooks/exhaustive-deps */
// src/app/admin/categories/job-categories/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { CategoryBreadcrumb } from '@/components/categories/CategoryBreadcrumb';
import { CategoryToolbar } from '@/components/categories/CategoryToolbar';
import { DeleteConfirmDialog } from '@/components/categories/DeleteConfirmDialog';
import { jobCategoriesService } from '@/services/categoryService';
import { JobCategory, CreateJobCategoryDto, UpdateJobCategoryDto } from '@/types/categories';
import { useApi } from '@/hooks/useApi';
import { Pencil, Trash2, X } from 'lucide-react';
import { TableSkeleton } from '@/components/kyc-management/states/TableSkeleton';
import { EmptyState } from '@/components/kyc-management/states/EmptyState';
import { ErrorState } from '@/components/kyc-management/states/ErrorState';

const JobCategoriesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<JobCategory[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(null);
  const [formData, setFormData] = useState<CreateJobCategoryDto>({ title: '' });
  const [formErrors, setFormErrors] = useState<{ title?: string }>({});
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<JobCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { loading, error, execute } = useApi({
    onSuccess: (response) => {
      setJobCategories(response || []);
    }
  });

  const loadJobCategories = () => {
    execute(() => jobCategoriesService.getAll());
  };

  useEffect(() => {
    loadJobCategories();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(jobCategories);
    } else {
      const filtered = jobCategories.filter((category) =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, jobCategories]);

  const handleAddNew = () => {
    setFormMode('create');
    setEditingCategory(null);
    setFormData({ title: '' });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleEdit = (category: JobCategory) => {
    setFormMode('edit');
    setEditingCategory(category);
    setFormData({ title: category.title });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: { title?: string } = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Category title is required';
    } else if (formData.title.length > 150) {
      errors.title = 'Title must be 150 characters or less';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (formMode === 'create') {
        await jobCategoriesService.create(formData);
        
      } else if (editingCategory) {
        await jobCategoriesService.update(editingCategory.id, formData as UpdateJobCategoryDto);
        
      }
      
      setIsFormOpen(false);
      loadJobCategories();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      alert(`Failed to ${formMode} job category: ${errorMessage}`);
    }
  };

  const handleDeleteClick = (category: JobCategory) => {
    setDeletingCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    
    setIsDeleting(true);
    try {
      await jobCategoriesService.delete(deletingCategory.id);
      
      setDeleteDialogOpen(false);
      loadJobCategories();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      alert(`Failed to delete job category: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <CategoryBreadcrumb categoryLabel="Job Categories Management" />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Job Categories Management</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <CategoryToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddNew={handleAddNew}
          addButtonText="Add Category"
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Title
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <TableSkeleton />
              ) : error ? (
                <ErrorState onRetry={loadJobCategories} />
              ) : filteredCategories.length === 0 ? (
                <EmptyState />
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{category.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.title}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
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
      </div>

      {/* Form Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {formMode === 'create' ? 'Add New Job Category' : 'Edit Job Category'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Security Operations, Development"
                  maxLength={150}
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {formMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="Delete Job Category"
        message="Are you sure you want to delete this job category? This action cannot be undone."
        itemName={deletingCategory?.title}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default JobCategoriesPage;