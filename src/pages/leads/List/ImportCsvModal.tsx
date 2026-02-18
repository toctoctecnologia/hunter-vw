import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { parseCsv } from '@/data/leads/csv';
import { importCsv } from '@/data/leads/leadsMockService';
import { toast } from '@/hooks/use-toast';

interface ImportCsvModalProps {
  onImported?: () => void;
}

export function ImportCsvModal({ onImported }: ImportCsvModalProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({
    name: 'name',
    email: 'email',
    phone: 'phone',
    status: 'status',
    source: 'source'
  });

  const handleFile = async (f: File) => {
    const text = await f.text();
    const records = parseCsv(text);
    setHeaders(Object.keys(records[0] || {}));
    setRows(records.slice(0, 10));
    setFile(f);
  };

  const handleImport = async () => {
    if (!file) return;
    const text = await file.text();
    const records = parseCsv(text);
    const mapped = records.map(r => ({
      name: r[mapping.name] ?? '',
      email: r[mapping.email] ?? '',
      phone: r[mapping.phone] ?? '',
      status: r[mapping.status] ?? '',
      source: r[mapping.source] ?? ''
    }));
    const csv = [
      'name,email,phone,status,source',
      ...mapped.map(r =>
        [r.name, r.email, r.phone, r.status, r.source]
          .map(v => `"${v.replace(/"/g, '""')}"`)
          .join(',')
      )
    ].join('\n');
    const mappedFile = new File([csv], file.name, { type: 'text/csv' });
    const count = await importCsv(mappedFile);
    toast({
      title: 'Importação concluída',
      description: `${count} leads importados`
    });
    setOpen(false);
    setFile(null);
    setHeaders([]);
    setRows([]);
    onImported?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Importar CSV</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Importar CSV</DialogTitle>
        </DialogHeader>
        {!file && (
          <input
            type="file"
            accept=".csv"
            aria-label="Selecionar arquivo CSV"
            className="focus:outline-none focus:ring-2 focus:ring-ring"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
        )}
        {file && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {['name', 'email', 'phone', 'status', 'source'].map(field => (
                <div key={field} className="space-y-1">
                  <label id={`label-${field}`} className="text-sm font-medium capitalize">
                    {field}
                  </label>
                  <Select
                    value={mapping[field]}
                    onValueChange={v => setMapping(m => ({ ...m, [field]: v }))}
                  >
                    <SelectTrigger
                      id={`select-${field}`}
                      aria-labelledby={`label-${field}`}
                    >
                      <SelectValue placeholder="Coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map(h => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map(h => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i}>
                    {headers.map(h => (
                      <TableCell key={h}>{r[h]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file}>
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportCsvModal;
