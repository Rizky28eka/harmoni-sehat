import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { openapi } from '../src/docs/openapi';
import { api } from './helpers';

describe('OpenAPI document', () => {
  it('is a valid OpenAPI 3 spec', async () => {
    // swagger-parser is ESM-only, which Jest's CJS runtime cannot load; validate in a plain Node process.
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'oas-')), 'openapi.json');
    fs.writeFileSync(file, JSON.stringify(openapi));
    const script = `require('@apidevtools/swagger-parser').validate(process.argv[1]).then(()=>console.log('VALID'),e=>{console.error(e.message);process.exit(1)})`;
    const out = execFileSync(process.execPath, ['-e', script, file], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8' });
    expect(out).toContain('VALID');
  });

  it('is served as JSON and as Swagger UI', async () => {
    const json = await api().get('/api/openapi.json');
    expect(json.status).toBe(200);
    expect(json.body.info.title).toBe('Harmoni Sehat API');
    const ui = await api().get('/api/docs/');
    expect(ui.status).toBe(200);
    expect(ui.text).toContain('swagger-ui');
  });

  it('only documents routes that really exist (no stale docs)', async () => {
    const missing: string[] = [];
    for (const [path, methods] of Object.entries<any>(openapi.paths)) {
      for (const method of Object.keys(methods)) {
        const url = `/api/v1${path.replace(/\{\w+\}/g, 'x')}`;
        const res = await (api() as any)[method](url).send({});
        // The catch-all handler is the only source of "Route ... not found".
        if (res.status === 404 && /^Route .* not found$/.test(res.body?.message ?? '')) missing.push(`${method.toUpperCase()} ${path}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
