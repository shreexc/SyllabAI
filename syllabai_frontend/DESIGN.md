
 # SyllabAI UI/UX Design System Specification

> **Document Status**: Complete Reference Documentation  
> **Source of Truth**: Figma UI/UX Inspection Report  
> **Target Package**: `syllabai_frontend`  
> **Design Mode**: Desktop-First (1440 px Canvas Width)  
> **Verification Status**: Explicitly distinguished between Verified Figma Properties and Proposed Documentation Aliases / Inferred Semantics.

---

## Table of Contents
1. [A. Project Overview](#a-project-overview)
2. [B. Design Principles and Visual Identity](#b-design-principles-and-visual-identity)
3. [C. Typography System](#c-typography-system)
4. [D. Color Palette](#d-color-palette)
5. [E. Gradients](#e-gradients)
6. [F. Design Tokens](#f-design-tokens)
7. [G. Layout and Spacing](#g-layout-and-spacing)
8. [H. Border Radius, Shadows, and Effects](#h-border-radius-shadows-and-effects)
9. [I. Components and Reusable Patterns](#i-components-and-reusable-patterns)
10. [J. Complete Screen Inventory](#j-complete-screen-inventory)
11. [K. Assets and Icons](#k-assets-and-icons)
12. [L. Prototype Interactions and Navigation](#l-prototype-interactions-and-navigation)
13. [M. Accessibility and Quality Findings](#m-accessibility-and-quality-findings)
14. [N. Responsive Design Limitations](#n-responsive-design-limitations)
15. [O. Implementation Guidance for Future Frontend Work](#o-implementation-guidance-for-future-frontend-work)

---

## A. Project Overview

### 1. Visual Identity & Design Purpose
SyllabAI is an AI-powered educational platform designed to empower educators and learners with personalized learning materials (interactive animations, flashcards, practice quizzes, short notes, and AI conversational assistance). The visual identity conveys an inviting, modern academic aesthetic characterized by soft lavender foundations, elevated white container surfaces, radiant purple gradient actions, and a refined balance between classical serif headings and crisp sans-serif interface typography.

### 2. Scope of Figma Inspection & Verified Facts
The design system detailed in this document is derived from a complete inspection of the Figma source project. The verified baseline metrics are:

| Metric | Verified Value | Notes / Implications |
| :--- | :--- | :--- |
| **Figma Pages** | `1 accessible page` | All designs reside within a single canvas page. |
| **Top-Level Screen Frames** | `20 screens` | Design references `S01` through `S20`. |
| **Inspected Nodes** | `2,016 nodes` | Full on-page node hierarchy traversed. |
| **Font Families** | `4 families` | Inter, Ramaraja, Baskervville, DM Serif Display. |
| **Prototype Reactions** | `79 reactions` | 100% triggered by `ON_CLICK`. |
| **Local Paint Styles** | `1 local style` | Verified style named `button` (linear purple gradient). |
| **Local Text Styles** | `0 (None)` | No local text styles defined in Figma source. |
| **Local Effect Styles** | `0 (None)` | No local elevation/shadow styles defined. |
| **Local Grid Styles** | `0 (None)` | No layout grids attached to screen frames. |
| **Variable Collections** | `0 (None)` | No Figma variables or variable modes defined. |
| **Component Architecture** | `Independent artwork` | Most repeated UI patterns are drawn independently rather than instantiated from Figma components. |
| **Off-Screen Explorations** | `29 nodes` | Standalone floating elements positioned outside screen bounds. |

---

## B. Design Principles and Visual Identity

The platform's visual presentation follows eight core tenets identified across the 20 screen canvases.

> **Note on Terminology**: All functional and semantic classifications (such as "primary brand", "surface", "card", or "category accent") are **inferred semantic interpretations** to assist software engineering. They are not formal Figma tokens.

1. **Pale Lavender Canvas (`#F8F6FF`)**:  
   Every top-level screen frame rests upon a pale lavender background, establishing a softer, lower-contrast environment than pure white.
2. **Elevated White Surfaces & Cards (`#FFFFFF`)**:  
   Interactive modules, content cards, sidebars, and navigation bars sit as distinct white panels on top of the lavender base, typically with a `15px` corner radius.
3. **Radiant Purple Gradient Actions**:  
   Primary calls-to-action (CTAs) utilize a signature three-stop linear purple gradient (`#806CF4` → `#9E8FFA` → `#B8A8F8`), defined locally as the `button` paint style.
4. **Classical Serif Display Typography**:  
   Display headlines, hero phrases, statistics, and editorial greetings employ expressive serifs (**Ramaraja**, **Baskervville**, and **DM Serif Display**) to establish academic prestige and warmth.
5. **Clear Sans-Serif Interface Typography**:  
   Body copy, form inputs, button labels, navigation links, and administrative controls exclusively utilize **Inter** across multiple weights (300 to 700).
6. **Curved Geometries**:  
   Buttons, cards, search fields, pills, and modals employ rounded radii ranging from `8px` up to full pill shapes (`50px`), providing a tactile, student-friendly interface.
7. **Lavender Illustrations & Subject Tint Accents**:  
   Educational subjects and material types are differentiated through soft pastel badges (green, pink, blue, coral, peach, yellow) overlaid with semi-transparent alphas.
8. **Clean Educational Dashboard Shell**:  
   A consistent desktop application shell structures the product: a fixed-width left navigation rail (`340px`), a top horizontal search and action bar (`1016px`), and a main canvas beginning at coordinate `x = 420`.

---

## C. Typography System

### 1. Verified Font Families and Usage

Four distinct font families are used across the platform.

#### Inter
- **Classification**: Primary Sans-Serif UI Font.
- **Available Weights/Styles**:
  - Light (`300`)
  - Regular (`400`)
  - Medium (`500`)
  - Semi Bold (`600`)
  - Bold (`700`)
  - Italic (slant: `-10`)
- **Usage**: Interface copy, form inputs, navigation items, buttons, metadata tags, data tables, and general body text.

#### Ramaraja
- **Classification**: Display Serif Heading Font.
- **Available Weights/Styles**: Regular (`400`).
- **Verified Sizes**: `36px`, `48px`, `64px`, and `96px`.
- **Tracking (Letter Spacing)**: Typically `0%`; selected `64px` display headings use `5%`.
- **Line Height**: `AUTO`.
- **Usage**: High-impact editorial headings, large landing hero phrases, and authentication marketing statements.

#### Baskervville
- **Classification**: Editorial Serif Font.
- **Available Weights/Styles**:
  - Regular (`400`)
  - Italic (`400`, slant `-10`)
  - Medium (`500`)
  - SemiBold (`600`)
  - Bold (`700`)
- **Verified Sizes**: `20px`, `22px`, `24px`, `32px`, `36px`, `40px`, and `50px`.
- **Tracking**: `0%` across all verified occurrences.
- **Line Height**: `AUTO` for most headings; the `36px` italic authentication title on `S01` has an explicit line height of `110px`.
- **Usage**: Auth screen greetings, section headers, empty-state titles, and editorial introductory text.

#### DM Serif Display
- **Classification**: High-Contrast Modern Serif Font.
- **Available Weights/Styles**: Regular (`400`).
- **Verified Sizes**: `20px`, `36px`, `48px`, and `64px`.
- **Tracking (Letter Spacing)**: Typically `0%`; selected high-visibility statistic treatments use `5%`.
- **Line Height**: `AUTO`.
- **Usage**: The platform brand monogram "S" glyph (`36px`), selected dashboard statistic counters, and elevated card titles.

---

### 2. Verified Typography Reference Table

The following table itemizes all font family, weight, size, tracking, line height, and observed usage combinations extracted from the Figma source.

| Font Family | Style / Weight | Size (px) | Tracking | Line Height | Observed Usage Examples |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Inter** | Light (`300`) | `16px` | `0%` | `AUTO` | Secondary instructions, supporting body copy |
| **Inter** | Regular (`400`) | `14px` | `0%` | `AUTO` | Helper text, input hints, table cells |
| **Inter** | Regular (`400`) | `16px` | `0%` | `AUTO` | Standard body paragraphs, card description text |
| **Inter** | Regular (`400`) | `20px` | `0%` | `AUTO` | Input placeholder text, card metadata |
| **Inter** | Regular (`400`) | `35px` | `0%` | `AUTO` | Hero sub-headlines, large instructional statements |
| **Inter** | Italic (`400`, slant -10) | `12px` | `1%` | `AUTO` | Timestamp metadata, audit notes, sub-labels |
| **Inter** | Medium (`500`) | `8px` | `0%` | `AUTO` | Micro pill tags, compact badge indicators |
| **Inter** | Medium (`500`) | `12px` | `0%` | `AUTO` | Status chips, classroom enrollment tags |
| **Inter** | Medium (`500`) | `13px` | `0%` | `AUTO` | Secondary sidebar meta, compact list text |
| **Inter** | Medium (`500`) | `14px` | `0%` | `AUTO` | Filter pills, form labels, secondary button text |
| **Inter** | Medium (`500`) | `15px` | `0%` | `AUTO` | Card actions, secondary navigation items |
| **Inter** | Medium (`500`) | `15px` | `5%` | `AUTO` | Uppercase category labels, section subheaders |
| **Inter** | Medium (`500`) | `16px` | `0%` | `AUTO` | Primary button labels, table header titles |
| **Inter** | Medium (`500`) | `18px` | `0%` | `AUTO` | Modal subheadings, card section titles |
| **Inter** | Medium (`500`) | `20px` | `0%` | `AUTO` | Sidebar navigation links, major input text |
| **Inter** | Medium (`500`) | `20px` | `6%` | `AUTO` | Prominent input labels, feature titles |
| **Inter** | Medium (`500`) | `20px` | `10%` | `AUTO` | Tracked section labels, emphasis headers |
| **Inter** | Medium (`500`) | `24px` | `0%` | `AUTO` | Logo wordmark ("SyllabAI"), modal headlines |
| **Inter** | Medium (`500`) | `32px` | `0%` | `AUTO` | Large panel titles, step titles |
| **Inter** | Medium (`500`) | `36px` | `0%` | `AUTO` | Empty-state headings, banner statements |
| **Inter** | Semi Bold (`600`) | `12px` | `10%` | `AUTO` | Tracked badges, status pills |
| **Inter** | Semi Bold (`600`) | `15px` | `10%` | `AUTO` | Category badges, metadata headers |
| **Inter** | Semi Bold (`600`) | `16px` | `0%` | `AUTO` | Standard button text, bold list items |
| **Inter** | Semi Bold (`600`) | `16px` | `5%` | `AUTO` | Action button labels, card headings |
| **Inter** | Semi Bold (`600`) | `18px` | `0%` | `AUTO` | Classroom card titles, subject group headers |
| **Inter** | Semi Bold (`600`) | `20px` | `0%` | `AUTO` | Profile card names, dialog headers |
| **Inter** | Semi Bold (`600`) | `20px` | `5%` | `AUTO` | Tracked card headlines |
| **Inter** | Semi Bold (`600`) | `20px` | `6%` | `AUTO` | Emphasized feature labels |
| **Inter** | Semi Bold (`600`) | `20px` | `10%` | `AUTO` | Wide-spaced action headings |
| **Inter** | Semi Bold (`600`) | `22px` | `0%` | `AUTO` | Dashboard card titles, profile headers |
| **Inter** | Semi Bold (`600`) | `32px` | `6%` | `AUTO` | Metric titles, prominent card section heads |
| **Inter** | Bold (`700`) | `16px` | `0%` | `AUTO` | Primary emphasized actions, critical alerts |
| **Inter** | Bold (`700`) | `48px` | `6%` | `AUTO` | Hero numerical values, high-emphasis counters |
| **Ramaraja** | Regular (`400`) | `36px` | `0%` | `AUTO` | Section titles, feature banner headers |
| **Ramaraja** | Regular (`400`) | `48px` | `0%` | `AUTO` | Landing section heroes, major editorial headlines |
| **Ramaraja** | Regular (`400`) | `64px` | `0%` | `AUTO` | Hero titles, landing page value propositions |
| **Ramaraja** | Regular (`400`) | `64px` | `5%` | `AUTO` | Spaced hero headings |
| **Ramaraja** | Regular (`400`) | `96px` | `0%` | `AUTO` | Super-display landing page hero headlines |
| **Baskervville**| Regular (`400`) | `20px` | `0%` | `AUTO` | Narrative quotes, card subtitles |
| **Baskervville**| Regular (`400`) | `22px` | `0%` | `AUTO` | Editorial subtitles, modal greetings |
| **Baskervville**| Regular (`400`) | `24px` | `0%` | `AUTO` | Overview section introductions |
| **Baskervville**| Regular (`400`) | `32px` | `0%` | `AUTO` | Editorial card titles, empty-state titles |
| **Baskervville**| Regular (`400`) | `36px` | `0%` | `AUTO` | Welcome banners, role-selection greetings |
| **Baskervville**| Italic (`400`, slant -10) | `36px` | `0%` | `110px` | Auth screen title (`S01` "Welcome Back") |
| **Baskervville**| Medium (`500`) | `40px` | `0%` | `AUTO` | Editorial showcase titles |
| **Baskervville**| SemiBold (`600`)| `40px` | `0%` | `AUTO` | Emphasized editorial headings |
| **Baskervville**| Bold (`700`) | `50px` | `0%` | `AUTO` | Major editorial display headers |
| **DM Serif Display** | Regular (`400`) | `20px` | `0%` | `AUTO` | Card callouts, accent labels |
| **DM Serif Display** | Regular (`400`) | `36px` | `0%` | `AUTO` | Brand "S" monogram tile (`19×49px` bounding box) |
| **DM Serif Display** | Regular (`400`) | `48px` | `0%` | `AUTO` | Large numeric score counters |
| **DM Serif Display** | Regular (`400`) | `64px` | `0%` | `AUTO` | Primary statistic numbers |
| **DM Serif Display** | Regular (`400`) | `64px` | `5%` | `AUTO` | Spaced large performance metrics |

---

### 3. Proposed Documentation Typography Aliases
> **Notice**: The following aliases are proposed implementation suggestions for engineering consistency. They do not exist as native tokens in Figma.

```css
/* Proposed Typography Scale Aliases (Non-Figma Tokens) */
--text-display-hero:      400 96px/normal "Ramaraja", serif;
--text-display-h1:        400 64px/normal "Ramaraja", serif;
--text-display-h2:        400 48px/normal "Ramaraja", serif;
--text-editorial-title:   400 36px/110px "Baskervville", serif;
--text-editorial-h3:      400 32px/normal "Baskervville", serif;
--text-brand-stat:        400 64px/normal "DM Serif Display", serif;
--text-brand-stat-sm:     400 48px/normal "DM Serif Display", serif;
--text-ui-h1:             600 32px/normal "Inter", sans-serif;
--text-ui-h2:             600 22px/normal "Inter", sans-serif;
--text-ui-nav:            500 20px/normal "Inter", sans-serif;
--text-ui-button:         600 16px/normal "Inter", sans-serif;
--text-ui-body:           400 16px/normal "Inter", sans-serif;
--text-ui-body-sm:        400 14px/normal "Inter", sans-serif;
--text-ui-meta:           400 12px/normal "Inter", sans-serif;
--text-ui-micro:          500 8px/normal  "Inter", sans-serif;
```

---

## D. Color Palette

All color values listed below are verified from the Figma node fills and strokes. Both hexadecimal and exact 8-bit integer RGB equivalents are provided.

### 1. Core Surfaces, Brands, and Neutrals

| Inferred Semantic Name | Verified HEX | Verified RGB | Observed Usage | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `#F8F6FF` | `rgb(248, 246, 255)` | Screen frame default fill across all 20 screens | Verified Figma Node Fill |
| **White Surface** | `#FFFFFF` | `rgb(255, 255, 255)` | Cards, sidebar, header, search bar, modals | Verified Figma Node Fill |
| **Primary Text** | `#000000` | `rgb(0, 0, 0)` | Primary headlines, bold titles, critical data | Verified Figma Node Fill |
| **Primary Purple** | `#806CF4` | `rgb(128, 108, 244)` | Active nav icons, gradient stop 0, highlights | Verified Figma Node Fill |
| **Gradient Midpoint** | `#9E8FFA` | `rgb(158, 143, 250)` | Primary button gradient stop 0.5 | Verified Figma Node Fill |
| **Gradient Endpoint** | `#B8A8F8` | `rgb(184, 168, 248)` | Primary button gradient stop 1.0 | Verified Figma Node Fill |
| **Deep Purple** | `#6555C1` | `rgb(101, 85, 193)` | Display gradient stop, brand icon accents | Verified Figma Node Fill |
| **Dark Purple** | `#30285B` | `rgb(48, 40, 91)` | Monogram tile gradient start, deep headlines | Verified Figma Node Fill |
| **Empty-State Purple** | `#330BBD` | `rgb(51, 11, 189)` | Illustration accent in empty-state artwork | Verified Figma Node Fill |
| **Muted Text / Border** | `#756A6A` | `rgb(117, 106, 106)` | Secondary labels, body copy, neutral strokes | Verified Figma Node Fill/Stroke |
| **Authentication Title**| `#20243A` | `rgb(32, 36, 58)` | Welcome Back heading on `S01` | Verified Figma Node Fill |
| **Lavender Link Accent**| `#BF97D8` | `rgb(191, 151, 216)` | Text link ("Forgot password?", "Sign in") | Verified Figma Node Fill |
| **Student Account Purple**| `#7665F5`| `rgb(118, 101, 245)` | Student role selection badge / accent | Verified Figma Node Fill |
| **Lavender Badge** | `#DBD3FB` | `rgb(219, 211, 251)` | Tag background, inactive indicator fill | Verified Figma Node Fill |
| **Lavender Icon / Avatar**| `#D7D1FA`| `rgb(215, 209, 250)` | Default avatar background, icon backplates | Verified Figma Node Fill |
| **Chat Surface** | `#F0ECFE` | `rgb(240, 236, 254)` | AI Assistant conversation card background | Verified Figma Node Fill |
| **Neutral Border** | `#B3B3B3` | `rgb(179, 179, 179)` | Search bar border, input outlines | Verified Figma Node Stroke |
| **Neutral Fill** | `#D9D9D9` | `rgb(217, 217, 217)` | Image placeholders, skeleton surfaces | Verified Figma Node Fill |
| **Light Neutral Stroke**| `#DEDEDE` | `rgb(222, 222, 222)` | Subtle container dividers, panel borders | Verified Figma Node Stroke |
| **Subject Card Border** | `#E5E0F5` | `rgb(229, 224, 245)` | Classroom / Subject card outer strokes | Verified Figma Node Stroke |
| **Subject Divider** | `#E0DDDD` | `rgb(224, 221, 221)` | Card internal horizontal dividing lines | Verified Figma Node Stroke |
| **Subject Card Text** | `#4B465D` | `rgb(75, 70, 93)` | Subject description, secondary card text | Verified Figma Node Fill |
| **Class Code Label** | `#464343` | `rgb(70, 67, 67)` | Join classroom prompt, code field label | Verified Figma Node Fill |
| **Subject Icon Stroke** | `#757575` | `rgb(117, 117, 117)` | Vector icon strokes inside subject cards | Verified Figma Node Stroke |
| **Class Icon Stroke** | `#555555` | `rgb(85, 85, 85)` | Class management gear/pencil action icons | Verified Figma Node Stroke |
| **Continue Surface** | `#EFEFEF` | `rgb(239, 239, 239)` | Inactive next/continue button background | Verified Figma Node Fill |
| **Header CTA Text** | `#FCF7F7` | `rgb(252, 247, 247)` | Light button typography on dark backgrounds | Verified Figma Node Fill |

---

### 2. Verified Accent, Category, and State Colors

The educational modules, analytics, and subject classifications use verified distinct accents:

| Semantic Purpose | Verified HEX | Verified RGB | Paint Opacity | Observed Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Educator Green** | `#7EDA84` | `rgb(126, 218, 132)` | `100%` | Educator role surface, teacher CTA |
| **Positive Score Green**| `#49B24F` | `rgb(73, 178, 79)` | `100%` | Passing score badge, upward progress indicator |
| **Destructive Text** | `#CA4A4A` | `rgb(202, 74, 74)` | `100%` | "Delete Account" label, warning text |
| **Destructive Border** | `#DC3B3E` | `rgb(220, 59, 62)` | `100%` | Danger confirmation action border |
| **History Score Pink** | `#F45FC5` | `rgb(244, 95, 197)` | `100%` | History quiz score indicator |
| **Animation Green** | `#BCFFAD` | `rgb(188, 255, 173)` | `~35%` | Animation material card accent fill |
| **Quiz Pink** | `#FFA4E2` | `rgb(255, 164, 226)` | `~29%` | Practice Quiz material card accent fill |
| **Flashcard Blue** | `#D0EDFA` | `rgb(208, 237, 250)` | `~48%` | Flashcard material card accent fill |
| **Chat Coral** | `#FF8D8F` | `rgb(255, 141, 143)` | `50%` | AI Chat pill badge accent fill |
| **Idea Yellow** | `#FFF599` | `rgb(255, 245, 153)` | `50%` | Tips / suggestion action surface fill |
| **Resource Peach** | `#FFBEA1` | `rgb(255, 190, 161)` | `~35%` or `~48%`| Learning resource container tint |
| **Streak Orange** | `#E3764B` | `rgb(227, 118, 75)` | `100%` | Study streak flame icon, day count tag |
| **Workflow Blue** | `#3D53D0` | `rgb(61, 83, 208)` | `100%` | Landing page workflow step badge |
| **Decorative Pink** | `#FDEAFD` | `rgb(253, 234, 253)` | `100%` | Background decorative swirl / splash |
| **Decorative Lavender**| `#EDE2FF` | `rgb(237, 226, 255)` | `100%` | Card illustration background circle |
| **Biology Header** | `#394E55` | `rgb(57, 78, 85)` | `100%` | Biology class card header surface |
| **Physics Header** | `#423B58` | `rgb(66, 59, 88)` | `100%` | Physics class card header surface |
| **Chemistry Header** | `#533955` | `rgb(83, 57, 85)` | `100%` | Chemistry class card header surface |
| **Biology Avatar** | `#BDCACE` | `rgb(189, 202, 206)` | `100%` | Biology instructor avatar circle |
| **Physics Avatar** | `#9C93BA` | `rgb(156, 147, 186)` | `100%` | Physics instructor avatar circle |
| **Chemistry Avatar** | `#A27EA5` | `rgb(162, 126, 165)` | `100%` | Chemistry instructor avatar circle |

> **Note on Precision**: In Figma's underlying JSON data, RGB channels are represented as 32-bit floating-point numbers between `0.0` and `1.0`. For example, `#806CF4` translates to `{r: 0.50196, g: 0.42353, b: 0.95686}`. Differences in floating-point rounding may occasionally yield minor rounding discrepancies (e.g., `128` vs `127.99`). The values in this document reflect direct 8-bit conversions. They must not be silently normalized or mapped to external standard Tailwind palettes during implementation.

---

## E. Gradients

All gradients in the Figma file are documented below with their exact color stops, alphas, and transforms.

### 1. Primary Button Gradient (Local Paint Style: `button`)
- **Type**: `GRADIENT_LINEAR`
- **Figma Local Style Name**: `button` (The only local paint style in the file)
- **Transform**: `[[1, 0, 0], [0, 1, 0]]` (Direct vertical progression top-to-bottom)
- **Overall Opacity**: `1.0`
- **Color Stops**:
  - `Stop 0.00`: `#806CF4` (Alpha: `1.0`)
  - `Stop 0.50`: `#9E8FFA` (Alpha: `1.0`)
  - `Stop 1.00`: `#B8A8F8` (Alpha: `1.0`)
- **Usage**: Primary button surfaces, active state pills, hero action triggers.

### 2. Display Text Radial Gradient
- **Type**: `GRADIENT_RADIAL`
- **Color Stops**:
  - `Stop 0.00`: `#30285B` (Alpha: `1.0`)
  - `Stop 1.00`: `#6555C1` (Alpha: `1.0`)
- **Usage**: Hero decorative typography on landing screens.

### 3. Sign-In Text Linear Gradient
- **Type**: `GRADIENT_LINEAR`
- **Color Stops**:
  - `Stop 0.0000000`: `#30285B` (Alpha: `1.0`)
  - `Stop 0.5961538`: `#6555C1` (Alpha: `1.0`)
- **Usage**: "Sign in to SyllabAI" and major authentication headings.

### 4. Brand Tile Diamond Gradient
- **Type**: `GRADIENT_DIAMOND`
- **Color Stops**:
  - `Stop 0.00`: `#30285B` (Alpha: `1.0`)
  - `Stop 1.00`: `#6555C1` (Alpha: `1.0`)
- **Usage**: Sidebar top-left logo tile background.

### 5. Single-Stop Gradients (Artifacts of Figma Vector Creation)
- **Educator CTA Fill**: `GRADIENT_LINEAR` with single stop `#7EDA84`. Rendered visually as solid `#7EDA84`.
- **Platform Badge Text**: `GRADIENT_LINEAR` with single stop `#111112`. Rendered visually as solid `#111112`.

> **Implementation Note**: In CSS/Tailwind, standard linear gradient angles (e.g. `180deg` or `to bottom`) should be used to visually recreate the linear Figma transforms `[[1, 0, 0], [0, 1, 0]]`. Do not invent non-standard angles.

---

## F. Design Tokens

> **Disclaimer**: The following CSS variables are **proposed documentation aliases** designed to assist future React/Tailwind developers. They **do not exist** as native Figma variables in the design file. Do not inject them into source code until explicitly scheduled.

```css
:root {
  /* ==========================================================================
     Surfaces & Canvas (Proposed Aliases)
     ========================================================================== */
  --color-background:         #F8F6FF;
  --color-surface:            #FFFFFF;
  --color-surface-chat:       #F0ECFE;
  --color-surface-continue:   #EFEFEF;

  /* ==========================================================================
     Typography & Text (Proposed Aliases)
     ========================================================================== */
  --color-text-primary:       #000000;
  --color-text-muted:         #756A6A;
  --color-text-auth-title:    #20243A;
  --color-text-card:          #4B465D;
  --color-text-header-cta:    #FCF7F7;
  --color-link-lavender:      #BF97D8;

  /* ==========================================================================
     Brand Purple & Gradients (Proposed Aliases)
     ========================================================================== */
  --color-brand-primary:      #806CF4;
  --color-brand-mid:          #9E8FFA;
  --color-brand-light:        #B8A8F8;
  --color-brand-deep:         #6555C1;
  --color-brand-dark:         #30285B;
  --color-brand-student:      #7665F5;
  --color-brand-badge:        #DBD3FB;
  --color-brand-avatar:       #D7D1FA;
  --gradient-primary-button:  linear-gradient(180deg, #806CF4 0%, #9E8FFA 50%, #B8A8F8 100%);

  /* ==========================================================================
     Borders & Dividers (Proposed Aliases)
     ========================================================================== */
  --color-border-neutral:     #B3B3B3;
  --color-border-subtle:      #DEDEDE;
  --color-border-card:        #E5E0F5;
  --color-divider-card:       #E0DDDD;

  /* ==========================================================================
     Category Accents & States (Proposed Aliases)
     ========================================================================== */
  --color-educator-green:     #7EDA84;
  --color-success-green:      #49B24F;
  --color-destructive-text:   #CA4A4A;
  --color-destructive-border: #DC3B3E;
  --color-history-pink:       #F45FC5;
  --color-streak-orange:      #E3764B;
  --color-workflow-blue:      #3D53D0;

  /* Category card background tints with verified alphas */
  --color-tint-animation:     rgba(188, 255, 173, 0.35); /* #BCFFAD @ 35% */
  --color-tint-quiz:          rgba(255, 164, 226, 0.29); /* #FFA4E2 @ 29% */
  --color-tint-flashcard:     rgba(208, 237, 250, 0.48); /* #D0EDFA @ 48% */
  --color-tint-chat:          rgba(255, 141, 143, 0.50); /* #FF8D8F @ 50% */
  --color-tint-idea:          rgba(255, 245, 153, 0.50); /* #FFF599 @ 50% */
  --color-tint-resource:      rgba(255, 190, 161, 0.48); /* #FFBEA1 @ 48% */

  /* Subject Header Fills */
  --color-subject-biology:    #394E55;
  --color-subject-physics:    #423B58;
  --color-subject-chemistry:  #533955;

  /* ==========================================================================
     Typography Families (Proposed Aliases)
     ========================================================================== */
  --font-ui:                  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display:             "Ramaraja", serif;
  --font-editorial:           "Baskervville", serif;
  --font-brand-numerals:      "DM Serif Display", serif;

  /* ==========================================================================
     Elevations & Radii (Proposed Aliases)
     ========================================================================== */
  --radius-xs:                2px;
  --radius-sm:                8px;
  --radius-md:                10px;
  --radius-surface:           15px;
  --radius-card-lg:           20px;
  --radius-role-card:         25px;
  --radius-chat-box:          40px;
  --radius-pill:              50px;
  --radius-circle:            100px;

  --shadow-default:           0px 4px 4px rgba(0, 0, 0, 0.25);
}
```

---

## G. Layout and Spacing

### 1. Root Screen Frame Metrics
- **Canvas Width**: `1440px` fixed across all 20 screen roots.
- **Root Auto Layout**: `NONE`. Frames use absolute coordinate positioning.
- **Root Padding**: `0px`.
- **Root Item Spacing**: `0px`.
- **Root Layout Grids**: `None`.
- **Clipping**: `clipsContent: true` across all top-level frames.
- **Wrapping**: All text and layout containers specify `NO_WRAP`.

### 2. Shared Desktop Application Shell Geometry
The dashboard and authenticated workspaces share an explicit desktop shell layout:

```
0px                       374px   395px                               1411px 1440px
|---------------------------|-------|-----------------------------------|------|
| (x=34)                    | gap   | (x=395)                           | clear|
| SIDEBAR CONTAINER         | =21px | HEADER CONTAINER                  | =29px|
| Width:  340px             |       | Width:  1016px, Height: 79px      |      |
| Height: 955px             |       | Radius: 15px, Fill: #FFFFFF       |      |
| Radius: 15px              |       |-----------------------------------|      |
| Fill:   #FFFFFF           |       | (x=430, y=48) SEARCH INPUT        |      |
|                           |       | Width: 501px, Height: 42px        |      |
|                           |       | Border: 1px #B3B3B3, Radius: 15px  |      |
|                           |       |-----------------------------------|      |
|                           |       | (x=420)                           |      |
|                           |       | MAIN WORKSPACE CONTENT AREA        |      |
|                           |       | (Content clearance to sidebar: 46)|      |
```

#### Exact Coordinate References:
- **Sidebar**:
  - `x = 34`, `y = 30`, `width = 340px`, `height = 955px`.
  - Surface: `#FFFFFF`, corner radius `15px`.
  - Logo Monogram Tile: `x = 70`, `y = 47`. Glyph box `19 × 49px`, DM Serif Display Regular `36px`.
  - Wordmark ("SyllabAI"): `x = 120`, `y = 57`, box `93 × 29px`, Inter Medium `24px`.
  - Navigation Icon Bounding Box: `26 × 26px`.
  - Navigation Item Text: Inter Medium `20px`.
  - Profile / Sign-Out Action Surface: `51 × 48px`.
- **Top Header**:
  - Standard Screens (`S05–S16`, `S19–S20`): `x = 395`, `y = 30`, `width = 1016px`, `height = 79px`, radius `15px`, fill `#FFFFFF`.
  - Shifted Screens (`S17`, `S18`): `x = 395`, `y = 33` (shifted down by `3px`), `height = 79px`.
- **Search Bar**:
  - Standard Screens: `x = 430`, `y = 48`, `width = 501px`, `height = 42px`, border `1px #B3B3B3`, radius `15px`.
  - Shifted Screens (`S17`, `S18`): `y = 51`.
  - Search Icon: `x = 444`, `y = 56` (`25 × 25px`).
  - Search Inset: `35px` from header left, `18px` from header top.
- **Main Workspace Start**: `x = 420` (providing `46px` of clearance from the sidebar right edge at `x = 374`).
- **Right Clearance**: `29px` between header right edge (`x = 1411`) and frame edge (`1440px`).

> **Clearance vs. Spacing Tokens Notice**: In the Figma source, spacing between elements is the mathematical result of absolute coordinates. These measured clearances represent layout observations, not an established design token scale (e.g., 4px or 8px grid).

### 3. Verified Auto Layout Sub-Containers
While screen frames do not use Auto Layout, specific nested components feature explicit Auto Layout parameters:

| Element Description | Direction | Padding (T/R/B/L) | Gap | Corner Radius |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Button CTA** | Horizontal | `12px 24px 12px 24px` | `10px` | `15px` |
| **Filter Pill Tag** | Horizontal | `6px 16px 6px 16px` | `8px` | `50px` |
| **Subject Card Icon Container** | Vertical | `8px 8px 8px 8px` | `0px` | `10px` |
| **Chat Suggestion Action** | Horizontal | `10px 18px 10px 18px` | `10px` | `40px` |
| **Streak Badge** | Horizontal | `4px 12px 4px 8px` | `6px` | `50px` |
| **PDF Upload Drop Surface** | Vertical | `40px 20px 40px 20px` | `16px` | `15px` |
| **Class Code 6-Digit Inset** | Horizontal | `8px 12px 8px 12px` | `12px` | `8px` |

---

## H. Border Radius, Shadows, and Effects

### 1. Border Radius Inventory
Every verified non-zero radius in the source file maps to specific component categories:

| Radius | Observed Usage |
| :--- | :--- |
| **`2px`** | Internal table cell indicators, micro badge accents |
| **`8px`** | Small thumbnail containers, class code digit boxes, tag chips |
| **`10px`** | Icon container backgrounds, small status alerts |
| **`14px`** | Intermediate modal elements, tooltips |
| **`15px`** | **Standard UI Surface**: Sidebar, top header, content cards, auth inputs, search bar |
| **`20px`** | Medium modal dialogues, large subject preview cards |
| **`25px`** | **Role Selection Surfaces**: Student and Educator selection cards on `S04` |
| **`40px`** | **Chat Entry Surface**: AI conversation message input bar on `S16` |
| **`50px`** | **Filter Pills & Status Chips**: History filter buttons, streak pills |
| **`90px`** | Large decorative background vector blobs |
| **`100px`** | Fully circular avatars, notification badges, floating action triggers |

### 2. Stroke & Border Rules
- **Standard Input & Card Borders**: `1px` solid (`#B3B3B3`, `#E5E0F5`, `#DEDEDE`).
- **Destructive Action Borders**: `2px` solid `#DC3B3E` (used for account deletion confirmation).
- **Upload Dropzones**: `1px` dashed stroke with dash pattern `[5, 5]` and `#B3B3B3`.

### 3. Shadows & Effects
- **Verified Drop Shadow**:
  - `type`: `DROP_SHADOW`
  - `color`: `rgba(0, 0, 0, 0.25)` (Black at `25%` opacity)
  - `offset`: `{ x: 0, y: 4 }`
  - `radius` (blur): `4px`
  - `spread`: `0px`
  - `blendMode`: `NORMAL`
  - `visible`: `true`
- **Effect Styles**: There are **zero** named local effect styles in the Figma file. All shadows are inline object effects.

---

## I. Components and Reusable Patterns

> **Component Notice**: The patterns below appear repeatedly across multiple frames. However, in the Figma source, they are constructed as **independent artwork groups and frames**, not linked Figma Component instances. They are documented here as pattern specifications for frontend engineering.

### 1. Authentication Inputs & Buttons (`S01`, `S03`)
- **Input Fields**:
  - Dimensions: `450px × 56px` (Note: `S03` has variations; see Section M).
  - Background: `#FFFFFF`.
  - Border: `1px` solid `#B3B3B3`, radius `15px`.
  - Text: Inter Regular `20px`, `#756A6A` placeholder fill.
- **Primary Auth Button**:
  - Dimensions: `450px × 56px`.
  - Background: Linear gradient (`#806CF4` → `#9E8FFA` → `#B8A8F8`).
  - Text: Inter Semi Bold `20px`, fill `#FFFFFF`, center aligned.
  - Radius: `15px`.

### 2. Role-Selection Surfaces (`S04`)
- **Card Dimensions**: `380px × 460px`.
- **Card Background**: `#FFFFFF`, radius `25px`, shadow `0px 4px 4px rgba(0,0,0,0.25)`.
- **Student Card Accent**: `#7665F5` accent pill, student character illustration.
- **Educator Card Accent**: `#7EDA84` accent pill, teacher character illustration.
- **Card Action**: Inter Semi Bold `20px`, radius `15px`.

### 3. Landing Page Content Modules (`S02`)
- **Workflow Step Cards**: White surface, radius `15px`, numbered step badge with `#3D53D0`, step title Inter Semi Bold `22px`.
- **Feature Cards**: White surface, radius `15px`, pastel icon backplate (`#D7D1FA`), title Baskervville `32px`.
- **Audience Comparison Panels**: Split panels for educators and students, contrasting `#806CF4` and `#7EDA84`.
- **FAQ Accordion Items**: White surface, radius `15px`, border `1px #E5E0F5`, question Inter Medium `20px`.

### 4. Shared Application Shell (`S05–S20`)
- **Sidebar**: Fixed `340 × 955px`, radius `15px`, `#FFFFFF`. Contains monogram, navigation links, and bottom profile capsule.
- **Top Header**: `1016 × 79px`, radius `15px`, `#FFFFFF`. Contains search input (`501 × 42px`) and notification actions.
- **Navigation Item**: `280 × 50px`, active state features `#806CF4` background or text highlight.

### 5. Educational Material Preparation & Empty States (`S05–S09`, `S20`)
- **Empty State Panel**: Centered white card (`880 × 540px`), radius `15px`.
- **Illustration**: Pastel circle (`160 × 160px`) with vector graphic (pencil, cards, lightbulb).
- **Heading**: Baskervville Regular `32px` or `36px`, color `#20243A`.
- **CTA**: Gradient button `240 × 50px`, Inter Semi Bold `16px`.

### 6. Upload & File Drop Panel (`S05`, `S08`)
- **Drop Area**: `720 × 280px`, dashed border `1px [5, 5]` `#B3B3B3`, background `#F8F6FF`, radius `15px`.
- **File Types Listed**: "PDF, DOCX, TXT up to 50MB".
- **Upload Icon**: Centered `48 × 48px` upload vector graphic.

### 7. Join-Class & 6-Digit Entry (`S12`)
- **Modal Surface**: `640 × 440px`, `#FFFFFF`, radius `20px`.
- **Digit Entry Cells**: 6 individual input boxes, each `52 × 64px`, border `1px #B3B3B3`, radius `8px`.
- **Digit Typography**: Inter Semi Bold `32px`, centered.

### 8. Subject and Classroom Cards (`S10`, `S11`, `S13`, `S14`)
- **Dimensions**: `300 × 260px` or `440 × 220px`.
- **Header Band**: Distinct subject background (`#394E55` Biology, `#423B58` Physics, `#533955` Chemistry).
- **Card Body**: `#FFFFFF`, border `1px #E5E0F5`, radius `15px`.
- **Avatar Capsule**: Instructor avatar (`40 × 40px`) overlapping the header seam.

### 9. History Table & Filters (`S15`)
- **Filter Bar**: Pill buttons (`50px` radius), active fill `#806CF4`, inactive `#FFFFFF` with `1px #B3B3B3`.
- **Table Rows**: Height `64px`, bottom border `1px #E0DDDD`, typography Inter Regular `14px`.

### 10. AI Chat Experience (`S16`)
- **Main Chat Card**: `1016 × 860px`, `#FFFFFF`, radius `15px`.
- **Message Bubbles**:
  - User: Gradient fill (`#806CF4`), text `#FFFFFF`, radius `15px` with bottom-right notch.
  - SyllabAI Assistant: `#F0ECFE` fill, text `#000000`, radius `15px` with bottom-left notch.
- **Input Pill**: Height `56px`, radius `40px`, border `1px #B3B3B3`, send button circle `40 × 40px`.

### 11. Student Analytics Dashboard (`S17`, `S19`)
- **Stat Cards**: `230 × 140px`, `#FFFFFF`, radius `15px`.
- **Metric Figure**: DM Serif Display `48px` or `64px`.
- **Recent Session Surface**: Full-width card with horizontal progress indicator bars.

### 12. Profile and Security Management (`S18`)
- **Setting Section Panels**: `#FFFFFF`, radius `15px`, padding `32px`.
- **Delete Account Action**: Border `2px #DC3B3E`, text `#CA4A4A`, radius `15px`.

---

## J. Complete Screen Inventory

All 20 top-level frames have a fixed canvas width of `1440px`. The heights and observed layouts vary as documented below:

| Ref | Verified Screen Name | Dimensions | Primary Layout / Key Features |
| :--- | :--- | :--- | :--- |
| **S01** | `Authentication / Sign In` | `1440 × 1024` | Centered split modal: left brand graphic (`#30285B`), right login form, Baskervville `36px` italic title (`lineHeight: 110px`), input fields, gradient CTA. |
| **S02** | `Landing Page` | `1440 × 3393` | Long-form presentation canvas: navigation header, Ramaraja hero (`96px`), workflow steps (`#3D53D0`), audience split, FAQ accordion, footer. |
| **S03** | `Student Registration` | `1440 × 1024` | Multi-field sign-up panel: first name, last name, email, password, role selection indicator, gradient CTA. Starting point for prototype. |
| **S04** | `Role Selection` | `1440 × 1024` | Split role-picker: Student card (`#7665F5`, radius `25px`) and Educator card (`#7EDA84`, radius `25px`), Baskervville heading. |
| **S05** | `Educational Animations` | `1440 × 1024` | Standard app shell (`340px` sidebar, `1016px` header), animation generation empty state, dashed upload dropzone, green pastel tint (`#BCFFAD`). |
| **S06** | `Teaching Animations` | `1440 × 1024` | Educator animation management view: curriculum module list, video generator queue, preview thumbnails. |
| **S07** | `Teaching Flashcards` | `1440 × 1024` | Flashcard deck creation workspace: deck name input, prompt box, card count indicator, blue pastel tint (`#D0EDFA`). |
| **S08** | `Practice Quizzes` | `1440 × 1024` | Student quiz generation view: topic input, question quantity selector, pink pastel tint (`#FFA4E2`), empty-state illustration. |
| **S09** | `Teaching Quizzes` | `1440 × 1024` | Educator assessment manager: test authoring card, answer key generator, rubric configuration panel. |
| **S10** | `Classroom Selection` | `1440 × 1024` | Grid of classroom cards (`300 × 260px`): Biology, Physics, Chemistry subject headers with instructor avatars. |
| **S11** | `Classroom Selection (Alt Destinations)` | `1440 × 1024` | Visually identical to `S10` but wired with distinct click destinations in the Figma prototype graph. |
| **S12** | `Join Class Screen` | `1440 × 1024` | Overlay modal with 6-digit verification code input cells (`52 × 64px`, radius `8px`), "Enter 6-character code" instruction. |
| **S13** | `My Subjects` | `1440 × 1024` | Student course overview: 6 subject cards with completion progress bars, colored category icons, vertical card layout. |
| **S14** | `My Classes` | `1440 × 1024` | Active enrollment dashboard: class schedule list, assignment deadlines, teacher contact badges. |
| **S15** | `History` | `1440 × 1165` | Extended height frame: filter pills (`All`, `Quizzes`, `Notes`, `Flashcards`), chronological session rows, score badges (`#F45FC5`, `#49B24F`). |
| **S16** | `AI Chat` | `1440 × 1024` | Conversational interface: chat history container (`#F0ECFE`), prompt bubble stream, suggestion chips (`#FFF599`), `40px` radius input pill. |
| **S17** | `Student Dashboard / Overview` | `1440 × 1145` | Extended height frame: header shifted to `y=33`, summary metrics, streak badge (`#E3764B`), horizontal session list (clipping bug present). |
| **S18** | `Profile and Security` | `1440 × 1286` | Extended height frame: user avatar, personal info inputs, password change group, destructive "Delete Account" button (`#DC3B3E`). |
| **S19** | `Dashboard with Class Management` | `1440 × 1432` | Tallest workspace frame: teacher metrics, class roster management cards, attendance tracking modules, score texts. |
| **S20** | `Study Flashcards` | `1440 × 1024` | Student flashcard study mode: central flip-card component (`600 × 380px`), flip trigger, next/prev navigation controls. |

### Off-Screen Exploration Elements
- An inventory of **29 off-screen nodes** exists in the Figma canvas positioned at coordinates outside the `1440 × H` screen boundaries (e.g., negative X or Y coordinates > 4000).
- These elements represent raw icon iterations, color swatches, discarded button experiments, and typography pairing tests. They are not complete screens and must not be implemented as routes.

---

## K. Assets and Icons

### 1. Raster Image Hashes
The Figma report identifies five unique embedded raster image assets referenced by SHA-1 hash strings.

| Asset Ref | Verified Image Hash | Display Sizes Observed | Screen Occurrences | Description / Content |
| :--- | :--- | :--- | :--- | :--- |
| **IMG-01** | `b856a9e14a1c1d0f...` | `340 × 955px`, `450 × 1024px` | `S01`, `S03` | Authentication decorative artwork (deep purple wave / learning graphic) |
| **IMG-02** | `fa27c6504d3e8b12...` | `120 × 120px`, `160 × 160px` | `S05`, `S08` | Empty-state student mascot / learning illustration |
| **IMG-03** | `3d91e847c2a04e55...` | `40 × 40px`, `64 × 64px` | `S10`, `S11`, `S18` | Default user avatar photograph / illustrated placeholder |
| **IMG-04** | `c481d9f33b1e7a64...` | `300 × 160px` | `S13`, `S14` | Subject card decorative banner graphic (science laboratory apparatus) |
| **IMG-05** | `7a12e4318c09d2ef...` | `540 × 360px` | `S02` | Landing page hero product mockup / preview illustration |

> **Asset Asset Notice**: Original image source filenames, uncompressed vectors, and licensing origins are **UNAVAILABLE** in the Figma inspection data. Engineering must export clean SVGs or high-resolution PNGs directly from Figma or provide production equivalents. Do not invent remote asset URLs.

### 2. Platform Brand Monogram
- **Brand Geometry**: Rounded square tile with linear/diamond gradient (`#30285B` → `#6555C1`).
- **Brand Glyph**: Capital letter "S" set in **DM Serif Display Regular `36px`**, color `#FFFFFF`, bounding box `19 × 49px`.
- **Wordmark**: Text string "SyllabAI" set in **Inter Medium `24px`**, color `#000000` or `#FFFFFF` depending on surface.

### 3. Icon Namespaces & Vector Layers
Layer naming conventions in Figma demonstrate distinct icon categories:
- `icon/nav/*`: `dashboard`, `subjects`, `classes`, `animations`, `flashcards`, `quizzes`, `chat`, `history`, `settings`. Standard bounding size: `26 × 26px`.
- `icon/action/*`: `search` (`25 × 25px`), `upload`, `filter`, `close`, `more-vertical`, `arrow-right`.
- `icon/subject/*`: `biology-dna`, `physics-atom`, `chemistry-flask`. Vector stroke width: `1.5px` or `2px`, color `#757575`.
- `icon/feedback/*`: `streak-flame` (`#E3764B`), `score-star` (`#F45FC5`), `success-check` (`#49B24F`).

---

## L. Prototype Interactions and Navigation

### 1. Prototype Reaction Characteristics
- **Total Recorded Reactions**: `79 interactions`.
- **Trigger Type**: `100% ON_CLICK` (No hover, drag, keypress, or timer triggers exist).
- **Action Types**: `NAVIGATE` (between frames) and `SCROLL_TO` (landing page anchor jumps).
- **Animation Transitions**: `SMART_ANIMATE` or `DISSOLVE`.
- **Easing & Duration**: `EASE_OUT`, duration `300ms` (`0.3s`).
- **Verified Starting Points**:
  - `S03` (Student Registration) — Primary user onboarding prototype flow.
  - `S02` (Landing Page) — Public marketing site prototype flow.

### 2. Verified Screen-to-Screen Navigation Matrix

The 79 prototype click interactions establish the following primary screen transitions:

| Source Screen | UI Element Clicked | Action Type | Destination Screen | Notes / Anomalies |
| :--- | :--- | :--- | :--- | :--- |
| **S02 (Landing)** | "Get Started" CTA | `NAVIGATE` | **S03** (Student Reg) | Enters onboarding flow |
| **S02 (Landing)** | "Sign In" Nav Link | `NAVIGATE` | **S01** (Sign In) | Direct auth flow |
| **S02 (Landing)** | "Features" Nav Link | `SCROLL_TO`| **S02** (#features) | Smooth scroll to anchor |
| **S02 (Landing)** | "Explore Notes" Card | `NAVIGATE` | **S20** (Flashcards) | Mismatched label anomaly |
| **S01 (Sign In)** | "Create account" Link| `NAVIGATE` | **S03** (Student Reg) | Auth toggle |
| **S01 (Sign In)** | "Sign In" Button | `NAVIGATE` | **S17** (Dashboard) | Simulates student login |
| **S03 (Reg)** | "Next" / "Submit" CTA | `NAVIGATE` | **S04** (Role Picker) | Proceeds to role choice |
| **S04 (Role)** | "Student" Card | `NAVIGATE` | **S10** (Classrooms) | Enters student workspace |
| **S04 (Role)** | "Educator" Card | `NAVIGATE` | **S06** (Teach Anim) | Enters teacher workspace |
| **S05 (Animations)**| Sidebar: "Quizzes" | `NAVIGATE` | **S08** (Quizzes) | Nav rail transition |
| **S05 (Animations)**| Sidebar: "Flashcards" | `NAVIGATE` | **S20** (Flashcards) | Nav rail transition |
| **S05 (Animations)**| Sidebar: "Chat" | `NAVIGATE` | **S16** (AI Chat) | Nav rail transition |
| **S06 (Teach Anim)**| Sidebar: "Quizzes" | `NAVIGATE` | **S09** (Teach Quiz) | Teacher nav rail |
| **S06 (Teach Anim)**| Sidebar: "Flashcards" | `NAVIGATE` | **S07** (Teach Cards)| Teacher nav rail |
| **S10 (Classes)** | "+ Join Class" Button | `NAVIGATE` | **S12** (Join Class) | Opens code input screen |
| **S10 (Classes)** | Biology Card Click | `NAVIGATE` | **S13** (My Subjects) | Opens subject detail |
| **S11 (Classes Alt)**| Card Click | `NAVIGATE` | **S14** (My Classes) | Alternative click path |
| **S12 (Join Class)**| "Cancel" / "Back" Icon| `NAVIGATE` | **S10** (Classes) | Dismisses modal |
| **S13 (Subjects)** | "History" Sidebar | `NAVIGATE` | **S15** (History) | History view transition |
| **S17 (Dashboard)**| "Profile" Bottom Card | `NAVIGATE` | **S18** (Profile) | Profile configuration |
| **S18 (Profile)** | "Dashboard" Sidebar | `NAVIGATE` | **S17** (Dashboard) | Return navigation |
| **S19 (Teach Dash)**| "Overview" Sidebar | `NAVIGATE` | **S06** (Teach Anim) | Teacher dashboard flow |

> **Prototype vs. Implementation Reality**: The existence of a prototype wire in Figma does **not** signify functioning backend logic. Features such as file processing, RAG indexing, chat responses, class joining, and account deletion must be wired to real API endpoints during engineering, not assumed complete from Figma.

---

## M. Accessibility and Quality Findings

### 1. Contrast Ratio Audit (WCAG 2.1 Compliance)
An inspection of text-to-background and UI-component contrast reveals several compliance flags:

| Screen / Element | Foreground HEX | Background HEX | Measured Ratio | WCAG AA Status (Normal Text) | Finding / Action Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S01**: Lavender Link ("Forgot?") | `#BF97D8` | `#FFFFFF` | **`2.44:1`** | **FAIL** (< 4.5:1) | Low contrast link. Review for darken pass. |
| **S05**: Purple User Name | `#806CF4` | `#FFFFFF` | **`3.91:1`** | **FAIL** (< 4.5:1) | Fails normal text AA; passes large text. |
| **S19**: Green Score Indicator | `#7EDA84` | `#FFFFFF` | **`2.70:1`** | **FAIL** (< 4.5:1) | Low contrast green data text. |
| **S18**: Destructive Action Text | `#CA4A4A` | `#FFFFFF` | **`4.59:1`** | **PASS** (>= 4.5:1) | Accessible warning label. |
| **S02**: Muted Body Copy | `#756A6A` | `#FFFFFF` | **`5.22:1`** | **PASS** (>= 4.5:1) | Accessible neutral paragraph text. |
| **S10**: White on Biology Header | `#FFFFFF` | `#394E55` | **`8.77:1`** | **PASS** (AAA >= 7.0:1) | High accessibility card header. |
| **S10**: White on Physics Header | `#FFFFFF` | `#423B58` | **`10.48:1`** | **PASS** (AAA >= 7.0:1) | High accessibility card header. |
| **S10**: White on Chemistry Header | `#FFFFFF` | `#533955` | **`10.09:1`** | **PASS** (AAA >= 7.0:1) | High accessibility card header. |
| **Primary CTA**: White on Stop 0 | `#FFFFFF` | `#806CF4` | **`3.91:1`** | **FAIL** (< 4.5:1) | Gradient start fails normal text. |
| **Primary CTA**: White on Stop 0.5 | `#FFFFFF` | `#9E8FFA` | **`2.71:1`** | **FAIL** (< 4.5:1) | Gradient midpoint fails normal text. |
| **Primary CTA**: White on Stop 1.0 | `#FFFFFF` | `#B8A8F8` | **`2.10:1`** | **FAIL** (< 4.5:1) | Gradient end severely low contrast. |
| **Educator CTA**: White on Green | `#FFFFFF` | `#7EDA84` | **`1.71:1`** | **FAIL** (< 4.5:1) | Highly illegible button combination. |
| **Search / Field Stroke**: Border | `#B3B3B3` | `#FFFFFF` | **`2.10:1`** | **FAIL** (< 3.0:1 non-text) | Fails non-text UI component contrast. |
| **Card Border**: Subtle Outline | `#E5E0F5` | `#FFFFFF` | **`1.29:1`** | **FAIL** (< 3.0:1 non-text) | Decorative boundary only; cannot rely on border alone. |

---

### 2. Layout, Geometrical, and Visual Inconsistencies
Engineering must be aware of the following visual bugs observed in the Figma file. **Do not fix these silently**; preserve the reference data and track them for future design passes:

1. **S17 Canvas Boundary Overflow**:  
   In `S17` (Student Dashboard), stat card elements and recent activity blocks extend to `x = 1480px` (beyond the `1440px` frame). Because `clipsContent: true` is set, these metrics are silently truncated on screen.
2. **S03 Form Input Dimensional Discrepancies**:  
   On `S03` (Registration), form input heights vary between `54px`, `56px`, and `58px`, and input widths vary between `448px` and `452px`, indicating manual dragging rather than component reuse.
3. **S13 / S14 Vertical Card Misalignment**:  
   Adjacent subject cards in `S13` have small vertical offsets (`y = 184px` vs `y = 187px`), resulting in a `3px` jitter across the row.
4. **S17 / S18 Shell Header Shift**:  
   The application header and search input sit at `y = 33` and `y = 51` on `S17` and `S18`, whereas all other 14 shell screens position them at `y = 30` and `y = 48`.
5. **Inconsistent Typography Tracking**:  
   Identical font sizes and styles use arbitrary tracking values across different cards (e.g. Inter Medium 20px appears with `0%`, `6%`, and `10%` tracking across adjacent screens).
6. **Leading Spaces in Content Strings**:  
   Several classroom names contain accidental leading whitespaces (e.g., `" Class 10 - Biology"`).
7. **Overlapping & Redundant Layer Nodes**:  
   Several screen frames contain identical duplicate vector paths stacked directly on top of each other with identical fills.
8. **Mismatched Prototype Destination**:  
   On `S02`, the card labeled "Explore Notes" is wired to navigate to `S20` (Flashcards) instead of a notes view.
9. **Spelling and Grammar Defects in Source Artwork**:  
   The source canvas includes several copy errors:
   - `"EXPLAINATIONS"` (misspelled on feature card)
   - `"ceck your sctivity"` (misspelled subheader on dashboard)
   - `"distarction free reading reading notes"` (duplicated word and spelling mistake)

---

## N. Responsive Design Limitations

The Figma design inspected is strictly desktop-oriented. Engineering must adhere to the following limitations:

1. **Fixed 1440 px Baseline**:  
   All 20 screen roots are set to exactly `1440px` width.
2. **Zero Mobile / Tablet Viewports**:  
   There are **no mobile screens, tablet frames, or intermediate responsive states** in the Figma file.
3. **No Breakpoint Tokens**:  
   The Figma file defines no responsive breakpoint tokens (e.g. `sm`, `md`, `lg`, `xl`).
4. **Behavior at Narrow Viewports is Unverified**:  
   How the `340px` sidebar, `1016px` header, or grid of cards should collapse, wrap, or stack on screens below `1440px` is **UNAVAILABLE** and **NEEDS CONFIRMATION**.
5. **Implementation Guidance**:  
   Do not arbitrarily invent responsive rules that alter the `1440px` layout. When responsive CSS/Tailwind rules are introduced in future tasks, the desktop view at `1440px` must match this specification exactly, and mobile layouts must be explicitly reviewed with stakeholders.

---

## O. Implementation Guidance for Future Frontend Work

When implementing the Next.js/Tailwind frontend, developers must follow these principles:

1. **Preserve Exact Visual Properties**:  
   Maintain verified colors, font families, corner radii, and elevations. Do not substitute generic Tailwind colors (e.g., do not replace `#806CF4` with Tailwind's default `purple-600` `#9333EA`).
2. **Handle Non-Component Artwork Systematically**:  
   Because repeated elements in Figma are independent artwork rather than linked components, abstract them cleanly into reusable React components (e.g. `<Sidebar />`, `<Header />`, `<SubjectCard />`, `<StatCard />`, `<ChatBubble />`).
3. **Treat Proposed CSS Variables as Reference Aliases**:  
   The CSS variables listed in Section F are documentation suggestions. Integrate them into `globals.css` or Tailwind configuration only when beginning frontend implementation.
4. **Confirm Unresolved Specifications**:  
   Before finalizing implementation passes, obtain design confirmation on:
   - Mobile and tablet responsive behavior.
   - Contrast remediation for low-contrast text and buttons.
   - Clarification of typo corrections and prototype anomalies.
   - Vector SVG asset exports for brand and illustration graphics.
5. **Preserve Documentation Integrity**:  
   This document must remain the single source of truth for design measurements. Any future updates to the UI must be reflected here with a clear distinction between verified Figma data and engineering additions.
