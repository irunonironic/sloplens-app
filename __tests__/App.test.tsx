/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = jest.fn(async () => {
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({
        status: 'OK',
        code: 200,
        total: 0,
        data: [],
      }),
    } as unknown as Response;
  });

  try {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<App />);
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
