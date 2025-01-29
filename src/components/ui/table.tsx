import React from 'react';

export const Table = ({ children, className = '', ...props }: React.HTMLProps<HTMLTableElement>) => (
  <table className={`min-w-full divide-y divide-gray-200 ${className}`} {...props}>
    {children}
  </table>
);

export const TableHeader = ({ children, className = '', ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
  <thead className={`bg-gray-50 ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = '', ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
  <tbody className={`bg-white divide-y divide-gray-200 ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableHead = ({ children, className = '', ...props }: React.HTMLProps<HTMLTableCellElement>) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`} {...props}>
    {children}
  </th>
);

export const TableRow = ({ children, className = '', ...props }: React.HTMLProps<HTMLTableRowElement>) => (
  <tr className={`${className}`} {...props}>
    {children}
  </tr>
);

export const TableCell = ({ children, className = '', ...props }: React.HTMLProps<HTMLTableCellElement>) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </td>
);
