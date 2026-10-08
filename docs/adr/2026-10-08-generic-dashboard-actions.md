# ADR: Implement Generic Dashboard CRUD Actions

## Status
Accepted

## Context
Each dashboard entity (news, dosen, testimonials, programs, facilities, information, achievements, videos, popups, hero_slides) has its own actions.ts file containing nearly identical code: slugify function, validation logic, create/update/delete action functions, and revalidatePath calls. Only the entity-specific details differ: validation fields, data store functions called, and revalidatePath targets. Changing cross-cutting concerns requires editing all 10+ files.

## Decision
We will implement a generic CRUD action generator that reduces duplication in dashboard actions.ts files while maintaining the existing API compatibility.

## Consequences

### Positive
- **Reduced duplication**: Estimated 90% reduction in dashboard actions.ts duplication
- **Improved locality**: Validation logic and action behavior defined in one place
- **Increased leverage**: Improvements to CRUD actions require changes in only one location
- **Better testability**: Generic action functions can be tested independently

### Negative
- **Initial implementation effort**: Requires refactoring existing action files
- **Complexity of handling entity-specific variations**: Different entities have different validation fields, image handling, etc.
- **Learning curve**: Team needs to understand the generic action pattern

## Alternatives Considered

### 1. Maintain Status Quo (Keep Duplication)
- **Pros**: No implementation risk, maximal performance
- **Cons**: Continued code duplication, higher maintenance burden, inconsistency risk

### 2. Entity-Specific Actions with Shared Validation Helpers
- **Pros**: Reduces duplication in validation logic only
- **Cons**: Still requires per-entity action files, less reduction in duplication

### 3. Middleware or Wrapper Approach
- **Pros**: Wrap existing actions with common logic
- **Cons**: Doesn't eliminate the boilerplate of defining similar action functions

## Related Decisions
- Complements the generic CRUD service for data-store layer (ADR 2026-10-08-generic-crud-service)
- Enables further improvements like optimistic updates or standardized error handling

## References
- PRD: Product Requirements Document for UISB Marketing Website
- Design System: UISB Design Tokens and Specifications
