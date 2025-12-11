import { LucideIcon } from 'lucide-react';

interface TableEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export default function TableEmptyState({ icon: Icon, title, description }: TableEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}
