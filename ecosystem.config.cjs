module.exports = {
  apps: [{
    name: 'clownbinge',
    script: '/var/www/clownbinge/artifacts/api-server/dist/index.mjs',
    env: {
      NODE_ENV: 'production',
      PORT: '3000',
      BASE_PATH: '/',
      DATABASE_URL: 'postgresql://postgres:wCt_4i5_GZaj4bK_2026@localhost:5432/clownbinge',
      ANTHROPIC_API_KEY: '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',
      AI_INTEGRATIONS_ANTHROPIC_BASE_URL: 'https://api.anthropic.com',
      AI_INTEGRATIONS_ANTHROPIC_API_KEY: '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',
      SESSION_SECRET: 'add03b172ec2288a70df0ddd19cdb921c6489aefe699b18624a133ab5bd179b4',
      METRICADIA_ADMIN_PASSWORD: 'Lord4LifeJesuNoApple#@b'
    }
  }]
};
