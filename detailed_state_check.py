#!/usr/bin/env python3
"""
Detailed state-by-state verification against legal_matrix_data.txt
"""
import json
import difflib

# Load JSON data
with open('data/states-data.json', 'r') as f:
    states_data = json.load(f)

# Load text data
with open('legal_matrix_data.txt', 'r') as f:
    matrix_lines = f.readlines()

# Create a dictionary keyed by state name
json_by_state = {state['state']: state for state in states_data}

def find_state_in_matrix(state_name):
    """Find state information in matrix text"""
    for i, line in enumerate(matrix_lines):
        if line.strip() == state_name:
            # Found the state, now extract data
            # Previous line should be Yes/No
            if i > 0:
                id_req = matrix_lines[i-1].strip()

                result = {
                    'idRequired': id_req == 'Yes',
                    'applicability': '',
                    'requirements': '',
                    'penalties': '',
                    'citation': '',
                    'notes': ''
                }

                # Next lines should be applicability, requirements, penalties, citation
                j = i + 1
                field_idx = 0
                fields = ['applicability', 'requirements', 'penalties', 'citation']
                current_field = None

                while j < len(matrix_lines) and field_idx < 4:
                    line = matrix_lines[j].strip()

                    # Skip empty lines
                    if not line:
                        j += 1
                        continue

                    # Check if we hit next state
                    if line in ['Yes', 'No'] and j + 1 < len(matrix_lines):
                        next_line = matrix_lines[j+1].strip()
                        # Check if next line looks like a state name
                        if len(next_line) > 0 and next_line[0].isupper() and not line.startswith('-'):
                            break

                    # Assign to current field
                    if field_idx < 4:
                        current_field = fields[field_idx]
                        if result[current_field]:
                            result[current_field] += ' ' + line
                        else:
                            result[current_field] = line

                        # Move to next field if line doesn't start with - (continuation)
                        if not (j + 1 < len(matrix_lines) and matrix_lines[j+1].strip().startswith('-')):
                            # Check if next line is continuation (starts with -)
                            peek_j = j + 1
                            while peek_j < len(matrix_lines):
                                peek_line = matrix_lines[peek_j].strip()
                                if not peek_line:
                                    peek_j += 1
                                    continue
                                if peek_line.startswith('-'):
                                    # It's continuation, don't move to next field yet
                                    j = peek_j
                                    result[current_field] += ' ' + peek_line
                                    peek_j += 1
                                else:
                                    # Not continuation
                                    field_idx += 1
                                    break
                            if peek_j >= len(matrix_lines):
                                field_idx += 1
                        else:
                            # Next line is continuation
                            pass
                    else:
                        # Everything after citation is notes
                        if result['notes']:
                            result['notes'] += ' ' + line
                        else:
                            result['notes'] = line

                    j += 1

                return result

    return None

def compare_text(text1, text2, threshold=0.8):
    """Compare two texts and return similarity ratio"""
    if not text1 and not text2:
        return 1.0
    if not text1 or not text2:
        return 0.0

    # Clean texts
    t1 = ' '.join(text1.lower().split())
    t2 = ' '.join(text2.lower().split())

    # Use difflib
    return difflib.SequenceMatcher(None, t1, t2).ratio()

# Track all discrepancies
all_discrepancies = []

print("=" * 100)
print("DETAILED STATE-BY-STATE VERIFICATION")
print("=" * 100)
print()

# Check each state
for state in sorted(states_data, key=lambda x: x['state']):
    state_name = state['state']
    json_legal = state['legal']

    matrix_legal = find_state_in_matrix(state_name)

    if not matrix_legal:
        print(f"\n⚠️  {state_name}: NOT FOUND IN MATRIX")
        all_discrepancies.append({
            'state': state_name,
            'issue': 'Not found in matrix data'
        })
        continue

    # Compare data
    discrepancies = []

    # 1. Check idRequired
    if json_legal['idRequired'] != matrix_legal['idRequired']:
        discrepancies.append({
            'field': 'idRequired',
            'json': json_legal['idRequired'],
            'matrix': matrix_legal['idRequired']
        })

    # 2. Check applicability (if state requires ID)
    if matrix_legal['idRequired'] and matrix_legal['applicability'] != '-':
        similarity = compare_text(json_legal['applicabilityExact'], matrix_legal['applicability'])
        if similarity < 0.85:
            discrepancies.append({
                'field': 'applicabilityExact',
                'similarity': f"{similarity:.2%}",
                'json': json_legal['applicabilityExact'][:100] + '...' if len(json_legal['applicabilityExact']) > 100 else json_legal['applicabilityExact'],
                'matrix': matrix_legal['applicability'][:100] + '...' if len(matrix_legal['applicability']) > 100 else matrix_legal['applicability']
            })

    # 3. Check requirements
    if matrix_legal['idRequired'] and matrix_legal['requirements'] != '-':
        similarity = compare_text(json_legal['idRequirementsExact'], matrix_legal['requirements'])
        if similarity < 0.85:
            discrepancies.append({
                'field': 'idRequirementsExact',
                'similarity': f"{similarity:.2%}",
                'json': json_legal['idRequirementsExact'][:100] + '...' if len(json_legal['idRequirementsExact']) > 100 else json_legal['idRequirementsExact'],
                'matrix': matrix_legal['requirements'][:100] + '...' if len(matrix_legal['requirements']) > 100 else matrix_legal['requirements']
            })

    # 4. Check penalties
    if matrix_legal['idRequired'] and matrix_legal['penalties'] != '-':
        similarity = compare_text(json_legal['penaltiesExact'], matrix_legal['penalties'])
        if similarity < 0.85:
            discrepancies.append({
                'field': 'penaltiesExact',
                'similarity': f"{similarity:.2%}",
                'json': json_legal['penaltiesExact'][:100] + '...' if len(json_legal['penaltiesExact']) > 100 else json_legal['penaltiesExact'],
                'matrix': matrix_legal['penalties'][:100] + '...' if len(matrix_legal['penalties']) > 100 else matrix_legal['penalties']
            })

    # 5. Check citation
    if matrix_legal['citation'] and matrix_legal['citation'] != '-':
        json_citation = json_legal['citation'].strip() if json_legal['citation'] else ''
        matrix_citation = matrix_legal['citation'].strip()
        if json_citation.lower() != matrix_citation.lower():
            discrepancies.append({
                'field': 'citation',
                'json': json_citation,
                'matrix': matrix_citation
            })

    if discrepancies:
        print(f"\n{'='*100}")
        print(f"❌ {state_name} - {len(discrepancies)} discrepancies found")
        print('='*100)
        for disc in discrepancies:
            print(f"\nField: {disc['field']}")
            if 'similarity' in disc:
                print(f"  Similarity: {disc['similarity']}")
            print(f"  JSON:   {disc['json']}")
            print(f"  Matrix: {disc['matrix']}")

        all_discrepancies.append({
            'state': state_name,
            'discrepancies': discrepancies
        })
    else:
        print(f"✅ {state_name} - All data matches")

print(f"\n\n{'='*100}")
print(f"SUMMARY")
print('='*100)
print(f"\nTotal states checked: {len(states_data)}")
print(f"States with discrepancies: {len(all_discrepancies)}")
print(f"States matching: {len(states_data) - len(all_discrepancies)}")

if all_discrepancies:
    print(f"\nStates with issues:")
    for item in all_discrepancies:
        if 'discrepancies' in item:
            print(f"  - {item['state']}: {len(item['discrepancies'])} discrepancies")
        else:
            print(f"  - {item['state']}: {item['issue']}")
