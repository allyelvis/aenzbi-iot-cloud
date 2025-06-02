import { CloudCog } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2 h-14">
      <CloudCog className="h-8 w-8 text-primary" />
      <h1 className="text-xl font-headline font-semibold text-foreground group-data-[collapsible=icon]:hidden">
        Aenzbi IoT
      </h1>
    </div>
  );
}
