import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const mockData = [
  { name: 'Apartamento Central', leads: 12 },
  { name: 'Casa com Jardim', leads: 9 },
  { name: 'Cobertura Luxo', leads: 7 },
];

export default function TopPropertiesWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Imóveis com mais leads</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {mockData.map((p) => (
            <li key={p.name} className="flex justify-between">
              <span>{p.name}</span>
              <span className="text-muted-foreground">{p.leads}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

