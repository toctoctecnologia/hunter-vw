import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function NewAnalysisButton() {
  return (
    <Button asChild>
      <Link to="/analises/nova">Nova análise</Link>
    </Button>
  );
}

