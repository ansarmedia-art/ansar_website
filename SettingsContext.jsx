import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-init';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    heroTitle: 'Shaping Bright Futures Through Education',
    logoUrl: 'https://i.ibb.co/7d4mTQVT/image.png',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    twitterUrl: 'https://twitter.com',
    whatsappChannelUrl: '',
    premisesImages: [''],
    kgImages: [''],
    visionText: 'To empower students with academic rigor, skill and ethical leadership to serve society.',
    missionText: 'Shape Contributors: Conduct educational programs that mold students into active contributors to a just and equitable society.',
    sustainabilityTitle: 'Year of Sustainability 2026–2027',
    sustainabilityDesc: 'At our school, the Year of Sustainability is dedicated to nurturing environmentally responsible and socially conscious learners. Through awareness, action, and innovation, we encourage students to embrace sustainable practices and become active contributors to a greener future.',
    sustainabilityLogoUrl: '',
    _isLoaded: false
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(prev => ({ ...prev, ...docSnap.data(), _isLoaded: true }));
      } else {
        setSettings(prev => ({ ...prev, _isLoaded: true }));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};