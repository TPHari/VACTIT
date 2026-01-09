import React from 'react';

interface TeacherCardProps {
  teacher: any;
  onSelect: (teacher: any) => void; // Thêm prop để báo cho cha biết khi được click
}

export default function TeacherCard({ teacher, onSelect }: TeacherCardProps) {
  return (
    <article className="bg-white rounded-2x1 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full">
      <div className="w-full overflow-hidden rounded-t-2xl bg-gray-100 relative" style={{ paddingTop: '100%' }}>
        <img
          src={teacher.image}
          alt={teacher.name}
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
        />
        {/* Overlay effect on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-base font-semibold mb-3 text-gray-800">{teacher.name}</h3>

        <ul className="text-sm text-gray-600 space-y-2 mb-3 leading-relaxed">
          {teacher.badges?.map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-1 inline-block w-2 h-2 rounded-full bg-yellow-500" />
              <span className="">{b}</span>
            </li>
          ))}
        </ul>

      </div>
    </article>
  );
}