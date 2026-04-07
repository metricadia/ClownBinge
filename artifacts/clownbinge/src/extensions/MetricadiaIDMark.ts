import { Mark, mergeAttributes } from '@tiptap/core';

export interface MetricadiaIDOptions {
  HTMLAttributes: Record<string, any>;
}

// Shared sanitization helper for Metricadia ID attributes (used in parseHTML and handleConfirmMetricadiaID)
export function sanitizeMetricadiaIDAttributes(attrs: { name?: string; imageUrl?: string; description?: string }) {
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
  // imageUrl is intentionally nullable — empty string means "no photo, show initials"
  return {
    name: attrs.name ? escapeHtml(attrs.name) : null,
    imageUrl: attrs.imageUrl && isSafeUrl(attrs.imageUrl)
      ? escapeUrlForAttribute(attrs.imageUrl)
      : '',
    description: attrs.description ? escapeHtml(attrs.description) : null,
  };
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    metricadiaID: {
      setMetricadiaID: (attributes: { name: string; imageUrl: string; description?: string; attribution?: string }) => ReturnType;
      unsetMetricadiaID: () => ReturnType;
    };
  }
}

export const MetricadiaIDMark = Mark.create<MetricadiaIDOptions>({
  name: 'metricadiaID',

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
          const rawName = element.getAttribute('data-metricadiaid-name') || element.getAttribute('data-metricadiaid-name');
          if (!rawName) return null;
          const sanitized = sanitizeMetricadiaIDAttributes({ name: rawName });
          return sanitized.name;
        },
        renderHTML: attributes => {
          if (!attributes.name) return {};
          return { 'data-metricadiaid-name': attributes.name };
        },
      },
      imageUrl: {
        default: null,
        parseHTML: element => {
          // Parse and sanitize legacy URLs on load
          const rawUrl = element.getAttribute('data-metricadiaid-image') || element.getAttribute('data-metricadiaid-image');
          if (!rawUrl) return null;
          const sanitized = sanitizeMetricadiaIDAttributes({ imageUrl: rawUrl });
          return sanitized.imageUrl;
        },
        renderHTML: attributes => {
          if (!attributes.imageUrl) return {};
          return { 'data-metricadiaid-image': attributes.imageUrl };
        },
      },
      description: {
        default: null,
        parseHTML: element => {
          const rawDesc = element.getAttribute('data-metricadiaid-desc');
          if (!rawDesc) return null;
          const sanitized = sanitizeMetricadiaIDAttributes({ description: rawDesc });
          return sanitized.description;
        },
        renderHTML: attributes => {
          if (!attributes.description) return {};
          return { 'data-metricadiaid-desc': attributes.description };
        },
      },
      attribution: {
        default: null,
        parseHTML: element => element.getAttribute('data-metricadiaid-attribution') || null,
        renderHTML: attributes => {
          if (!attributes.attribution) return {};
          return { 'data-metricadiaid-attribution': attributes.attribution };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-metricadiaid-name]',
      },
      {
        tag: 'span[data-metricadiaid-name]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Attributes are already escaped when stored in PM state (see handleConfirmMetricadiaID)
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

    const rawImageUrl = HTMLAttributes['data-metricadiaid-image'] || '';
    const validatedImageUrl = isSafeUrl(rawImageUrl) 
      ? rawImageUrl 
      : '/public-objects/public/fallback-avatar.png';

    // Use already-escaped values from PM state
    const safeName = HTMLAttributes['data-metricadiaid-name'] || '';
    const safeImageUrl = validatedImageUrl;
    const safeDescription = HTMLAttributes['data-metricadiaid-desc'] || undefined;
    const safeAttribution = HTMLAttributes['data-metricadiaid-attribution'] || undefined;

    // Generate test ID from name (sanitized to alphanumeric only)
    const safeTestId = (HTMLAttributes['data-metricadiaid-name'] || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-metricadiaid-name': safeName,
        'data-metricadiaid-image': safeImageUrl,
        ...(safeDescription ? { 'data-metricadiaid-desc': safeDescription } : {}),
        ...(safeAttribution ? { 'data-metricadiaid-attribution': safeAttribution } : {}),
        class: 'metricadiaid-marker',
        role: 'button',
        tabindex: '0',
        'data-testid': `metricadiaid-${safeTestId}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setMetricadiaID:
        attributes =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      unsetMetricadiaID:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
