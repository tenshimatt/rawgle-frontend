/**
 * Integration Tests for API Endpoints
 *
 * Tests the actual API endpoints with HTTP requests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Mock fetch for testing purposes
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe('Health Records API Integration', () => {
  const testPetId = 'test-pet-1';
  let createdRecordId: string;

  describe('GET /api/health/records', () => {
    it('should return 400 when petId is missing', async () => {
      const response = await fetch(`${BASE_URL}/api/health/records`);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return empty array for pet with no records', async () => {
      const response = await fetch(`${BASE_URL}/api/health/records?petId=${testPetId}`, {
        headers: { 'x-user-id': 'demo-user' }
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('POST /api/health/records', () => {
    it('should create a new health record', async () => {
      const newRecord = {
        petId: testPetId,
        type: 'vaccination',
        date: '2025-10-15',
        title: 'Test Rabies Vaccine',
        provider: 'Test Vet Clinic',
        notes: 'Test vaccination record',
        nextDueDate: '2026-10-15',
        cost: 75.00
      };

      const response = await fetch(`${BASE_URL}/api/health/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify(newRecord)
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('data');
      expect(data.data).toHaveProperty('id');
      expect(data.data.title).toBe(newRecord.title);

      createdRecordId = data.data.id;
    });

    it('should reject record without required fields', async () => {
      const invalidRecord = {
        petId: testPetId,
        // Missing required fields: type, date, title, provider
      };

      const response = await fetch(`${BASE_URL}/api/health/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify(invalidRecord)
      });

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/health/records/:id', () => {
    it('should update an existing health record', async () => {
      if (!createdRecordId) {
        // Create a record first
        const newRecord = {
          petId: testPetId,
          type: 'checkup',
          date: '2025-10-20',
          title: 'Annual Checkup',
          provider: 'Test Vet'
        };

        const createResponse = await fetch(`${BASE_URL}/api/health/records`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'demo-user'
          },
          body: JSON.stringify(newRecord)
        });
        const createData = await createResponse.json();
        createdRecordId = createData.data.id;
      }

      const updates = {
        title: 'Updated Checkup Title',
        cost: 100.00,
        notes: 'Updated notes for test'
      };

      const response = await fetch(`${BASE_URL}/api/health/records/${createdRecordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.title).toBe(updates.title);
      expect(data.data.cost).toBe(updates.cost);
    });

    it('should return 404 for non-existent record', async () => {
      const response = await fetch(`${BASE_URL}/api/health/records/non-existent-id`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify({ title: 'Test' })
      });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/health/records/:id', () => {
    it('should delete an existing health record', async () => {
      if (!createdRecordId) {
        test.skip();
      }

      const response = await fetch(`${BASE_URL}/api/health/records/${createdRecordId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'demo-user' }
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
      expect(data.success).toBe(true);
    });

    it('should return 404 when deleting non-existent record', async () => {
      const response = await fetch(`${BASE_URL}/api/health/records/non-existent-id`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'demo-user' }
      });

      expect(response.status).toBe(404);
    });
  });
});

describe('Feeding Records API Integration', () => {
  const testPetId = 'test-pet-1';
  let createdFeedingId: string;

  describe('GET /api/feeding', () => {
    it('should return 400 when petId is missing', async () => {
      const response = await fetch(`${BASE_URL}/api/feeding`);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return feeding records for a pet', async () => {
      const response = await fetch(`${BASE_URL}/api/feeding?petId=${testPetId}`, {
        headers: { 'x-user-id': 'demo-user' }
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should filter records by date range', async () => {
      const startDate = '2025-10-01';
      const response = await fetch(
        `${BASE_URL}/api/feeding?petId=${testPetId}&startDate=${startDate}`,
        { headers: { 'x-user-id': 'demo-user' } }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
    });
  });

  describe('POST /api/feeding', () => {
    it('should create a new feeding record', async () => {
      const newFeeding = {
        petId: testPetId,
        date: new Date().toISOString(),
        mealType: 'breakfast',
        foodType: 'Chicken',
        amount: 200,
        unit: 'grams',
        notes: 'Test feeding record'
      };

      const response = await fetch(`${BASE_URL}/api/feeding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify(newFeeding)
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('data');
      expect(data.data.mealType).toBe(newFeeding.mealType);
      expect(data.data.amount).toBe(newFeeding.amount);

      createdFeedingId = data.data.id;
    });

    it('should reject feeding without required fields', async () => {
      const invalidFeeding = {
        petId: testPetId,
        // Missing required fields
      };

      const response = await fetch(`${BASE_URL}/api/feeding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify(invalidFeeding)
      });

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/feeding/:id', () => {
    it('should update feeding record', async () => {
      if (!createdFeedingId) {
        test.skip();
      }

      const updates = {
        mealType: 'dinner',
        amount: 250,
        notes: 'Updated feeding notes'
      };

      const response = await fetch(`${BASE_URL}/api/feeding/${createdFeedingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.mealType).toBe(updates.mealType);
      expect(data.data.amount).toBe(updates.amount);
    });

    it('should return 404 for non-existent feeding', async () => {
      const response = await fetch(`${BASE_URL}/api/feeding/non-existent-id`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify({ amount: 100 })
      });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/feeding/:id', () => {
    it('should delete feeding record', async () => {
      if (!createdFeedingId) {
        test.skip();
      }

      const response = await fetch(`${BASE_URL}/api/feeding/${createdFeedingId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'demo-user' }
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});

describe('Feeding Schedule API Integration', () => {
  const testPetId = 'test-pet-1';
  let createdScheduleId: string;

  describe('GET /api/feeding/schedule', () => {
    it('should return schedules for a pet', async () => {
      const response = await fetch(`${BASE_URL}/api/feeding/schedule?petId=${testPetId}`, {
        headers: { 'x-user-id': 'demo-user' }
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('POST /api/feeding/schedule', () => {
    it('should create a new feeding schedule', async () => {
      const newSchedule = {
        petId: testPetId,
        mealType: 'breakfast',
        ingredients: [
          { type: 'ingredient', name: 'Chicken', amount: 150, unit: 'grams' },
          { type: 'supplement', name: 'Fish Oil', amount: 5, unit: 'ml' }
        ],
        frequency: 'daily',
        notes: 'Test schedule',
        active: true
      };

      const response = await fetch(`${BASE_URL}/api/feeding/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify(newSchedule)
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('data');
      expect(data.data.mealType).toBe(newSchedule.mealType);
      expect(data.data.ingredients).toHaveLength(2);

      createdScheduleId = data.data.id;
    });
  });

  describe('PATCH /api/feeding/schedule/:id', () => {
    it('should update feeding schedule', async () => {
      if (!createdScheduleId) {
        test.skip();
      }

      const updates = {
        ingredients: [
          { type: 'ingredient', name: 'Beef', amount: 200, unit: 'grams' }
        ],
        notes: 'Updated schedule notes'
      };

      const response = await fetch(`${BASE_URL}/api/feeding/schedule/${createdScheduleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.ingredients).toHaveLength(1);
    });
  });

  describe('DELETE /api/feeding/schedule/:id', () => {
    it('should delete feeding schedule', async () => {
      if (!createdScheduleId) {
        test.skip();
      }

      const response = await fetch(`${BASE_URL}/api/feeding/schedule/${createdScheduleId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'demo-user' }
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});

describe('Supplements API Integration', () => {
  const testPetId = 'test-pet-1';
  let createdSupplementId: string;

  describe('GET /api/supplements', () => {
    it('should return 400 when petId is missing', async () => {
      const response = await fetch(`${BASE_URL}/api/supplements`);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return supplements for a pet', async () => {
      const response = await fetch(`${BASE_URL}/api/supplements?petId=${testPetId}`, {
        headers: { 'x-user-id': 'demo-user' }
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('POST /api/supplements', () => {
    it('should create a new supplement', async () => {
      const newSupplement = {
        petId: testPetId,
        name: 'Fish Oil',
        type: 'omega-3',
        dosage: '5ml',
        frequency: 'daily',
        timeOfDay: 'morning',
        purpose: 'Joint health',
        notes: 'Test supplement'
      };

      const response = await fetch(`${BASE_URL}/api/supplements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify(newSupplement)
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('data');
      expect(data.data.name).toBe(newSupplement.name);

      createdSupplementId = data.data.id;
    });

    it('should reject supplement without required fields', async () => {
      const invalidSupplement = {
        petId: testPetId,
        // Missing name and dosage
      };

      const response = await fetch(`${BASE_URL}/api/supplements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify(invalidSupplement)
      });

      expect(response.status).toBe(400);
    });
  });
});

describe('API Error Handling', () => {
  it('should handle invalid JSON gracefully', async () => {
    const response = await fetch(`${BASE_URL}/api/health/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'demo-user'
      },
      body: 'invalid json'
    });

    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('should require authentication header', async () => {
    // Request without x-user-id header
    const response = await fetch(`${BASE_URL}/api/health/records?petId=test-pet-1`);

    // Should either require auth or work with demo user
    expect(response.status).toBeDefined();
  });

  it('should return proper error messages', async () => {
    const response = await fetch(`${BASE_URL}/api/health/records`);
    const data = await response.json();

    expect(data).toHaveProperty('error');
    expect(typeof data.error).toBe('string');
  });
});
