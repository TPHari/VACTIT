import Link from 'next/link';

export default function TeacherCard({ teacher }: { teacher: any }) {
  return (
    <article className="bg-white rounded-2x1 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full">
      <div className="w-full overflow-hidden rounded-t-2xl bg-gray-100 relative" style={{ paddingTop: '100%' }}>
        <img
          src={teacher.image}
          alt={teacher.name}
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
        />
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