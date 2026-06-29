import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { 
  MoreHorizontal, Search, Filter, Shield, 
  User as UserIcon, HeartPulse, Activity, ShieldAlert, Trash2
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const DropdownMenu = ({ isOpen, onClose, onChangeRole }) => {
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
    <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-card border rounded-lg shadow-lg py-1 z-50">
      <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">Change Role</div>
      <button onClick={() => { onChangeRole('patient'); onClose(); }} className="w-full text-left px-4 py-2 text-sm hover:bg-muted text-emerald-500">Make Patient</button>
      <button onClick={() => { onChangeRole('admin'); onClose(); }} className="w-full text-left px-4 py-2 text-sm hover:bg-muted text-red-500">Make Admin</button>
    </div>
  );
};

const UserManagement = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', page, search, roleFilter],
    queryFn: () => adminService.getUsers(page, 10, search, roleFilter),
    keepPreviousData: true,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchTerm);
    setPage(1);
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: info => {
        const user = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: info => {
        const role = info.getValue();
        let Icon = UserIcon;
        let color = 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        
        if (role === 'doctor') {
          Icon = HeartPulse;
          color = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        } else if (role === 'patient') {
          Icon = Activity;
          color = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        } else if (['admin', 'superadmin', 'moderator'].includes(role)) {
          Icon = ShieldAlert;
          color = 'bg-red-500/10 text-red-500 border-red-500/20';
        }

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${color}`}>
            <Icon className="w-3.5 h-3.5" />
            {role}
          </div>
        )
      }
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: info => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${info.getValue() !== false ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {info.getValue() !== false ? 'Active' : 'Suspended'}
        </span>
      )
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
                onChangeRole={(role) => updateRoleMutation.mutate({ id, role })}
              />
            </div>
            <button 
              onClick={() => handleDeleteUser(id)}
              className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-muted-foreground"
              title="Delete User"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        );
      }
    }
  ];

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries(['users']);
    },
    onError: (err) => toast.error('Error deleting user: ' + (err.response?.data?.message || err.message))
  });

  const createMutation = useMutation({
    mutationFn: adminService.createUser,
    onSuccess: () => {
      toast.success('User created successfully');
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      queryClient.invalidateQueries(['users']);
    },
    onError: (err) => toast.error('Error creating user: ' + (err.response?.data?.message || err.message))
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => adminService.updateUserRole(id, role),
    onSuccess: () => {
      toast.success('User role updated');
      queryClient.invalidateQueries(['users']);
    },
    onError: (err) => toast.error('Error updating role: ' + (err.response?.data?.message || err.message))
  });

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.meta?.pages || -1,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1">User Management</h1>
          <p className="text-muted-foreground">Manage patients, doctors, and system administrators.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <Shield className="w-4 h-4" /> Add Admin
        </button>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b bg-muted/20 flex flex-wrap gap-4 items-center justify-between shrink-0">
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..." 
              className="w-full bg-background border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </form>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-background border rounded-xl px-3 py-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select 
                className="bg-transparent text-sm focus:outline-none cursor-pointer"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Roles</option>
                <option value="patient">Patients</option>
                <option value="doctor">Doctors</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-0 shadow-sm">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 font-semibold">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                !isLoading && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between bg-muted/10 shrink-0">
          <p className="text-sm text-muted-foreground">
            Showing page <span className="font-semibold text-foreground">{page}</span> of <span className="font-semibold text-foreground">{data?.meta?.pages || 1}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(old => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-muted disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(old => (data?.meta?.pages && old < data.meta.pages ? old + 1 : old))}
              disabled={!data?.meta?.pages || page === data.meta.pages}
              className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-muted disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Add New User</h2>
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
                <label className="block text-sm font-medium mb-1">Role</label>
                <select className="w-full bg-background border rounded-lg px-3 py-2" 
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="admin">Admin</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-lg font-medium hover:bg-muted">Cancel</button>
                <button type="submit" disabled={createMutation.isLoading} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">
                  {createMutation.isLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
