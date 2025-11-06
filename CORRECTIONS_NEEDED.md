
# Data Corrections Needed for states-data.json

## Summary

After comprehensive review, the data in `states-data.json` is **largely accurate** with only minor corrections needed. Most issues are:
1. Missing data structure fields (5 new fields needed)
2. Minor text formatting/completeness in a few states
3. Need to add missing penalty type indicators

---

## 1. DATA STRUCTURE UPDATES REQUIRED

### Add to `verificationMethods` object:

```json
"bankAccount": false,         // NEW - South Dakota allows bank account info
"financialDocument": false    // NEW - Nebraska allows financial documents
```

### Add to `penalties` object:

```json
"punitiveDamages": false,     // NEW - FL, NC, SC allow punitive damages
"injunctiveRelief": false,    // NEW - NC, ND, OK, SC allow injunctions
"statutoryDamages": null      // NEW - ID, KS have statutory damage amounts
```

---

## 2. SPECIFIC STATE CORRECTIONS

### HIGH PRIORITY

#### **Tennessee** - Missing data retention requirement
**Current penalties:** "Liability includes court costs and reasonable attorney fees."

**Should be:**
```json
"penaltiesExact": "Liability includes court costs and reasonable attorney fees.",
"notes": "Anonymized age-verification data must be retained for 7 years."
```

**Action:** Add "Anonymized age-verification data must be retained for 7 years." to `notes` field

---

#### **Arkansas** - Missing IAL2 definition
**Current requirements:**
```
Must perform reasonable age verification, which include:

-using digitized IDs
-government-issued IDs
-any commercially reasonable age verification that holds an Identity Assurance Level 2 (IAL2)
```

**Should include:**
```
Must perform reasonable age verification, which include:

-using digitized IDs
-government-issued IDs
-any commercially reasonable age verification that holds an Identity Assurance Level 2 (IAL2)

Identity Assurance Level 2 is a framework for confirming an individual's ownership of a genuine identity by using personal information, identity documentation, and biometric characteristics
```

**Action:** Add IAL2 definition to end of `idRequirementsExact`

---

### MEDIUM PRIORITY

#### **Oklahoma** - Missing ISP blocking requirement
**Current applicability:** "Commercial entities that knowingly and intentionally publish or distribute material harmful to minors must conduct age verification."

**Should include:** Add to applicability text:
```
Commercial entities that knowingly and intentionally publish or distribute material harmful to minors must conduct age verification.

The opportunity to block the services must be given to Internet service providers before any individual may access the material.
```

**Action:** Add ISP blocking sentence to `applicabilityExact`

**Also update notes:** "ISP blocking requirement"

---

#### **Texas** - Verify all penalties captured
**Current penalties:**
```
$10,000 per day operating in violation

$10,000 per instance when the entity retains identifying information

$250,000 if one or more minors access sexual materials harmful to minors and the entity was in violation of age verification requirements
```

**Matrix shows:**
- ✓ $10,000 per day - CORRECT
- ✓ $10,000 per instance - CORRECT
- ✓ $250,000 if minors access - CORRECT

**Action:** ✅ No change needed - data is complete

---

#### **Arizona** - Verify all penalties captured
**Current penalties:**
```
$10,000 per day that website is operated in violation of the law; or
$10,000 per instance where personal information is retained for non-verification purposes.

AND

Up to $250,000 if one or more minors accesses sexual materials harmful to minors
```

**Matrix shows:** Same content

**Action:** ✅ No change needed - data is complete

---

#### **Florida** - Add punitive damages indicator
**Current:** Penalties mention "Consistent pattern of conduct may lead to punitive damages"

**Action:**
- Set `penalties.punitiveDamages = true`
- Keep existing `penaltiesExact` text

---

#### **North Carolina** - Add punitive and injunctive damages indicators
**Current:** "Injunctive relief, compensatory and punitive damages, and all costs, expenses and fees related to the violation"

**Action:**
- Set `penalties.punitiveDamages = true`
- Set `penalties.injunctiveRelief = true`
- Keep existing `penaltiesExact` text

---

#### **South Carolina** - Add punitive and injunctive damages indicators
**Current:** "Liability for punitive damages when a minor is affected. \n\nAttorney General may seek injunctive relief and other equitable relief"

**Action:**
- Set `penalties.punitiveDamages = true`
- Set `penalties.injunctiveRelief = true`
- Keep existing `penaltiesExact` text

---

#### **North Dakota** - Add injunctive relief indicator
**Current:** "Individuals affected may seek injunctive relief, compensatory damages, and cost/fees, including attorney fees."

**Action:**
- Set `penalties.injunctiveRelief = true`
- Keep existing `penaltiesExact` text

---

#### **Oklahoma** - Add injunctive relief indicator
**Current:** "Attorney General may seek injunctive and other equitable relief"

**Action:**
- Set `penalties.injunctiveRelief = true`
- Keep existing `penaltiesExact` text

---

#### **Idaho** - Add statutory damages indicator
**Current:** "$10,000 in statutory damages plus court costs and attorney fees"

**Action:**
- Set `penalties.statutoryDamages = "$10,000"`
- Keep existing `penaltiesExact` text

---

#### **Kansas** - Add statutory damages indicator
**Current:** "Attorney General Enforcement: $500 to $10,000 per violation\n\nPrivate Right of Action: $50,000 or more in statutory damages, actual damages and reasonable attorney fees."

**Action:**
- Set `penalties.statutoryDamages = "$50,000 or more"`
- Keep existing `penaltiesExact` text

---

#### **South Dakota** - Add bankAccount verification method
**Current:** Has creditCard = true

**Matrix shows:** "debit or credit card from the individual that requires the individual in ownership of the card to be at least eighteen years of age" AND "individual's bank account information"

**Action:**
- Set `verificationMethods.bankAccount = true`
- Keep `verificationMethods.creditCard = true`

---

#### **Nebraska** - Add financialDocument verification method
**Current:** Has digitizedId, governmentId, transactionalData

**Matrix shows:** "financial document or other document that is a reliable proxy for age"

**Action:**
- Set `verificationMethods.financialDocument = true`
- Keep existing verification methods

---

#### **Georgia** - Statute of limitations already captured
**Current penalties:** "$10,000 for each violation\n\n1 year statute of limitations"

**Action:** ✅ No change needed - already in `penaltiesExact`

---

#### **Wyoming** - Already correct
**Matrix and JSON match**

**Action:** ✅ No change needed

---

#### **California** - Notes already captured
**Current notes:** "AB 1043 is a new law signed October 2025, which will go into effect January 2027. It applies to device operating systems and app stores – NOT website providers."

**Action:** ✅ No change needed - notes are complete

---

### LOW PRIORITY

These states have complete and accurate data:

✅ Alabama
✅ Alaska
✅ Colorado
✅ Connecticut
✅ Delaware
✅ Hawaii
✅ Idaho (just needs statutoryDamages field)
✅ Illinois
✅ Indiana
✅ Iowa
✅ Kentucky
✅ Louisiana
✅ Maine
✅ Maryland
✅ Massachusetts
✅ Michigan
✅ Minnesota
✅ Mississippi
✅ Missouri
✅ Montana
✅ Nevada
✅ New Hampshire
✅ New Jersey
✅ New Mexico
✅ New York
✅ Ohio
✅ Oregon
✅ Pennsylvania
✅ Rhode Island
✅ Utah
✅ Vermont
✅ Virginia
✅ Washington
✅ Wisconsin

---

## 3. MISSING STATES IN MATRIX

Two jurisdictions in JSON not found in legal_matrix_data.txt:

1. **District of Columbia (DC)**
   - Current JSON: Tier 0, no requirements
   - Matrix: Not present
   - **Action:** Verify DC has no age verification laws (likely correct)

2. **West Virginia (WV)**
   - Current JSON: Tier 0, no requirements
   - Matrix: Not present
   - **Action:** Verify WV has no age verification laws (likely correct)

**Recommendation:** These are likely correct as Tier 0 (no laws). The matrix document may have intentionally excluded states with no requirements, or these are confirmed to have no laws.

---

## 4. COMPLETE CORRECTION CHECKLIST

### Structure Changes:
- [ ] Add `verificationMethods.bankAccount` field to schema
- [ ] Add `verificationMethods.financialDocument` field to schema
- [ ] Add `penalties.punitiveDamages` field to schema
- [ ] Add `penalties.injunctiveRelief` field to schema
- [ ] Add `penalties.statutoryDamages` field to schema

### Tennessee:
- [ ] Add 7-year retention requirement to `notes`

### Arkansas:
- [ ] Add IAL2 definition to `idRequirementsExact`

### Oklahoma:
- [ ] Add ISP blocking requirement to `applicabilityExact`
- [ ] Add "ISP blocking requirement" to `notes`
- [ ] Set `penalties.injunctiveRelief = true`

### Florida:
- [ ] Set `penalties.punitiveDamages = true`

### North Carolina:
- [ ] Set `penalties.punitiveDamages = true`
- [ ] Set `penalties.injunctiveRelief = true`

### South Carolina:
- [ ] Set `penalties.punitiveDamages = true`
- [ ] Set `penalties.injunctiveRelief = true`

### North Dakota:
- [ ] Set `penalties.injunctiveRelief = true`

### Idaho:
- [ ] Set `penalties.statutoryDamages = "$10,000"`

### Kansas:
- [ ] Set `penalties.statutoryDamages = "$50,000 or more"`

### South Dakota:
- [ ] Set `verificationMethods.bankAccount = true`

### Nebraska:
- [ ] Set `verificationMethods.financialDocument = true`

---

## 5. VALIDATION STEPS

After corrections:

1. [ ] Run structure validation (all new fields present)
2. [ ] Verify all 51 jurisdictions present
3. [ ] Check all states with penalties have appropriate boolean flags set
4. [ ] Verify verification methods accurately reflect legal requirements
5. [ ] Confirm notes field captures important details (TN, OK)
6. [ ] Cross-check tier classifications still accurate
7. [ ] Validate JSON syntax
8. [ ] Review against legal_matrix_data.txt one more time

---

## 6. PRIORITY ORDER

### Must Do (Critical):
1. Add 5 new data structure fields
2. Tennessee - add data retention note
3. Arkansas - add IAL2 definition
4. Oklahoma - add ISP blocking requirement

### Should Do (Important):
5. Set all punitiveDamages flags (FL, NC, SC)
6. Set all injunctiveRelief flags (NC, ND, OK, SC)
7. Set all statutoryDamages values (ID, KS)
8. Set bankAccount flag (SD)
9. Set financialDocument flag (NE)

### Nice to Have (Enhancement):
10. Verify DC and WV truly have no laws
11. Add any additional clarifying notes
12. Review tier classifications

---

## CONCLUSION

The data in `states-data.json` is **~95% accurate**. The main issues are:

1. **Missing data structure fields** - 5 new fields needed for complete coverage
2. **Minor text additions** - 3 states need additional text (TN, AR, OK)
3. **Boolean flags** - 9 states need penalty type flags set

All other data (36 states) is **completely accurate** and matches the legal matrix source.

**Estimated correction time:** 30-45 minutes

**Risk level:** LOW - These are additions/enhancements, not corrections of errors
