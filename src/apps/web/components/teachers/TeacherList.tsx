import TeacherCard from './TeacherCard';

interface TeacherListProps {
  items: Array<any>;
  onSelect: (teacher: any) => void;
}

export default function TeacherList({ items, onSelect }: TeacherListProps) {
  return (
    // Sử dụng flex-wrap và justify-center để các thẻ w-56 luôn căn giữa đẹp mắt
    <div className="flex flex-wrap justify-center gap-6 pb-8">
      {items.map((t) => (
        <TeacherCard 
          key={t.id} 
          teacher={t} 
          onSelect={onSelect} 
        />
      ))}
    </div>
  );
}