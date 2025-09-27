import { vi } from 'vitest';

vi.mock('server-only', () => ({}), { virtual: true });

vi.mock('next/server', () => {
  type HeadersInitInput = HeadersInit | undefined;

  class HeadersMock {
    private map = new Map<string, string>();

    constructor(init?: HeadersInitInput) {
      if (!init) return;
      if (init instanceof Headers) {
        init.forEach((value, key) => {
          this.set(key, value);
        });
        return;
      }
      if (Array.isArray(init)) {
        init.forEach(([key, value]) => {
          this.set(key, value);
        });
        return;
      }
      Object.entries(init).forEach(([key, value]) => {
        this.set(key, String(value));
      });
    }

    set(key: string, value: string) {
      this.map.set(key.toLowerCase(), value);
      return this;
    }

    get(key: string) {
      return this.map.get(key.toLowerCase()) ?? null;
    }

    toJSON() {
      return Object.fromEntries(this.map.entries());
    }
  }

  class NextResponse {
    public status: number;
    public headers: HeadersMock;
    public body: unknown;

    constructor(body?: unknown, init?: ResponseInit) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.headers = new HeadersMock(init?.headers);
    }

    static json(data: unknown, init?: number | ResponseInit) {
      if (typeof init === 'number') {
        return new NextResponse(data, { status: init, headers: { 'content-type': 'application/json' } });
      }
      const headers = init?.headers ?? { 'content-type': 'application/json' };
      return new NextResponse(data, { ...init, headers });
    }

    async json() {
      return this.body;
    }
  }

  return { NextResponse };
}, { virtual: true });
