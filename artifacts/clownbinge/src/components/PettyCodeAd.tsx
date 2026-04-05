import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function PettyCodeAd() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="my-8" data-testid="pettycode-ad-banner">
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-amber-600/30 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6">
          {/* Left: Logo/Icon + Text */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Avatar/Logo Circle */}
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
              <span className="text-white text-xl sm:text-2xl font-black">M</span>
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col gap-0.5">
              <div className="text-amber-500 text-xs sm:text-sm font-bold tracking-wide uppercase">
                Premium Ad Space
              </div>
              <div className="text-stone-400 text-xs sm:text-sm">
                {isMobile ? 'Contact for placement' : 'Your Brand Here - Contact us for premium placement'}
              </div>
            </div>
          </div>

          {/* Right: CTA Button */}
          <Button
            variant="default"
            size={isMobile ? 'sm' : 'default'}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-stone-950 font-bold shadow-lg flex-shrink-0"
            data-testid="button-ad-learn-more"
          >
            {isMobile ? 'Learn' : 'Learn More'}
          </Button>
        </div>

        {/* Bottom: Advertisement label */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
          <div className="text-center text-stone-500 text-xs">
            Advertisement
          </div>
        </div>
      </div>
    </div>
  );
}
