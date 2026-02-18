import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin?: (credentials: { email: string; password: string }) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const backgroundImages = [
    '/uploads/0a65a9d8-6587-49d4-8729-8a46c66b1a37.png',
    '/uploads/63d533d3-9326-4fda-bd8a-8ef8e6cb3587.png',
    '/uploads/5ccdfdf4-1be1-4027-814b-9ceb1482c8e9.png',
    '/uploads/f50b6900-0b8c-4f5d-93cb-f962ee0f2be0.png'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.({ email, password });
  };

  // Auto-change background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        <img 
          src={backgroundImages[currentBgIndex]}
          alt="Luxury Property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Login Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-sm">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">TocToc CRM</h1>
            <p className="text-white/80">Acesse sua conta</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent))]"
                  placeholder="Digite seu email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent))]"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Entrar
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <button type="button" className="text-white/80 hover:text-white text-sm transition-colors">
                Esqueci minha senha
              </button>
            </div>
          </form>

          {/* Background Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {backgroundImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentBgIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};