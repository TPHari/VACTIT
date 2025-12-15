import TeacherCard from './TeacherCard';

export default function TeacherList({ items }: { items: Array<any> }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((t) => (
        <TeacherCard key={t.id} teacher={t} />
      ))}
    </div>
  );
}