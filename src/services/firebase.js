import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment,
  onSnapshot
} from 'firebase/firestore';

// ── Admin Config ──
const ADMIN_EMAILS = [
  'stevven0019@gmail.com',
  'esteban.edugen@gmail.com',
  'esteb@edugen.pro',
  'esteban@edugen.pro'
];

export const isAdmin = (email) => {
  if (!email) return false;
  const lower = email.toLowerCase();
  if (isDemoMode) {
    return lower.includes('admin') || lower.endsWith('@edugen.pro') || lower === 'stevven0019@gmail.com';
  }
  return ADMIN_EMAILS.includes(lower);
};

// ── Check if Environment Credentials exist and are not boilerplate placeholders ──
const isEnvConfigured = () => {
  const k = import.meta.env.VITE_FIREBASE_API_KEY;
  return k && k !== 'your_firebase_api_key' && k.trim() !== '';
};

let firebaseApp = null;
let realAuth = null;
let realDb = null;
let isDemoMode = true;

if (isEnvConfigured()) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
    
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }
    realAuth = getAuth(firebaseApp);
    realDb = getFirestore(firebaseApp);
    isDemoMode = false;
    console.log("Firebase initialized successfully in Real Mode!");
  } catch (err) {
    console.error("Firebase failed to initialize, falling back to Simulation Mode:", err);
    isDemoMode = true;
  }
} else {
  console.log("Firebase credentials not configured. App running in fully interactive Simulation Mode!");
  isDemoMode = true;
}

// ── Mock Auth Implementation for Simulation Mode ──
const mockAuth = {
  currentUser: null,
  authStateListeners: [],
  onAuthStateChanged(callback) {
    this.authStateListeners.push(callback);
    // Emit initial state
    setTimeout(() => {
      const savedUser = localStorage.getItem('edugen_demo_user');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      } else {
        this.currentUser = null;
      }
      callback(this.currentUser);
    }, 100);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
    };
  },
  async signIn(email, password) {
    await new Promise(r => setTimeout(r, 600)); // Simulate lag
    const user = { uid: 'demo_user_123', email: email || 'docente@edugen.pro', isDemo: true };
    this.currentUser = user;
    localStorage.setItem('edugen_demo_user', JSON.stringify(user));
    // Initialize standard tokens (2 free trial tokens on signup)
    if (!localStorage.getItem(`edugen_credits_${user.uid}`)) {
      localStorage.setItem(`edugen_credits_${user.uid}`, '2');
    }
    this.authStateListeners.forEach(cb => cb(user));
    return user;
  },
  async register(email, password) {
    return this.signIn(email, password);
  },
  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('edugen_demo_user');
    this.authStateListeners.forEach(cb => cb(null));
  }
};

// ── Mock Database Implementation for Simulation Mode ──
const mockDb = {
  getCredits(uid) {
    const credits = localStorage.getItem(`edugen_credits_${uid}`);
    if (credits === null) {
      localStorage.setItem(`edugen_credits_${uid}`, '2');
      return 2;
    }
    return parseInt(credits, 10);
  },
  setCredits(uid, value) {
    localStorage.setItem(`edugen_credits_${uid}`, value.toString());
  },
  getPlans(uid) {
    const plans = localStorage.getItem(`edugen_plans_${uid}`);
    return plans ? JSON.parse(plans) : [];
  },
  savePlan(uid, plan) {
    const plans = this.getPlans(uid);
    const index = plans.findIndex(p => p.id === plan.id);
    if (index >= 0) {
      plans[index] = plan;
    } else {
      plans.push(plan);
    }
    localStorage.setItem(`edugen_plans_${uid}`, JSON.stringify(plans));
  },
  deletePlan(uid, planId) {
    const plans = this.getPlans(uid);
    const filtered = plans.filter(p => p.id !== planId);
    localStorage.setItem(`edugen_plans_${uid}`, JSON.stringify(filtered));
  },
  getPremium(uid) {
    const isPrem = localStorage.getItem(`edugen_premium_${uid}`);
    return isPrem === 'true';
  },
  setPremium(uid, value) {
    localStorage.setItem(`edugen_premium_${uid}`, value ? 'true' : 'false');
  },
  getPendingPayments() {
    const list = localStorage.getItem('edugen_pending_payments');
    return list ? JSON.parse(list) : [];
  },
  submitPendingPayment(uid, email, productType, tokenQuantity, amount, refId, screenshot) {
    const payments = this.getPendingPayments();
    const newPayment = {
      id: 'mock_pay_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      uid,
      email,
      productType,
      tokenQuantity,
      amount,
      refId,
      screenshot,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    payments.push(newPayment);
    localStorage.setItem('edugen_pending_payments', JSON.stringify(payments));
    window.dispatchEvent(new Event('storage'));
    return newPayment;
  },
  updatePaymentStatus(paymentId, status, targetUid, productType, tokenQuantity, amount) {
    const payments = this.getPendingPayments();
    const index = payments.findIndex(p => p.id === paymentId);
    if (index >= 0) {
      payments[index].status = status;
      localStorage.setItem('edugen_pending_payments', JSON.stringify(payments));
      
      if (status === 'approved') {
        if (productType === 'subscription') {
          this.setPremium(targetUid, true);
          const current = this.getCredits(targetUid);
          this.setCredits(targetUid, current + 30);
        } else {
          const current = this.getCredits(targetUid);
          this.setCredits(targetUid, current + tokenQuantity);
        }
      }
      window.dispatchEvent(new Event('storage'));
    }
  }
};

// ── Unified Exports ──
export { isDemoMode };

export const authService = {
  onAuthStateChange(callback) {
    if (isDemoMode) {
      return mockAuth.onAuthStateChanged(callback);
    } else {
      return onAuthStateChanged(realAuth, callback);
    }
  },
  async login(email, password) {
    if (isDemoMode) {
      return mockAuth.signIn(email, password);
    } else {
      return signInWithEmailAndPassword(realAuth, email, password);
    }
  },
  async register(email, password) {
    if (isDemoMode) {
      return mockAuth.register(email, password);
    } else {
      return createUserWithEmailAndPassword(realAuth, email, password);
    }
  },
  async logout() {
    if (isDemoMode) {
      return mockAuth.signOut();
    } else {
      return signOut(realAuth);
    }
  },
  async loginWithGoogle() {
    if (isDemoMode) {
      await new Promise(r => setTimeout(r, 600));
      const user = { uid: 'google_user_123', email: 'docente.google@edugen.pro', isDemo: true };
      mockAuth.currentUser = user;
      localStorage.setItem('edugen_demo_user', JSON.stringify(user));
      if (!localStorage.getItem(`edugen_credits_${user.uid}`)) {
        localStorage.setItem(`edugen_credits_${user.uid}`, '2');
      }
      mockAuth.authStateListeners.forEach(cb => cb(user));
      return user;
    } else {
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      return signInWithPopup(realAuth, provider);
    }
  },
  async loginWithFacebook() {
    if (isDemoMode) {
      await new Promise(r => setTimeout(r, 600));
      const user = { uid: 'facebook_user_123', email: 'docente.fb@edugen.pro', isDemo: true };
      mockAuth.currentUser = user;
      localStorage.setItem('edugen_demo_user', JSON.stringify(user));
      if (!localStorage.getItem(`edugen_credits_${user.uid}`)) {
        localStorage.setItem(`edugen_credits_${user.uid}`, '2');
      }
      mockAuth.authStateListeners.forEach(cb => cb(user));
      return user;
    } else {
      const { signInWithPopup, FacebookAuthProvider } = await import('firebase/auth');
      const provider = new FacebookAuthProvider();
      return signInWithPopup(realAuth, provider);
    }
  }
};

export const databaseService = {
  // Syncs profile snapshot (credits & premium)
  syncUserCredits(uid, callback) {
    if (isDemoMode) {
      // Simulate real-time stream
      const trigger = () => {
        const c = mockDb.getCredits(uid);
        const p = mockDb.getPremium(uid);
        callback({ credits: c, isPremium: p });
      };
      trigger();
      window.addEventListener('storage', trigger);
      return () => window.removeEventListener('storage', trigger);
    } else {
      const userRef = doc(realDb, 'artifacts', 'edugen-panama-aoa', 'users', uid, 'profile', 'data');
      
      const localTrigger = () => {
        const val = localStorage.getItem(`edugen_credits_${uid}`);
        const pVal = localStorage.getItem(`edugen_premium_${uid}`);
        callback({
          credits: val !== null ? parseInt(val, 10) : 2,
          isPremium: pVal === 'true'
        });
      };
      window.addEventListener('storage', localTrigger);

      let unsubscribe = () => {};
      try {
        unsubscribe = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const currentCredits = data.generationsLeft !== undefined ? data.generationsLeft : 2;
            const isPremium = data.isPremium !== undefined ? data.isPremium : false;

            // Sync with local storage
            localStorage.setItem(`edugen_credits_${uid}`, currentCredits.toString());
            localStorage.setItem(`edugen_premium_${uid}`, isPremium ? 'true' : 'false');

            if (currentCredits === undefined && !data.initializedFreeCredits) {
              setDoc(userRef, { generationsLeft: 2, initializedFreeCredits: true }, { merge: true })
                .then(() => callback({ credits: 2, isPremium }))
                .catch(err => {
                  console.error("Failed to set initial free credits:", err);
                  callback({ credits: 2, isPremium });
                });
            } else {
              callback({ credits: currentCredits, isPremium });
            }
          } else {
            setDoc(userRef, { email: realAuth.currentUser?.email || 'anon', generationsLeft: 2, isPremium: false, initializedFreeCredits: true })
              .then(() => callback({ credits: 2, isPremium: false }))
              .catch((err) => {
                console.error("Failed to initialize user document in Firestore:", err);
                if (localStorage.getItem(`edugen_credits_${uid}`) === null) {
                  localStorage.setItem(`edugen_credits_${uid}`, '2');
                }
                if (localStorage.getItem(`edugen_premium_${uid}`) === null) {
                  localStorage.setItem(`edugen_premium_${uid}`, 'false');
                }
                localTrigger();
              });
          }
        }, (error) => {
          console.error("onSnapshot permission error, falling back to local storage:", error);
          if (localStorage.getItem(`edugen_credits_${uid}`) === null) {
            localStorage.setItem(`edugen_credits_${uid}`, '2');
          }
          if (localStorage.getItem(`edugen_premium_${uid}`) === null) {
            localStorage.setItem(`edugen_premium_${uid}`, 'false');
          }
          localTrigger();
        });
      } catch (err) {
        console.error("Failed to set up Firestore listener, using local storage:", err);
        if (localStorage.getItem(`edugen_credits_${uid}`) === null) {
          localStorage.setItem(`edugen_credits_${uid}`, '2');
        }
        if (localStorage.getItem(`edugen_premium_${uid}`) === null) {
          localStorage.setItem(`edugen_premium_${uid}`, 'false');
        }
        localTrigger();
      }

      return () => {
        unsubscribe();
        window.removeEventListener('storage', localTrigger);
      };
    }
  },
  
  // Increments user credits (recharge)
  async incrementCredits(uid, value = 10) {
    if (isDemoMode) {
      const current = mockDb.getCredits(uid);
      mockDb.setCredits(uid, current + value);
      window.dispatchEvent(new Event('storage'));
    } else {
      const userRef = doc(realDb, 'artifacts', 'edugen-panama-aoa', 'users', uid, 'profile', 'data');
      try {
        await updateDoc(userRef, { generationsLeft: increment(value) });
      } catch (err) {
        console.warn("Firestore incrementCredits failed, falling back to local storage:", err);
        const current = parseInt(localStorage.getItem(`edugen_credits_${uid}`) || '2', 10);
        localStorage.setItem(`edugen_credits_${uid}`, (current + value).toString());
        window.dispatchEvent(new Event('storage'));
      }
    }
  },

  // Decrement user credits
  async decrementCredits(uid) {
    if (isDemoMode) {
      const current = mockDb.getCredits(uid);
      if (current > 0) {
        mockDb.setCredits(uid, current - 1);
        window.dispatchEvent(new Event('storage'));
      }
    } else {
      const userRef = doc(realDb, 'artifacts', 'edugen-panama-aoa', 'users', uid, 'profile', 'data');
      try {
        await updateDoc(userRef, { generationsLeft: increment(-1) });
      } catch (err) {
        console.warn("Firestore decrementCredits failed, falling back to local storage:", err);
        const current = parseInt(localStorage.getItem(`edugen_credits_${uid}`) || '2', 10);
        if (current > 0) {
          localStorage.setItem(`edugen_credits_${uid}`, (current - 1).toString());
        }
        window.dispatchEvent(new Event('storage'));
      }
    }
  },

  // Toggles user premium subscription status
  async togglePremium(uid, isPremiumValue) {
    if (isDemoMode) {
      mockDb.setPremium(uid, isPremiumValue);
      window.dispatchEvent(new Event('storage'));
    } else {
      const userRef = doc(realDb, 'artifacts', 'edugen-panama-aoa', 'users', uid, 'profile', 'data');
      try {
        await updateDoc(userRef, { isPremium: isPremiumValue });
        localStorage.setItem(`edugen_premium_${uid}`, isPremiumValue ? 'true' : 'false');
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.warn("Firestore togglePremium failed, falling back to local storage:", err);
        mockDb.setPremium(uid, isPremiumValue);
        window.dispatchEvent(new Event('storage'));
      }
    }
  },

  // Library Saves: Permanent records of teacher plans
  async getSavedPlans(uid) {
    if (isDemoMode) {
      return mockDb.getPlans(uid);
    } else {
      const userRef = doc(realDb, 'artifacts', 'edugen-panama-aoa', 'users', uid, 'library', 'plans');
      try {
        const snap = await getDoc(userRef);
        return snap.exists() ? snap.data().items || [] : [];
      } catch (err) {
        console.warn("Firestore getSavedPlans failed, falling back to local storage:", err);
        return mockDb.getPlans(uid);
      }
    }
  },

  async savePlanToLibrary(uid, plan) {
    if (isDemoMode) {
      mockDb.savePlan(uid, plan);
    } else {
      const userRef = doc(realDb, 'artifacts', 'edugen-panama-aoa', 'users', uid, 'library', 'plans');
      try {
        const snap = await getDoc(userRef);
        let currentItems = snap.exists() ? snap.data().items || [] : [];
        
        const index = currentItems.findIndex(i => i.id === plan.id);
        if (index >= 0) {
          currentItems[index] = plan;
        } else {
          currentItems.push(plan);
        }
        
        await setDoc(userRef, { items: currentItems }, { merge: true });
      } catch (err) {
        console.warn("Firestore savePlanToLibrary failed, falling back to local storage:", err);
        mockDb.savePlan(uid, plan);
      }
    }
  },

  async deletePlanFromLibrary(uid, planId) {
    if (isDemoMode) {
      mockDb.deletePlan(uid, planId);
    } else {
      const userRef = doc(realDb, 'artifacts', 'edugen-panama-aoa', 'users', uid, 'library', 'plans');
      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const filtered = (snap.data().items || []).filter(i => i.id !== planId);
          await setDoc(userRef, { items: filtered }, { merge: true });
        }
      } catch (err) {
        console.warn("Firestore deletePlanFromLibrary failed, falling back to local storage:", err);
        mockDb.deletePlan(uid, planId);
      }
    }
  },

  async submitPendingPayment(uid, email, productType, tokenQuantity, amount, refId, screenshot) {
    if (isDemoMode) {
      return mockDb.submitPendingPayment(uid, email, productType, tokenQuantity, amount, refId, screenshot);
    } else {
      const { collection, addDoc } = await import('firebase/firestore');
      const paymentsCol = collection(realDb, 'artifacts', 'edugen-panama-aoa', 'pending_payments');
      const docData = {
        uid,
        email,
        productType,
        tokenQuantity,
        amount,
        refId,
        screenshot,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      return addDoc(paymentsCol, docData);
    }
  },

  async getPendingPayments() {
    if (isDemoMode) {
      return mockDb.getPendingPayments();
    } else {
      const { collection, query, getDocs, orderBy } = await import('firebase/firestore');
      const paymentsCol = collection(realDb, 'artifacts', 'edugen-panama-aoa', 'pending_payments');
      const q = query(paymentsCol, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    }
  },

  async updatePaymentStatus(paymentId, status, targetUid, productType, tokenQuantity, amount) {
    if (isDemoMode) {
      return mockDb.updatePaymentStatus(paymentId, status, targetUid, productType, tokenQuantity, amount);
    } else {
      const { doc, updateDoc } = await import('firebase/firestore');
      const paymentRef = doc(realDb, 'artifacts', 'edugen-panama-aoa', 'pending_payments', paymentId);
      await updateDoc(paymentRef, { status });

      if (status === 'approved') {
        if (productType === 'subscription') {
          await this.togglePremium(targetUid, true);
          await this.incrementCredits(targetUid, 30);
        } else {
          await this.incrementCredits(targetUid, tokenQuantity);
        }
      }
    }
  },

  async submitPublicComment(name, school, region, text) {
    if (isDemoMode) {
      const key = 'edugen_public_comments';
      const current = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
      const newComment = {
        id: 'mock_comm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name,
        school,
        region,
        text,
        createdAt: new Date().toISOString()
      };
      current.push(newComment);
      localStorage.setItem(key, JSON.stringify(current));
      window.dispatchEvent(new Event('storage'));
      return newComment;
    } else {
      const { collection, addDoc } = await import('firebase/firestore');
      const commentsCol = collection(realDb, 'artifacts', 'edugen-panama-aoa', 'comments');
      return addDoc(commentsCol, {
        name,
        school,
        region,
        text,
        createdAt: new Date().toISOString()
      });
    }
  },

  async getPublicComments() {
    const defaultComments = [
      {
        id: '1',
        name: 'Profa. María González',
        school: 'C.E.B.G. República de Panamá',
        region: 'Panamá Centro',
        text: 'EduGen cambió completamente mi rutina semanal. Lo que antes me tomaba todo el fin de semana planificando formatos AOA, ahora lo estructuro en minutos. La alineación con los archivos oficiales es excelente.',
        createdAt: '2026-06-10T12:00:00Z'
      },
      {
        id: '2',
        name: 'Prof. Carlos Samudio',
        school: 'Colegio Félix Olivares Contreras',
        region: 'Chiriquí',
        text: 'El generador trimestral (Theme Planner) me permite alinear automáticamente los niveles CEFR que MEDUCA exige para mis grupos de media y premedia. Es una herramienta indispensable hoy en día.',
        createdAt: '2026-06-11T14:30:00Z'
      },
      {
        id: '3',
        name: 'Profa. Yamileth Samaniego',
        school: 'Escuela Hipólito Pérez Tello',
        region: 'Herrera',
        text: 'Los proyectos interdisciplinarios que genera vinculando inglés con Ciencias Naturales y Arte han sido un éxito total en mi escuela. Hacen que las clases cobren un sentido real para los estudiantes.',
        createdAt: '2026-06-12T09:15:00Z'
      }
    ];

    if (isDemoMode) {
      const key = 'edugen_public_comments';
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultComments));
        return defaultComments;
      }
      return JSON.parse(stored);
    } else {
      try {
        const { collection, query, getDocs, orderBy } = await import('firebase/firestore');
        const commentsCol = collection(realDb, 'artifacts', 'edugen-panama-aoa', 'comments');
        const q = query(commentsCol, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        return list.length > 0 ? list : defaultComments;
      } catch (err) {
        console.warn("Firestore getPublicComments failed, falling back to local storage:", err);
        const stored = localStorage.getItem('edugen_public_comments');
        return stored ? JSON.parse(stored) : defaultComments;
      }
    }
  },

  async getSurveyResults() {
    const defaultVotes = { 'opt1': 45, 'opt2': 28, 'opt3': 18, 'opt4': 9, total: 100 };
    if (isDemoMode) {
      const key = 'edugen_survey_votes';
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultVotes));
        return defaultVotes;
      }
      return JSON.parse(stored);
    } else {
      try {
        const { doc, getDoc, setDoc } = await import('firebase/firestore');
        const pollRef = doc(realDb, 'artifacts', 'edugen-panama-aoa', 'polls', 'interest_survey');
        const snap = await getDoc(pollRef);
        if (snap.exists()) {
          return snap.data();
        } else {
          await setDoc(pollRef, defaultVotes);
          return defaultVotes;
        }
      } catch (err) {
        console.warn("Firestore getSurveyResults failed, falling back to local storage:", err);
        const stored = localStorage.getItem('edugen_survey_votes');
        return stored ? JSON.parse(stored) : defaultVotes;
      }
    }
  },

  async submitSurveyVote(optionId) {
    const defaultVotes = { 'opt1': 45, 'opt2': 28, 'opt3': 18, 'opt4': 9, total: 100 };
    if (isDemoMode) {
      const key = 'edugen_survey_votes';
      const current = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : defaultVotes;
      current[optionId] = (current[optionId] || 0) + 1;
      current.total = (current.total || 0) + 1;
      localStorage.setItem(key, JSON.stringify(current));
      window.dispatchEvent(new Event('storage'));
      return current;
    } else {
      try {
        const { doc, getDoc, setDoc, updateDoc, increment } = await import('firebase/firestore');
        const pollRef = doc(realDb, 'artifacts', 'edugen-panama-aoa', 'polls', 'interest_survey');
        const snap = await getDoc(pollRef);
        if (!snap.exists()) {
          await setDoc(pollRef, defaultVotes);
        }
        await updateDoc(pollRef, {
          [optionId]: increment(1),
          total: increment(1)
        });
        const updated = await getDoc(pollRef);
        return updated.data();
      } catch (err) {
        console.warn("Firestore submitSurveyVote failed, falling back to local storage:", err);
        const key = 'edugen_survey_votes';
        const current = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : defaultVotes;
        current[optionId] = (current[optionId] || 0) + 1;
        current.total = (current.total || 0) + 1;
        localStorage.setItem(key, JSON.stringify(current));
        window.dispatchEvent(new Event('storage'));
        return current;
      }
    }
  }
};
