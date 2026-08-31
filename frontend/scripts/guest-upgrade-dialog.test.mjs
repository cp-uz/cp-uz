import test from 'node:test';
import assert from 'node:assert/strict';

import React from 'react';
import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';

const dialogStubId = '\0guest-upgrade-dialog-test-stub';

test('guest upgrade dialog exposes optional name fields and username constraints', async () => {
  const server = await createServer({
    root: process.cwd(),
    appType: 'custom',
    logLevel: 'silent',
    ssr: { noExternal: ['@mui/material'] },
    server: { middlewareMode: true },
    plugins: [
      {
        name: 'guest-upgrade-dialog-test-stub',
        enforce: 'pre',
        resolveId(source) {
          return source === '@mui/material/Dialog' ? dialogStubId : undefined;
        },
        load(id) {
          if (id !== dialogStubId) return undefined;
          return `
            import React from 'react';
            export default function Dialog({ open, children, fullWidth, maxWidth, ...props }) {
              return open ? React.createElement('section', props, children) : null;
            }
          `;
        },
      },
    ],
  });

  try {
    const { GuestUpgradeDialog } = await server.ssrLoadModule(
      '/src/modules/auth/ui/components/GuestUpgradeDialog/GuestUpgradeDialog.tsx'
    );
    const html = renderToStaticMarkup(
      React.createElement(GuestUpgradeDialog, {
        open: true,
        onClose() {},
        onUpgraded() {},
      })
    );

    assert.match(html, /Ism \(ixtiyoriy\)/);
    assert.match(html, /Familiya \(ixtiyoriy\)/);
    assert.match(html, /Foydalanuvchi nomi/);
    assert.match(html, /autocomplete="given-name"/i);
    assert.match(html, /autocomplete="family-name"/i);
    assert.match(html, /maxlength="150"/i);
    assert.match(html, /pattern="\[a-z\]\[a-z0-9_-\]\{2,29\}"/);
  } finally {
    await server.close();
  }
});
