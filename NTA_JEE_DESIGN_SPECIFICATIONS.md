# Official NTA JEE Main Exam Interface Design Specifications

## Executive Summary
This document contains detailed design specifications extracted from official NTA JEE Main reference materials, including the complete exam window layout, color scheme, typography, and UI component styling.

---

## 1. COLOR SCHEME

### Primary Colors
| Color Name | Hex Code | Usage |
|-----------|----------|--------|
| **Navy Blue (Dark)** | `#0a2a6e` | Primary headers, active states, main accent |
| **Blue (Medium)** | `#1a4da0` | Secondary backgrounds, meta sections, borders |
| **Gold** | `#c8950a` | Emphasis, accents, special highlights, NTA branding |
| **Gold (Light)** | `#fdf3d6` | Gold background tint, instruction boxes |

### Supporting Colors
| Color Name | Hex Code | Usage |
|-----------|----------|--------|
| **Green** | `#1a7a3a` | Correct answers, success states, marks (+4) |
| **Red** | `#c0392b` | Wrong answers, danger alerts, negative marks (-1) |
| **Orange** | `#f5a623` | Warning states, review flags |
| **Purple** | `#7b1fa2` | Marked for review status |

### Neutral Colors
| Color Name | Hex Code | Usage |
|-----------|----------|--------|
| **Light Background** | `#f5f7fa` | Main page background |
| **Section Background** | `#eaf0fa` | Section headers, section tabs |
| **Light Blue** | `#dce8f8` | Option hover states, light backgrounds |
| **Border Color** | `#b0bed4` | Card borders, dividers |
| **Text Dark** | `#1a1a1a` | Primary text |
| **Text Muted** | `#555555` | Secondary text, metadata |
| **White** | `#ffffff` | Card backgrounds, option backgrounds |

---

## 2. TYPOGRAPHY

### Font Families
```css
/* Serif Font - For question text and formal content */
Font Stack: 'EB Garamond', Georgia, serif
Weights: 400 (Regular), 500 (Medium), 600 (Semibold)
Use Cases:
  - Question text
  - Question numbers
  - Option text
  - Timer display

/* Sans-serif Font - For UI and labels */
Font Stack: 'Source Sans 3', Arial, sans-serif
Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
Use Cases:
  - Headers and titles
  - Labels and metadata
  - Buttons
  - Instructions
```

### Size Standards
| Element | Size | Weight | Case |
|---------|------|--------|------|
| Page Title (H1) | 22px | 600 | Regular |
| Section Headers | 13px | 600 | Regular, letter-spacing 0.5px |
| Question Number | 13px | 700 | Regular (Serif) |
| Question Text | 15.5px | 400 | Regular (Serif) |
| Option Text | 15px | 400 | Regular (Serif) |
| Label Text | 12px | 400 | Uppercase, letter-spacing 0.8px |
| Metadata | 12px | 400 | Regular |
| Small Text | 10px | 400 | Uppercase, letter-spacing varies |

---

## 3. LAYOUT STRUCTURE

### Overall Window Layout
```
┌─────────────────────────────────────────────────────┐
│  TOOLBAR (Sticky, z-index: 100)                      │
│  - Logo/Timer | Title | Buttons                      │
└─────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────┐
│                    MAIN EXAM PAGE                     │
│  ┌─────────────────────────────────────────────┐     │
│  │ HEADER                                       │     │
│  │ - NTA Emblem (60x60px)                       │     │
│  │ - Title: "Joint Entrance Examination (Main)"│     │
│  │ - Subtitle: "Paper X (B.E./B.Tech) Session"│     │
│  └─────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────┐    │
│  │ META INFO ROW (4 columns grid)                │    │
│  │ [Date] [Shift] [Total Marks] [Duration]     │    │
│  └──────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐    │
│  │ INSTRUCTIONS BOX                              │    │
│  │ - Gold background (#fdf3d6)                  │    │
│  │ - Gold left border (4px)                     │    │
│  │ - List of exam rules                         │    │
│  └──────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐    │
│  │ MARKING SCHEME (3-column flex layout)         │    │
│  │ [MCQ Scheme] [Integer Scheme] [Score Summary]│    │
│  └──────────────────────────────────────────────┘    │
│                                                       │
│  REPEATED FOR EACH SECTION:                         │
│  ┌──────────────────────────────────────────────┐    │
│  │ SECTION HEADER (Dark blue background)        │    │
│  │ SECTION A — PHYSICS                          │    │
│  │ (Questions 1–20 · MCQ · +4 / −1)            │    │
│  └──────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐    │
│  │ QUESTION CARDS (stacked vertically)          │    │
│  │ - Question header with number and tag        │    │
│  │ - Question text and image                    │    │
│  │ - Options (2-column grid)                    │    │
│  │ - Status indicators                          │    │
│  └──────────────────────────────────────────────┘    │
│                                                       │
│  ┌──────────────────────────────────────────────┐    │
│  │ LEGEND / STATUS INDICATORS                   │    │
│  │ - Answered | Marked | Skipped | Review       │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### Exam Window (Interactive Mode) Layout
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (h-14 / 56px height)                                 │
│ [Quiz Title] [Timer Icon + Time] [Submit Button] [Menu Icon]│
│ Background: Navy (#0a2a6e) | Text: White                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SECTION TABS ROW (py-2, overflow-x-auto)                   │
│ [PHYSICS] [CHEMISTRY] [MATHEMATICS]                        │
│ Background: Light Blue (#eaf0fa) | Border: #dde2f0         │
│ Active: Navy bg, White text | Inactive: Gray text          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                            │ │
│ MAIN QUESTION AREA                                  SIDEBAR│ │
│                                                            │ │
│ ┌──────────────────────────────────────┐  ┌─────────────┐│ │
│ │ Q# of Total | Marks [+4] [-1]        │  │ QUESTIONS   ││ │
│ ├──────────────────────────────────────┤  │ PALETTE     ││ │
│ │ Question Text (serif, 15.5px)        │  │             ││ │
│ │ [Image if exists]                    │  │ [Grid of    ││ │
│ │                                      │  │  question   ││ │
│ │ OPTIONS (2x2 or 1x4 grid)           │  │  numbers]   ││ │
│ │ [A] Option A                        │  │             ││ │
│ │ [B] Option B                        │  │ Legend:     ││ │
│ │ [C] Option C (selected)             │  │ • Answered  ││ │
│ │ [D] Option D                        │  │ • Reviewed  ││ │
│ │                                      │  │ • Visited   ││ │
│ │                                      │  │ • Skipped   ││ │
│ └──────────────────────────────────────┘  └─────────────┘│ │
│                                                            │ │
│ ┌──────────────────────────────────────────────────────┐ │ │
│ │ [Mark for Review] [Prev] [Save & Next]  │ │
│ │ (Footer)                                 │ │
│ └──────────────────────────────────────────────────────┘ │ │
│                                                            │ │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. HEADER SECTION

### Header Top (height: auto, padding: 16px 28px)
- **Emblem**: 60×60px SVG circle with NTA branding
- **Title Container**:
  - Main Title: "Joint Entrance Examination (Main) — 2025"
  - Font: EB Garamond, 22px, weight 600
  - Subtitle: "Paper 1 (B.E./B.Tech) · Session 1"
  - Font: 12px, opacity 75% white
- **Border Bottom**: 2px solid gold (#c8950a)

### Header Meta Row
- **Layout**: CSS Grid with 4 equal columns
- **Background**: Navy blue (#1a4da0)
- **Column Items**: Date | Shift | Total Marks | Duration
- **Item Layout**:
  - Label: 10px, uppercase, letter-spacing 0.8px, 65% opacity
  - Value: 13px, font-weight 600
  - Padding: 9px 16px
  - Border-right: 1px solid rgba(255,255,255,0.15) (except last)

---

## 5. FOOTER SECTION

### Footer (height: auto, padding: 14px 24px)
- **Border-Top**: 2px solid navy (#0a2a6e)
- **Background**: Light section background (#eaf0fa)
- **Layout**: Flex with space-between
- **Text Color**: Muted gray (#555)
- **Font Size**: 12px
- **Content**:
  - Left: Status/Info text
  - Right: Action buttons

---

## 6. TIMER / CLOCK STYLING

### Position & Display
- **Sticky Position**: Top of page, z-index: 100
- **Toolbar Display**: Center-right of header
- **Font**: EB Garamond Serif
- **Size**: 22px
- **Weight**: 600
- **Default Color**: Navy (#0a2a6e)
- **Warning Color**: Red (#c0392b) when < 5 minutes (with blink animation)

### Timer Format
```
HHH:MM:SS  (e.g., "03:00:00" for 3 hours)
or
MM:SS      (e.g., "45:32" for under 1 hour)
```

### Animation
```css
@keyframes blink {
  50% { opacity: 0.5; }
}
.timer.warning { animation: blink 1s step-end infinite; }
```

---

## 7. QUESTION DISPLAY FORMAT

### Question Card Structure
```
┌─────────────────────────────────────────┐
│ Q-HEADER (bg: #eaf0fa, padding: 8px 14px)
│ [Q. Number] ─────────────────────── [Tag]
├─────────────────────────────────────────┤
│ Q-BODY (padding: 14px 16px)
│ [Question Text - Serif 15.5px]
│ [Image if present - max-height 200px]
├─────────────────────────────────────────┤
│ OPTIONS (Grid: 2 columns, gap: 8px)
│ [A] [Option Text]    [B] [Option Text]
│ [C] [Option Text]    [D] [Option Text]
├─────────────────────────────────────────┤
│ Q-STATUS (padding: 8px 14px, bg: #fafbfd)
│ [Dot] Status Label
└─────────────────────────────────────────┘
```

### Question Header (Q-Header)
- **Background**: #eaf0fa (light section)
- **Padding**: 8px 14px
- **Display**: Flex between
- **Borders**: 1px solid #b0bed4 bottom
- **Q-Number**:
  - Font: EB Garamond, 13px, bold, navy color
  - Format: "Q. 1", "Q. 21", etc.
- **Q-Tag**:
  - Font: 10px, weight 500
  - Padding: 2px 8px
  - Border-radius: 20px (pill shape)
  - Background colors:
    - MCQ: Navy (#1a4da0)
    - Integer: Dark green (#0a6e5a)
    - Numerical: Purple (#6b35a0)
  - Text: White

### Question Body (Q-Body)
- **Padding**: 14px 16px
- **Question Text**:
  - Font: EB Garamond, 15.5px, line-height 1.7
  - Color: #1a1a1a
  - Margin-bottom: 14px
  - Supports `<em>` for emphasis (italics)
- **Question Image** (if present):
  - Max-width: 100%
  - Max-height: 200px
  - Border: 1px dashed #b0bed4
  - Border-radius: 4px
  - Padding: 20px
  - Margin-bottom: 12px
  - Background: #eaf0fa

### Question Status (Q-Status)
- **Padding**: 8px 14px
- **Border-Top**: 1px solid #b0bed4
- **Background**: #fafbfd
- **Layout**: Flex with gap 8px, flex-wrap
- **Font**: 11px
- **Status Dot**: 8×8px circle
  - Green (#1a7a3a): Answered
  - Purple (#7b1fa2): Marked
  - Gray (#aaa): Skipped
  - Orange (#e67e22): Review

---

## 8. OPTIONS DISPLAY FORMAT

### Options Container
- **Layout**: CSS Grid
- **Columns**: 2 (for MCQ-Single), 1 (responsive)
- **Gap**: 8px
- **Responsive**: @media (max-width: 700px) → 1 column

### Single Option
- **Display**: Flex with gap 10px, align-items flex-start
- **Padding**: 9px 12px
- **Border**: 1px solid #b0bed4
- **Border-radius**: 4px
- **Cursor**: pointer
- **User-select**: none
- **Transitions**: border-color 0.15s, background 0.15s

### Option States
| State | Border Color | Background Color |
|-------|-------------|------------------|
| Default | #b0bed4 | white |
| Hover | #1a4da0 | #dce8f8 |
| Selected | #1a4da0 | #dce8f8 |
| Correct Answer | #1a7a3a | #e6f5eb |
| Wrong Answer | #c0392b | #fceaea |

### Option Label (Circle with Letter)
- **Size**: 22×22px
- **Border-radius**: 50% (circle)
- **Border**: 1.5px solid #1a4da0
- **Display**: Flex centered
- **Font**: 11px, weight 700, navy color
- **Flex-shrink**: 0
- **Margin-top**: 1px

### Option Label States
| State | Background | Border Color | Text Color |
|-------|-----------|-------------|-----------|
| Default | transparent | #1a4da0 | #1a4da0 |
| Selected | #1a4da0 | #1a4da0 | white |
| Correct | #1a7a3a | #1a7a3a | white |
| Wrong | #c0392b | #c0392b | white |

### Option Text
- **Font**: EB Garamond Serif, 15px, line-height 1.5
- **Color**: #1a1a1a
- **Flex**: 1

---

## 9. INTEGER / NUMERIC TYPE INPUT

### Input Container
- **Display**: Flex with gap 12px
- **Align-items**: center
- **Margin-top**: 6px

### Label
- **Font-size**: 13px
- **Color**: #555 (muted)

### Input Field
- **Width**: 120px
- **Padding**: 7px 10px
- **Border**: 1.5px solid #b0bed4
- **Border-radius**: 4px
- **Font**: Source Sans 3, 15px
- **Text-align**: center
- **Color**: #1a1a1a
- **Focus State**:
  - Outline: none
  - Border-color: #1a4da0

---

## 10. QUESTION PALETTE / SIDEBAR

### Palette Container
- **Position**: Fixed (in print mode) / Relative (in interactive mode)
- **Width**: 200px (print) / 288px (interactive with w-72)
- **Background**: white
- **Border**: 1px solid #b0bed4
- **Border-radius**: 6px (interactive), 4px (print)
- **Box-shadow**: 0 4px 20px rgba(0,0,0,0.12)
- **Z-index**: 50
- **Max-height**: 340px with overflow-y-auto
- **Font-size**: 12px

### Palette Title
- **Background**: Navy (#0a2a6e)
- **Color**: white
- **Padding**: 8px 12px
- **Font-weight**: 600
- **Font-size**: 12px

### Palette Grid
- **Display**: CSS Grid
- **Columns**: 5 equal
- **Gap**: 4px
- **Padding**: 10px
- **Max-height**: 340px with overflow-y-auto

### Question Number Button (Palette Item)
- **Width**: 30px
- **Height**: 30px
- **Border**: 1.5px solid #b0bed4
- **Border-radius**: 4px
- **Background**: #eaf0fa (default)
- **Font-size**: 11px
- **Font-weight**: 600
- **Cursor**: pointer
- **Display**: Flex centered
- **Color**: #1a1a1a
- **Transition**: background 0.1s

### Palette Button States
| State | Background | Border Color | Text Color |
|-------|-----------|-------------|-----------|
| Default | #eaf0fa | #b0bed4 | #1a1a1a |
| Hover | #dce8f8 | #1a4da0 | #1a1a1a |
| Current | #1a4da0 | #0a2a6e | white |
| Answered | #c8ecd4 | #1a7a3a | #0a3d1a |
| Marked | #e8d5f5 | #7b1fa2 | varies |

---

## 11. NAVIGATION BUTTONS & CONTROLS

### Main Navigation Bar (Section Tabs)
- **Layout**: Flex with gap 1px
- **Padding**: 6px 24px (y-padding 2) (interactive: varies)
- **Overflow-x**: auto (scrollable on mobile)
- **Background**: #eaf0fa (interactive: section-bg)
- **Border-bottom**: 1px solid #dde2f0 (interactive: lightBorder)

### Section Tab Button
- **Padding**: 3px 12px (print) / responsive (interactive)
- **Font-size**: 13px (print) / text-xs (interactive)
- **Font-weight**: 600
- **Text-transform**: uppercase
- **Whitespace-nowrap**: true
- **Border-radius**: 4px (print) / varies (interactive)
- **Cursor**: pointer
- **Transition**: 0.15s

### Section Tab States
| State | Background | Text Color | Shadow |
|-------|-----------|-----------|---------|
| Active | #0a2a6e | white | 0 2px 8px rgba(0,0,0,0.3) |
| Inactive | transparent | #666 | none |
| Hover | white / 50% | #666 | varies |

### Action Buttons (Bottom Footer)

#### Previous / Next Navigation
- **Padding**: 6px 14px (print) / 2px (interactive icon)
- **Border-radius**: 4px
- **Font-size**: 13px (print) / icon-sized (interactive)
- **Font-weight**: 600
- **Border**: 1px or 1.5px solid #b0bed4 or #0a2a6e
- **Disabled State**: opacity 30%

#### Standard Button
- **Padding**: 8px 20px (print) / 12px 24px (interactive)
- **Border-radius**: 4px
- **Font**: inherit, 13px, weight 600
- **Cursor**: pointer
- **Border**: 1.5px solid
- **Transition**: 0.15s

#### Button Variants

**Outline (Default)**
- Background: white
- Border-color: #1a4da0
- Text-color: #1a4da0
- Hover: background #dce8f8

**Solid (Primary)**
- Background: #0a2a6e
- Border-color: #0a2a6e
- Text-color: white
- Hover: background #1a4da0

**Submit (Success)**
- Background: #1a7a3a
- Border-color: #1a7a3a
- Text-color: white

**Danger**
- Background: #c0392b
- Border-color: #c0392b
- Text-color: white

**Warning (Flag/Review)**
- Background: transparent / 8% tint
- Border: 2px solid #f5a623
- Text-color: #f5a623

---

## 12. SECTION TABS LAYOUT & STYLING

### Section Header (Before Questions)
- **Background**: Navy (#0a2a6e)
- **Color**: white
- **Padding**: 10px 24px
- **Font-size**: 13px
- **Font-weight**: 600
- **Letter-spacing**: 0.5px
- **Display**: Flex justify-between
- **Margin-top**: 8px

### Section Header Content
- **Left**: Section name (e.g., "SECTION A — PHYSICS")
- **Right Info**:
  - Font-size: 11px
  - Color: rgba(255,255,255,0.7)
  - Font-weight: 400
  - Format: "Questions 1–20 · MCQ · +4 / −1"

### Interactive Section Tabs (Top of Question Area)
- **Sticky/Flex**: Row layout with overflow-x-auto
- **Gap**: 1px between tabs
- **Padding**: py-2 px-6
- **Background**: #eaf0fa

---

## 13. INSTRUCTIONS BOX

### Container
- **Background**: #fdf3d6 (gold-light)
- **Border**: 1px solid #e8c96b
- **Border-left**: 4px solid #c8950a (gold)
- **Margin**: 20px 24px
- **Padding**: 14px 18px
- **Border-radius**: 2px
- **Font-size**: 13px

### Title
- **Color**: #c8950a
- **Font-size**: 12px
- **Text-transform**: uppercase
- **Letter-spacing**: 1px
- **Font-weight**: 700
- **Margin-bottom**: 8px

### Instructions List
- **Padding-left**: 18px
- **List-item margin-bottom**: 5px
- **Color**: #4a3800

---

## 14. MARKING SCHEME BOX

### Container
- **Display**: Flex
- **Gap**: 12px
- **Margin**: 0 24px 20px
- **Flex-wrap**: wrap

### Mark Card
- **Flex**: 1
- **Min-width**: 140px
- **Border**: 1px solid #b0bed4
- **Border-radius**: 4px
- **Padding**: 10px 14px
- **Background**: #eaf0fa

### Mark Title
- **Font-size**: 11px
- **Text-transform**: uppercase
- **Letter-spacing**: 0.8px
- **Color**: #555 (muted)

### Mark Values Row
- **Display**: Flex
- **Gap**: 12px
- **Margin-top**: 6px

### Individual Mark Value
- **Text-align**: center
- **Number**: 18px, weight 700, EB Garamond serif
  - Correct: #1a7a3a (green)
  - Wrong: #c0392b (red)
  - Neutral: #555 (muted)
- **Sub-label**: 10px, color #555 (muted)

---

## 15. LEGEND / STATUS INDICATORS

### Legend Container (Print Mode)
- **Display**: Flex
- **Gap**: 16px
- **Flex-wrap**: wrap
- **Padding**: 12px 24px
- **Border-top**: 1px solid #b0bed4
- **Font-size**: 12px
- **Background**: #fafbfd
- **Margin-top**: 20px

### Legend Item
- **Display**: Flex
- **Align-items**: center
- **Gap**: 6px

### Status Dot
- **Width**: 8px
- **Height**: 8px
- **Border-radius**: 50%
- **Display**: inline-block
- **Colors**:
  - Answered: #1a7a3a (green)
  - Marked: #7b1fa2 (purple)
  - Skipped: #aaa (gray)
  - Review: #e67e22 (orange)

### Status Legend Items
1. Answered (✓) - Green dot
2. Marked for Review (🚩) - Purple dot
3. Skipped (Not Attempted) - Gray dot
4. Not Visited - Light gray border

---

## 16. PRINT STYLES

### Print Media Adjustments
```css
@media print {
  body { 
    background: white; 
    font-size: 12px; 
  }
  .no-print { display: none !important; }
  .page { 
    box-shadow: none; 
    margin: 0; 
    padding: 20px; 
    max-width: 100%; 
  }
  .question-card { break-inside: avoid; }
  header { 
    print-color-adjust: exact; 
    -webkit-print-color-adjust: exact; 
  }
}
```

---

## 17. RESPONSIVE BREAKPOINTS

### Mobile Breakpoint (@media max-width: 700px)
- Question Palette: display none
- Options Grid: 1 column (instead of 2)
- Header Meta: 2 columns (instead of 4)
- Toolbar: Stacked/wrapped layout

### Tablet/Desktop (@media > 700px)
- All layouts as specified
- Question Palette: visible
- Options Grid: 2 columns
- Section Tabs: Fully visible

### Interactive Exam Mode Responsive
- **Mobile**: Sidebar slides from right, overlay with z-20
- **Tablet+**: Sidebar visible always
- Sidebar width: w-72 (288px) on desktop
- Mobile: Full viewport width with translate animations

---

## 18. ANIMATIONS & TRANSITIONS

### Transition Times
- Standard: `0.15s`
- Sidebar: `0.3s duration-300`
- Button interactions: `active:scale-95`

### Animations
```css
/* Blink animation for critical timer */
@keyframes blink {
  50% { opacity: 0.5; }
}
.timer.warning { animation: blink 1s step-end infinite; }

/* Sidebar slide (mobile) */
.sidebar-mobile { 
  transition: transform 0.3s ease-in-out;
  transform: translateX(100%);
}
.sidebar-mobile.open { 
  transform: translateX(0);
}
```

### Hover Effects
- Buttons: Opacity and background color changes
- Options: Border color changes + light background
- Cards: Subtle shadow increase

---

## 19. SPACING STANDARDS

### Padding Standards
| Size | Value | Usage |
|------|-------|-------|
| Extra Small | 4px | Icon margins, small gaps |
| Small | 8px | Button padding (y), gaps |
| Medium | 12px | Standard padding, spacing |
| Large | 16px | Card padding, outer padding |
| Extra Large | 24px | Page margins, section margins |
| XXL | 28px | Page bottom padding |

### Margin Standards
| Element | Top | Right | Bottom | Left |
|---------|-----|-------|--------|------|
| Questions | 14px top (after first) | 0 | 0 | 0 |
| Sections | 8px | 0 | 0 | 0 |
| Page | 24px | auto | 24px | auto |
| Instruction | 20px | 24px | 20px | 24px |

---

## 20. BOX SHADOWS

### Shadow Standards
- **Light Shadow**: `0 2px 8px rgba(0,0,0,0.12)`
- **Medium Shadow**: `0 4px 20px rgba(0,0,0,0.12)`
- **Heavy Shadow**: `0 8px 32px rgba(0,0,0,0.15)`
- **Card Shadow**: `0 2px 20px rgba(0,0,0,0.12)`
- **Button Active**: None (or shadow-md on hover)

---

## 21. BORDER STYLES

### Border Standards
- **Standard Border**: `1px solid #b0bed4`
- **Strong Border**: `2px solid #0a2a6e`
- **Accent Border**: `4px solid #c8950a`
- **Dashed Border**: `1px dashed #b0bed4`
- **Subtle Border**: `1px solid rgba(255,255,255,0.15)`

### Border Radius Standards
- Sharp elements: `2px`
- Standard elements: `4px`
- Buttons: `4px`
- Pill buttons: `20px`
- Cards (modern): `6px`
- Modal (modern): `2px`

---

## 22. IMPLEMENTATION CHECKLIST

### Header & Meta
- [x] Navy background (#0a2a6e)
- [x] Gold bottom border (2px)
- [x] 4-column meta grid
- [x] Proper typography and spacing

### Questions
- [x] Light gray section headers
- [x] Question cards with headers
- [x] 2-column option grid (responsive)
- [x] Status indicators at bottom
- [x] Proper hover states

### Timer
- [x] Sticky position at top
- [x] HHH:MM:SS format
- [x] Red color when < 5 minutes
- [x] Blink animation on critical time

### Navigation
- [x] Section tabs at top
- [x] Active tab styling (navy + white)
- [x] Proper button states (outline, solid, submit)
- [x] Previous/Next navigation

### Sidebar (Interactive Mode)
- [x] 288px width
- [x] Question palette grid (5 columns)
- [x] Color-coded status indicators
- [x] Legend explaining status colors
- [x] Responsive hide on mobile

### Footer
- [x] Dark border top
- [x] Light background
- [x] Action buttons properly spaced
- [x] Status information

---

## 23. ADDITIONAL NOTES

### Color Consistency
- All navy blue (#0a2a6e) should be consistent across headers, active states, and primary text
- Gold (#c8950a) used only for accents and important elements (not for primary text)
- Green (#1a7a3a) strictly for success/correct answers
- Red (#c0392b) strictly for errors/wrong answers

### Typography Consistency
- Question text always uses EB Garamond serif
- UI text (labels, buttons) uses Source Sans 3
- Question numbers use EB Garamond (serif)
- No decorative fonts should be used

### Performance Considerations
- Palette fixed positioning may cause performance issues on low-end devices
- Consider virtualizing long question lists for better performance
- Use CSS transitions for smooth animations
- Lazy load images in questions

### Accessibility
- Ensure sufficient color contrast (WCAG AA)
- Proper `aria-labels` for buttons
- Keyboard navigation support for all interactive elements
- Screen reader support for status indicators

---

**Document Version**: 1.0  
**Based on**: Official NTA JEE Main Reference Materials + jee_mains_paper.html  
**Last Updated**: April 20, 2026
