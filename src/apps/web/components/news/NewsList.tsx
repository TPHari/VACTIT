import React from 'react';
import NewsCard from './NewsCard';

interface NewsListProps {
  items: Array<any>;
  onSelect: (item: any) => void; // Thêm dòng này
}

export default function NewsList({ items, onSelect }: NewsListProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {items.map((item) => (
        <NewsCard 
          key={item.id} 
          item={item} 
          onSelect={onSelect} // Truyền xuống Card
        />
      ))}
    </div>
  );
}