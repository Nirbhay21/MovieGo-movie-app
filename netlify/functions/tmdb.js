import { env } from 'node:process';

export const handler = async (event) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders
    };
  }

  // Validate HTTP method
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Method not allowed',
        message: 'Only GET requests are supported'
      })
    };
  }

  // Get API key
  const apiKey = env.VITE_API_ACCESS_TOKEN;
  if (!apiKey) {
    console.error('TMDB API key not configured');
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'API configuration error'
      })
    };
  }

  try {
    // Extract path and ensure leading slash is removed
    const path = event.path
      .replace(/^\/\.netlify\/functions\/tmdb\/?/, '')
      .replace(/^\/api\/tmdb\/?/, '')
      .replace(/^\//, '');

    console.log('Original path:', event.path);
    console.log('Processed path:', path);

    // Construct TMDB API URL
    const url = new URL(`https://api.themoviedb.org/3/${path}`);

    // Add query parameters
    if (event.queryStringParameters) {
      Object.entries(event.queryStringParameters).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    console.log('TMDB API request URL:', url.toString());

    // Make request to TMDB API
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    // Log error responses for debugging
    if (!response.ok) {
      console.error('TMDB API Error:', {
        status: response.status,
        statusText: response.statusText,
        path: path,
        url: url.toString(),
        data: data
      });
    }

    return {
      statusCode: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('TMDB Proxy Error:', {
      error: error.message,
      stack: error.stack,
      path: event.path
    });

    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        path: event.path
      })
    };
  }
};