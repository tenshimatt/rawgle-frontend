import { NextRequest, NextResponse } from 'next/server';

// Feature 30: Export health reports as PDF
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petId, startDate, endDate } = body;

  // In production, generate actual PDF using jsPDF or similar
  const report = {
    petId,
    startDate,
    endDate,
    downloadUrl: `/reports/${petId}-${Date.now()}.pdf`,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ data: report });
}
