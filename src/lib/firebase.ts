import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import type { Chat, Message } from '../types';

import appletConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: appletConfig.apiKey,
  authDomain: appletConfig.authDomain,
  projectId: appletConfig.projectId,
  storageBucket: appletConfig.storageBucket,
  messagingSenderId: appletConfig.messagingSenderId,
  appId: appletConfig.appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, appletConfig.firestoreDatabaseId);

export { auth, db };

export async function signIn(): Promise<User> {
  const result = await signInAnonymously(auth);
  return result.user;
}

export function onAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function loadChats(uid: string): Promise<Chat[]> {
  const chatsRef = collection(db, 'users', uid, 'chats');
  const q = query(chatsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Chat);
}

export async function loadChat(
  uid: string,
  chatId: string,
): Promise<Chat | null> {
  const ref = doc(db, 'users', uid, 'chats', chatId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Chat;
}

export async function saveChat(uid: string, chat: Chat): Promise<void> {
  const ref = doc(db, 'users', uid, 'chats', chat.id);
  const { id, ...data } = chat;
  await setDoc(ref, data, { merge: true });
}

export async function deleteChat(
  uid: string,
  chatId: string,
): Promise<void> {
  const ref = doc(db, 'users', uid, 'chats', chatId);
  await deleteDoc(ref);
}

export function newMessage(
  role: Message['role'],
  content: string,
): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}
