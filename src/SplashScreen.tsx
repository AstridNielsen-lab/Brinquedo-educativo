import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinished: () => void;
  duration?: number;
}

function SplashScreen({ onFinished, duration = 5000 }: SplashScreenProps) {
  const [opacity, setOpacity] = useState(0);
  const [exitAnimation, setExitAnimation] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setOpacity(1), 100);

    // Start exit animation before duration completes
    const exitTimer = setTimeout(() => {
      setExitAnimation(true);
    }, duration - 1000);

    // Complete transition after full duration
    const finishTimer = setTimeout(() => {
      onFinished();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinished]);

  return (
    <div 
      className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 z-50 transition-opacity duration-1000 ${exitAnimation ? 'opacity-0' : ''}`}
      style={{ opacity }}
    >
      <div className="text-center max-w-3xl px-6">
        {/* Game Logo/Name */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeIn">
          Blocos Magnéticos Infantis
        </h1>
        
        {/* Game Description */}
        <p className="text-xl text-blue-200 mb-12 animate-fadeIn animation-delay-300">
          Brinquedo educativo com formas geométricas coloridas e conexões magnéticas
        </p>
        
        {/* Company Information */}
        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-fadeIn animation-delay-500">
          <h2 className="text-2xl font-semibold text-white mb-2">Like Look Solutions</h2>
          <p className="text-blue-200 mb-4">Soluções criativas para aprendizado infantil</p>
          
          <div className="text-blue-100 space-y-2">
            <p>Desenvolvido por: Julio Campos Machado</p>
            <p>Contato: +5511992946628</p>
            <p>
              <a 
                href="https://likelook.wixsite.com/solutions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-colors"
              >
                https://likelook.wixsite.com/solutions
              </a>
            </p>
          </div>
        </div>
        
        {/* Loading Animation */}
        <div className="flex justify-center space-x-2 animate-fadeIn animation-delay-700">
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce animation-delay-150"></div>
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce animation-delay-300"></div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
