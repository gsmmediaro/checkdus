'use client';

import { useEffect, useState } from 'react';

export default function MapComponent() {
  const [mapboxToken, setMapboxToken] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      setError('Map requires Mapbox token. Configure NEXT_PUBLIC_MAPBOX_TOKEN in environment variables');
    } else {
      setMapboxToken(token);
    }
  }, []);

  // If there's an error (missing token), show error message
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <p className="text-red-600 font-semibold mb-2">Map Configuration Required</p>
        <p className="text-gray-600 text-sm text-center max-w-md">
          {error}
        </p>
        <div className="mt-4 p-4 bg-white rounded border text-left">
          <p className="text-sm text-gray-700">
            <strong>Default Location:</strong><br />
            123 Main Street, Suite 100<br />
            City, State 12345
          </p>
        </div>
      </div>
    );
  }

  // If token is available, render the Mapbox map
  // For now, we'll show a placeholder with instructions
  // In production, you would use react-map-gl or mapbox-gl here
  return (
    <div className="w-full h-full relative">
      {/* Placeholder - in production this would be the actual Mapbox map */}
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-center p-8">
          <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-green-800 font-semibold mb-2">Mapbox Token Configured</p>
          <p className="text-gray-700 text-sm">
            Map is ready to display.<br />
            To enable the interactive map, install mapbox-gl:<br />
            <code className="bg-white px-2 py-1 rounded text-xs">npm install mapbox-gl react-map-gl</code>
          </p>
          <div className="mt-4 p-4 bg-white rounded shadow-sm">
            <p className="text-sm text-gray-700">
              <strong>Our Location:</strong><br />
              123 Main Street, Suite 100<br />
              City, State 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
