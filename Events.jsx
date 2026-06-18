import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-init';
import Layout from './Layout';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'updates'), 
      where('category', '==', 'Events'),
      where('published', '==', true)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort locally to prevent Firestore composite index missing errors
      docs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setEvents(docs);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching events:", err);
      setError("Unable to load events at this time.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 lg:py-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-emerald-950">Events</h1>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">Join us for our school events, celebrations, and community activities.</p>
        </div>
        {error ? (
          <p className="text-center text-red-500 font-bold">{error}</p>
        ) : loading ? (
          <p className="text-center text-slate-500">Loading events...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? events.map(item => (
              <div key={item.id} onClick={() => navigate(`/events/${item.id}`)} className="cursor-pointer">
                <EventCard {...item} />
              </div>
            )) : <p className="col-span-full text-center text-slate-500">No events have been scheduled yet.</p>}
          </div>
        )}
      </div>
    </Layout>
  );
}