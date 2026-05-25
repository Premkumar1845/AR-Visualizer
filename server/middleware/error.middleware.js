export function errorMiddleware(err, _req, res, _next) {
    let status = err.statusCode || err.status || 500;
    let message = err.message || 'Internal Server Error';

    // Map low-level "fetch failed" / DNS / connection errors (typically from
    // an unreachable Supabase URL) into a clearer 503 message.
    const cause = err.cause || err.error || {};
    const code = err.code || cause.code;
    if (
        message.includes('fetch failed') ||
        message.includes('ENOTFOUND') ||
        message.includes('ECONNREFUSED') ||
        code === 'ENOTFOUND' ||
        code === 'ECONNREFUSED' ||
        code === 'EAI_AGAIN'
    ) {
        status = 503;
        message =
            'Upstream service unreachable. Check that SUPABASE_URL in server/.env points to a real Supabase project (or remove it to use the in-memory dev fallback).';
    }

    if (status >= 500) {
        console.error('[error]', err);
    }
    res.status(status).json({
        message,
        details: err.details,
        ...(process.env.NODE_ENV !== 'production' && status >= 500 ? { stack: err.stack } : {}),
    });
}

export function notFoundMiddleware(_req, res) {
    res.status(404).json({ message: 'Not found' });
}
