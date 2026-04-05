import { ComponentType } from 'react';

export interface PettyCodeComponent {
  component: ComponentType<any>;
  props?: Record<string, any>;
}

const PETTYCODE_REGISTRY: Record<string, PettyCodeComponent> = {};

export function registerPettyCode(
  code: string,
  component: ComponentType<any>,
  defaultProps?: Record<string, any>
): void {
  PETTYCODE_REGISTRY[code] = {
    component,
    props: defaultProps || {},
  };
}

export function getPettyCodeComponent(code: string): PettyCodeComponent | null {
  return PETTYCODE_REGISTRY[code] || null;
}

export function renderPettyCode(code: string, key: string): JSX.Element | null {
  const pettyCodeInfo = getPettyCodeComponent(code);
  if (!pettyCodeInfo) return null;
  
  const Component = pettyCodeInfo.component;
  return <Component key={key} {...pettyCodeInfo.props} />;
}
