import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { 
  MoreHorizontal, Search, Filter,
  User as UserIcon
} from 'lucide-react';
import adminService from '../../services/adminService';

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: adminService.getPatients
  });

  const columns = [
    {
      accessorKey: 'name',
      header: 'Patient',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold">{info.row.original.name}</p>
            <p className="text-xs text-muted-foreground">{info.row.original.email}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: info => info.getValue() || 'N/A'
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: info => info.getValue() || 'N/A'
    },
    {
      accessorKey: 'predictions',
      header: 'Total Predictions',
      cell: info => (
        <span className="font-bold text-primary">{info.getValue()}</span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: info => new Date(info.getValue()).toLocaleDateString()
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
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1">Patient Management</h1>
          <p className="text-muted-foreground">View and manage patient records and history.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b bg-muted/20 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by Name or Email..." 
              className="w-full bg-background border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
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
                      No patients found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {isLoading && <div className="p-4 text-center text-muted-foreground">Loading...</div>}
      </div>
    </div>
  );
};

export default PatientManagement;
