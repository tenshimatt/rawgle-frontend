# OpenProject Task Template for Automated Testing

## Task Subject Format
```
[AUTO] Feature Name - Brief Description
```

Example: `[AUTO] AI Assistant - Add chat history persistence`

---

## Task Description Format

Use this template in the **Description** field of your OpenProject task:

```markdown
## Feature Requirements
[Describe what this feature should do - user-facing functionality]

## Technical Requirements
[List technical specifications, API endpoints, data models, etc.]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

---

### AUTOMATION METADATA (Required for n8n)

SPEC_FILE: /specs/features/feature-name.yml

GOOD_EXAMPLES: /examples/patterns/similar-feature-1.tsx, /examples/patterns/similar-feature-2.tsx

TARGET_FILES: /src/app/feature/page.tsx, /src/components/FeatureComponent.tsx, /src/app/api/feature/route.ts

---

## Testing Instructions
[How should this feature be tested manually?]

## Dependencies
- Related tasks: #123, #456
- External APIs: OpenAI, Stripe, etc.
```

---

## Example Filled Task

**Subject:** `[AUTO] Wishlist - Add bulk delete functionality`

**Description:**
```markdown
## Feature Requirements
Allow users to select multiple wishlist items and delete them all at once with a single button click.

## Technical Requirements
- Add checkbox selection UI to wishlist items
- Implement "Select All" functionality
- Add "Delete Selected" button
- Call DELETE /api/wishlist with array of item IDs
- Show confirmation modal before deletion
- Update UI after successful deletion
- Handle errors gracefully with toast notifications

## Acceptance Criteria
- [ ] User can select individual wishlist items via checkboxes
- [ ] User can select/deselect all items with "Select All" checkbox
- [ ] "Delete Selected" button is only enabled when items are selected
- [ ] Confirmation modal appears before deletion
- [ ] All selected items are deleted in a single API call
- [ ] UI updates immediately after successful deletion
- [ ] Error toast appears if deletion fails
- [ ] Unit tests cover selection logic
- [ ] E2E tests cover complete flow

---

### AUTOMATION METADATA

SPEC_FILE: /specs/features/wishlist-bulk-delete.yml

GOOD_EXAMPLES: /examples/patterns/bulk-selection.tsx, /examples/patterns/confirmation-modal.tsx, /src/app/cart/page.tsx

TARGET_FILES: /src/app/wishlist/page.tsx, /src/app/api/wishlist/route.ts, /src/components/wishlist/BulkDeleteModal.tsx

---

## Testing Instructions
1. Navigate to /wishlist
2. Add several items to wishlist
3. Click checkboxes to select items
4. Click "Delete Selected" button
5. Confirm deletion in modal
6. Verify items are removed from list
7. Test "Select All" functionality
8. Test error handling by disconnecting network

## Dependencies
- Related tasks: #234 (Wishlist feature)
- APIs: /api/wishlist (DELETE)
```

---

## Custom Fields (Optional - Create in OpenProject)

You can also create custom fields in OpenProject for cleaner metadata:

1. **Spec File Path** (Text field)
   - Format: `/specs/features/feature-name.yml`

2. **Good Examples** (Text field - Long)
   - Format: Comma-separated file paths

3. **Target Files** (Text field - Long)
   - Format: Comma-separated file paths

4. **Auto Test Status** (List field)
   - Options: Not Started, In Progress, Passed, Failed, Needs Review

5. **Test Results URL** (Text field)
   - Auto-populated by n8n with Jenkins build URL

---

## Status Workflow

Your OpenProject workflow should have these statuses:

1. **New** - Task created, not started
2. **In Progress** - **Triggers n8n automation** ⚡
3. **Testing** - Automated tests running
4. **Ready for Review** - Tests passed, awaiting code review
5. **Failed** - Tests failed, needs manual intervention
6. **Done** - Merged and deployed

---

## Webhook Configuration in OpenProject

1. Go to **OpenProject → Administration → Webhooks**
2. Create new webhook:
   - **Name:** n8n Auto Testing Pipeline
   - **URL:** `http://your-n8n-instance:5678/webhook/openproject-task-update`
   - **Events:** Work package updated
   - **Projects:** Select your project
   - **Enabled:** Yes

3. Test the webhook by moving a task to "In Progress"

---

## How It Works

1. You create a task using this template
2. Fill in the SPEC_FILE, GOOD_EXAMPLES, and TARGET_FILES
3. Move task to **"In Progress"** status
4. n8n receives webhook from OpenProject
5. n8n fetches spec file and examples from GitHub
6. n8n calls Claude API with comprehensive prompt
7. Claude generates complete code + tests
8. Jenkins runs tests in isolated environment
9. Results posted back to OpenProject as comment
10. Task status updated to "Ready for Review" or "Failed"
11. You review the code and merge if good

---

## Tips for Best Results

### Write Good Specs
- Be specific about UI/UX behavior
- Include error handling requirements
- Specify exact API contracts
- List all edge cases

### Choose Good Examples
- Pick examples that are similar in complexity
- Use examples that passed code review
- Include both component and API examples
- Make sure examples follow best practices

### Target Files
- List ALL files that need to be created/modified
- Include test files
- Include type definition files if needed
- Be specific with paths

### Testing Instructions
- Write manual testing steps
- Include edge cases to test
- Specify expected behavior
- Note any dependencies (logged in user, etc.)
