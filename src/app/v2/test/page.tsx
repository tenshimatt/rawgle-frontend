'use client';

import { useEffect, useState } from 'react';

export default function V2TestPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [suppliers, setSuppliers] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function test() {
      try {
        // Test diagnostics
        const diagRes = await fetch('/v2/api/diagnostics');
        const diagData = await diagRes.json();
        setDiagnostics(diagData);

        // Test suppliers
        const suppRes = await fetch('/v2/api/suppliers?limit=5');
        const suppData = await suppRes.json();
        setSuppliers(suppData);
      } catch (error) {
        console.error('Test failed:', error);
      } finally {
        setLoading(false);
      }
    }
    test();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Testing v2 API routes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">V2 API Test Results</h1>

        {/* Diagnostics */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-teal-600">Diagnostics Endpoint</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Status:</span>
              <span className={diagnostics?.success ? 'text-green-600' : 'text-red-600'}>
                {diagnostics?.success ? '✅ Success' : '❌ Failed'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Cloudflare Connected:</span>
              <span className={diagnostics?.data?.cloudflare?.connected ? 'text-green-600' : 'text-red-600'}>
                {diagnostics?.data?.cloudflare?.connected ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            {diagnostics?.data?.cloudflare?.stats && (
              <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
                <div className="text-lg font-bold text-green-800">
                  📊 Total Suppliers: {diagnostics.data.cloudflare.stats.total_suppliers || 0}
                </div>
              </div>
            )}
          </div>
          <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </div>

        {/* Suppliers */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-orange-600">Suppliers Endpoint</h2>
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Status:</span>
              <span className={suppliers?.success ? 'text-green-600' : 'text-red-600'}>
                {suppliers?.success ? '✅ Success' : '❌ Failed'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Count:</span>
              <span className="text-blue-600 font-bold">{suppliers?.count || 0} suppliers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Source:</span>
              <span className="text-purple-600">{suppliers?.source || 'unknown'}</span>
            </div>
            {suppliers?.total_in_database && (
              <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                <div className="text-lg font-bold text-blue-800">
                  🗄️ Total in Database: {suppliers.total_in_database}
                </div>
              </div>
            )}
          </div>

          {suppliers?.suppliers && suppliers.suppliers.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold mb-3">Sample Suppliers:</h3>
              <div className="space-y-3">
                {suppliers.suppliers.slice(0, 3).map((supplier: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded border">
                    <div className="font-semibold">{supplier.business_name || supplier.name}</div>
                    <div className="text-sm text-gray-600">
                      {supplier.city}, {supplier.state}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(suppliers, null, 2)}
          </pre>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-teal-600 hover:text-teal-700 font-semibold">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
