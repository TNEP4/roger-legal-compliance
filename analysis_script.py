#!/usr/bin/env python3
"""
Comprehensive review of states-data.json against legal_matrix_data.txt
"""
import json
import re

# Load JSON data
with open('data/states-data.json', 'r') as f:
    states_data = json.load(f)

# Load text data
with open('legal_matrix_data.txt', 'r') as f:
    matrix_text = f.read()

# Parse the matrix text by state
def parse_matrix_data():
    """Parse the legal matrix text file"""
    states_info = {}
    lines = matrix_text.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Check if this is a state entry (Yes/No followed by state name)
        if line in ['Yes', 'No'] and i + 1 < len(lines):
            id_required = line == 'Yes'
            i += 1
            state_name = lines[i].strip()

            if state_name in ['ID Req?', 'States', '-']:
                i += 1
                continue

            # Collect the next 4 lines: applicability, requirements, penalties, citation
            applicability = lines[i+1].strip() if i+1 < len(lines) else ''
            requirements = lines[i+2].strip() if i+2 < len(lines) else ''
            penalties = lines[i+3].strip() if i+3 < len(lines) else ''
            citation = lines[i+4].strip() if i+4 < len(lines) else ''

            # Handle multi-line entries
            j = i + 5
            while j < len(lines) and lines[j].strip() and lines[j].strip() not in ['Yes', 'No']:
                # This might be continuation of previous field or notes
                if not lines[j].strip().startswith('-') and len(lines[j].strip()) > 50:
                    # Likely a note or continuation
                    if citation and citation != '-':
                        # Add to notes
                        pass
                j += 1

            states_info[state_name] = {
                'idRequired': id_required,
                'applicability': applicability,
                'requirements': requirements,
                'penalties': penalties,
                'citation': citation
            }

            i = j
        else:
            i += 1

    return states_info

# Analyze verification methods coverage
def analyze_verification_methods():
    """Analyze what verification methods are mentioned across all states"""
    methods_found = {
        'creditCard': [],
        'digitizedId': [],
        'governmentId': [],
        'transactionalData': [],
        'ial2Required': [],
        'photoMatching': [],
        'anonymousOption': [],
        'thirdPartyService': [],
        'commercialDatabase': [],
        'commerciallySoftware': [],
        'bankAccount': [],  # New - found in South Dakota
        'financialDocument': [],  # New - found in Nebraska
    }

    for state in states_data:
        requirements = state['legal']['idRequirementsExact'].lower()
        state_name = state['state']

        if 'credit card' in requirements or 'debit card' in requirements:
            methods_found['creditCard'].append(state_name)
        if 'digitized id' in requirements or 'digital id' in requirements:
            methods_found['digitizedId'].append(state_name)
        if 'government-issued id' in requirements or 'government issued id' in requirements:
            methods_found['governmentId'].append(state_name)
        if 'transactional data' in requirements:
            methods_found['transactionalData'].append(state_name)
        if 'ial2' in requirements or 'identity assurance level 2' in requirements:
            methods_found['ial2Required'].append(state_name)
        if 'photo' in requirements and 'match' in requirements:
            methods_found['photoMatching'].append(state_name)
        if 'anonymous' in requirements:
            methods_found['anonymousOption'].append(state_name)
        if 'third party' in requirements or 'third-party' in requirements:
            methods_found['thirdPartyService'].append(state_name)
        if 'commercial database' in requirements or 'commercially available database' in requirements:
            methods_found['commercialDatabase'].append(state_name)
        if 'commercially available software' in requirements or 'commercially reasonable' in requirements:
            methods_found['commerciallySoftware'].append(state_name)
        if 'bank account' in requirements:
            methods_found['bankAccount'].append(state_name)
        if 'financial document' in requirements:
            methods_found['financialDocument'].append(state_name)

    return methods_found

# Check each state's data
def check_state_data():
    """Cross-check each state against matrix data"""
    issues = []

    matrix_data = parse_matrix_data()

    for state in states_data:
        state_name = state['state']
        json_legal = state['legal']

        # Find in matrix
        if state_name in matrix_data:
            matrix_legal = matrix_data[state_name]

            # Check idRequired
            if json_legal['idRequired'] != matrix_legal['idRequired']:
                issues.append({
                    'state': state_name,
                    'field': 'idRequired',
                    'json_value': json_legal['idRequired'],
                    'matrix_value': matrix_legal['idRequired']
                })

            # Check applicability (basic check - not empty when should have data)
            if matrix_legal['idRequired'] and matrix_legal['applicability'] != '-':
                if not json_legal['applicabilityExact']:
                    issues.append({
                        'state': state_name,
                        'field': 'applicabilityExact',
                        'issue': 'Empty in JSON but has data in matrix'
                    })

            # Check requirements
            if matrix_legal['idRequired'] and matrix_legal['requirements'] != '-':
                if not json_legal['idRequirementsExact']:
                    issues.append({
                        'state': state_name,
                        'field': 'idRequirementsExact',
                        'issue': 'Empty in JSON but has data in matrix'
                    })
        else:
            issues.append({
                'state': state_name,
                'field': 'general',
                'issue': f'State {state_name} not found in matrix data'
            })

    return issues

# Analyze penalties structure
def analyze_penalties():
    """Check if penalties structure captures all types"""
    penalty_types_found = {
        'perViolation': [],
        'perDay': [],
        'ifMinorAccesses': [],
        'privateRightOfAction': [],
        'attorneyFees': [],
        'civilOnly': [],
        'punitiveDamages': [],  # New - found in some states
        'injunctiveRelief': [],  # New - found in some states
        'statutoryDamages': [],  # New - found in some states
    }

    for state in states_data:
        penalties_text = state['legal']['penaltiesExact'].lower()
        state_name = state['state']

        if penalties_text and penalties_text != '-':
            if 'punitive' in penalties_text:
                penalty_types_found['punitiveDamages'].append(state_name)
            if 'injunctive' in penalties_text:
                penalty_types_found['injunctiveRelief'].append(state_name)
            if 'statutory' in penalties_text:
                penalty_types_found['statutoryDamages'].append(state_name)

    return penalty_types_found

# Run all analyses
print("=" * 80)
print("COMPREHENSIVE DATA REVIEW")
print("=" * 80)
print()

print("1. VERIFICATION METHODS ANALYSIS")
print("-" * 80)
methods = analyze_verification_methods()
for method, states in methods.items():
    if states:
        print(f"\n{method}: {len(states)} states")
        print(f"  States: {', '.join(states)}")

print("\n\n2. PENALTIES STRUCTURE ANALYSIS")
print("-" * 80)
penalties = analyze_penalties()
for penalty_type, states in penalties.items():
    if states:
        print(f"\n{penalty_type}: {len(states)} states")
        print(f"  States: {', '.join(states)}")

print("\n\n3. DATA CONSISTENCY ISSUES")
print("-" * 80)
issues = check_state_data()
if issues:
    for issue in issues:
        print(f"\n{issue['state']}:")
        print(f"  Field: {issue['field']}")
        if 'json_value' in issue:
            print(f"  JSON: {issue['json_value']}")
            print(f"  Matrix: {issue['matrix_value']}")
        else:
            print(f"  Issue: {issue['issue']}")
else:
    print("\nNo issues found!")

print("\n\n4. MISSING VERIFICATION METHOD FIELDS")
print("-" * 80)
current_fields = ['creditCard', 'digitizedId', 'governmentId', 'transactionalData',
                 'ial2Required', 'photoMatching', 'anonymousOption', 'thirdPartyService',
                 'commercialDatabase', 'commerciallySoftware']
if methods.get('bankAccount'):
    print("\n⚠️  'bankAccount' method found but not in data structure")
    print(f"   States: {', '.join(methods['bankAccount'])}")
if methods.get('financialDocument'):
    print("\n⚠️  'financialDocument' method found but not in data structure")
    print(f"   States: {', '.join(methods['financialDocument'])}")

print("\n\n5. MISSING PENALTY FIELDS")
print("-" * 80)
current_penalty_fields = ['perViolation', 'perDay', 'ifMinorAccesses',
                          'privateRightOfAction', 'attorneyFees', 'civilOnly']
if penalties.get('punitiveDamages'):
    print("\n⚠️  'punitiveDamages' found but not in data structure")
    print(f"   States: {', '.join(penalties['punitiveDamages'])}")
if penalties.get('injunctiveRelief'):
    print("\n⚠️  'injunctiveRelief' found but not in data structure")
    print(f"   States: {', '.join(penalties['injunctiveRelief'])}")
if penalties.get('statutoryDamages'):
    print("\n⚠️  'statutoryDamages' found but not in data structure")
    print(f"   States: {', '.join(penalties['statutoryDamages'])}")
