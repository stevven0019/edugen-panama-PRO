import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight,
  School,
  LockKeyhole,
  X
} from 'lucide-react';
import { authService, databaseService, isDemoMode } from './services/firebase';

// Views
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CustomAlert from './components/CustomAlert';
import Dashboard from './pages/Dashboard';
import PlannerAOA from './pages/PlannerAOA';
import Interdisciplinary from './pages/Interdisciplinary';
import ThemePlanner from './pages/ThemePlanner';
import Library from './pages/Library';
import AdBanner from './components/AdBanner';

// EduGen Pro Billing & Ads components
import BillingModal from './components/BillingModal';
import { InterstitialAd, RewardedAd } from './components/AdManager';

// Public Views
import PublicLanding from './pages/PublicLanding';
import Blog from './pages/Blog';
import LegalPages from './pages/LegalPages';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  
  // App navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Login Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Public portal navigation states
  const [publicTab, setPublicTab] = useState('landing');
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Global alert alert modal state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('info'); // 'info' | 'success' | 'error'

  // EduGen Pro Billing & Ads States
  const [billingOpen, setBillingOpen] = useState(false);
  const [interstitialOpen, setInterstitialOpen] = useState(false);
  const [rewardedOpen, setRewardedOpen] = useState(false);
  const [onInterstitialFinished, setOnInterstitialFinished] = useState(() => () => {});
  const [onRewardedFinished, setOnRewardedFinished] = useState(() => () => {});

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPWAInstallBtn, setShowPWAInstallBtn] = useState(false);

  // Simulated Push Notification State
  const [pushNotification, setPushNotification] = useState(null);

  // Listen to billing modal trigger events globally
  useEffect(() => {
    const openBilling = () => setBillingOpen(true);
    window.addEventListener('show-billing-modal', openBilling);
    return () => window.removeEventListener('show-billing-modal', openBilling);
  }, []);

  // Listen to PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPWAInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handlePWAInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install: ${outcome}`);
    setDeferredPrompt(null);
    setShowPWAInstallBtn(false);
  };

  // Push Notification simulation
  useEffect(() => {
    if (user && credits === 0 && !isPremium) {
      const timer = setTimeout(() => {
        setPushNotification({
          title: "Notificación: EduGen Pro",
          body: "Tus tokens gratuitos se agotaron. Hazte PRO o mira un anuncio para seguir planificando."
        });
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setPushNotification(null);
    }
  }, [credits, isPremium, user]);

  const triggerInterstitialAd = (onFinishedCallback) => {
    if (isPremium) {
      onFinishedCallback();
    } else {
      setOnInterstitialFinished(() => onFinishedCallback);
      setInterstitialOpen(true);
    }
  };

  const triggerRewardedAd = (onRewardCallback) => {
    setOnRewardedFinished(() => onRewardCallback);
    setRewardedOpen(true);
  };

  const triggerAlert = (message, type = 'info') => {
    setAlertMsg(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  // ── Listen for Authentication changes ──
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ── Sync user credits dynamically when logged in ──
  useEffect(() => {
    if (!user) return;
    const unsubscribe = databaseService.syncUserCredits(user.uid, (data) => {
      setCredits(data.credits);
      setIsPremium(data.isPremium);
    });
    return () => unsubscribe();
  }, [user]);

  // Automatically close auth modal if user logs in
  useEffect(() => {
    if (user) {
      setShowAuthModal(false);
    }
  }, [user]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      triggerAlert("Por favor completa todos los campos del formulario.", "info");
      return;
    }
    
    setLoginLoading(true);
    try {
      if (isRegister) {
        await authService.register(email, password);
        triggerAlert("¡Registro exitoso! Bienvenido al sistema EduGen Panama PRO.", "success");
      } else {
        await authService.login(email, password);
        triggerAlert("Sesión iniciada con éxito.", "success");
      }
    } catch (err) {
      console.error(err);
      triggerAlert("Error de autenticación: " + err.message, "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    try {
      await authService.loginWithGoogle();
      triggerAlert("Sesión iniciada con Google con éxito.", "success");
    } catch (err) {
      triggerAlert("Error al iniciar sesión con Google: " + err.message, "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoginLoading(true);
    try {
      await authService.loginWithFacebook();
      triggerAlert("Sesión iniciada con Facebook con éxito.", "success");
    } catch (err) {
      triggerAlert("Error al iniciar sesión con Facebook: " + err.message, "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAddCredits = () => {
    setBillingOpen(true);
  };

  const handleTogglePremium = () => {
    if (isPremium) {
      // Allow user to downgrade for simulation testing
      databaseService.togglePremium(user.uid, false);
      triggerAlert("Suscripción PRO desactivada. Cuenta en versión gratuita.", "info");
    } else {
      // Open billing modal to subscribe to PRO
      setBillingOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      triggerAlert("Sesión cerrada correctamente.", "info");
      setActiveTab('dashboard');
    } catch (e) {
      triggerAlert("Error al intentar cerrar sesión.", "error");
    }
  };

  // ── Render Boot Loading state ──
  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center z-50">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-600 uppercase animate-pulse">
          Iniciando Sistema AOA...
        </p>
      </div>
    );
  }

  // ── Render Public Portal Layout (Unauthenticated) ──
  if (!user) {
    return (
      <div className="min-h-screen">
        
        {/* Public Views Switcher */}
        {publicTab === 'landing' && (
          <PublicLanding 
            onLoginClick={() => setShowAuthModal(true)} 
            setPublicTab={setPublicTab} 
            setSelectedArticleId={setSelectedArticleId} 
          />
        )}
        
        {publicTab === 'blog' && (
          <Blog 
            selectedArticleId={selectedArticleId} 
            setSelectedArticleId={setSelectedArticleId} 
            setPublicTab={setPublicTab} 
            onLoginClick={() => setShowAuthModal(true)} 
          />
        )}

        {(publicTab === 'privacy' || publicTab === 'terms' || publicTab === 'about') && (
          <LegalPages 
            defaultTab={publicTab} 
            setPublicTab={setPublicTab} 
            onLoginClick={() => setShowAuthModal(true)} 
          />
        )}

        {/* Dynamic Auth Modal Overlay */}
        {showAuthModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in"
            onClick={() => setShowAuthModal(false)}
          >
            <div 
              className="w-full max-w-md relative animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2 rounded-full transition active:scale-95 z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full space-y-6">
                {/* Logo */}
                <div className="text-center space-y-3">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-16 h-16 rounded-3xl text-white shadow-xl shadow-blue-500/20 flex items-center justify-center mx-auto">
                    <School className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                      EduGen Panama PRO
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                      Sistema de Planificación Curricular AOA
                    </p>
                  </div>
                </div>

                {/* Form Card */}
                <div className="glass-panel p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 mb-6">
                    {isRegister ? 'Crear Cuenta Docente' : 'Iniciar Sesión'}
                  </h3>
                  
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Correo Electrónico</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                        <input 
                          type="email" 
                          placeholder="ejemplo@correo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                        <input 
                          type="password" 
                          placeholder="Contraseña de acceso"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input outline-none text-xs"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loginLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-blue-500/10 active:scale-98 transition flex items-center justify-center gap-2 text-xs cursor-pointer"
                    >
                      {loginLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>{isRegister ? 'Registrarme' : 'Entrar al Sistema'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="relative flex py-3 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                    <span className="flex-shrink mx-3 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">o continuar con</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={handleGoogleLogin}
                      className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer active:scale-95"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.5 15 0 12 0 7.3 0 3.3 2.7 1.3 6.6l3.9 3C6.1 7.1 8.8 5.04 12 5.04z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"/>
                        <path fill="#FBBC05" d="M5.2 14.6c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.3 7c-1.3 2.6-1.3 5.7 0 8.3l3.9-3.1z"/>
                        <path fill="#34A853" d="M12 24c3.2 0 6-1 8-2.8l-3.7-2.9c-1.1.7-2.5 1.1-4.3 1.1-3.2 0-5.9-2.1-6.8-4.9l-3.9 3.1C3.3 21.3 7.3 24 12 24z"/>
                      </svg>
                      Google
                    </button>
                    <button 
                      type="button"
                      onClick={handleFacebookLogin}
                      className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer active:scale-95"
                    >
                      <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs">
                    <span className="text-slate-400 dark:text-slate-500 mr-1.5">
                      {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes una cuenta?'}
                    </span>
                    <button 
                      onClick={() => setIsRegister(!isRegister)} 
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 font-bold transition"
                    >
                      {isRegister ? 'Inicia Sesión' : 'Regístrate aquí'}
                    </button>
                  </div>
                </div>
                
                {/* Demo Alert Box */}
                <div className="glass-panel p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-3 mt-3">
                  <LockKeyhole className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider leading-none">Interactive Sandbox</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      El sistema entrará automáticamente en <strong>Modo Demo</strong> interactivo con créditos de cortesía si no has configurado tus llaves.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Global Modal system message */}
        <CustomAlert 
          isOpen={alertOpen} 
          message={alertMsg} 
          type={alertType} 
          onClose={() => setAlertOpen(false)} 
        />
      </div>
    );
  }

  // ── Render Main Workspace Layout (Authenticated) ──
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      
      {/* Dynamic Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userEmail={user.email} 
        onLogout={handleLogout} 
        showPWAInstallBtn={showPWAInstallBtn}
        onPWAInstall={handlePWAInstall}
      />
      
      {/* Content wrapper panel */}
      <div className="flex-1 flex flex-col p-4 md:p-8 lg:pl-[312px] min-w-0 transition-all duration-300">
        
        {/* Global top status bar header */}
        <Header 
          activeTab={activeTab} 
          credits={credits} 
          isDemoMode={isDemoMode}
          onAddCredits={handleAddCredits}
          isPremium={isPremium}
          onTogglePremium={handleTogglePremium}
        />
        
        {/* Dashboard / pages dispatcher router */}
        <main className="flex-grow animate-fade-in">
          {activeTab === 'dashboard' && (
            <Dashboard 
              user={user} 
              credits={credits} 
              setActiveTab={setActiveTab} 
              isPremium={isPremium}
            />
          )}
          {activeTab === 'aoa' && (
            <PlannerAOA 
              user={user} 
              credits={credits} 
              onTriggerAlert={triggerAlert} 
              isPremium={isPremium}
              triggerInterstitialAd={triggerInterstitialAd}
              triggerRewardedAd={triggerRewardedAd}
            />
          )}
          {activeTab === 'interdisciplinary' && (
            <Interdisciplinary 
              user={user} 
              credits={credits} 
              onTriggerAlert={triggerAlert} 
              isPremium={isPremium}
              triggerInterstitialAd={triggerInterstitialAd}
              triggerRewardedAd={triggerRewardedAd}
            />
          )}
          {activeTab === 'theme-planner' && (
            <ThemePlanner 
              user={user} 
              credits={credits} 
              onTriggerAlert={triggerAlert} 
              isPremium={isPremium}
              triggerInterstitialAd={triggerInterstitialAd}
              triggerRewardedAd={triggerRewardedAd}
            />
          )}
          {activeTab === 'library' && (
            <Library 
              user={user} 
              onTriggerAlert={triggerAlert} 
            />
          )}
          {activeTab === 'blog' && (
            <Blog 
              selectedArticleId={selectedArticleId} 
              setSelectedArticleId={setSelectedArticleId} 
              setPublicTab={(tab) => {
                if (tab === 'landing') setActiveTab('dashboard');
                else if (tab === 'blog') setActiveTab('blog');
                else { setSelectedArticleId(null); setActiveTab(tab); }
              }}
              onLoginClick={() => {}}
            />
          )}
          {(activeTab === 'privacy' || activeTab === 'terms' || activeTab === 'about') && (
            <LegalPages 
              defaultTab={activeTab} 
              setPublicTab={(tab) => {
                if (tab === 'landing') setActiveTab('dashboard');
                else if (tab === 'blog') setActiveTab('blog');
                else setActiveTab(tab);
              }}
              onLoginClick={() => {}}
            />
          )}
        </main>
        
        {/* Global Footer Ad banner */}
        <AdBanner type="footer" isPremium={isPremium} />
      </div>

      {/* EduGen Pro Billing checkout modal */}
      <BillingModal 
        isOpen={billingOpen}
        onClose={() => setBillingOpen(false)}
        user={user}
        onTriggerAlert={triggerAlert}
      />

      {/* Simulated Google AdMob Interstitial Ad */}
      <InterstitialAd 
        isOpen={interstitialOpen}
        onClose={() => setInterstitialOpen(false)}
        onAdFinished={onInterstitialFinished}
      />

      {/* Simulated Google AdMob Rewarded Video Ad */}
      <RewardedAd 
        isOpen={rewardedOpen}
        onClose={() => setRewardedOpen(false)}
        onRewardReceived={onRewardedFinished}
      />

      {/* Simulated push notification toast */}
      {pushNotification && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-5 py-4 rounded-3xl shadow-2xl border border-slate-800 dark:border-slate-200 flex items-start gap-3.5 max-w-sm animate-fade-in-up">
          <div className="bg-blue-600/10 p-2.5 rounded-2xl text-blue-500 flex-shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-0.5">
            <h4 className="text-xs font-black uppercase tracking-wider">{pushNotification.title}</h4>
            <p className="text-[11px] font-medium opacity-85 leading-relaxed">{pushNotification.body}</p>
          </div>
          <button 
            onClick={() => setPushNotification(null)}
            className="text-slate-400 hover:text-slate-200 dark:hover:text-slate-700 active:scale-95 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global modal system messages */}
      <CustomAlert 
        isOpen={alertOpen} 
        message={alertMsg} 
        type={alertType} 
        onClose={() => setAlertOpen(false)} 
      />
    </div>
  );
}
