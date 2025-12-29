'use client';
import React, { useEffect, useState } from "react";
import ExamContainer from "@/components/exam/ExamContainer";
import { api } from "@/lib/api-client";

type Params = Promise<{ testId: string }>


export default function ExamPage(props: {
  params: Params;
} ) {
  const params = React.use(props.params)
  const testId = params.testId
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    try {
      api.tests.getPages(testId)
      .then((res) => {
        setPages(res.pages);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
    } catch (error) {
      console.error('Error fetching pages:', error);
      setLoading(false);
    }
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



