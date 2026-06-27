import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { 
  MoreHorizontal, Search, Filter, CheckCircle, 
  XCircle, Stethoscope, AlertTriangle, UserPlus
} from 'lucide-react';

const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Sarah Ahmed', email: 'sarah@medica.ai', specializations: ['Cardiology'], pmdc: '12345-A', status: 'Verified', joinDate: '2025-01-15' },
  { id: 2, name: 'Dr. Ali Khan', email: 'ali@medica.ai', specializations: ['Neurology', 'General'], pmdc: '67890-S', status: 'Pending', joinDate: '2025-02-10' },
  { id: 3, name: 'Dr. Fatima Tariq', email: 'fatima@medica.ai', specializations: ['Pediatrics'], pmdc: '11223-P', status: 'Suspended', joinDate: '2024-11-20' },
];

const DoctorManagement = () => {
  const [data] = useState(MOCK_DOCTORS);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    {
      accessorKey: 'name',
      header: 'Doctor',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold">{info.row.original.name}</p>
            <p className="text-xs text-muted-foreground">{info.row.original.email}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'pmdc',
      header: 'PMDC No.'
    },
    {
      accessorKey: 'specializations',
      header: 'Specializations',
      cell: info => (
        <div className="flex gap-1 flex-wrap">
          {info.getValue().map(spec => (
            <span key={spec} className="px-2 py-1 bg-muted rounded-md text-xs">{spec}</span>
          ))}
        </div>
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
      accessorKey: 'joinDate',
      header: 'Joined'
    },
    {
      id: 'actions',
      cell: () => (
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      )
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1">Doctor Management</h1>
          <p className="text-muted-foreground">Approve, verify, and manage healthcare professionals.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2">
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
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;
