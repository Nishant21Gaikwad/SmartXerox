import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ordersAPI } from '../services/api';

const REFRESH_INTERVAL_MS = 15000;

const statusTone = {
  'In Queue': 'bg-amber-100 text-amber-700 border-amber-200',
  Printing: 'bg-sky-100 text-sky-700 border-sky-200',
  Ready: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const StudentQueue = () => {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem('smartxerox_user') || '{}');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [queueData, setQueueData] = useState({
    stats: {
      totalActive: 0,
      queueLength: 0,
      inQueue: 0,
      printing: 0,
      ready: 0,
    },
    myQueue: [],
    timeline: [],
    refreshedAt: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('smartxerox_token');
    if (!token || !savedUser.id) {
      navigate('/login');
      return;
    }

    const load = async (isBackgroundRefresh = false) => {
      if (isBackgroundRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await ordersAPI.getStudentQueue();
        if (response?.success && response?.data) {
          setQueueData(response.data);
          setError('');
        } else {
          setError('Could not load live queue. Please try again.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch live queue data');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    load();

    const intervalId = setInterval(() => {
      load(true);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [navigate, savedUser.id]);

  const myActiveQueueNumbers = useMemo(
    () => queueData.myQueue.filter((item) => item.queueNumber).map((item) => item.queueNumber),
    [queueData.myQueue],
  );

  const nearestQueueNumber = myActiveQueueNumbers.length > 0 ? Math.min(...myActiveQueueNumbers) : null;

  return (
    <div className="app-shell">
      <Navbar />

      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="section-title mb-1 text-slate-900">Live Queue Tracker</h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Privacy mode is active. Other students are shown anonymously.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/student')} className="btn btn-ghost px-3 py-2 text-xs sm:text-sm">
              Back to Orders
            </button>
            <button
              type="button"
              onClick={async () => {
                setRefreshing(true);
                setError('');
                try {
                  const response = await ordersAPI.getStudentQueue();
                  if (response?.success && response?.data) {
                    setQueueData(response.data);
                  }
                } catch (err) {
                  setError(err.response?.data?.message || 'Failed to refresh queue');
                } finally {
                  setRefreshing(false);
                }
              }}
              className="btn btn-primary px-3 py-2 text-xs sm:text-sm"
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && <div className="info-banner error mb-4">{error}</div>}

        {loading ? (
          <div className="card py-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-sky-600"></div>
            <p className="mt-3 text-sm text-slate-500">Loading live queue...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="card p-4 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Total Active</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{queueData.stats.totalActive}</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">In Queue</p>
                <p className="mt-1 text-2xl font-black text-amber-600">{queueData.stats.inQueue}</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Printing</p>
                <p className="mt-1 text-2xl font-black text-sky-600">{queueData.stats.printing}</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Ready</p>
                <p className="mt-1 text-2xl font-black text-emerald-600">{queueData.stats.ready}</p>
              </div>
            </div>

            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-sm font-black uppercase tracking-[0.1em] text-slate-700 sm:text-base">Your Queue Number</h2>
                <span className="text-[11px] font-semibold text-slate-500 sm:text-xs">
                  Updated {queueData.refreshedAt ? new Date(queueData.refreshedAt).toLocaleTimeString() : '--'}
                </span>
              </div>

              {nearestQueueNumber ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <div className="h-11 w-11 animate-pulse rounded-full bg-emerald-600 text-center text-lg font-black leading-[44px] text-white">
                    {nearestQueueNumber}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">You are currently in queue.</p>
                    <p className="text-xs text-emerald-700">Nearest active queue slot: #{nearestQueueNumber}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  You currently have no active in-queue order. If your order is ready, it will appear in your order history.
                </div>
              )}

              {queueData.myQueue.length > 0 && (
                <div className="mt-3 space-y-2">
                  {queueData.myQueue.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div>
                        <p className="text-xs font-bold text-slate-700">Order #{item.id.slice(0, 8)}</p>
                        <p className="text-[11px] text-slate-500">Submitted {new Date(item.submittedAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusTone[item.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {item.status}
                        </span>
                        <p className="mt-1 text-[11px] text-slate-600">
                          {item.queueNumber ? `Queue #${item.queueNumber}` : 'Not in queue'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-4">
              <h2 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-slate-700 sm:text-base">Anonymous Live Queue</h2>

              {queueData.timeline.length > 0 ? (
                <div className="space-y-2">
                  {queueData.timeline.map((slot) => (
                    <div key={`${slot.slot}-${slot.status}`} className="animate-rise flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${slot.status === 'Printing' ? 'animate-pulse bg-sky-500' : 'bg-amber-500'}`}></span>
                        <p className="text-xs font-bold text-slate-700 sm:text-sm">Queue #{slot.slot}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusTone[slot.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {slot.status}
                        </span>
                        {slot.isMine && (
                          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
                  Queue is currently empty.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentQueue;
