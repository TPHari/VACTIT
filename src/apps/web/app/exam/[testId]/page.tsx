'use client';
import React, { useEffect, useState } from "react";
import ExamContainer from "@/components/exam/ExamContainer";


type Params = Promise<{ testId: string }>


export default function ExamPage(props: {
  params: Params;
} ) {
  const params = React.use(props.params)
  const testId = params.testId
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    console.log(`Fetching pages for exam ${testId}`);


    fetch(`/api/exam/${testId}/pages`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setPages(data.pages || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [testId]);


  if (loading) {
    return <div className="p-4">Loading exam…</div>;
  }


  return (
    <div className="min-h-screen flex flex-col h-screen">
      <main className="flex-1 overflow-hidden p-4 bg-gray-50">
        <ExamContainer testId={testId} initialPages={pages} />
      </main>
    </div>
  );
}



