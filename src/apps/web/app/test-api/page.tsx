'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';

export default function TestApiPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [trials, setTrials] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [queueHealth, setQueueHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string>('');
  const [jobStatus, setJobStatus] = useState<any>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch health first
      const healthData = await api.health.check();
      setHealth(healthData);

      // Try to fetch queue health (may fail if Redis not configured)
      try {
        const queueData = await api.health.checkQueue();
        setQueueHealth(queueData);
      } catch (err) {
        console.log('Queue health check failed (Redis might not be configured)');
        setQueueHealth({ error: 'Not configured' });
      }

      // Fetch all data with error handling for each
      const [usersData, testsData, trialsData, responsesData] = await Promise.allSettled([
        api.users.getAll(),
        api.tests.getAll(),
        api.trials.getAll(),
        api.responses.getAll(),
      ]);

      // Handle users
      if (usersData.status === 'fulfilled') {
        const data: any = usersData.value;
        // API returns { data: [...] } format
        const userArray = data?.data || data;
        setUsers(Array.isArray(userArray) ? userArray : []);
        console.log('Users loaded:', userArray);
      } else {
        console.error('Failed to fetch users:', usersData.reason);
        setUsers([]);
      }

      // Handle tests
      if (testsData.status === 'fulfilled') {
        const data: any = testsData.value;
        const testArray = data?.data || data;
        setTests(Array.isArray(testArray) ? testArray : []);
        console.log('Tests loaded:', testArray);
      } else {
        console.error('Failed to fetch tests:', testsData.reason);
        setTests([]);
      }

      // Handle trials
      if (trialsData.status === 'fulfilled') {
        const data: any = trialsData.value;
        const trialArray = data?.data || data;
        setTrials(Array.isArray(trialArray) ? trialArray : []);
        console.log('Trials loaded:', trialArray);
      } else {
        console.error('Failed to fetch trials:', trialsData.reason);
        setTrials([]);
      }

      // Handle responses
      if (responsesData.status === 'fulfilled') {
        const data: any = responsesData.value;
        const responseArray = data?.data || data;
        setResponses(Array.isArray(responseArray) ? responseArray : []);
        console.log('Responses loaded:', responseArray);
      } else {
        console.error('Failed to fetch responses:', responsesData.reason);
        setResponses([]);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const timestamp = Date.now();
      const email = `student${timestamp}@test.com`;
      const newUser = await api.users.create({
        user_id: email, // Use email as user_id
        name: 'Test Student',
        email: email,
        role: 'Student',
        created_at: new Date().toISOString(),
        hash_password: 'test123',
      });
      alert('User created: ' + JSON.stringify(newUser, null, 2));
      fetchAllData();
    } catch (err: any) {
      alert('Error creating user: ' + err.message);
    }
  };

  const handleCreateTest = async () => {
    try {
      const timestamp = Date.now();
      const newTest = await api.tests.create({
        test_id: `TEST${timestamp}`,
        title: `V-ACT Mock Test ${timestamp}`,
        description: 'Auto-generated test from integration page',
        duration_minutes: 90,
        total_questions: 100,
        passing_score: 700,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      alert('Test created: ' + JSON.stringify(newTest, null, 2));
      fetchAllData();
    } catch (err: any) {
      alert('Error creating test: ' + err.message);
    }
  };

  const handleCreateTrial = async () => {
    if (users.length === 0 || tests.length === 0) {
      alert('Please create at least one user and one test first!');
      return;
    }

    try {
      const timestamp = Date.now();
      const newTrial = await api.trials.create({
        trial_id: `TRIAL${timestamp}`,
        user_id: users[0].user_id,
        test_id: tests[0].test_id,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        total_score: null,
      });
      alert('Trial created: ' + JSON.stringify(newTrial, null, 2));
      fetchAllData();
    } catch (err: any) {
      alert('Error creating trial: ' + err.message);
    }
  };

  const handleSubmitJob = async () => {
    if (trials.length === 0) {
      alert('Please create at least one trial first!');
      return;
    }

    try {
      const result = await api.jobs.scoreTest({
        trialId: trials[0].trial_id,
        userId: trials[0].user_id,
      });
      alert('Job submitted: ' + JSON.stringify(result, null, 2));
      if (result.jobId) {
        setJobId(result.jobId);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCheckJobStatus = async () => {
    if (!jobId) {
      alert('Please submit a job first!');
      return;
    }

    try {
      const status = await api.jobs.getStatus(jobId);
      setJobStatus(status);
      alert('Job status: ' + JSON.stringify(status, null, 2));
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button
            onClick={fetchAllData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          VACTIT API Integration Test
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* System Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${health?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              System Health
            </h2>
            {health ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${health.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                    {health.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className={`font-semibold ${health.database === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                    {health.database}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Redis:</span>
                  <span className="font-semibold text-gray-700">
                    {health.redis || 'Not configured'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-semibold text-gray-700">
                    {health.uptime ? `${Math.floor(health.uptime)}s` : 'N/A'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Queue Health</h2>
            {queueHealth?.error ? (
              <p className="text-gray-500 text-sm">{queueHealth.error}</p>
            ) : queueHealth ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600">{queueHealth.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waiting:</span>
                  <span className="font-semibold text-gray-700">{queueHealth.jobs?.waiting || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active:</span>
                  <span className="font-semibold text-gray-700">{queueHealth.jobs?.active || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold text-gray-700">{queueHealth.jobs?.completed || 0}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCreateUser}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Create User
            </button>
            <button
              onClick={handleCreateTest}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Create Test
            </button>
            <button
              onClick={handleCreateTrial}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Create Trial
            </button>
            <button
              onClick={handleSubmitJob}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
            >
              Submit Job
            </button>
            <button
              onClick={handleCheckJobStatus}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Check Job Status
            </button>
            <button
              onClick={fetchAllData}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Users ({users.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-auto">
              {users.length === 0 ? (
                <p className="text-gray-500 text-sm">No users found. Click "Create User" to add one.</p>
              ) : (
                users.map((user: any) => (
                  <div key={user.user_id} className="p-3 border rounded hover:bg-gray-50 transition">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tests */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Tests ({tests.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-auto">
              {tests.length === 0 ? (
                <p className="text-gray-500 text-sm">No tests found. Click "Create Test" to add one.</p>
              ) : (
                tests.map((test: any) => (
                  <div key={test.test_id} className="p-3 border rounded hover:bg-gray-50 transition">
                    <p className="font-semibold text-gray-900">{test.title}</p>
                    <p className="text-sm text-gray-600">{test.description}</p>
                    <p className="text-xs text-gray-500">
                      {test.total_questions} questions • {test.duration_minutes} min
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Trials */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Trials ({trials.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-auto">
              {trials.length === 0 ? (
                <p className="text-gray-500 text-sm">No trials found. Click "Create Trial" to add one.</p>
              ) : (
                trials.map((trial: any) => (
                  <div key={trial.trial_id} className="p-3 border rounded hover:bg-gray-50 transition">
                    <p className="font-semibold text-gray-900">{trial.trial_id}</p>
                    <p className="text-sm text-gray-600">
                      User: {trial.user_id} • Test: {trial.test_id}
                    </p>
                    <p className="text-xs text-gray-500">
                      Score: {trial.total_score || 'Not scored'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Responses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Responses ({responses.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-auto">
              {responses.length === 0 ? (
                <p className="text-gray-500 text-sm">No responses found.</p>
              ) : (
                responses.map((response: any, idx: number) => (
                  <div key={idx} className="p-3 border rounded hover:bg-gray-50 transition">
                    <p className="font-semibold text-gray-900">Response #{idx + 1}</p>
                    <p className="text-sm text-gray-600">Trial: {response.trial_id}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Job Status */}
        {jobStatus && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Job Status</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(jobStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
