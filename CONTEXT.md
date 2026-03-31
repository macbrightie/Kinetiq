# Project Context & Intelligence (AI Guide)

This file serves as a persistent context guide for AI engineering assistants working on Kinetiq.

## Core Identity
Kinetiq is an "Elite Coach" platform. It should never feel like a generic CRM or generic fitness app. It should feel like a performance-driven, high-data-integrity intelligence tool.

## Technical Requirements (Non-Negotiable)

1.  **Icon Library**: ONLY use `lucide-react` for newer components or `iconsax-react` where established.
    - **Standard Icon Size**: `14px` by `14px` for consistency.
2.  **Buttons**: 
    - **Shape**: ALWAYS pill-shaped (`rounded-full`). Never just rounded corners.
    - **Font Weight**: Always `font-medium` (never bold or black).
    - **Hover States**: Always **Grey/Neutral** (`hover:bg-muted` or similar). Avoid blue, green, or brand colors for hover unless specifically requested as a feedback state.
    - **Padding**: Standardize on high horizontal padding for a premium look (e.g., `px-6` or `px-8` for large buttons).
3.  **Badges**:
    - **Shape**: Always pill-shaped (`rounded-full`).
    - **Padding**: Use specific padding of `12px` (left/right) and `4px` (top/bottom) for a "high-end" look.
    - **Icons**: Icons inside badges should be `12px`.
4.  **Authentication & Onboarding**: 
    - **Split-Screen Layout**: Entry flow (Sign-in/Sign-up) uses a left-form/right-cinematic-hero layout.
    - **Client Setup**: A structured multi-step flow (Welcome -> Profile -> Communication -> Integrations -> Success/Confetti).
    - **Theme Toggle**: Must be available and functional (Light/Dark mode) using the `.light`/`.dark` class strategy.
5.  **Typography**: 
    - Primary font: `Satoshi` or `Helvetica Neue` (check `globals.css`).
    - Use `font-plus-jakarta` for specific headings where imported.

## Domain Logic: Burnout Prediction
The "Burnout Prediction" is the "killer feature". It monitors:
- **Engagement decay**: Fewer comments, less frequent check-ins.
- **Adherence drift**: Missing scheduled sessions.
- **Physiological load**: Heart rate variability (via Strava) vs. perceived exertion.

Keep all AI-related messaging around "Predictive Intelligence" and "Proactive Intervention".
