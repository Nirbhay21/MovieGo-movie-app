import { env } from 'node:process';

/**
 * Netlify function handler for TMDB API proxy
 */
export const handler = async (event) => {
  // Enable CORS
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

  // Only allow GET requests
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

  const path = event.path.replace('/.netlify/functions/tmdb/', '');
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
    console.log('Proxying request to:', path);
    const url = new URL(`https://api.themoviedb.org/3/${path}`);
    
    // Add query parameters
    if (event.queryStringParameters) {
      Object.entries(event.queryStringParameters).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    console.log('Full URL:', url.toString());

    const response = await fetch(url, {
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
        data
      });
    }

    // Return TMDB API response
    return {
      statusCode: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('TMDB Proxy Error:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to fetch data',
        details: error.message
      })
    };
  }
};