/* eslint-disable react-hooks/exhaustive-deps */
// src/app/admin/categories/skills/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { CategoryBreadcrumb } from '@/components/categories/CategoryBreadcrumb';
import { CategoryToolbar } from '@/components/categories/CategoryToolbar';
import { DeleteConfirmDialog } from '@/components/categories/DeleteConfirmDialog';
import { skillsService } from '@/services/categoryService';
import { Skill, CreateSkillDto, UpdateSkillDto } from '@/types/categories';
import { useApi } from '@/hooks/useApi';
import { Pencil, Trash2, X } from 'lucide-react';
import { TableSkeleton } from '@/components/kyc-management/states/TableSkeleton';
import { EmptyState } from '@/components/kyc-management/states/EmptyState';
import { ErrorState } from '@/components/kyc-management/states/ErrorState';

const SkillsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  
  // Form dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<CreateSkillDto>({ name: '' });
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { loading, error, execute } = useApi({
    onSuccess: (response) => {
        const skillsdata = response || [];
        setSkills(skillsdata);
    }
  });

  const loadSkills = () => {
    execute(() => skillsService.getAll());
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // Filter skills based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSkills(skills);
    } else {
      const filtered = skills.filter((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSkills(filtered);
    }
  }, [searchQuery, skills]);

  // Form handlers
  const handleAddNew = () => {
    setFormMode('create');
    setEditingSkill(null);
    setFormData({ name: '' });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setFormMode('edit');
    setEditingSkill(skill);
    setFormData({ name: skill.name });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: { name?: string } = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Skill name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Skill name must be 100 characters or less';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (formMode === 'create') {
        await skillsService.create(formData);
      } else if (editingSkill) {
        await skillsService.update(editingSkill.id, formData as UpdateSkillDto);
      }
      
      setIsFormOpen(false);
      loadSkills();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      alert(`Failed to ${formMode} skill: ${errorMessage}`);
    }
  };

  // Delete handlers
  const handleDeleteClick = (skill: Skill) => {
    setDeletingSkill(skill);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSkill) return;
    
    setIsDeleting(true);
    try {
      await skillsService.delete(deletingSkill.id);
      setDeleteDialogOpen(false);
      loadSkills();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      alert(`Failed to delete skill: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRetry = () => {
    loadSkills();
  };

  return (
    <div className="p-6">
      <CategoryBreadcrumb categoryLabel="Skills Management" />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Skills Management</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <CategoryToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddNew={handleAddNew}
          addButtonText="Add Skill"
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skill Name
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
                <ErrorState onRetry={handleRetry} />
              ) : filteredSkills.length === 0 ? (
                <EmptyState />
              ) : (
                filteredSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{skill.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{skill.name}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(skill)}
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
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {formMode === 'create' ? 'Add New Skill' : 'Edit Skill'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter skill name"
                  maxLength={100}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
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

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        itemName={deletingSkill?.name}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SkillsPage;