import {Link} from 'wouter';
import {ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-128px)] w-full flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4 select-none">
          404
        </div>
        <p className="text-sm font-mono text-muted-foreground mb-4">
          page not found
        </p>
        <h1 className="text-2xl font-display font-bold text-foreground mb-3">
          Nothing to flash here
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
          Head back to safety.
        </p>
        <Button asChild className="rounded-xl gap-2 bg-primary hover:bg-primary/90">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
