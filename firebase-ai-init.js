import { getAI, GoogleAIBackend } from 'firebase/ai';
import { app } from './firebase-init';

export const ai = getAI(app, { backend: new GoogleAIBackend() });
