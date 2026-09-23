# Output Plan: https://un.ms/pile

## Target URLs
- **URL:** https://un.ms/pile
- **Origin:** un.ms
- **Pathname:** /pile

## Keys
- **site-key:** `un.ms-9e73fc9e` (origin slug + first 8 hex of SHA-256("un.ms"))
- **page-key:** `pile-7b2b2b3f` (pathname slug + first 8 hex of SHA-256("/pile"))

## Paths
- **app-root:** `.` (repository root)
- **artifact-root:** `docs/research/un.ms-9e73fc9e/pile-7b2b2b3f/`
- **screenshot-root:** `docs/design-references/un.ms-9e73fc9e/pile-7b2b2b3f/`
- **component-root:** `src/components/sites/un.ms-9e73fc9e/pile-7b2b2b3f/`
- **asset-root:** `public/sites/un.ms-9e73fc9e/pile-7b2b2b3f/`
- **route:** `src/app/page.tsx` (replacing scaffold since this is the first clone)

## Route Preservation
- Existing `src/app/page.tsx` is a scaffold placeholder - will be replaced
- No other routes exist in the template

## Shared Foundation Changes
- **layout.tsx:** Replace Geist fonts with Inter (next/font/google), update metadata
- **globals.css:** Merge target's CSS custom properties (--background-color, --text-color, --primary-color, etc.) into shadcn token system

## Design Tokens (Extracted)
- Font: InterVariable, Inter, sans-serif
- Background: rgba(247, 250, 251)
- Background secondary: #ceebff
- Background tertiary: #92d2d8
- Text: rgba(0, 0, 0, 0.85)
- Text secondary: rgba(0, 0, 0, 0.6)
- Primary: #e75900
- Primary hover: #b14400
- Secondary: #004491
- Border: rgba(0, 0, 0, 0.25)

## Page Topology (Expected)
Based on the brochure nature of the Pile landing page:
1. Navigation/Header
2. Hero section with headline and CTA
3. Feature sections
4. Download/CTA section
5. Footer
