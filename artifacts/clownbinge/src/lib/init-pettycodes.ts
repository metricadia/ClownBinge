import { registerPettyCode } from './pettycode-registry';
import { PettyCodeAd } from '@/components/PettyCodeAd';

export function initializePettyCodes() {
  // Register custom inline components that can be embedded via [[PettyCodeAd]] in article content.
  // Add more custom components here as needed.
  registerPettyCode('PettyCodeAd', PettyCodeAd);
}
