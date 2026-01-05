import TeacherCard from './TeacherCard';

interface TeacherListProps {
  items: Array<any>;
  onSelect: (teacher: any) => void;
}

export default function TeacherList({ items, onSelect }: TeacherListProps) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {items.map((t) => (
          <TeacherCard key={t.id} teacher={t} />
        ))}
      </div>
    </div>
  );
}