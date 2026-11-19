import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events');
// Prompt user to select account if needed
provider.setCustomParameters({
  prompt: 'select_account',
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;
let currentUser: User | null = null;

// Listeners for auth state changes
const authChangeListeners: Array<(user: User | null, token: string | null) => void> = [];

export const subscribeToGoogleAuth = (
  callback: (user: User | null, token: string | null) => void
) => {
  authChangeListeners.push(callback);
  callback(currentUser, cachedAccessToken);
  return () => {
    const idx = authChangeListeners.indexOf(callback);
    if (idx > -1) authChangeListeners.splice(idx, 1);
  };
};

const notifyListeners = () => {
  for (const listener of authChangeListeners) {
    listener(currentUser, cachedAccessToken);
  }
};

// Initialize auth state listener on app startup
export const initGoogleAuth = (
  onSuccess?: (user: User, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    currentUser = user;
    if (user) {
      if (cachedAccessToken) {
        if (onSuccess) onSuccess(user, cachedAccessToken);
        notifyListeners();
      } else if (!isSigningIn) {
        // If user is restored from session without token yet, wait or notify
        if (onFailure) onFailure();
        notifyListeners();
      }
    } else {
      cachedAccessToken = null;
      if (onFailure) onFailure();
      notifyListeners();
    }
  });
};

export const signInGoogleCalendar = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Nie udało się uzyskać tokenu dostępu Google Calendar.');
    }

    cachedAccessToken = credential.accessToken;
    currentUser = result.user;
    notifyListeners();
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Błąd logowania do Google Calendar:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const signOutGoogleCalendar = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
  currentUser = null;
  notifyListeners();
};

export const getGoogleAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getConnectedGoogleUser = (): User | null => {
  return currentUser;
};
