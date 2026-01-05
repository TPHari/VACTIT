import Link from 'next/link';

export default function NewsCard({ item }: { item: any }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition hover:ring-1 hover:ring-blue-100 flex flex-col h-full">
      <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>

      {/* content wrapper is a column that grows so the footer (Đọc thêm) stays at the bottom */}
      <div className="flex flex-col flex-1 pt-2 pb-4 px-4">
        <div className="text-sm text-gray-500 flex items-center gap-3 mb-3">
          <span className="text-yellow-500 font-medium">{item.author}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">{item.date}</span>
          <span className="ml-auto text-xs text-gray-400">{item.views} lượt xem</span>
        </div>

        <h3 className="text-lg font-semibold mb-2 leading-tight">{item.title}</h3>

        {/* make excerpt take remaining space so footer stays pinned */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{item.excerpt}</p>

        {/* footer always at bottom */}
        <div className="mt-3">
          <button
            className="inline-flex items-center text-blue-600 font-medium hover:cursor-pointer hover:underline"
          >
            Đọc thêm
            <span className="ml-2 text-blue-600">→</span>
          </button>
        </div>
      </div>
    </article>
  );
}