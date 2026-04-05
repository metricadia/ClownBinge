import { Mark, mergeAttributes } from '@tiptap/core';

export interface PettyIDOptions {
  HTMLAttributes: Record<string, any>;
}

// Shared sanitization helper for PettyID attributes (used in parseHTML and handleConfirmPettyID)
export function sanitizePettyIDAttributes(attrs: { name?: string; imageUrl?: string; description?: string }) {
  // HTML escape function for text content - escapes dangerous characters but NOT forward slashes
  const escapeHtml = (text: string): string => {
    if (!text) return '';
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      // Do NOT escape forward slashes - they're safe in text content
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  };

  // URL-safe escape function - escapes quotes and angle brackets but preserves forward slashes
  const escapeUrlForAttribute = (url: string): string => {
    if (!url) return '';
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      // Do NOT escape forward slashes - they're safe in URLs and needed for paths
    };
    return url.replace(/[&<>"']/g, (char) => map[char]);
  };

  // URL validation
  const isSafeUrl = (url: string): boolean => {
    if (!url) return false;
    const trimmed = url.trim();
    if (trimmed !== url || /[\x00-\x1F\x7F]/.test(url)) return false;
    if (url.startsWith('//')) return false;
    if (url.startsWith('/')) return true;
    try {
      const parsed = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'https://example.com');
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Sanitize and return safe attributes
  return {
    name: attrs.name ? escapeHtml(attrs.name) : null,
    // Escape quotes/brackets but NOT slashes - prevents XSS while preserving URL paths
    imageUrl: attrs.imageUrl && isSafeUrl(attrs.imageUrl) 
      ? escapeUrlForAttribute(attrs.imageUrl) 
      : '/public-objects/public/fallback-avatar.png',
    description: attrs.description ? escapeHtml(attrs.description) : null,
  };
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pettyID: {
      setPettyID: (attributes: { name: string; imageUrl: string; description?: string }) => ReturnType;
      unsetPettyID: () => ReturnType;
    };
  }
}

export const PettyIDMark = Mark.create<PettyIDOptions>({
  name: 'pettyID',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: element => {
          // Parse and sanitize legacy content on load
          const rawName = element.getAttribute('data-pettyid-name') || element.getAttribute('data-pettyq-name');
          if (!rawName) return null;
          const sanitized = sanitizePettyIDAttributes({ name: rawName });
          return sanitized.name;
        },
        renderHTML: attributes => {
          if (!attributes.name) return {};
          return { 'data-pettyid-name': attributes.name };
        },
      },
      imageUrl: {
        default: null,
        parseHTML: element => {
          // Parse and sanitize legacy URLs on load
          const rawUrl = element.getAttribute('data-pettyid-image') || element.getAttribute('data-pettyq-image');
          if (!rawUrl) return null;
          const sanitized = sanitizePettyIDAttributes({ imageUrl: rawUrl });
          return sanitized.imageUrl;
        },
        renderHTML: attributes => {
          if (!attributes.imageUrl) return {};
          return { 'data-pettyid-image': attributes.imageUrl };
        },
      },
      description: {
        default: null,
        parseHTML: element => {
          // Parse and sanitize legacy descriptions on load
          const rawDesc = element.getAttribute('data-pettyid-desc') || element.getAttribute('data-pettyq-desc');
          if (!rawDesc) return null;
          const sanitized = sanitizePettyIDAttributes({ description: rawDesc });
          return sanitized.description;
        },
        renderHTML: attributes => {
          if (!attributes.description) return {};
          return { 'data-pettyid-desc': attributes.description };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-pettyid-name]',
      },
      {
        tag: 'span[data-pettyq-name]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Attributes are already escaped when stored in PM state (see handleConfirmPettyID)
    // Just pass them through without double-escaping
    // URL validation as defense-in-depth
    const isSafeUrl = (url: string): boolean => {
      if (!url) return false;
      const trimmed = url.trim();
      if (trimmed !== url || /[\x00-\x1F\x7F]/.test(url)) return false;
      if (url.startsWith('//')) return false;
      if (url.startsWith('/')) return true;
      try {
        const parsed = new URL(url, window.location.origin);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    };

    const rawImageUrl = HTMLAttributes['data-pettyid-image'] || '';
    const validatedImageUrl = isSafeUrl(rawImageUrl) 
      ? rawImageUrl 
      : '/public-objects/public/fallback-avatar.png';

    // Use already-escaped values from PM state
    const safeName = HTMLAttributes['data-pettyid-name'] || '';
    const safeImageUrl = validatedImageUrl;
    const safeDescription = HTMLAttributes['data-pettyid-desc'] || undefined;

    // Generate test ID from name (sanitized to alphanumeric only)
    const safeTestId = (HTMLAttributes['data-pettyid-name'] || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-pettyid-name': safeName,
        'data-pettyid-image': safeImageUrl,
        ...(safeDescription ? { 'data-pettyid-desc': safeDescription } : {}),
        class: 'pettyid-marker',
        role: 'button',
        tabindex: '0',
        'data-testid': `pettyid-${safeTestId}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setPettyID:
        attributes =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      unsetPettyID:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
