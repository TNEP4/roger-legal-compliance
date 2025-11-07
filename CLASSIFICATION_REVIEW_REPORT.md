# ID Verification Method Classification Review

**Date:** 2025-01-06
**Status:** Analysis Complete - Recommendations Provided

---

## Executive Summary

This analysis reviews the current classification of ID verification methods across two systems:
- **State Category Mode** (Tiers 0-4): Business cost and friction tiers
- **ID Check Method Mode** (Groups 0-5): Individual method groupings

### Key Findings

1. **Alabama Misclassification**: Currently Tier 2, should be Tier 1
2. **Consistent ID Check Grouping**: Group assignments are logically sound
3. **"Commercially Reasonable Software" Ambiguity**: The vagueness of this term creates classification challenges

---

## Question 1: Should "commerciallySoftware" be in same group as credit cards?

### Current Classification

| System | commerciallySoftware | creditCard |
|--------|---------------------|------------|
| **State Category (Tier)** | Tier 1 or 2 (inconsistent) | Tier 1 |
| **ID Check Method (Group)** | Group 2 | Group 1 |

### Analysis

**States with commerciallySoftware:** 20 total
- **With transactionalData:** 13 states (Arizona, Kentucky, Louisiana, Mississippi, Missouri, Montana, Nebraska, North Dakota, Oklahoma, South Carolina, Tennessee, Texas, Utah)
- **With creditCard:** 0 states
- **ONLY commerciallySoftware:** 1 state (Alabama)

### Legal Context

"Commercially reasonable software" is a **catch-all legal term** that states use intentionally for flexibility. It can mean:
- Credit card verification (requires 18+)
- Any third-party age verification service
- Database checks
- Any "reasonable" method

### Recommendation: **NO - Keep them separate**

**Reasoning:**
- `creditCard` is **SPECIFIC** - explicitly requires credit card, zero ambiguity
- `commerciallySoftware` is **VAGUE** - could mean many things, including but not limited to credit cards
- Placing them in the same group would suggest they're equivalent, but:
  - creditCard: 100% guaranteed zero friction (already collected in payment)
  - commerciallySoftware: 0-100% friction depending on implementation chosen

**Current Group 2 placement is correct** because:
- It acknowledges potential for low-cost implementations
- Reflects legal uncertainty about what qualifies
- Allows flexibility in business interpretation

---

## Question 2: Is the friction level accurate for each method?

### Current Method Hierarchy

From `/js/app.js` lines 820-844:

| Method | Group | Friction Level | Cost | User Experience |
|--------|-------|---------------|------|-----------------|
| **creditCard** | 1 | Zero Friction, Zero Cost | $0 | Already collected in payment |
| **commerciallySoftware** | 2 | Zero Friction, Low Cost | $0-500/mo | Vague - could be CC or service |
| **transactionalData** | 2 | Zero Friction, Low Cost | $0.05-0.25/check | Background database check |
| **commercialDatabase** | 2 | Zero Friction, Low Cost | $0.10/check | Credit bureau API |
| **bankAccount** | 3 | Low-Medium Friction | $0 | Account verification |
| **thirdPartyService** | 3 | Low-Medium Friction | $1k-5k/mo | Redirect to Yoti/Veriff |
| **digitizedId** | 4 | High Friction | $2k-10k/mo | Upload ID photo |
| **governmentId** | 4 | High Friction | $2k-10k/mo | Upload government ID |
| **financialDocument** | 4 | High Friction | $0-10k/mo | Upload financial docs |
| **ial2Required** | 5 | Very High Friction | $10k-25k/mo | Full IAL2 certification |
| **photoMatching** | 5 | Very High Friction | $5k-15k/mo | Selfie + ID match |
| **anonymousOption** | 5 | Very High Friction | $5k-20k/mo | Anonymous token system |

### Accuracy Assessment

✅ **Accurate Classifications:**
- **Group 1 (creditCard)**: Truly zero friction - collected during payment flow
- **Group 2 (transactionalData, commercialDatabase)**: Automated background checks, minimal friction
- **Group 3 (bankAccount, thirdPartyService)**: Slight user action required
- **Group 4 (ID uploads)**: Significant user action - photo upload
- **Group 5 (IAL2, biometrics)**: Maximum friction - complex verification

⚠️ **Questionable Classification:**
- **Group 2 (commerciallySoftware)**: Listed as "Zero Friction, Low Cost" but actual friction depends on implementation
  - If business uses credit card → Zero friction
  - If business uses third-party service → Low-Medium friction
  - Current placement in Group 2 is a **reasonable compromise** given legal ambiguity

### Recommendation: **All friction levels are accurate**

The current hierarchy correctly ranks methods by user friction and implementation cost. The only ambiguity is `commerciallySoftware`, which is appropriately placed in Group 2 as a middle ground.

---

## Question 3: Inconsistencies between State Category and ID Check Method?

### Comparative Analysis

| Method | State Category (Tiers) | ID Check Method (Group) | Status |
|--------|----------------------|------------------------|--------|
| **creditCard** | Tier 1 only | Group 1 | ✅ Consistent |
| **transactionalData** | Tier 2 (14 states)<br>Tier 3 (1 state: Tennessee) | Group 2 | ✅ Consistent |
| **commercialDatabase** | Tier 2 only | Group 2 | ✅ Consistent |
| **commerciallySoftware** | Tier 2 (16 states)<br>Tier 3 (4 states) | Group 2 | ❌ **INCONSISTENT** |

### Identified Inconsistency: Alabama

**Problem:** Alabama is currently classified as **Tier 2**

**Alabama's Requirements:**
```json
"verificationMethods": {
  "creditCard": false,
  "digitizedId": false,
  "governmentId": false,
  "transactionalData": false,
  "commerciallySoftware": true,  ← ONLY method
  // ... all others false
}
```

**Legal Language (Alabama):**
> "Any commercially available software, application, program, or methodology that, when enabled, provides reasonable assurances that any individual accessing certain published material is 18 years of age or older."

**Why this is Tier 2:** Current tier assignment algorithm likely treats all `commerciallySoftware` states as Tier 2.

**Why this SHOULD be Tier 1:**
1. Alabama has NO specific requirements beyond "commercially reasonable"
2. Credit card verification is widely accepted as "commercially reasonable"
3. No database checks explicitly required
4. No ID upload mentioned
5. Business can use existing payment processor as verification

### Tier Assignment Algorithm Issue

From `/TIER_SYSTEM_BUSINESS_MODEL.md` lines 175-194:

```
IF creditCard OR bankAccount OR financialDocument OR commerciallySoftware:
    TIER 1 - CC Compliant
```

**But actual tier assignment appears to be:**
- Alabama with ONLY `commerciallySoftware` → Tier 2 ❌
- South Dakota with `creditCard` + `governmentId` + `bankAccount` → Tier 1 ✅

**This is inconsistent!**

### Other Tier 3 States with commerciallySoftware

Four states are Tier 3 (High Friction) but also have `commerciallySoftware`:
1. **Arkansas** - Tier 3 (has `ial2Required`)
2. **Florida** - Tier 3 (has `anonymousOption`)
3. **Georgia** - Tier 3 (has `ial2Required`)
4. **Tennessee** - Tier 3 (has `photoMatching`, `transactionalData`)

These are **correctly classified** as Tier 3 because they have Tier 4/5 requirements that override the `commerciallySoftware` option.

### Recommendation: **Fix Alabama tier assignment**

**Change Alabama from Tier 2 → Tier 1**

Reasoning:
- Follows the stated tier algorithm in documentation
- Matches business reality (credit card should qualify)
- Consistent with how Tier 1 is defined
- Zero additional cost for businesses already processing payments

---

## Question 4: Most Logical and Consistent Classification

### Recommended Changes

#### 1. Alabama Tier Correction

**File:** `/data/states-data.json`

```json
{
  "state": "Alabama",
  "legal": {
    "tier": 1,  // ← Change from 2 to 1
    // ... rest unchanged
  }
}
```

**Justification:**
- Only requirement is "commercially reasonable software"
- Credit card payment satisfies this requirement
- No explicit database or ID requirements
- Should be grouped with other Tier 1 states

**Business Impact:**
- Alabama moves from "Low Cost" category to "Zero Cost" category
- Tier 1 states increase from 2 to 3 (South Dakota, Wyoming, Alabama)
- Tier 2 states decrease from 17 to 16

#### 2. Keep ID Check Method Groups Unchanged

Current grouping in `/js/app.js` lines 474-488 is **correct**:

```javascript
const methodToGroup = {
  'creditCard': 1,           // ✅ Correct - specific, zero friction
  'commerciallySoftware': 2, // ✅ Correct - vague, variable friction
  'transactionalData': 2,    // ✅ Correct - low friction, low cost
  'commercialDatabase': 2,   // ✅ Correct - low friction, low cost
  // ... rest are correct
};
```

**Why keep commerciallySoftware in Group 2:**
- Reflects legal ambiguity about what qualifies
- Not guaranteed to be zero-friction like creditCard
- Allows for range of implementations ($0-500/mo)
- Separating it from Group 1 signals businesses should verify legal interpretation

#### 3. Clarify Tier Assignment Algorithm

**Update:** `/TIER_SYSTEM_BUSINESS_MODEL.md` lines 175-194

Add clarification:

```
ELSE IF creditCard OR bankAccount OR financialDocument:
    TIER 1 - CC Compliant

ELSE IF commerciallySoftware ONLY (no other requirements):
    TIER 1 - CC Compliant (credit card likely qualifies as "commercially reasonable")

ELSE IF transactionalData OR commercialDatabase:
    TIER 2 - Low Friction (database check acceptable)

ELSE IF commerciallySoftware + (transactionalData OR commercialDatabase):
    TIER 2 - Low Friction (multiple options including databases)
```

### Updated Tier Breakdown After Changes

| Tier | States | Example States | Cost |
|------|--------|----------------|------|
| **Tier 0** | 27 | California, New York, etc. | $0 |
| **Tier 1** | **3** | South Dakota, Wyoming, **Alabama** | $0 |
| **Tier 2** | **16** | Arizona, Texas, Louisiana, etc. | $500-2k/mo |
| **Tier 3** | 0 | None | N/A |
| **Tier 4** | 4 | Arkansas, Florida, Georgia, Tennessee | $10k-25k/mo |

---

## Implementation Checklist

### Critical Changes Required

- [ ] **Update Alabama tier in `/data/states-data.json`**
  - Change `"tier": 2` to `"tier": 1`
  - No other changes needed to Alabama data

- [ ] **Update `/TIER_SYSTEM_BUSINESS_MODEL.md`**
  - Clarify tier assignment algorithm for `commerciallySoftware`
  - Update state counts (Tier 1: 2→3, Tier 2: 17→16)
  - Update Alabama's tier in state lists

- [ ] **Update any summary statistics**
  - Tier 1: 5.9% → ~6.8% of states
  - Tier 2: 33.3% → ~31.4% of states

### No Changes Required

- ✅ ID Check Method groupings in `/js/app.js` - already correct
- ✅ Method hierarchy definitions - already correct
- ✅ Color mappings - already correct
- ✅ All other state data - already correct

---

## Detailed Findings by Method

### creditCard (Group 1, Tier 1)

**Classification:** ✅ Correct

**States:** 2 (South Dakota, Wyoming)

**Characteristics:**
- Explicitly mentioned in state law
- Zero friction (already in payment flow)
- Zero cost (payment processor handles)
- No ambiguity

**Tier vs Group:** Consistent - Tier 1 states, Group 1 method

---

### commerciallySoftware (Group 2, Tier 1-3)

**Classification:** ⚠️ Partially incorrect (Alabama should be Tier 1)

**States:** 20 total
- Tier 2: 16 states
- Tier 3: 4 states (have additional IAL2/photo requirements)

**Characteristics:**
- Vague legal language
- Could mean credit card, database, or third-party service
- Cost range: $0-500/mo depending on interpretation
- Variable friction based on implementation

**Tier vs Group:**
- Group 2 placement: ✅ Correct (reflects ambiguity)
- Tier 2 for most states: ✅ Correct (when combined with other requirements)
- **Tier 2 for Alabama: ❌ Incorrect (should be Tier 1)**

**Legal Interpretation:**
- "Commercially reasonable" likely includes credit cards
- Most states pair with other requirements (transactionalData, etc.)
- Alabama stands alone with ONLY this requirement

---

### transactionalData (Group 2, Tier 2-3)

**Classification:** ✅ Correct

**States:** 15 total
- Tier 2: 14 states
- Tier 3: 1 state (Tennessee - has photoMatching)

**Characteristics:**
- Explicit database checks required
- Low friction (automated background check)
- Low cost ($0.05-0.25 per check)
- Clear implementation path

**Tier vs Group:** Consistent - Tier 2 states, Group 2 method

---

### commercialDatabase (Group 2, Tier 2)

**Classification:** ✅ Correct

**States:** 4 (North Carolina, Virginia, Indiana, South Carolina)

**Characteristics:**
- Specific database verification required
- Low friction (automated API call)
- Low cost (~$0.10 per check)
- Credit bureau APIs commonly used

**Tier vs Group:** Consistent - Tier 2 states, Group 2 method

---

## Business Impact Analysis

### Current Classification Issues

**Problem:** Alabama classified as Tier 2 costs businesses money unnecessarily

**Impact:**
- Businesses think they need database verification ($500-2k/mo)
- Reality: Credit card payment likely suffices ($0 additional cost)
- Overestimation of compliance cost

### After Proposed Changes

**Tier 1 States (Zero Additional Cost):** 3 states, 6.8% of US
- South Dakota (explicit credit card acceptance)
- Wyoming (explicit credit card acceptance)
- **Alabama (credit card qualifies as "commercially reasonable")**

**Tier 2 States (Low Cost):** 16 states, 31.4% of US
- Need database/transactional verification
- Cost: $500-2,000/month
- Examples: Arizona, Texas, Louisiana

**Business Strategy:**
- Phase 1: Launch in Tier 0-1 (30 states, 59.7% of US) - Zero cost
- Phase 2: Add Tier 2 (16 states, 31.4% of US) - Low cost
- Phase 3: Evaluate Tier 4 (4 states, 7.8% of US) - High cost

---

## Conclusion

### Summary of Recommendations

1. ✅ **Keep creditCard in Group 1** - Currently correct, no changes needed

2. ✅ **Keep transactionalData in Group 2** - Currently correct, no changes needed

3. ✅ **Keep commerciallySoftware in Group 2** - Currently correct for ID Check Method mode
   - Reflects legal ambiguity
   - Not guaranteed zero-friction
   - Separates it from explicit creditCard acceptance

4. ❌ **Change Alabama from Tier 2 to Tier 1** - CORRECTION NEEDED
   - Only has commerciallySoftware requirement
   - Credit card should qualify
   - Consistent with Tier 1 definition
   - Saves businesses ~$1k-2k/month in unnecessary costs

5. ✅ **All friction levels are accurate** - No changes needed
   - Current hierarchy correctly ranks methods
   - Costs are realistic
   - User experience descriptions are accurate

### Inconsistencies Found

**Only 1 inconsistency:** Alabama's tier assignment

**All other classifications are logically consistent and defensible.**

---

## Appendix: State-by-State Breakdown

### States by Verification Method

#### creditCard (2 states)
- South Dakota (Tier 1) - also accepts governmentId, bankAccount
- Wyoming (Tier 1) - also accepts governmentId

#### commerciallySoftware (20 states)

**Tier 2 (16 states):**
- Alabama - ONLY commerciallySoftware ← **Should be Tier 1**
- Arizona - also transactionalData, digitizedId, governmentId
- Kansas - no transactionalData
- Kentucky - also transactionalData
- Louisiana - also transactionalData
- Mississippi - also transactionalData
- Missouri - also transactionalData
- Montana - also transactionalData
- Nebraska - also transactionalData
- North Carolina - no transactionalData
- North Dakota - also transactionalData
- Oklahoma - also transactionalData, thirdPartyService
- South Carolina - also transactionalData, commercialDatabase, thirdPartyService
- Texas - also transactionalData
- Utah - also transactionalData, thirdPartyService
- Virginia - no transactionalData

**Tier 3 (4 states):**
- Arkansas - also ial2Required
- Florida - also anonymousOption
- Georgia - also ial2Required
- Tennessee - also photoMatching, transactionalData

#### transactionalData (15 states)
All Tier 2 except Tennessee (Tier 3)

#### commercialDatabase (4 states)
All Tier 2

---

**Report Generated:** 2025-01-06
**Data Source:** `/data/states-data.json`, `/js/app.js`, `/TIER_SYSTEM_BUSINESS_MODEL.md`
**Analysis Tool:** Python data validation scripts
