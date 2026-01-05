'use client';
import React, { useEffect, useState } from "react";
import ExamContainer from "@/components/exam/ExamContainer";
import { api } from "@/lib/api-client";
import Loading from "./loading";

type Params = Promise<{ testId: string }>


export default function ExamPage(props: {
  params: Params;
}) {
  const params = React.use(props.params)
  const testId = params.testId
  const [pages, setPages] = useState<string[]>([]);
  const [trialData, setTrialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    try {
      // Fetch both pages and trial details (which contains test info)
      Promise.all([
        api.tests.getPages(testId),
        api.trials.getById(testId)
      ])
        .then(([pagesRes, trialRes]) => {
          setPages(pagesRes.pages || []);
          setTrialData(trialRes.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, [testId]);


  if (loading) {
    return <Loading></Loading>
  }


  return (
    <div className="min-h-screen flex flex-col h-screen">
      <main className="flex-1 overflow-hidden bg-gray-50">
        <ExamContainer
          testId={testId}
          initialPages={pages}
          testTitle={trialData?.test?.title}
          durationMinutes={trialData?.test?.duration}
          realTestId={trialData?.test?.test_id}
        />
      </main>
    </div>
  )
}

