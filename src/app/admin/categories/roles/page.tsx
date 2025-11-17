/* eslint-disable react-hooks/exhaustive-deps */
// src/app/admin/categories/roles/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { CategoryBreadcrumb } from '@/components/categories/CategoryBreadcrumb';
import { CategoryToolbar } from '@/components/categories/CategoryToolbar';
import { DeleteConfirmDialog } from '@/components/categories/DeleteConfirmDialog';
import { rolesService, jobCategoriesService } from '@/services/categoryService';
import { Role, CreateRoleDto, UpdateRoleDto, JobCategory } from '@/types/categories';
import { useApi } from '@/hooks/useApi';
import { Pencil, Trash2, X } from 'lucide-react';
import { TableSkeleton } from '@/components/kyc-management/states/TableSkeleton';
import { EmptyState } from '@/components/kyc-management/states/EmptyState';
import { ErrorState } from '@/components/kyc-management/states/ErrorState';

const RolesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<CreateRoleDto>({ name: '', categoryId: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { loading, error, execute } = useApi({
    onSuccess: (response) => {
      setRoles(response || []);
    }
  });

  const loadRoles = () => {
    execute(() => rolesService.getAll());
  };

  const loadJobCategories = async () => {
    try {
      const categories = await jobCategoriesService.getAll();
      setJobCategories(categories);
    } catch (err) {
      console.error('Failed to load job categories:', err);
    }
  };

  useEffect(() => {
    loadRoles();
    loadJobCategories();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter((role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.category?.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRoles(filtered);
    }
  }, [searchQuery, roles]);

  const handleAddNew = () => {
    setFormMode('create');
    setEditingRole(null);
    setFormData({ name: '', categoryId: '' });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleEdit = (role: Role) => {
    setFormMode('edit');
    setEditingRole(role);
    setFormData({ name: role.name, categoryId: role.categoryId });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Role name is required';
    } else if (formData.name.length > 150) {
      errors.name = 'Role name must be 150 characters or less';
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Job category is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (formMode === 'create') {
        await rolesService.create(formData);
        
      } else if (editingRole) {
        await rolesService.update(editingRole.id, formData as UpdateRoleDto);
        
      }
      
      setIsFormOpen(false);
      loadRoles();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      alert(`Failed to ${formMode} role: ${errorMessage}`);
    }
  };

  const handleDeleteClick = (role: Role) => {
    setDeletingRole(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRole) return;
    
    setIsDeleting(true);
    try {
      await rolesService.delete(deletingRole.id);
      
      setDeleteDialogOpen(false);
      loadRoles();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      alert(`Failed to delete role: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <CategoryBreadcrumb categoryLabel="Roles Management" />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Roles Management</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <CategoryToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddNew={handleAddNew}
          addButtonText="Add Role"
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <TableSkeleton />
              ) : error ? (
                <ErrorState onRetry={loadRoles} />
              ) : filteredRoles.length === 0 ? (
                <EmptyState />
              ) : (
                filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{role.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{role.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {role.category?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(role)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(role)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Delete">
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {formMode === 'create' ? 'Add New Role' : 'Edit Role'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Security Analyst, Penetration Tester"
                    maxLength={150}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.categoryId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {jobCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                  {formErrors.categoryId && <p className="mt-1 text-sm text-red-600">{formErrors.categoryId}</p>}
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
        title="Delete Role"
        message="Are you sure you want to delete this role? This action cannot be undone."
        itemName={deletingRole?.name}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default RolesPage;