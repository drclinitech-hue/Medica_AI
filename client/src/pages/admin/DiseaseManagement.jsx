import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { 
  MoreHorizontal, Search, Activity, Plus, Trash2
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const DiseaseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', description: '', riskLevel: 'Moderate', category: 'General', symptoms: '' 
  });

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['diseases'],
    queryFn: adminService.getDiseases
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteDisease,
    onSuccess: () => {
      toast.success('Disease deleted successfully');
      queryClient.invalidateQueries(['diseases']);
    },
    onError: (err) => toast.error('Error deleting disease: ' + (err.response?.data?.message || err.message))
  });

  const createMutation = useMutation({
    mutationFn: adminService.createDisease,
    onSuccess: () => {
      toast.success('Disease added successfully');
      setIsAddModalOpen(false);
      setFormData({ name: '', description: '', riskLevel: 'Moderate', category: 'General', symptoms: '' });
      queryClient.invalidateQueries(['diseases']);
    },
    onError: (err) => toast.error('Error adding disease: ' + (err.response?.data?.message || err.message))
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this disease?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean)
    };
    createMutation.mutate(payload);
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Disease',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-semibold">{info.getValue()}</span>
        </div>
      )
    },
      accessorKey: 'description',
      header: 'Description',
      cell: info => <span className="truncate max-w-[200px] block" title={info.getValue()}>{info.getValue()}</span>
    },
    {
      accessorKey: 'symptoms',
      header: 'Key Symptoms',
      cell: info => (
        <div className="flex gap-1 flex-wrap">
          {info.getValue().map(symp => (
            <span key={symp} className="px-2 py-1 bg-muted rounded-md text-xs">{symp}</span>
          ))}
        </div>
      )
    },
    {
      id: 'actions',
      cell: info => (
        <div className="flex gap-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
          <button 
            onClick={() => handleDelete(info.row.original._id)}
            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-muted-foreground"
            title="Delete Disease"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1">Diseases & Symptoms</h1>
          <p className="text-muted-foreground">Manage the knowledge base for the AI Prediction Model.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Disease
        </button>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b bg-muted/20 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search diseases..." 
              className="w-full bg-background border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 font-semibold">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                !isLoading && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground">
                      No diseases found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {isLoading && <div className="p-4 text-center text-muted-foreground">Loading...</div>}
      </div>

      {/* Add Disease Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Disease</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Disease Name</label>
                <input required type="text" className="w-full bg-background border rounded-lg px-3 py-2" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required rows="2" className="w-full bg-background border rounded-lg px-3 py-2" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Symptoms (comma separated)</label>
                <textarea required rows="2" placeholder="Fever, Cough, Headache" className="w-full bg-background border rounded-lg px-3 py-2" 
                  value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} />
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-lg font-medium hover:bg-muted">Cancel</button>
                <button type="submit" disabled={createMutation.isLoading} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">
                  {createMutation.isLoading ? 'Adding...' : 'Add Disease'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseManagement;
