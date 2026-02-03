import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page you're looking for doesn't exist or the opportunity may have been moved.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button variant="default">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        <Link href="/opportunities">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Browse Opportunities
          </Button>
        </Link>
      </div>
    </div>
  );
}
