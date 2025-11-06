#!/usr/bin/env python3
"""
Apply all corrections to states-data.json
"""
import json
import sys

# Load current data
with open('data/states-data.json', 'r') as f:
    states_data = json.load(f)

# Create a dictionary for easy lookup
states_dict = {state['state']: state for state in states_data}

print("=" * 80)
print("APPLYING CORRECTIONS TO states-data.json")
print("=" * 80)
print()

# Track all changes
changes_made = []

# ============================================================================
# STEP 1: Add new fields to all states
# ============================================================================
print("STEP 1: Adding new data structure fields to all states...")
print("-" * 80)

for state in states_data:
    state_name = state['state']

    # Add new verification method fields
    if 'bankAccount' not in state['legal']['verificationMethods']:
        state['legal']['verificationMethods']['bankAccount'] = False
        changes_made.append(f"{state_name}: Added verificationMethods.bankAccount field")

    if 'financialDocument' not in state['legal']['verificationMethods']:
        state['legal']['verificationMethods']['financialDocument'] = False
        changes_made.append(f"{state_name}: Added verificationMethods.financialDocument field")

    # Add new penalty fields
    if 'punitiveDamages' not in state['legal']['penalties']:
        state['legal']['penalties']['punitiveDamages'] = False
        changes_made.append(f"{state_name}: Added penalties.punitiveDamages field")

    if 'injunctiveRelief' not in state['legal']['penalties']:
        state['legal']['penalties']['injunctiveRelief'] = False
        changes_made.append(f"{state_name}: Added penalties.injunctiveRelief field")

    if 'statutoryDamages' not in state['legal']['penalties']:
        state['legal']['penalties']['statutoryDamages'] = None
        changes_made.append(f"{state_name}: Added penalties.statutoryDamages field")

print(f"✓ Added 5 new fields to all {len(states_data)} states")
print()

# ============================================================================
# STEP 2: Tennessee - Add data retention note
# ============================================================================
print("STEP 2: Tennessee - Adding 7-year data retention requirement...")
print("-" * 80)

tn = states_dict['Tennessee']
if '7 years' not in tn['legal']['notes']:
    tn['legal']['notes'] = "Anonymized age-verification data must be retained for 7 years."
    changes_made.append("Tennessee: Added 7-year data retention to notes")
    print("✓ Tennessee updated")
else:
    print("✓ Tennessee already has retention note")
print()

# ============================================================================
# STEP 3: Arkansas - Add IAL2 definition
# ============================================================================
print("STEP 3: Arkansas - Adding IAL2 definition...")
print("-" * 80)

ar = states_dict['Arkansas']
ial2_definition = "\n\nIdentity Assurance Level 2 is a framework for confirming an individual's ownership of a genuine identity by using personal information, identity documentation, and biometric characteristics"

if 'framework' not in ar['legal']['idRequirementsExact']:
    ar['legal']['idRequirementsExact'] += ial2_definition
    changes_made.append("Arkansas: Added IAL2 definition to idRequirementsExact")
    print("✓ Arkansas updated")
else:
    print("✓ Arkansas already has IAL2 definition")
print()

# ============================================================================
# STEP 4: Oklahoma - Add ISP blocking requirement
# ============================================================================
print("STEP 4: Oklahoma - Adding ISP blocking requirement...")
print("-" * 80)

ok = states_dict['Oklahoma']
isp_text = "\n\nThe opportunity to block the services must be given to Internet service providers before any individual may access the material."

if 'Internet service providers' not in ok['legal']['applicabilityExact']:
    ok['legal']['applicabilityExact'] += isp_text
    changes_made.append("Oklahoma: Added ISP blocking to applicabilityExact")
    print("✓ Oklahoma applicability updated")
else:
    print("✓ Oklahoma already has ISP blocking text")

if 'ISP' not in ok['legal']['notes']:
    ok['legal']['notes'] = "ISP blocking requirement"
    changes_made.append("Oklahoma: Added ISP note")
    print("✓ Oklahoma notes updated")
else:
    print("✓ Oklahoma already has ISP note")

ok['legal']['penalties']['injunctiveRelief'] = True
changes_made.append("Oklahoma: Set injunctiveRelief = true")
print("✓ Oklahoma injunctiveRelief flag set")
print()

# ============================================================================
# STEP 5: Florida - Set punitiveDamages flag
# ============================================================================
print("STEP 5: Florida - Setting punitiveDamages flag...")
print("-" * 80)

fl = states_dict['Florida']
fl['legal']['penalties']['punitiveDamages'] = True
changes_made.append("Florida: Set punitiveDamages = true")
print("✓ Florida updated")
print()

# ============================================================================
# STEP 6: North Carolina - Set punitive and injunctive flags
# ============================================================================
print("STEP 6: North Carolina - Setting punitive and injunctive flags...")
print("-" * 80)

nc = states_dict['North Carolina']
nc['legal']['penalties']['punitiveDamages'] = True
nc['legal']['penalties']['injunctiveRelief'] = True
changes_made.append("North Carolina: Set punitiveDamages = true")
changes_made.append("North Carolina: Set injunctiveRelief = true")
print("✓ North Carolina updated")
print()

# ============================================================================
# STEP 7: South Carolina - Set punitive and injunctive flags
# ============================================================================
print("STEP 7: South Carolina - Setting punitive and injunctive flags...")
print("-" * 80)

sc = states_dict['South Carolina']
sc['legal']['penalties']['punitiveDamages'] = True
sc['legal']['penalties']['injunctiveRelief'] = True
changes_made.append("South Carolina: Set punitiveDamages = true")
changes_made.append("South Carolina: Set injunctiveRelief = true")
print("✓ South Carolina updated")
print()

# ============================================================================
# STEP 8: North Dakota - Set injunctiveRelief flag
# ============================================================================
print("STEP 8: North Dakota - Setting injunctiveRelief flag...")
print("-" * 80)

nd = states_dict['North Dakota']
nd['legal']['penalties']['injunctiveRelief'] = True
changes_made.append("North Dakota: Set injunctiveRelief = true")
print("✓ North Dakota updated")
print()

# ============================================================================
# STEP 9: Idaho - Set statutoryDamages value
# ============================================================================
print("STEP 9: Idaho - Setting statutoryDamages value...")
print("-" * 80)

id = states_dict['Idaho']
id['legal']['penalties']['statutoryDamages'] = "$10,000"
changes_made.append("Idaho: Set statutoryDamages = '$10,000'")
print("✓ Idaho updated")
print()

# ============================================================================
# STEP 10: Kansas - Set statutoryDamages value
# ============================================================================
print("STEP 10: Kansas - Setting statutoryDamages value...")
print("-" * 80)

ks = states_dict['Kansas']
ks['legal']['penalties']['statutoryDamages'] = "$50,000 or more"
changes_made.append("Kansas: Set statutoryDamages = '$50,000 or more'")
print("✓ Kansas updated")
print()

# ============================================================================
# STEP 11: South Dakota - Set bankAccount flag
# ============================================================================
print("STEP 11: South Dakota - Setting bankAccount flag...")
print("-" * 80)

sd = states_dict['South Dakota']
sd['legal']['verificationMethods']['bankAccount'] = True
changes_made.append("South Dakota: Set bankAccount = true")
print("✓ South Dakota updated")
print()

# ============================================================================
# STEP 12: Nebraska - Set financialDocument flag
# ============================================================================
print("STEP 12: Nebraska - Setting financialDocument flag...")
print("-" * 80)

ne = states_dict['Nebraska']
ne['legal']['verificationMethods']['financialDocument'] = True
changes_made.append("Nebraska: Set financialDocument = true")
print("✓ Nebraska updated")
print()

# ============================================================================
# Save the updated data
# ============================================================================
print("=" * 80)
print("SAVING UPDATED DATA")
print("=" * 80)
print()

# Create backup
with open('data/states-data.json.backup', 'w') as f:
    json.dump(states_data, f, indent=2, ensure_ascii=False)
print("✓ Backup created: data/states-data.json.backup")

# Save updated data
with open('data/states-data.json', 'w') as f:
    json.dump(states_data, f, indent=2, ensure_ascii=False)
print("✓ Updated data saved: data/states-data.json")
print()

# ============================================================================
# Summary
# ============================================================================
print("=" * 80)
print("SUMMARY OF ALL CHANGES")
print("=" * 80)
print()
print(f"Total changes made: {len(changes_made)}")
print()

# Group changes by type
structural_changes = [c for c in changes_made if 'Added' in c and 'field' in c]
text_changes = [c for c in changes_made if any(x in c for x in ['Added', 'Updated']) and 'field' not in c]
flag_changes = [c for c in changes_made if 'Set' in c]

print(f"Structural changes (new fields): {len(structural_changes)}")
print(f"Text changes: {len([c for c in text_changes if 'field' not in c])}")
print(f"Flag updates: {len(flag_changes)}")
print()

print("States affected by non-structural changes:")
affected_states = set()
for change in changes_made:
    if 'field' not in change:
        state = change.split(':')[0]
        affected_states.add(state)

for state in sorted(affected_states):
    state_changes = [c for c in changes_made if c.startswith(state + ':') and 'field' not in c]
    print(f"  • {state}: {len(state_changes)} change(s)")

print()
print("=" * 80)
print("✅ ALL CORRECTIONS APPLIED SUCCESSFULLY")
print("=" * 80)
