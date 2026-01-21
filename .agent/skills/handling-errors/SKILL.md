---
name: handling-errors
description: Masters error handling patterns across languages including exceptions, Result types, and graceful degradation. Use when the user needs valid error handling strategies or debugging assistance.
---

# Error Handling Patterns

## When to use this skill
- Implementing error handling in new features
- Designing error-resilient APIs
- Debugging production issues
- Improving application reliability
- Creating better error messages for users and developers
- Implementing retry and circuit breaker patterns
- Handling async/concurrent errors
- Building fault-tolerant distributed systems

## Workflow
### Implementation Checklist
- [ ] **Analyze Failure Modes**: Identify what can go wrong (network, validation, resource exhaustion).
- [ ] **Choose Strategy**: Select Exception vs Result Type based on language and context.
- [ ] **Define Error Hierarchy**: Create specific error classes/types; avoid generic `Error`.
- [ ] **Implement Propagation**: Ensure errors bubble up with context (wrapping/stack traces).
- [ ] **Add Observability**: meaningful logs, metrics, and tracing.
- [ ] **Plan Recovery**: Implement retries, fallbacks, or graceful degradation.
- [ ] **User Feedback**: Design user-facing error messages (no stack traces to UI).

## Instructions

### Core Concepts

#### 1. Error Handling Philosophies

**Exceptions vs Result Types:**
- **Exceptions**: Traditional try-catch, disrupts control flow. Use for unexpected errors.
- **Result Types**: Explicit success/failure, functional approach. Use for expected errors, validation failures.
- **Error Codes**: C-style, requires discipline.
- **Option/Maybe Types**: For nullable values.

#### 2. The Pyramid of Error Handling
- **Level 1: Panic/Crash** (Development only) - Fail fast on unrecoverable configuration errors.
- **Level 2: Unchecked Exceptions** (Unexpected) - Database down, filesystem full. Bubble to top-level handler.
- **Level 3: Checked Exceptions/Result Types** (Expected) - User not found, validation error. Handle immediately.
- **Level 4: Graceful Degradation** (UX) - Show cached data or limited feature set instead of error page.

#### 3. Context & Propagation
- **Wrapping**: `try { ... } catch (e) { throw new OrderFailedException("...", e); }`
- **Context**: Attach IDs (User ID, Request ID) to errors.
- **Sanitization**: Strip sensitive data before logging.

### Language-Specific Patterns

#### JavaScript / TypeScript
```typescript
// Good: Type Guards and Custom Classes
class AppError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

// Result Pattern (using simple object or library like neverthrow)
type Result<T, E> = { ok: true, value: T } | { ok: false, error: E };

async function getUser(id: string): Promise<Result<User, AppError>> {
  try {
    const user = await db.find(id);
    if (!user) return { ok: false, error: new AppError('NOT_FOUND', 'User missing') };
    return { ok: true, value: user };
  } catch (e) {
    return { ok: false, error: new AppError('DB_ERROR', (e as Error).message) };
  }
}
```

#### Python
```python
# Good: Custom Exceptions & Context Manager
class ApplicationError(Exception):
    """Base class for application errors"""
    pass

class ResourceNotFoundError(ApplicationError):
    pass

def process_order(order_id: str):
    try:
        # Business logic
        pass
    except DatabaseError as e:
        # Chain exceptions to preserve stack trace
        raise ApplicationError(f"Order {order_id} failed") from e
```

#### Go
```go
// Good: Explicit Error Checking & Sentinel Errors
var ErrNotFound = errors.New("not found")

func GetUser(id string) (*User, error) {
    user, err := db.Query("...", id)
    if err != nil {
        if err == sql.ErrNoRows {
            return nil, fmt.Errorf("getting user %s: %w", id, ErrNotFound)
        }
        return nil, fmt.Errorf("database query failed: %w", err)
    }
    return user, nil
}
```

#### Rust
```rust
// Good: Result Type & ? Operator
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("data store disconnected")]
    Disconnect(#[from] io::Error),
    #[error("the data for key `{0}` is not available")]
    Redaction(String),
}

fn get_data(key: &str) -> Result<String, AppError> {
    let data = fs::read_to_string(key)?; // Auto-converts io::Error to AppError
    Ok(data)
}
```

## Common Pitfalls
- **Catching Too Broadly**: `except Exception` or `catch (e)` without re-throwing hides bugs.
- **Empty Catch Blocks**: Silently swallowing errors is dangerous. "Errors should never pass silently."
- **Logging and Re-throwing**: Creates duplicate log entries (one at catch, one at top level). Log OR re-throw.
- **Poor Error Messages**: "Error occurred" gives no clues. "Connection refused to 10.0.0.1:8080" is actionable.
- **Returning Error Codes**: Use exceptions or Result types for richer context.

## Resources
- [Node.js Error Handling Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Rust Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html)
- [Go Error Handling Guide](https://go.dev/blog/error-handling-and-go)
