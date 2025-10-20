# Feature: Fix Add Pet Dialog Birthdate Field

## User Story
AS A pet owner
I WANT TO see a proper date picker for my pet's birthdate
SO THAT I can easily enter their birth date and calculate their age automatically

## Problem
Currently the birthdate field shows "dd/mm/yyyy" placeholder text instead of a proper date picker. The HTML5 date input is not rendering correctly.

## Requirements

### Functional
- [ ] Birthdate field renders as a proper HTML5 date input
- [ ] Date picker appears when field is clicked
- [ ] Date is validated (cannot be in the future)
- [ ] Form submits with birthdate in YYYY-MM-DD format
- [ ] Age is calculated automatically from birthdate
- [ ] All field naming uses lowercase `birthdate` (not `birthDate`)

### Non-Functional
- [ ] Works on all modern browsers (Chrome, Firefox, Safari)
- [ ] Mobile-friendly date picker
- [ ] Accessible via keyboard
- [ ] Clear visual feedback when field is focused

## Current State

**File**: `src/components/pets/add-pet-dialog.tsx`

**Issue**: Lines 273-284 show placeholder text instead of date picker

```typescript
{/* Birthdate */}
<div className="space-y-2">
  <Label htmlFor="birthdate">Birthdate *</Label>
  <Input
    id="birthdate"
    type="date"
    value={formData.birthdate}
    onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
    max={new Date().toISOString().split('T')[0]}
    required
  />
</div>
```

## Solution

### Option 1: Ensure Proper Date Input Styling
The Input component may be overriding native date input styles. Check:
- `src/components/ui/input.tsx` for conflicting styles
- CSS that might hide the date picker icon
- Browser-specific styling issues

### Option 2: Use a Date Picker Library
If native input doesn't work, consider:
- `react-day-picker`
- `@radix-ui/react-popover` + `react-day-picker`
- Already using Radix UI components

## Implementation Steps

1. **Investigate Input Component**
   ```typescript
   // Check src/components/ui/input.tsx
   // Ensure no styles override date input appearance
   ```

2. **Test Native Date Input**
   ```typescript
   // Add data-testid for testing
   <Input
     id="birthdate"
     type="date"
     value={formData.birthdate}
     onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
     max={new Date().toISOString().split('T')[0]}
     required
     data-testid="pet-birthdate-input"
     className="cursor-pointer" // Ensure clickable
   />
   ```

3. **Add Visual Feedback**
   ```typescript
   <div className="space-y-2">
     <Label htmlFor="birthdate">Birthdate *</Label>
     <div className="relative">
       <Input
         id="birthdate"
         type="date"
         value={formData.birthdate}
         onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
         max={new Date().toISOString().split('T')[0]}
         required
         className="w-full"
       />
       {!formData.birthdate && (
         <span className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none">
           Select birthdate
         </span>
       )}
     </div>
   </div>
   ```

4. **Alternative: Custom Date Picker**
   If native doesn't work, implement custom picker:
   ```typescript
   import { Calendar } from "@/components/ui/calendar"
   import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
   import { format } from "date-fns"

   <Popover>
     <PopoverTrigger asChild>
       <Button variant="outline" className="w-full justify-start text-left">
         {formData.birthdate ? format(new Date(formData.birthdate), "PPP") : "Pick a date"}
       </Button>
     </PopoverTrigger>
     <PopoverContent className="w-auto p-0">
       <Calendar
         mode="single"
         selected={formData.birthdate ? new Date(formData.birthdate) : undefined}
         onSelect={(date) => setFormData(prev => ({
           ...prev,
           birthdate: date ? format(date, "yyyy-MM-dd") : ''
         }))}
         disabled={(date) => date > new Date()}
       />
     </PopoverContent>
   </Popover>
   ```

## API Contract

**Unchanged** - Already correct:

### POST /api/pets
```json
{
  "name": "string",
  "species": "dog" | "cat",
  "breed": "string",
  "birthdate": "YYYY-MM-DD",  // ✅ Correct format
  "weight": number,
  "gender": "male" | "female",
  "image": "base64 string (optional)"
}
```

## Test Cases

### Unit Tests
```typescript
describe('AddPetDialog - Birthdate Field', () => {
  it('renders date input field', () => {
    render(<AddPetDialog onPetAdded={jest.fn()} />);
    const dateInput = screen.getByTestId('pet-birthdate-input');
    expect(dateInput).toHaveAttribute('type', 'date');
  });

  it('prevents future dates', () => {
    render(<AddPetDialog onPetAdded={jest.fn()} />);
    const dateInput = screen.getByTestId('pet-birthdate-input');
    const maxDate = dateInput.getAttribute('max');
    expect(new Date(maxDate!)).toBeLessThanOrEqual(new Date());
  });

  it('submits correct date format', async () => {
    const onPetAdded = jest.fn();
    render(<AddPetDialog onPetAdded={onPetAdded} />);

    // Fill form
    await userEvent.type(screen.getByLabelText('Pet Name'), 'Buddy');
    await userEvent.click(screen.getByLabelText('Dog'));
    await userEvent.selectOptions(screen.getByLabelText('Breed'), 'Golden Retriever');
    await userEvent.type(screen.getByTestId('pet-birthdate-input'), '2020-03-15');
    await userEvent.type(screen.getByLabelText('Weight'), '65');

    await userEvent.click(screen.getByText('Add Pet'));

    // Verify API call
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/pets',
      expect.objectContaining({
        body: expect.stringContaining('"birthdate":"2020-03-15"')
      })
    );
  });
});
```

### E2E Tests (Selenium)
```typescript
test('user can select birthdate using date picker', async () => {
  await page.goto('http://localhost:3010/pets');
  await page.click('[data-testid="add-pet-button"]');

  // Check date input is visible and clickable
  const birthdateInput = await page.$('[data-testid="pet-birthdate-input"]');
  expect(birthdateInput).toBeTruthy();

  // Fill date
  await page.fill('[data-testid="pet-birthdate-input"]', '2020-03-15');

  // Fill other fields
  await page.fill('[name="name"]', 'Buddy');
  await page.click('[value="dog"]');
  await page.selectOption('[name="breed"]', 'Golden Retriever');
  await page.fill('[name="weight"]', '65');

  // Submit
  await page.click('[data-testid="submit"]');

  // Verify pet was created
  await expect(page.locator('.pet-card')).toContainText('Buddy');
  await expect(page.locator('.pet-card')).toContainText('4 years'); // Age calculated from birthdate
});
```

## Acceptance Criteria

- [ ] Birthdate field shows proper date picker (native or custom)
- [ ] Date picker is clickable and functional
- [ ] Cannot select future dates
- [ ] Form submits with correct YYYY-MM-DD format
- [ ] Age is calculated and displayed correctly
- [ ] Works on desktop and mobile browsers
- [ ] Accessible via keyboard (Tab, Enter, Arrows)
- [ ] All tests pass (unit + E2E)
- [ ] TypeScript build succeeds
- [ ] No console errors
- [ ] Field has clear visual styling

## Dependencies

- ✅ Input component: `src/components/ui/input.tsx`
- ⚠️ May need: `react-day-picker` (if custom picker required)
- ⚠️ May need: Calendar component (if custom picker required)
- ✅ Existing form validation

## Design Consistency

- Use existing design system colors (persian-green, charcoal)
- Match styling of other form fields (species, gender radio buttons)
- Clear focus states
- Error states if validation fails

## Notes

- **Current Bug**: Date input shows placeholder text instead of picker
- **Root Cause**: Likely CSS/styling issue or browser incompatibility
- **Priority**: HIGH - blocks users from adding pets
- **Estimated Fix Time**: 30-60 minutes
- **Testing Required**: Both unit and E2E tests
- **Rollout**: Deploy immediately after tests pass

## Related Files

- `src/components/pets/add-pet-dialog.tsx` (main component)
- `src/components/ui/input.tsx` (check for style conflicts)
- `src/app/api/pets/route.ts` (API - already correct)
- `src/components/pets/edit-pet-dialog.tsx` (should use same pattern)

## Success Metrics

- [ ] Users can successfully add pets with birthdates
- [ ] Zero console errors related to date input
- [ ] 100% test coverage for birthdate functionality
- [ ] Vercel build passes
- [ ] No regression in other form fields
