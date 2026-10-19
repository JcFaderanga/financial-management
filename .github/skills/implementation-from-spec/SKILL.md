---
name: implementation-from-spec
description: "Use when implementing a feature or change from a provided requirements, prompt, or specification file; read the full source first, follow it as authoritative, and verify every requirement."
---

# Implement from a Source Specification

Use the identified requirements file as the source of truth. This workflow is for implementing changes, not merely reviewing or summarizing a specification.

## Procedure

1. Identify the exact source file the user wants implemented. If multiple plausible files exist and the intended one is unclear, ask which file to use before changing application code.
2. Read the entire source file before making changes. Capture its requirements, constraints, existing behavior expectations, edge cases, and acceptance criteria.
3. Inspect the relevant codebase and existing tests. Follow its architecture, naming, formatting, localization, and established patterns; reuse existing components and utilities where appropriate.
4. Compare the source requirements with the existing behavior. Implement each requested change without inventing requirements, altering unrelated behavior, or refactoring unrelated code.
5. Preserve existing functionality unless the source explicitly requires a change. Address validation and edge cases specified by the source.
6. Review the complete diff against the source requirement by requirement. Keep directly related documentation up to date.
7. Run the smallest relevant tests, lint, or build checks available. Report what was changed, key implementation decisions, any limitation, and the validation performed.

## Guardrails

- Treat the selected source file as authoritative; do not skip minor requirements or silently reinterpret them.
- Inspect surrounding code and patterns before resolving ambiguity. Ask the user when ambiguity remains consequential.
- If a requirement cannot be implemented as written, explain the limitation instead of substituting an unrequested behavior.
- Keep changes precise, maintainable, and limited to the requested scope.
