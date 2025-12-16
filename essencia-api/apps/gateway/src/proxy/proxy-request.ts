import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import type { Request, Response } from 'express';

type HeaderValue = string | string[] | undefined;

function shouldSerializeJson(req: Request) {
  const contentType = req.headers['content-type']?.toString() ?? '';
  return contentType.includes('application/json');
}

function shouldSerializeUrlEncoded(req: Request) {
  const contentType = req.headers['content-type']?.toString() ?? '';
  return contentType.includes('application/x-www-form-urlencoded');
}

function dropHopByHopHeaders(headers: Record<string, HeaderValue>) {
  delete headers.connection;
  delete headers['keep-alive'];
  delete headers['proxy-authenticate'];
  delete headers['proxy-authorization'];
  delete headers.te;
  delete headers.trailer;
  delete headers['transfer-encoding'];
  delete headers.upgrade;
}

export async function proxyRequest(params: {
  req: Request;
  res: Response;
  targetBaseUrl: string;
  additionalHeaders?: Record<string, HeaderValue>;
  rewritePath?: (originalUrl: string) => string;
}): Promise<void> {
  const { req, res, targetBaseUrl, additionalHeaders, rewritePath } = params;

  const originalUrl = req.originalUrl || req.url || '/';
  const targetUrl = new URL(rewritePath ? rewritePath(originalUrl) : originalUrl, targetBaseUrl);

  const headers: Record<string, HeaderValue> = { ...(req.headers as Record<string, HeaderValue>) };
  delete headers.host;

  if (additionalHeaders) {
    for (const [key, value] of Object.entries(additionalHeaders)) {
      if (value !== undefined && value !== '') {
        headers[key.toLowerCase()] = value;
      }
    }
  }

  let bodyBuffer: Buffer | undefined;
  let pipeBody = false;

  if (!['GET', 'HEAD'].includes(req.method.toUpperCase())) {
    if (shouldSerializeJson(req)) {
      bodyBuffer = Buffer.from(JSON.stringify(req.body ?? {}));
      headers['content-length'] = String(bodyBuffer.byteLength);
      headers['content-type'] = headers['content-type'] ?? 'application/json';
    } else if (shouldSerializeUrlEncoded(req)) {
      const params = new URLSearchParams(req.body as Record<string, string>);
      bodyBuffer = Buffer.from(params.toString());
      headers['content-length'] = String(bodyBuffer.byteLength);
      headers['content-type'] =
        headers['content-type'] ?? 'application/x-www-form-urlencoded';
    } else {
      pipeBody = true;
    }
  }

  dropHopByHopHeaders(headers);

  const requestFn = targetUrl.protocol === 'https:' ? httpsRequest : httpRequest;

  await new Promise<void>((resolve, reject) => {
    const proxyReq = requestFn(
      {
        protocol: targetUrl.protocol,
        hostname: targetUrl.hostname,
        port: targetUrl.port,
        method: req.method,
        path: `${targetUrl.pathname}${targetUrl.search}`,
        headers,
      },
      (proxyRes) => {
        res.status(proxyRes.statusCode ?? 502);

        for (const [key, value] of Object.entries(proxyRes.headers)) {
          if (value !== undefined) {
            res.setHeader(key, value as any);
          }
        }

        proxyRes.pipe(res);
        proxyRes.on('end', resolve);
      },
    );

    const onError = (error: unknown) => {
      proxyReq.destroy();
      reject(error);
    };

    proxyReq.on('error', onError);
    req.on('aborted', () => proxyReq.destroy());
    res.on('close', () => proxyReq.destroy());

    if (bodyBuffer) {
      proxyReq.end(bodyBuffer);
      return;
    }

    if (pipeBody) {
      req.pipe(proxyReq);
      return;
    }

    proxyReq.end();
  });
}

