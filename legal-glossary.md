# Legal Terms Glossary

> **Note:** This glossary provides explanations at three levels of detail: Simple, Intermediate, and Detailed. Each term is explained from basic understanding to comprehensive legal context.

---

## Material Harmful to Minors

### 🔵 Simple
Sexual content that's inappropriate for people under 18.

### 🟢 Intermediate
Content depicting sexual acts that's offensive by community standards and has no serious value for minors. Based on the "Miller test" but modified for minors.

### 🟠 Detailed
A three-part legal test (modified Miller test) where ALL three must be true:

1. The average person, using contemporary community standards, would find it appeals to minors' prurient (shameful/morbid) interest in sex
2. It depicts sexual conduct in a patently offensive way for minors
3. It lacks serious literary, artistic, political, or scientific value *for minors*

**Key difference from adult obscenity:** Each prong adds "for minors" - so material can be legal for adults but "harmful to minors."

---

## IAL2 (Identity Assurance Level 2)

### 🔵 Simple
Strong ID verification using government documents plus a selfie. Required by Arkansas and Georgia.

### 🟢 Intermediate
A federal government standard (NIST) for proving someone's identity online with "high confidence." Requires multiple types of proof including photo ID and biometric verification (like face matching).

### 🟠 Detailed
**Official Standard:** NIST Special Publication 800-63A

**Evidence Required:** One STRONG + one FAIR piece of evidence, OR one SUPERIOR piece

**Typical Process:**
- Personal information (name, DOB, address)
- Government-issued photo ID (driver's license, passport)
- Biometric verification (live selfie matched to ID photo)
- Background database checks

**Why it's strict:** Designed to prevent impersonation attacks and identity fraud at government-level security. More rigorous than typical e-commerce verification.

**Cost implication:** Requires specialized third-party services ($1-5 per verification). Cannot be done with simple credit card checks.

---

## Transactional Data

### 🔵 Simple
Records from business transactions and databases that can prove someone's age. Examples: mortgage records, employment history, education records.

### 🟢 Intermediate
"A sequence of information that documents an exchange, agreement, or transfer between an individual, commercial entity, or third party." Used by third-party age verification companies that access commercial databases containing adult records.

### 🟠 Detailed
**Legal Definition (from statutes):** "Public or private transactional data" means records documenting exchanges, agreements, or transfers that can verify age.

**Specific Examples from State Laws:**
- Mortgage/property records (must be 18+ to sign)
- Employment records (W-2s, payroll data)
- Educational records (college enrollment)
- Utility bills, insurance policies
- Commercial database entries

**How it works:** Third-party services (like Yoti, Veriff, ID.me) check if your name/DOB appears in these adult-only databases.

**The Credit Card Question:** Most statutes say "public or private transactional data" but DON'T explicitly say if credit cards count. Only South Dakota, Wyoming, and Nebraska explicitly allow credit cards. Other states remain unclear.

**Implementation:** Typically costs $0.05-0.25 per verification through specialized vendors.

---

## Commercially Reasonable Method

### 🔵 Simple
Age verification methods that work in the real world and are used by legitimate businesses.

### 🟢 Intermediate
Methods "regularly used by government or businesses for age and identity verification" (Florida's definition). Must be practical to implement while effectively confirming users are 18+.

### 🟠 Detailed
**The Problem:** No state defines this precisely. It's intentionally vague legal language.

**Generally Accepted Methods:**
- Government-issued ID verification (most common)
- Digital ID apps (state-approved)
- Third-party verification services
- Database lookups (transactional data)
- Biometric verification

**What's NOT Clear:**
- Are credit cards "commercially reasonable"? (Disputed - only 3 states explicitly allow)
- How much verification is "reasonable"? (Court precedent lacking)
- What accuracy rate is required? (Not specified)

**Legal Standard Applied:** Would a "reasonable business person" consider this method adequate for age verification? Courts will decide case-by-case.

**Risk:** This vagueness means you could implement something you think is "reasonable" and still face litigation. Conservative interpretation recommended.

---

## Digital ID / Digitized ID

### 🔵 Simple
A digital version of your driver's license or ID card, often in a mobile app.

### 🟢 Intermediate
A verified digital credential (like Apple Wallet ID or state-specific apps) that proves your identity and age without sharing your actual ID document.

### 🟠 Detailed
**Types:**
- *State-issued mobile IDs*: Official digital versions of driver's licenses (e.g., Arizona, Colorado, Maryland apps)
- *Third-party digital IDs*: Verified credentials from services like Clear, ID.me
- *Scanned/photo IDs*: Pictures of physical IDs (least secure, often not accepted)

**Arizona's specific requirement:** Digital ID that "does not cause information to be transmitted to a governmental entity" - meaning privacy-preserving verification.

**How they work:** Use cryptographic signatures to prove authenticity without exposing your full ID. Some use zero-knowledge proofs (only share "over 18" boolean, not your exact age).

**Adoption:** Still emerging technology. Not all states have digital ID programs yet.

---

## Private Right of Action

### 🔵 Simple
Individuals (like parents) can sue you directly, not just the government.

### 🟢 Intermediate
When a law includes a "private right of action," any affected person can file a lawsuit against you for damages. You're not just at risk from government enforcement - anyone can sue.

### 🟠 Detailed
**Why it matters:** Much higher legal risk. Government has limited resources and prosecutes selectively. Private citizens can sue anytime.

**Examples from State Laws:**
- **Kansas:** $50,000+ in statutory damages PLUS actual damages + attorney fees
- **Wyoming:** Parents of minors can bring civil action
- **Arkansas, Kentucky, Louisiana:** Individuals can sue for damages

**Financial Risk:**
- Class action lawsuit potential (thousands of plaintiffs)
- Must pay plaintiff's attorney fees if you lose
- Statutory damages (fixed amounts, don't need to prove actual harm)
- Discovery costs (defending lawsuits is expensive even if you win)

**Comparison:** States with ONLY government enforcement (Attorney General) = lower risk. States with private right of action = significantly higher litigation risk.

---

## Legal Disclaimer

⚠️ **IMPORTANT:** This tool is for informational purposes only and does NOT constitute legal advice. Laws are subject to change, interpretation varies, and enforcement is unpredictable. You MUST consult with a qualified attorney before making any business decisions based on this information.

---

## Data Sources

- **Legal requirements:** Original legal research (2024-2025)
- **Population data:** US Census Bureau 2025
- **LGBTQ+ demographics:** Williams Institute, Gallup, MAP
- **Last updated:** November 2025

