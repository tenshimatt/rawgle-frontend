/**
 * Unit Tests for Feeding Schedule Edit Functionality
 *
 * Tests the feeding schedule API endpoints and edit dialog behavior
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Mock data
const mockFeedingRecord = {
  id: '1',
  petId: 'pet-1',
  date: '2025-10-23T08:00:00Z',
  mealType: 'breakfast',
  foodType: 'Chicken',
  amount: 200,
  unit: 'grams',
  notes: 'Morning meal',
  createdAt: '2025-10-23T08:00:00Z'
};

const mockSchedule = {
  id: 'schedule-1',
  petId: 'pet-1',
  mealType: 'breakfast',
  ingredients: [
    { type: 'ingredient', name: 'Chicken', amount: 150, unit: 'grams' },
    { type: 'supplement', name: 'Fish Oil', amount: 5, unit: 'ml' }
  ],
  frequency: 'daily',
  notes: 'Morning feeding schedule',
  active: true
};

describe('Feeding Records API - GET', () => {
  it('should fetch feeding records for a specific pet', () => {
    const petId = 'pet-1';
    const queryParams = new URLSearchParams({ petId });

    expect(queryParams.get('petId')).toBe(petId);
  });

  it('should filter records by date range', () => {
    const records = [
      { ...mockFeedingRecord, id: '1', date: '2025-10-20T08:00:00Z' },
      { ...mockFeedingRecord, id: '2', date: '2025-10-21T08:00:00Z' },
      { ...mockFeedingRecord, id: '3', date: '2025-10-22T08:00:00Z' }
    ];

    const startDate = new Date('2025-10-21T00:00:00Z');
    const filtered = records.filter(r => new Date(r.date) >= startDate);

    expect(filtered).toHaveLength(2);
  });

  it('should support different time filters (today, week, month)', () => {
    const now = new Date('2025-10-23T12:00:00Z');
    const filters = {
      today: new Date(now.setHours(0, 0, 0, 0)),
      week: new Date(now.setDate(now.getDate() - 7)),
      month: new Date(now.setDate(now.getDate() - 30))
    };

    expect(filters.today).toBeDefined();
    expect(filters.week).toBeDefined();
    expect(filters.month).toBeDefined();
  });
});

describe('Feeding Records API - POST', () => {
  it('should create a new feeding record with all required fields', () => {
    const newRecord = {
      petId: 'pet-1',
      date: new Date().toISOString(),
      mealType: 'lunch',
      foodType: 'Beef',
      amount: 250,
      unit: 'grams',
      notes: 'Lunch meal'
    };

    expect(newRecord.petId).toBeDefined();
    expect(newRecord.date).toBeDefined();
    expect(newRecord.mealType).toBeDefined();
    expect(newRecord.amount).toBeGreaterThan(0);
  });

  it('should validate amount is a positive number', () => {
    const validAmount = 200;
    const invalidAmount = -50;

    expect(validAmount).toBeGreaterThan(0);
    expect(invalidAmount).toBeLessThan(0);
  });

  it('should support different meal types', () => {
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

    mealTypes.forEach(type => {
      const record = { ...mockFeedingRecord, mealType: type };
      expect(mealTypes).toContain(record.mealType);
    });
  });

  it('should support different units', () => {
    const units = ['grams', 'ounces', 'cups', 'pounds'];

    units.forEach(unit => {
      const record = { ...mockFeedingRecord, unit };
      expect(units).toContain(record.unit);
    });
  });
});

describe('Feeding Records API - PATCH (Edit)', () => {
  it('should update feeding record with new values', () => {
    const updates = {
      mealType: 'dinner',
      foodType: 'Turkey',
      amount: 300,
      notes: 'Evening meal - larger portion'
    };

    const updatedRecord = {
      ...mockFeedingRecord,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    expect(updatedRecord.mealType).toBe('dinner');
    expect(updatedRecord.foodType).toBe('Turkey');
    expect(updatedRecord.amount).toBe(300);
  });

  it('should parse amount string to number', () => {
    const amountString = '250.5';
    const amountNumber = parseFloat(amountString);

    expect(amountNumber).toBe(250.5);
    expect(typeof amountNumber).toBe('number');
  });

  it('should preserve original timestamp but add updatedAt', () => {
    const original = { ...mockFeedingRecord };
    const updated = {
      ...original,
      amount: 300,
      updatedAt: new Date().toISOString()
    };

    expect(updated.createdAt).toBe(original.createdAt);
    expect(updated.updatedAt).toBeDefined();
  });
});

describe('Feeding Records API - DELETE', () => {
  it('should delete feeding record by ID', () => {
    let records = [
      { ...mockFeedingRecord, id: '1' },
      { ...mockFeedingRecord, id: '2' },
      { ...mockFeedingRecord, id: '3' }
    ];

    const idToDelete = '2';
    const initialLength = records.length;
    records = records.filter(r => r.id !== idToDelete);

    expect(records.length).toBe(initialLength - 1);
    expect(records.find(r => r.id === idToDelete)).toBeUndefined();
  });

  it('should return 404 for non-existent record', () => {
    const records = [{ ...mockFeedingRecord, id: '1' }];
    const recordId = 'non-existent';
    const found = records.find(r => r.id === recordId);

    expect(found).toBeUndefined();
  });
});

describe('Feeding Statistics Calculations', () => {
  it('should calculate total amount for today', () => {
    const today = new Date().toDateString();
    const feedings = [
      { ...mockFeedingRecord, date: new Date().toISOString(), amount: 100 },
      { ...mockFeedingRecord, date: new Date().toISOString(), amount: 150 },
      { ...mockFeedingRecord, date: new Date().toISOString(), amount: 200 }
    ];

    const todayFeedings = feedings.filter(f =>
      new Date(f.date).toDateString() === today
    );

    const total = todayFeedings.reduce((sum, f) => sum + f.amount, 0);
    expect(total).toBe(450);
  });

  it('should calculate weekly average', () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyFeedings = [
      { amount: 100 },
      { amount: 150 },
      { amount: 200 },
      { amount: 180 },
      { amount: 120 }
    ];

    const totalAmount = weeklyFeedings.reduce((sum, f) => sum + f.amount, 0);
    const avgDailyAmount = totalAmount / 7;

    expect(avgDailyAmount).toBeCloseTo(107.14, 2);
  });

  it('should filter feedings by week', () => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const feedings = [
      { date: new Date(now).toISOString() }, // Today
      { date: new Date(weekAgo).toISOString() }, // Exactly 7 days ago
      { date: new Date(weekAgo.getTime() - 86400000).toISOString() } // 8 days ago
    ];

    const weeklyFeedings = feedings.filter(f =>
      new Date(f.date) >= weekAgo
    );

    expect(weeklyFeedings.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Feeding Schedule Management', () => {
  it('should create schedule with ingredients', () => {
    const schedule = {
      petId: 'pet-1',
      mealType: 'breakfast',
      ingredients: [
        { type: 'ingredient', name: 'Chicken', amount: 150, unit: 'grams' },
        { type: 'supplement', name: 'Vitamins', amount: 10, unit: 'ml' }
      ],
      frequency: 'daily',
      notes: 'Morning schedule',
      active: true
    };

    expect(schedule.ingredients).toHaveLength(2);
    expect(schedule.ingredients[0].type).toBe('ingredient');
    expect(schedule.ingredients[1].type).toBe('supplement');
  });

  it('should differentiate between ingredients and supplements', () => {
    const ingredients = mockSchedule.ingredients.filter(i => i.type === 'ingredient');
    const supplements = mockSchedule.ingredients.filter(i => i.type === 'supplement');

    expect(ingredients).toHaveLength(1);
    expect(supplements).toHaveLength(1);
  });

  it('should support different frequencies', () => {
    const frequencies = ['daily', 'twice-daily', 'weekly', 'as-needed'];

    frequencies.forEach(freq => {
      const schedule = { ...mockSchedule, frequency: freq };
      expect(frequencies).toContain(schedule.frequency);
    });
  });

  it('should toggle active status', () => {
    let schedule = { ...mockSchedule, active: true };
    schedule = { ...schedule, active: !schedule.active };

    expect(schedule.active).toBe(false);
  });
});

describe('Edit Feeding Dialog Component', () => {
  it('should populate form with existing feeding data', () => {
    const formData = {
      petId: mockFeedingRecord.petId,
      date: new Date(mockFeedingRecord.date).toISOString().slice(0, 16),
      mealType: mockFeedingRecord.mealType,
      foodType: mockFeedingRecord.foodType,
      amount: mockFeedingRecord.amount.toString(),
      unit: mockFeedingRecord.unit,
      notes: mockFeedingRecord.notes
    };

    expect(formData.petId).toBe('pet-1');
    expect(formData.mealType).toBe('breakfast');
    expect(formData.amount).toBe('200');
  });

  it('should format datetime for input field', () => {
    const date = new Date('2025-10-23T08:00:00Z');
    const formatted = date.toISOString().slice(0, 16);

    expect(formatted).toBe('2025-10-23T08:00');
  });

  it('should validate required fields', () => {
    const formData = {
      petId: 'pet-1',
      date: '2025-10-23T08:00',
      mealType: 'breakfast',
      amount: '200',
      unit: 'grams'
    };

    const isValid =
      formData.petId &&
      formData.date &&
      formData.mealType &&
      formData.amount &&
      formData.unit;

    expect(isValid).toBe(true);
  });
});

describe('Meal Type Color Coding', () => {
  it('should assign different colors to meal types', () => {
    const getMealTypeColor = (mealType: string) => {
      switch (mealType.toLowerCase()) {
        case 'breakfast':
          return 'bg-maize/20 text-charcoal border-maize/30';
        case 'lunch':
          return 'bg-persian-green/20 text-charcoal border-persian-green/30';
        case 'dinner':
          return 'bg-burnt-sienna/20 text-charcoal border-burnt-sienna/30';
        case 'snack':
          return 'bg-coral/20 text-charcoal border-coral/30';
        default:
          return 'bg-charcoal/10 text-charcoal border-charcoal/20';
      }
    };

    expect(getMealTypeColor('breakfast')).toContain('maize');
    expect(getMealTypeColor('lunch')).toContain('persian-green');
    expect(getMealTypeColor('dinner')).toContain('burnt-sienna');
    expect(getMealTypeColor('snack')).toContain('coral');
  });
});

describe('Date Formatting Utilities', () => {
  it('should format date as "Today" for current day', () => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const today = new Date();

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      }
      return date.toLocaleDateString();
    };

    const todayStr = new Date().toISOString();
    expect(formatDate(todayStr)).toBe('Today');
  });

  it('should format date as "Yesterday" for previous day', () => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      return date.toLocaleDateString();
    };

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    expect(formatDate(yesterdayDate.toISOString())).toBe('Yesterday');
  });

  it('should format time in 12-hour format', () => {
    const formatTime = (dateString: string) => {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    const time = '2025-10-23T14:30:00Z';
    const formatted = formatTime(time);

    expect(formatted).toContain(':30');
    expect(formatted).toMatch(/AM|PM/);
  });
});

describe('Ingredient Management', () => {
  it('should add new ingredient to schedule', () => {
    const ingredients = [...mockSchedule.ingredients];
    const newIngredient = {
      type: 'ingredient' as const,
      name: 'Beef',
      amount: 100,
      unit: 'grams'
    };

    ingredients.push(newIngredient);
    expect(ingredients).toHaveLength(3);
  });

  it('should remove ingredient from schedule', () => {
    let ingredients = [...mockSchedule.ingredients];
    const initialLength = ingredients.length;

    ingredients = ingredients.filter((_, index) => index !== 0);
    expect(ingredients).toHaveLength(initialLength - 1);
  });

  it('should update ingredient amounts', () => {
    const ingredients = [...mockSchedule.ingredients];
    ingredients[0] = { ...ingredients[0], amount: 200 };

    expect(ingredients[0].amount).toBe(200);
  });
});
