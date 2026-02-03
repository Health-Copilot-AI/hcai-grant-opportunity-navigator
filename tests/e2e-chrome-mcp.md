# E2E Test Results - Chrome MCP

## Test Date: 2026-02-03

## Test Environment
- **Browser**: Chrome (debug mode)
- **URL**: http://localhost:3000
- **Data Path**: /home/hcai/grants/hcai-grant-flow/ai-model/03_outputs/opportunities-v2

---

## Test 1: Dashboard Page Load
**Status**: ✅ PASS

**Steps**:
1. Navigate to http://localhost:3000
2. Verify page renders without errors
3. Check for key elements

**Results**:
- Page title: "GrantFlow Navigator"
- Stats displayed: Total Opportunities (27), High Priority (14), Rolling (9), Passed (5)
- Funding range shown: $5.1M - $25.3M
- Charts rendered: Deadline bar chart, Route distribution pie chart
- Prior relationships displayed

**Screenshot**: screenshots/dashboard.png

---

## Test 2: Opportunities List Page
**Status**: ✅ PASS

**Steps**:
1. Navigate to /opportunities
2. Verify grid loads with all opportunities
3. Check filters are present

**Results**:
- Shows "27 of 27 opportunities"
- Filters present: Route, Priorities, Funder Types, Statuses
- Opportunity cards display: name, funder, amount, deadline, route badge, score
- Cards are clickable (link to detail page)

**Screenshot**: screenshots/opportunities.png

---

## Test 3: Opportunity Detail Page
**Status**: ✅ PASS

**Steps**:
1. Navigate to /opportunities/002-florida-blue
2. Verify all sections render
3. Check tabs work

**Results**:
- Header shows: "Florida Blue Foundation Maternal Health Grants"
- Weighted score: 4.80
- Quick facts display: Amount, Deadline, LOI Required, Funder Type
- Tabs present: Overview, Research, Application, Files
- Radar chart renders with alignment scores
- Contacts section populated
- Strategic notes displayed

**Screenshot**: screenshots/detail.png

---

## Test 4: Timeline Page
**Status**: ✅ PASS

**Steps**:
1. Navigate to /timeline
2. Verify deadline categories
3. Check chart renders

**Results**:
- Stats: 3 Upcoming, 9 Rolling, 5 Passed
- Deadline chart shows bars by days remaining
- Upcoming deadlines list with dates and days remaining
- Rolling deadlines grid
- Passed deadlines with "X days ago" labels

**Screenshot**: screenshots/timeline.png

---

## Test 5: Relationships Page
**Status**: ✅ PASS

**Steps**:
1. Navigate to /relationships
2. Verify relationship categories
3. Check strategy section

**Results**:
- Current Grantees: 0
- Prior Funded: 4 (Florida Blue x2, Health Foundation of South Florida, Kresge)
- Prior Contact: 1 (Centene Foundation)
- Strategy guidance displayed for each relationship type

**Screenshot**: screenshots/relationships.png

---

## Test 6: Search Page
**Status**: ✅ PASS

**Steps**:
1. Navigate to /search
2. Verify search form renders
3. Check suggested search terms

**Results**:
- Search input with placeholder text
- Quick search buttons: Florida Blue, HRSA, mobile health, AI, SDOH
- Loading state handled with Suspense boundary

---

## Test 7: API Endpoints
**Status**: ✅ PASS

**Endpoints Tested**:
- GET /api/health → {"status":"ok","timestamp":"..."}
- GET /api/opportunities → Returns 27 opportunities with full data
- GET /api/global → Returns aggregated stats and lists

---

## Test 8: Responsive Design
**Status**: ✅ PASS

**Notes**:
- Grid layouts adapt (4-col → 2-col → 1-col)
- Sidebar navigation collapses appropriately
- Cards maintain readability at all sizes

---

## Test 9: Theme Toggle
**Status**: ✅ PASS

**Notes**:
- Light/dark mode toggle present in header
- CSS variables properly applied in both modes

---

## Summary

| Test | Result |
|------|--------|
| Dashboard Load | ✅ PASS |
| Opportunities List | ✅ PASS |
| Opportunity Detail | ✅ PASS |
| Timeline Page | ✅ PASS |
| Relationships Page | ✅ PASS |
| Search Page | ✅ PASS |
| API Endpoints | ✅ PASS |
| Responsive Design | ✅ PASS |
| Theme Toggle | ✅ PASS |

**Overall**: 9/9 tests passed

---

## Issues Fixed During Testing

1. **Tailwind CSS Error**: "border-border class does not exist"
   - Fixed by adding CSS variable color definitions to tailwind.config.js

2. **useSearchParams Suspense Error**: Search page needed Suspense boundary
   - Fixed by wrapping SearchContent component in Suspense

3. **React Server Component Error**: Icon components passed to client components
   - Fixed by using string-based icon names instead of component references
