import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-init';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    heroTitle: 'Empowering Minds, Enriching Futures',
    logoUrl: 'https://i.ibb.co/7d4mTQVT/image.png',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    twitterUrl: 'https://twitter.com',
    whatsappChannelUrl: '',
    premisesImages: [''],
    kgImages: [''],
    visionText: 'To empower students with academic rigor, skill and ethical leadership to serve society.',
    missionText: '1. Provide an inclusive learning environment that ensures sustained academic growth.\n2. To empower students with skills, values and character, enabling them to make meaningful contributions to the society.\n3. Conduct various programmes that will empower the students with 21st century skills.',
    sustainabilityTitle: 'Year of Sustainability 2026–2027',
    feeStructurePdfUrl: '',
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
