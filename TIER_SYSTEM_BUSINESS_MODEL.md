# Age Verification Tier System - Business Cost Model

## Product Strategy Context

**Your Business Model:**
- **Free Version:** 100% adult content free → No age verification needed
- **Paid Version:** Credit card payment required → Automatic age verification
- **Additional ID Verification:** Only when CC payment insufficient under local law

This tier system reflects **business cost and user friction** to comply with age verification laws, NOT legal strictness.

---

## Tier Definitions

### **Tier 0: No Restrictions**
- **Description:** No age verification law in effect
- **Cost:** $0/month additional
- **User Friction:** None
- **Implementation:** No compliance needed
- **User Experience:** Free users see no adult content; paid users unlock immediately with CC
- **States:** 27 states (52.9%)
- **Examples:** Alaska, California, Colorado, Connecticut, Delaware, Hawaii, Illinois, etc.

---

### **Tier 1: CC Compliant** ✅ ZERO COST
- **Description:** Credit card or financial verification is legally sufficient
- **Cost:** $0/month additional
- **User Friction:** Zero - Already Compliant
- **Implementation:** Credit card payment processor already satisfies legal requirement
- **User Experience:** Paid users unlock adult content immediately upon payment
- **States:** 4 states (7.8%)
- **Legal Methods Accepted:**
  - Credit card verification (`creditCard`)
  - Bank account verification (`bankAccount`)
  - Financial document verification (`financialDocument`)
  - "Commercially reasonable" methods with no specific requirements (`commerciallySoftware` only)

**States in Tier 1:**
1. **Alabama** - Commercially reasonable software only (CC qualifies)
2. **Nebraska** - Financial document accepted (includes credit card statements)
3. **South Dakota** - Credit card or bank account
4. **Wyoming** - Credit card accepted

---

### **Tier 2: Silent Background Check** ⚠️ LOW COST
- **Description:** Commercial database verification (truly low friction)
- **Cost:** $500-2,000/month
- **User Friction:** Zero - Silent background check (1-2 second delay)
- **Implementation:** Integrate commercial database API (credit bureau verification)
- **User Experience:** Users pay with CC, then background check runs invisibly using their billing info
- **States:** 4 states (7.8%)
- **Legal Methods:**
  - Commercial database checks (`commercialDatabase`)
  - These states explicitly accept credit bureau/commercial database verification

**Implementation Options:**
1. **Credit bureau verification** (e.g., Experian, Equifax age check)
2. **Identity verification services** (LexisNexis, IDology)
3. **Commercial data brokers** (aggregate adult consumer data)

**States in Tier 2:**
1. **Kansas** - Commercial database OR government ID OR commercially reasonable
2. **North Carolina** - Commercial database
3. **South Carolina** - Commercial database OR transactional data OR other methods
4. **Virginia** - Commercial database

---

### **Tier 3: User Input Required** ⚠️ MEDIUM COST
- **Description:** Transactional data, third-party service, or ID upload required (user must take action)
- **Cost:** $500-10,000/month
- **User Friction:** Low to High - Users must provide additional information or upload documents
- **Implementation:** Integrate transactional data API, third-party service, OR build ID upload flow
- **User Experience:** Users pay with CC, then must provide personal info OR redirect to third-party OR upload ID
- **States:** 12 states (23.5%)
- **Legal Methods:**
  - Transactional data verification (`transactionalData`) - requires user to input name, DOB, address
  - Commercially reasonable software (`commerciallySoftware`) - when combined with other requirements
  - Third-party service (`thirdPartyService`) - redirect to external verification
  - Digital ID (`digitizedId`) or Government ID (`governmentId`) - document upload

**States in Tier 3:**
1. **Arizona** - Digital ID OR government ID OR transactional data OR commercially reasonable
2. **Idaho** - Digital ID OR government ID OR transactional data
3. **Indiana** - Third-party service OR transactional data
4. **Kentucky** - Government ID OR transactional data OR commercially reasonable
5. **Louisiana** - Digital ID OR government ID OR transactional data OR commercially reasonable
6. **Mississippi** - Digital ID OR government ID OR transactional data OR commercially reasonable
7. **Missouri** - Government ID OR transactional data OR commercially reasonable
8. **Montana** - Digital ID OR government ID OR transactional data OR commercially reasonable
9. **North Dakota** - Digital ID OR government ID OR transactional data OR commercially reasonable
10. **Oklahoma** - Digital ID OR third-party service OR transactional data OR commercially reasonable
11. **Texas** - Digital ID OR government ID OR transactional data OR commercially reasonable
12. **Utah** - Digital ID OR third-party service OR transactional data OR commercially reasonable

---

### **Tier 4: High Friction** ❌ VERY HIGH COST
- **Description:** Strictest requirements - IAL2, anonymous option, or photo matching
- **Cost:** $10,000-25,000/month
- **User Friction:** Very High - Biometric verification
- **Implementation:** Full IAL2 certification OR anonymous verification system OR biometric matching
- **User Experience:** Users must complete complex verification: selfie + ID match, liveness detection, or anonymous token system
- **States:** 4 states (7.8%)
- **Legal Requirements:**
  - **IAL2 (Identity Assurance Level 2):** NIST standard requiring biometric + ID + liveness detection
  - **Anonymous Option:** Must offer anonymous age verification (no personal data to website)
  - **Photo Matching:** Selfie must match government ID photo

**States in Tier 4:**
1. **Arkansas** - Requires IAL2 certification
2. **Florida** - Must offer anonymous age verification option
3. **Georgia** - Requires IAL2 certification
4. **Tennessee** - Requires photo matching with government ID

**Business Decision:** Consider geo-blocking these 4 states until product scales justify the $10k-25k/month compliance cost.

---

## Business Summary

### Cost Analysis

| Tier | States | % of US | Compliance Cost | Status |
|------|--------|---------|----------------|--------|
| Tier 0 | 27 | 53.5% | $0 | ✅ Compliant |
| Tier 1 | 4 | 2.5% | $0 | ✅ CC Payment Sufficient |
| Tier 2 | 4 | 8.4% | $500-2k/month | ⚠️ Silent Background Check |
| Tier 3 | 12 | 22.3% | $500-10k/month | ⚠️ User Input Required |
| Tier 4 | 4 | 13.3% | $10k-25k/month | ❌ Biometric/IAL2 Required |

### Launch Strategy Recommendation

**Phase 1: Launch in Tier 0-1 (31 states, 56.0% of US)**
- Zero additional compliance cost
- CC payment is legally sufficient
- Immediate market entry

**Phase 2: Add Tier 2 (4 states, 8.4% of US)**
- Integrate commercial database API ($500-2k/month)
- Silent background check (zero user friction)
- Covers Kansas, North Carolina, South Carolina, Virginia

**Phase 3: Add Tier 3 (12 states, 22.3% of US)**
- Implement transactional data verification
- Users must provide additional information
- Covers remaining major markets

**Phase 4: Evaluate Tier 4 (4 states, 13.3% of US)**
- Florida (23.8M population, 6.94% of US)
- Georgia (11.3M population, 3.29% of US)
- Arkansas (3.1M population, 0.9% of US)
- Tennessee (7.3M population, 2.13% of US)
- **Decision:** Geo-block OR invest $10k-25k/month when revenue justifies it

---

## Legal Interpretation Notes

### Why "Commercially Reasonable" Qualifies Credit Cards

Many states use language like "commercially reasonable software, application, or methodology." Legal analysis supports that **credit card payment qualifies**:

1. **Age Restriction:** Credit cards require 18+ (or parental authorization)
2. **Widely Accepted:** Used by major platforms for age-restricted content
3. **Commercially Reasonable:** Standardized payment infrastructure
4. **Legal Precedent:** Payment processors are accepted age verification in many jurisdictions

### Why We Choose Lowest-Friction Option

When state law says "digitized ID OR government ID OR transactional data OR commercially reasonable," the word **"OR"** gives businesses a choice. We choose the lowest-friction, lowest-cost option that satisfies the statute.

**Legal Defensibility:** If state law explicitly allows transactional data, a business cannot be penalized for choosing that method over ID upload.

---

## Tier Assignment Algorithm

```
IF no age verification law OR idRequired = false:
    TIER 0 - No Restrictions

ELSE IF ial2Required OR anonymousOption OR photoMatching:
    TIER 4 - High Friction (biometric/IAL2 requirements)

ELSE IF creditCard OR bankAccount OR financialDocument:
    TIER 1 - CC Compliant (payment methods sufficient)

ELSE IF (state = "Alabama" AND commerciallySoftware ONLY):
    TIER 1 - CC Compliant (commercially reasonable can be satisfied by CC)

ELSE IF commercialDatabase:
    TIER 2 - Silent Background Check (zero user friction)

ELSE IF transactionalData OR commerciallySoftware OR thirdPartyService OR digitizedId OR governmentId:
    TIER 3 - User Input Required (user must take action)

ELSE:
    TIER 3 - User Input Required (default if idRequired)
```

---

## Verification Method Reference

| Method | Friction | Cost | User Flow | States Using |
|--------|----------|------|-----------|--------------|
| `creditCard` | None | $0 | Already in payment | 2 |
| `bankAccount` | None | $0 | Already in payment | 1 |
| `financialDocument` | None | $0 | Already in payment | 1 |
| `commerciallySoftware` | None-Low | $0-500 | CC likely qualifies | 20 |
| `transactionalData` | Low | $500-2k | Background check | 15 |
| `commercialDatabase` | Low | $500-2k | Credit bureau API | 4 |
| `thirdPartyService` | Medium | $1k-5k | Redirect to Yoti/Veriff | 4 |
| `digitizedId` | High | $2k-10k | Upload ID photo | 13 |
| `governmentId` | High | $2k-10k | Upload ID + OCR | 14 |
| `photoMatching` | Very High | $5k-15k | Selfie + ID match | 1 |
| `ial2Required` | Very High | $10k-25k | Full IAL2 cert | 2 |
| `anonymousOption` | Very High | $5k-20k | Anonymous tokens | 1 |

---

## Questions & Answers

**Q: Can we just use credit card for all Tier 2 states?**
A: Legally risky. Tier 2 states explicitly require "transactional data" or "commercial database" checks, which goes beyond simple credit card acceptance. Credit bureau verification (~$0.10/check) is safer.

**Q: What's the difference between Tier 1 and Tier 2?**
A: Tier 1 accepts "commercially reasonable" methods with no specific requirements (CC qualifies). Tier 2 explicitly requires database/transactional data checks (CC alone may not suffice legally).

**Q: Should we geo-block Tier 4 states?**
A: Depends on revenue potential. Florida alone is 6.94% of US population (23.8M people). If your market is large enough, the $10k-25k/month cost may be justified. Otherwise, geo-block until scale justifies it.

**Q: How do we handle users with VPNs?**
A: Geo-detection is based on IP address. VPN users may access from different tiers. Industry standard is to verify based on billing address, not IP address, for paid users.

---

**Last Updated:** 2025-01-06
**Data Source:** data/states-data.json
**Legal Disclaimer:** This is a business analysis tool, not legal advice. Consult with a licensed attorney before implementing age verification strategies.
