import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { 
  MoreHorizontal, Search, Activity, Plus
} from 'lucide-react';

const MOCK_DISEASES = [
  { id: 1, name: 'Dengue Fever', category: 'Infectious', riskLevel: 'High', symptoms: ['Fever', 'Joint Pain', 'Rash'] },
  { id: 2, name: 'Typhoid', category: 'Bacterial', riskLevel: 'Moderate', symptoms: ['High Fever', 'Abdominal Pain', 'Weakness'] },
  { id: 3, name: 'Covid-19', category: 'Viral', riskLevel: 'High', symptoms: ['Fever', 'Cough', 'Loss of Taste'] },
];

const DiseaseManagement = () => {
  const [data] = useState(MOCK_DISEASES);

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
    {
      accessorKey: 'category',
      header: 'Category'
    },
    {
      accessorKey: 'riskLevel',
      header: 'Risk Level',
      cell: info => {
        const risk = info.getValue();
        let color = 'bg-gray-500/10 text-gray-500';
        if (risk === 'High') color = 'bg-red-500/10 text-red-500';
        if (risk === 'Moderate') color = 'bg-yellow-500/10 text-yellow-500';
        return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>{risk}</span>;
      }
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
          <h1 className="text-3xl font-black mb-1">Diseases & Symptoms</h1>
          <p className="text-muted-foreground">Manage the knowledge base for the AI Prediction Model.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2">
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

export default DiseaseManagement;
