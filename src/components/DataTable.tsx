import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useVirtualizer } from '@tanstack/react-virtual';
import Papa from 'papaparse';
import { toast } from 'sonner';

interface Domain {
  Domain: string;
  'Niche 1': string;
  'Niche 2': string;
  Traffic: string;
  DR: number;
  DA: number;
  Language: string;
  Price: string;
  'Spam Score': string;
}

interface DataTableProps {
  searchTerm: string;
}

export const DataTable = ({ searchTerm }: DataTableProps) => {
  const [data, setData] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Domain;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Attempting to fetch CSV file...');
        const response = await fetch('/Sheet1.csv');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('CSV text received:', csvText.substring(0, 100) + '...');
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            console.log('Parse complete. Row count:', results.data.length);
            console.log('First row:', results.data[0]);
            setData(results.data as Domain[]);
            setIsLoading(false);
            toast.success('Data loaded successfully!');
          },
          error: (error) => {
            console.error('Parse error:', error);
            toast.error('Error parsing CSV file');
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading CSV:', error);
        toast.error('Error loading CSV file');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredData = data.filter(item =>
    item.Domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortData = (key: keyof Domain) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setData(sorted);
    setSortConfig({ key, direction });
  };

  const parentRef = useVirtualizer({
    count: filteredData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-white rounded-md border">
        <div className="text-lg">Loading data...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-white rounded-md border">
        <div className="text-lg">No data available. Please ensure Sheet1.csv is in the public folder.</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <div className="relative" style={{ height: '600px' }} ref={parentRef}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => sortData('Domain')} className="cursor-pointer">
                Domain Name
              </TableHead>
              <TableHead onClick={() => sortData('Niche 1')} className="cursor-pointer">
                Niche 1
              </TableHead>
              <TableHead onClick={() => sortData('Niche 2')} className="cursor-pointer">
                Niche 2
              </TableHead>
              <TableHead onClick={() => sortData('Traffic')} className="cursor-pointer">
                Traffic
              </TableHead>
              <TableHead onClick={() => sortData('DR')} className="cursor-pointer">
                DR
              </TableHead>
              <TableHead onClick={() => sortData('DA')} className="cursor-pointer">
                DA
              </TableHead>
              <TableHead onClick={() => sortData('Language')} className="cursor-pointer">
                Language
              </TableHead>
              <TableHead onClick={() => sortData('Price')} className="cursor-pointer">
                Price
              </TableHead>
              <TableHead onClick={() => sortData('Spam Score')} className="cursor-pointer">
                Spam Score
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parentRef.getVirtualItems().map((virtualRow) => {
              const item = filteredData[virtualRow.index];
              return (
                <TableRow key={virtualRow.index}>
                  <TableCell>{item.Domain}</TableCell>
                  <TableCell>{item['Niche 1']}</TableCell>
                  <TableCell>{item['Niche 2']}</TableCell>
                  <TableCell>{item.Traffic}</TableCell>
                  <TableCell>{item.DR}</TableCell>
                  <TableCell>{item.DA}</TableCell>
                  <TableCell>{item.Language}</TableCell>
                  <TableCell>{item.Price}</TableCell>
                  <TableCell>{item['Spam Score']}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};