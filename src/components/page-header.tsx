import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-7 w-7 text-primary hidden sm:block" />}
          <div>
            <h1 className="text-2xl md:text-3xl font-headline font-semibold text-foreground">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground font-body">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
