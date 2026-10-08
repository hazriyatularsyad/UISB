# ADR: Implement Generic CRUD Service for Data Store Layer

## Status
Accepted

## Context
The data-store layer (`src/lib/data-store.ts`) contains significant duplication: for each of 10+ entity types, there are nearly identical CRUD functions (list*, adminList*, get*, create*, update*, delete*). This duplication makes changes repetitive and increases the risk of inconsistencies.

## Decision
We will implement a generic CRUD service that reduces duplication in the data-store layer while maintaining the existing API compatibility.

## Consequences

### Positive
- **Reduced duplication**: Estimated 80% reduction in data-store.ts lines of code
- **Improved locality**: Entity-specific configuration co-located rather than scattered across functions
- **Increased leverage**: Changes to CRUD behavior require modifications in only one place
- **Better testability**: Generic functions can be unit tested once

### Negative
- **Initial implementation effort**: Requires refactoring existing code
- **Potential performance overhead**: Generic service may have slight runtime impact compared to hand-optimized queries
- **Loss of SQL optimization opportunities**: Hand-written queries might be more efficient than generic ones

## Alternatives Considered

### 1. Maintain Status Quo (Keep Duplication)
- **Pros**: No implementation risk, maximal performance
- **Cons**: Continued code duplication, higher maintenance burden, inconsistency risk

### 2. Hooks-Only Approach for Client Components
- **Pros**: Good encapsulation for UI logic
- **Cons**: Doesn't work for server components or server actions, inconsistent architecture

### 3. Entity-Specific Services with Shared Base Class
- **Pros**: Some code reuse while maintaining entity-specific optimization
- **Cons**: Still requires per-entity files, less reduction in duplication than fully generic approach

## Related Decisions
- Consider implementing generic dashboard CRUD actions as a complementary improvement
- May revisit if performance profiling shows unacceptable overhead

## References
- PRD: Product Requirements Document for UISB Marketing Website
- Design System: UISB Design Tokens and Specifications
