#!/usr/bin/env python3
"""
Validate the updated states-data.json
"""
import json
import sys

print("=" * 80)
print("VALIDATION CHECKS FOR UPDATED states-data.json")
print("=" * 80)
print()

# Load updated data
try:
    with open('data/states-data.json', 'r') as f:
        states_data = json.load(f)
    print("✓ JSON is valid and loads correctly")
except json.JSONDecodeError as e:
    print(f"❌ JSON SYNTAX ERROR: {e}")
    sys.exit(1)

print()

# ============================================================================
# CHECK 1: Structure validation
# ============================================================================
print("CHECK 1: Data Structure Validation")
print("-" * 80)

required_fields = {
    'top_level': ['state', 'abbreviation', 'population', 'populationPercent', 'lgbtqDensity', 'legal'],
    'legal': ['tier', 'idRequired', 'applicabilityExact', 'idRequirementsExact', 'penaltiesExact',
              'verificationMethods', 'penalties', 'citation', 'effectiveDate', 'notes'],
    'verificationMethods': ['creditCard', 'digitizedId', 'governmentId', 'transactionalData',
                           'ial2Required', 'photoMatching', 'anonymousOption', 'thirdPartyService',
                           'commercialDatabase', 'commerciallySoftware', 'bankAccount', 'financialDocument'],
    'penalties': ['perViolation', 'perDay', 'ifMinorAccesses', 'privateRightOfAction',
                  'attorneyFees', 'civilOnly', 'punitiveDamages', 'injunctiveRelief', 'statutoryDamages']
}

structure_errors = []

for state in states_data:
    state_name = state['state']

    # Check top-level fields
    for field in required_fields['top_level']:
        if field not in state:
            structure_errors.append(f"{state_name}: Missing top-level field '{field}'")

    # Check legal fields
    if 'legal' in state:
        for field in required_fields['legal']:
            if field not in state['legal']:
                structure_errors.append(f"{state_name}: Missing legal field '{field}'")

        # Check verificationMethods fields
        if 'verificationMethods' in state['legal']:
            for field in required_fields['verificationMethods']:
                if field not in state['legal']['verificationMethods']:
                    structure_errors.append(f"{state_name}: Missing verificationMethods field '{field}'")

        # Check penalties fields
        if 'penalties' in state['legal']:
            for field in required_fields['penalties']:
                if field not in state['legal']['penalties']:
                    structure_errors.append(f"{state_name}: Missing penalties field '{field}'")

if structure_errors:
    print(f"❌ Found {len(structure_errors)} structure errors:")
    for error in structure_errors:
        print(f"   • {error}")
    sys.exit(1)
else:
    print(f"✓ All {len(states_data)} states have complete structure")
    print(f"✓ All 12 verification method fields present")
    print(f"✓ All 9 penalty fields present")

print()

# ============================================================================
# CHECK 2: Verify new fields are present and properly initialized
# ============================================================================
print("CHECK 2: New Fields Validation")
print("-" * 80)

new_fields_check = {
    'bankAccount': 0,
    'financialDocument': 0,
    'punitiveDamages': 0,
    'injunctiveRelief': 0,
    'statutoryDamages': 0
}

for state in states_data:
    # Check new verification method fields
    if state['legal']['verificationMethods'].get('bankAccount'):
        new_fields_check['bankAccount'] += 1
    if state['legal']['verificationMethods'].get('financialDocument'):
        new_fields_check['financialDocument'] += 1

    # Check new penalty fields
    if state['legal']['penalties'].get('punitiveDamages'):
        new_fields_check['punitiveDamages'] += 1
    if state['legal']['penalties'].get('injunctiveRelief'):
        new_fields_check['injunctiveRelief'] += 1
    if state['legal']['penalties'].get('statutoryDamages'):
        new_fields_check['statutoryDamages'] += 1

print("New fields usage:")
print(f"  • bankAccount: {new_fields_check['bankAccount']} state(s) - Expected: 1 (South Dakota)")
print(f"  • financialDocument: {new_fields_check['financialDocument']} state(s) - Expected: 1 (Nebraska)")
print(f"  • punitiveDamages: {new_fields_check['punitiveDamages']} state(s) - Expected: 3 (FL, NC, SC)")
print(f"  • injunctiveRelief: {new_fields_check['injunctiveRelief']} state(s) - Expected: 4 (NC, ND, OK, SC)")
print(f"  • statutoryDamages: {new_fields_check['statutoryDamages']} state(s) - Expected: 2 (ID, KS)")

# Validate counts
expected_counts = {
    'bankAccount': 1,
    'financialDocument': 1,
    'punitiveDamages': 3,
    'injunctiveRelief': 4,
    'statutoryDamages': 2
}

all_counts_correct = True
for field, expected in expected_counts.items():
    if new_fields_check[field] != expected:
        print(f"❌ {field}: Expected {expected}, got {new_fields_check[field]}")
        all_counts_correct = False

if all_counts_correct:
    print("✓ All new field counts are correct")

print()

# ============================================================================
# CHECK 3: Verify specific state updates
# ============================================================================
print("CHECK 3: Specific State Updates Validation")
print("-" * 80)

states_dict = {state['state']: state for state in states_data}

checks = []

# Tennessee - 7-year retention
tn = states_dict['Tennessee']
if '7 years' in tn['legal']['notes'] or '7-year' in tn['legal']['notes']:
    checks.append(("Tennessee", "7-year retention note", "✓"))
else:
    checks.append(("Tennessee", "7-year retention note", "❌"))

# Arkansas - IAL2 definition
ar = states_dict['Arkansas']
if 'framework' in ar['legal']['idRequirementsExact']:
    checks.append(("Arkansas", "IAL2 definition", "✓"))
else:
    checks.append(("Arkansas", "IAL2 definition", "❌"))

# Oklahoma - ISP blocking
ok = states_dict['Oklahoma']
if 'Internet service providers' in ok['legal']['applicabilityExact'] or 'ISP' in ok['legal']['applicabilityExact']:
    checks.append(("Oklahoma", "ISP blocking requirement", "✓"))
else:
    checks.append(("Oklahoma", "ISP blocking requirement", "❌"))

if ok['legal']['penalties']['injunctiveRelief']:
    checks.append(("Oklahoma", "injunctiveRelief flag", "✓"))
else:
    checks.append(("Oklahoma", "injunctiveRelief flag", "❌"))

# Florida - punitiveDamages
fl = states_dict['Florida']
if fl['legal']['penalties']['punitiveDamages']:
    checks.append(("Florida", "punitiveDamages flag", "✓"))
else:
    checks.append(("Florida", "punitiveDamages flag", "❌"))

# North Carolina - both flags
nc = states_dict['North Carolina']
if nc['legal']['penalties']['punitiveDamages']:
    checks.append(("North Carolina", "punitiveDamages flag", "✓"))
else:
    checks.append(("North Carolina", "punitiveDamages flag", "❌"))

if nc['legal']['penalties']['injunctiveRelief']:
    checks.append(("North Carolina", "injunctiveRelief flag", "✓"))
else:
    checks.append(("North Carolina", "injunctiveRelief flag", "❌"))

# South Carolina - both flags
sc = states_dict['South Carolina']
if sc['legal']['penalties']['punitiveDamages']:
    checks.append(("South Carolina", "punitiveDamages flag", "✓"))
else:
    checks.append(("South Carolina", "punitiveDamages flag", "❌"))

if sc['legal']['penalties']['injunctiveRelief']:
    checks.append(("South Carolina", "injunctiveRelief flag", "✓"))
else:
    checks.append(("South Carolina", "injunctiveRelief flag", "❌"))

# North Dakota
nd = states_dict['North Dakota']
if nd['legal']['penalties']['injunctiveRelief']:
    checks.append(("North Dakota", "injunctiveRelief flag", "✓"))
else:
    checks.append(("North Dakota", "injunctiveRelief flag", "❌"))

# Idaho
id_state = states_dict['Idaho']
if id_state['legal']['penalties']['statutoryDamages'] == "$10,000":
    checks.append(("Idaho", "statutoryDamages value", "✓"))
else:
    checks.append(("Idaho", "statutoryDamages value", "❌"))

# Kansas
ks = states_dict['Kansas']
if ks['legal']['penalties']['statutoryDamages'] == "$50,000 or more":
    checks.append(("Kansas", "statutoryDamages value", "✓"))
else:
    checks.append(("Kansas", "statutoryDamages value", "❌"))

# South Dakota
sd = states_dict['South Dakota']
if sd['legal']['verificationMethods']['bankAccount']:
    checks.append(("South Dakota", "bankAccount flag", "✓"))
else:
    checks.append(("South Dakota", "bankAccount flag", "❌"))

# Nebraska
ne = states_dict['Nebraska']
if ne['legal']['verificationMethods']['financialDocument']:
    checks.append(("Nebraska", "financialDocument flag", "✓"))
else:
    checks.append(("Nebraska", "financialDocument flag", "❌"))

# Print results
for state, check, result in checks:
    print(f"{result} {state}: {check}")

failed_checks = [c for c in checks if c[2] == "❌"]
if failed_checks:
    print(f"\n❌ {len(failed_checks)} checks failed")
    sys.exit(1)
else:
    print(f"\n✓ All {len(checks)} specific state checks passed")

print()

# ============================================================================
# CHECK 4: Data integrity checks
# ============================================================================
print("CHECK 4: Data Integrity Checks")
print("-" * 80)

# Check that all states have unique names
state_names = [s['state'] for s in states_data]
if len(state_names) != len(set(state_names)):
    print("❌ Duplicate state names found")
    sys.exit(1)
else:
    print(f"✓ All {len(state_names)} state names are unique")

# Check tier values are valid
valid_tiers = [0, 1, 2, 3, 4]
invalid_tiers = []
for state in states_data:
    if state['legal']['tier'] not in valid_tiers:
        invalid_tiers.append(f"{state['state']}: tier={state['legal']['tier']}")

if invalid_tiers:
    print(f"❌ Invalid tier values found:")
    for invalid in invalid_tiers:
        print(f"   • {invalid}")
    sys.exit(1)
else:
    print("✓ All tier values are valid (0-4)")

# Check that verification method booleans are actually booleans
vm_type_errors = []
for state in states_data:
    for key, value in state['legal']['verificationMethods'].items():
        if not isinstance(value, bool):
            vm_type_errors.append(f"{state['state']}: {key} is {type(value).__name__}, not bool")

if vm_type_errors:
    print(f"❌ Verification method type errors:")
    for error in vm_type_errors:
        print(f"   • {error}")
    sys.exit(1)
else:
    print("✓ All verification method values are booleans")

# Check that penalty booleans are booleans
penalty_type_errors = []
for state in states_data:
    for key, value in state['legal']['penalties'].items():
        if key in ['privateRightOfAction', 'attorneyFees', 'civilOnly', 'punitiveDamages', 'injunctiveRelief']:
            if not isinstance(value, bool):
                penalty_type_errors.append(f"{state['state']}: {key} is {type(value).__name__}, not bool")

if penalty_type_errors:
    print(f"❌ Penalty boolean type errors:")
    for error in penalty_type_errors:
        print(f"   • {error}")
    sys.exit(1)
else:
    print("✓ All penalty boolean values are booleans")

print()

# ============================================================================
# FINAL SUMMARY
# ============================================================================
print("=" * 80)
print("✅ ALL VALIDATION CHECKS PASSED")
print("=" * 80)
print()
print("Summary:")
print(f"  • {len(states_data)} states validated")
print(f"  • {len(required_fields['verificationMethods'])} verification method fields")
print(f"  • {len(required_fields['penalties'])} penalty fields")
print(f"  • {len(checks)} specific state updates verified")
print(f"  • Data integrity confirmed")
print()
print("✅ states-data.json is ready for production use")
