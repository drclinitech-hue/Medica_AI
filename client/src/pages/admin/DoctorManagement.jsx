import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { 
  MoreHorizontal, Search, Filter, CheckCircle, 
  XCircle, Stethoscope, AlertTriangle, UserPlus, Trash2
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const DropdownMenu = ({ isOpen, onClose, onVerify, onSuspend }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-card border rounded-lg shadow-lg py-1 z-50">
      <button 
        onClick={() => { onVerify(); onClose(); }}
        className="w-full text-left px-4 py-2 text-sm text-green-500 hover:bg-muted"
      >
        Verify
      </button>
      <button 
        onClick={() => { onSuspend(); onClose(); }}
        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-muted"
      >
        Suspend
      </button>
    </div>
  );
};

const DoctorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', pmdcNumber: '', specialization: '', fee: 1000, city: ''
  });
  
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: adminService.getDoctors
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteDoctor,
    onSuccess: () => {
      toast.success('Doctor deleted successfully');
      queryClient.invalidateQueries(['doctors']);
    },
    onError: (err) => toast.error('Error deleting doctor: ' + (err.response?.data?.message || err.message))
  });

  const createMutation = useMutation({
    mutationFn: adminService.createDoctor,
    onSuccess: () => {
      toast.success('Doctor added successfully');
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', password: '', pmdcNumber: '', specialization: '', fee: 1000, city: '' });
      queryClient.invalidateQueries(['doctors']);
    },
    onError: (err) => toast.error('Error adding doctor: ' + (err.response?.data?.message || err.message))
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminService.updateDoctorStatus(id, status),
    onSuccess: () => {
      toast.success('Doctor status updated');
      queryClient.invalidateQueries(['doctors']);
    },
    onError: (err) => toast.error('Error updating status: ' + (err.response?.data?.message || err.message))
  });

  const handleDeleteDoctor = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const columns = [
    {
      accessorKey: 'userId',
      header: 'Doctor',
      cell: info => {
        const user = info.getValue() || {};
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">{user.name || 'Unknown'}</p>
              <p className="text-xs text-muted-foreground">{user.email || 'N/A'}</p>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'pmdcNumber',
      header: 'PMDC No.'
    },
    {
      accessorKey: 'specialization',
      header: 'Specializations',
      cell: info => (
        <span className="px-2 py-1 bg-muted rounded-md text-xs">{info.getValue()}</span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        let color = 'bg-gray-500/10 text-gray-500';
        let Icon = CheckCircle;
        if (status === 'Verified') { color = 'bg-green-500/10 text-green-500'; }
        if (status === 'Pending') { color = 'bg-yellow-500/10 text-yellow-500'; Icon = AlertTriangle; }
        if (status === 'Suspended') { color = 'bg-red-500/10 text-red-500'; Icon = XCircle; }

        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
            <Icon className="w-3.5 h-3.5" />
            {status}
          </span>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: info => new Date(info.getValue()).toLocaleDateString()
    },
    {
      id: 'actions',
      cell: info => {
        const id = info.row.original._id;
        return (
          <div className="flex gap-2 items-center relative">
            <div className="relative">
              <button 
                onClick={() => setOpenDropdownId(openDropdownId === id ? null : id)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
              </button>
              <DropdownMenu 
                isOpen={openDropdownId === id} 
                onClose={() => setOpenDropdownId(null)}
                onVerify={() => updateStatusMutation.mutate({ id, status: 'Verified' })}
                onSuspend={() => updateStatusMutation.mutate({ id, status: 'Suspended' })}
              />
            </div>
            <button 
              onClick={() => handleDeleteDoctor(id)}
              className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-muted-foreground"
              title="Delete Doctor"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        );
      }
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
          <h1 className="text-3xl font-black mb-1">Doctor Management</h1>
          <p className="text-muted-foreground">Verify and manage medical professionals on MediCheck AI.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b bg-muted/20 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search PMDC or Name..." 
              className="w-full bg-background border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-background border rounded-xl px-3 py-2 cursor-pointer">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">All Statuses</span>
            </div>
          </div>
        </div>

        {/* Table Container */}
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
                      No doctors found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {isLoading && <div className="p-4 text-center text-muted-foreground">Loading...</div>}
      </div>

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Doctor</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input required type="text" className="w-full bg-background border rounded-lg px-3 py-2" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input required type="email" className="w-full bg-background border rounded-lg px-3 py-2" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input required type="password" minLength="6" className="w-full bg-background border rounded-lg px-3 py-2" 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PMDC Number</label>
                <input required type="text" className="w-full bg-background border rounded-lg px-3 py-2" 
                  value={formData.pmdcNumber} onChange={e => setFormData({...formData, pmdcNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <input required type="text" className="w-full bg-background border rounded-lg px-3 py-2" 
                  value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Fee (PKR)</label>
                  <input type="number" className="w-full bg-background border rounded-lg px-3 py-2" 
                    value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input type="text" className="w-full bg-background border rounded-lg px-3 py-2" 
                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-lg font-medium hover:bg-muted">Cancel</button>
                <button type="submit" disabled={createMutation.isLoading} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">
                  {createMutation.isLoading ? 'Adding...' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
