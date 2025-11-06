# ID Verification Method Ranking System

**Last Updated**: 2025-01-06
**Purpose**: Define the hierarchy of ID verification methods based on **user friction + implementation cost**

---

## Ranking Philosophy

The ranking system prioritizes methods that provide:
1. **Lowest user friction** (seamless user experience)
2. **Lowest implementation cost** (business efficiency)
3. **Highest legal compliance** (accepted by most states)

**Key Principle**: A $0 method that requires high user effort (e.g., uploading documents) ranks LOWER than a $0.10/check automated background check that's invisible to the user.

---

## Tier 1: Zero Friction, Zero Cost ✅

### **1. Credit Card**
- **How it works**: Verifies credit card ownership (requires 18+)
- **User friction**: **ZERO** - User already paying, instant verification
- **Implementation cost**: $0 (already part of payment flow)
- **User action**: None
- **Legal status**: Explicitly accepted in 3 states (South Dakota, Wyoming, Nebraska)
- **Business value**: Best option when available

---

## Tier 2: Zero Friction, Low Cost 💰

### **2. Commercial Database**
- **How it works**: Credit bureau verification (Experian, Equifax age check)
- **User friction**: **ZERO to LOW** - Background check using billing info (~1-2 second delay)
- **Implementation cost**: ~$0.10 per verification ($500-2k/mo at scale)
- **User action**: None (silent background check)
- **Legal status**: Accepted in 4 states
- **Business value**: Invisible to user, highly scalable

### **3. Transactional Data**
- **How it works**: Third-party checks commercial databases (mortgage, employment, education records)
- **User friction**: **ZERO to LOW** - Background check using billing info (1-2 second delay)
- **Implementation cost**: $0.05-0.25 per verification ($500-2k/mo at scale)
- **User action**: None (silent background check)
- **Legal status**: Accepted in 15 states
- **Business value**: Wider state coverage than commercial database alone

### **4. Commercially Reasonable Software**
- **How it works**: Catch-all term for "any reasonable method"
- **User friction**: **ZERO to LOW** - One API call after payment, no user action
- **Implementation cost**: $0-500/mo (depends on interpretation)
- **User action**: None
- **Legal status**: Accepted in 20 states using this language
- **Business value**: Flexible interpretation may allow credit card verification

---

## Tier 3: Low-Medium Friction, Medium Cost ⚠️

### **5. Third-Party Service**
- **How it works**: Redirect to external service (Yoti, Veriff, ID.me)
- **User friction**: **MEDIUM** - User must leave your site, create account with third-party
- **Implementation cost**: $1k-5k/mo
- **User action**: Redirect → Create account → Verify → Return
- **Legal status**: Accepted in 4 states
- **Business value**: Lower than database checks due to user redirect friction

### **6. Bank Account**
- **How it works**: Confirms bank account ownership (requires 18+)
- **User friction**: **LOW to MEDIUM** - May require micro-deposit verification (1-2 days)
- **Implementation cost**: $0 (payment processor feature)
- **User action**: Verify two small deposits in bank statement
- **Legal status**: Explicitly mentioned in 1 state (South Dakota)
- **Business value**: Time delay creates friction, rarely accepted

---

## Tier 4: High Friction, Medium-High Cost ❌

### **7. Digitized ID**
- **How it works**: Digital version of driver's license (state apps, Apple Wallet)
- **User friction**: **MEDIUM to HIGH** - User must have/setup digital ID first
- **Implementation cost**: $2k-10k/mo
- **User action**: Download state app OR setup Apple Wallet ID (if not already done)
- **Legal status**: Mentioned in 13 states
- **Business value**: Not all states offer digital IDs; setup barrier

### **8. Financial Document**
- **How it works**: Upload mortgage, tax returns, insurance policies, loan agreements
- **User friction**: **HIGH** - User must find, photograph, and upload documents
- **Implementation cost**: $0 (manual review) or $2k-10k/mo (automated OCR)
- **User action**: Find document → Photograph → Upload → Wait for review
- **Legal status**: Explicitly mentioned in 1 state (Nebraska)
- **Business value**: High friction despite $0 cost; poor UX

### **9. Government-Issued ID**
- **How it works**: Upload photo of driver's license + OCR processing
- **User friction**: **HIGH** - User must take photo, upload, wait for verification
- **Implementation cost**: $2k-10k/mo (OCR + verification service)
- **User action**: Photograph ID → Upload → Wait for processing
- **Legal status**: Required in 14 states
- **Business value**: Standard but high-friction method

---

## Tier 5: Very High Friction, Very High Cost 🚫

### **10. Photo Matching**
- **How it works**: Live selfie matched to government ID photo using facial recognition
- **User friction**: **VERY HIGH** - Take selfie + upload ID + wait for biometric match
- **Implementation cost**: $5k-15k/mo
- **User action**: Photograph ID → Take live selfie → Liveness detection → Wait for match
- **Legal status**: Required in 1 state (Tennessee)
- **Business value**: Consider geo-blocking Tennessee

### **11. IAL2 Certification**
- **How it works**: NIST standard - government documents + biometric verification + liveness detection
- **User friction**: **VERY HIGH** - Multi-step government-level verification process
- **Implementation cost**: $1-5 per verification ($10k-25k/mo at scale)
- **User action**: Multi-step process: Personal info → Upload ID → Live selfie → Background checks
- **Legal status**: Required in 2 states (Arkansas, Georgia)
- **Business value**: Consider geo-blocking Arkansas & Georgia

### **12. Anonymous Option**
- **How it works**: Anonymous age verification tokens (no personal data shared with website)
- **User friction**: **VERY HIGH** - Complex cryptographic token system
- **Implementation cost**: $5k-20k/mo
- **User action**: Use third-party anonymous verification provider → Generate token → Submit
- **Legal status**: Required in 1 state (Florida)
- **Business value**: Consider geo-blocking Florida

---

## Implementation Priority

### Phase 1: Launch (Tier 1-2)
Implement credit card + commercial database/transactional data/commercially reasonable software:
- Covers 30 states (Tier 0 + Tier 1 + Tier 2)
- Total cost: $500-2k/mo
- User friction: Near zero

### Phase 2: Expansion (Tier 3-4)
Add government ID upload when revenue justifies:
- Covers additional states requiring ID upload
- Total cost: +$2k-10k/mo
- Acceptable friction for compliance

### Phase 3: Maximum Coverage (Tier 5)
Evaluate geo-blocking vs. implementing:
- IAL2 for Arkansas & Georgia
- Photo matching for Tennessee
- Anonymous option for Florida
- Total cost: +$10k-25k/mo
- Very high friction; consider geo-blocking instead

---

## Key Insights

### ❌ Common Misconception
**"Financial documents are free, so they should rank high"**
- **Reality**: Requiring users to upload tax returns or mortgage papers creates massive friction
- **Better alternative**: Pay $0.10 for a silent background check

### ✅ Best Practice
**"Invisible verification = Happy users"**
- Methods ranked 1-4 require zero or minimal user action
- User completes payment → Age verified automatically → Access granted
- No extra steps, no friction

### 📊 Cost vs. Friction Matrix

| Method | Cost | Friction | Rank |
|--------|------|----------|------|
| Credit card | $0 | Zero | #1 |
| Commercial database | $0.10 | Zero | #2 |
| Commercially reasonable software | $0-500 | Zero-Low | #4 |
| Financial document | $0 | High | #8 |

**Lesson**: Cost alone doesn't determine rank; UX friction matters more.

---

## Related Documentation

- [TIER_SYSTEM_BUSINESS_MODEL.md](TIER_SYSTEM_BUSINESS_MODEL.md) - State tier classifications
- [VERIFICATION_METHODS_TABLE.md](VERIFICATION_METHODS_TABLE.md) - Quick reference by state
- [legal-glossary.md](legal-glossary.md) - Legal term definitions

---

**Last Updated**: 2025-01-06
**Legal Disclaimer**: This is a business analysis tool, not legal advice. Consult with a licensed attorney before implementing age verification strategies.
