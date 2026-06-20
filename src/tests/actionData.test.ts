import { describe, it, expect } from 'vitest';
import { ECO_ACTIONS } from '../utils/actionData';

describe('Eco Actions Catalog Data Integrity Suite', () => {
  it('should verify the catalog contains all 23 actions', () => {
    expect(ECO_ACTIONS.length).toBe(23);
  });

  it('should verify each action is correctly structured and has valid values', () => {
    ECO_ACTIONS.forEach((action) => {
      // Check ID and title
      expect(action.id).toBeDefined();
      expect(action.id.length).toBeGreaterThan(0);
      expect(action.title).toBeDefined();
      expect(action.title.length).toBeGreaterThan(0);
      expect(action.description).toBeDefined();
      expect(action.description.length).toBeGreaterThan(0);

      // Check categories
      expect(['travel', 'home', 'diet', 'waste']).toContain(action.category);

      // Check savings are positive numbers
      expect(action.savings).toBeGreaterThan(0);

      // Check effort levels
      expect(['low', 'medium', 'high']).toContain(action.effort);

      // Check cost levels
      expect(['none', 'low', 'high']).toContain(action.cost);

      // Check impact levels
      expect(['low', 'medium', 'high']).toContain(action.impact);

      // Check tip is present
      expect(action.tip).toBeDefined();
      expect(action.tip.length).toBeGreaterThan(0);
    });
  });

  it('should verify all action IDs are unique', () => {
    const ids = ECO_ACTIONS.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
