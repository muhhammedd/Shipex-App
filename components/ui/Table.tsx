import React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
}

export function Table({ children, className = '', ...props }: TableProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-accent/10 glass shadow-premium">
            <table className={`min-w-full divide-y divide-accent/10 ${className}`} {...props}>
                {children}
            </table>
        </div>
    );
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
}

export function TableHeader({ children, className = '', ...props }: TableHeaderProps) {
    return (
        <thead className={`bg-surface/30 backdrop-blur-md ${className}`} {...props}>
            {children}
        </thead>
    );
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
}

export function TableBody({ children, className = '', ...props }: TableBodyProps) {
    return (
        <tbody className={`divide-y divide-accent/5 ${className}`} {...props}>
            {children}
        </tbody>
    );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    children: React.ReactNode;
}

export function TableRow({ children, className = '', ...props }: TableRowProps) {
    return (
        <tr
            className={`hover:bg-accent/5 transition-all duration-300 group ${className}`}
            {...props}
        >
            {children}
        </tr>
    );
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}

export function TableHead({ children, className = '', ...props }: TableHeadProps) {
    return (
        <th
            scope="col"
            className={`px-6 py-4 text-left text-[10px] font-black text-accent uppercase tracking-[0.2em] ${className}`}
            {...props}
        >
            {children}
        </th>
    );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}

export function TableCell({ children, className = '', ...props }: TableCellProps) {
    return (
        <td
            className={`px-6 py-4 whitespace-nowrap text-sm text-primary-light/80 group-hover:text-accent transition-colors ${className}`}
            {...props}
        >
            {children}
        </td>
    );
}

interface DataTableProps {
    data: any[];
    columns: {
        header: string;
        accessor: string | ((item: any) => React.ReactNode);
    }[];
    className?: string;
}

export function DataTable({ data, columns, className = '' }: DataTableProps) {
    return (
        <Table className={className}>
            <TableHeader>
                <TableRow>
                    {columns.map((col, i) => (
                        <TableHead key={i}>{col.header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columns.map((col, colIndex) => {
                            const content = typeof col.accessor === 'function'
                                ? col.accessor(item)
                                : item[col.accessor];
                            return (
                                <TableCell key={colIndex}>
                                    {content}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
