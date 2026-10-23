#!/usr/bin/env python3
"""Validate src/data/questions.json for Smart Quiz. Usage: python3 validate_questions.py [path]"""
import json, sys, collections

path = sys.argv[1] if len(sys.argv) > 1 else "questions.json"
TOPICS = {"cloud-concepts", "architecture-services", "management-governance"}
DIFFS = {"easy", "medium", "hard"}
KEYS = {"id", "topic", "subtopic", "difficulty", "question", "options", "correctOptionId", "explanation"}
OKEYS = {"id", "text", "explanation"}
errors = []

with open(path, encoding="utf-8") as f:
    data = json.load(f)  # fails loudly on invalid JSON
if not isinstance(data, list):
    sys.exit("Top-level value must be an array")

ids, qtexts = set(), set()
for n, q in enumerate(data, 1):
    tag = q.get("id", f"#{n}")
    if set(q.keys()) != KEYS: errors.append(f"{tag}: keys {sorted(set(q.keys()) ^ KEYS)} differ from interface")
    if tag in ids: errors.append(f"{tag}: duplicate id")
    ids.add(tag)
    if q.get("topic") not in TOPICS: errors.append(f"{tag}: invalid topic {q.get('topic')!r}")
    if q.get("difficulty") not in DIFFS: errors.append(f"{tag}: invalid difficulty")
    for k in ("id", "subtopic", "question", "explanation"):
        if not isinstance(q.get(k), str) or not q[k].strip(): errors.append(f"{tag}: empty {k}")
    if q.get("question") in qtexts: errors.append(f"{tag}: duplicate question text")
    qtexts.add(q.get("question"))
    opts = q.get("options", [])
    if len(opts) != 4: errors.append(f"{tag}: {len(opts)} options")
    oids = [o.get("id") for o in opts]
    if oids != ["A", "B", "C", "D"]: errors.append(f"{tag}: option ids {oids}")
    if len({o.get("text") for o in opts}) != len(opts): errors.append(f"{tag}: duplicate option text")
    for o in opts:
        if set(o.keys()) != OKEYS: errors.append(f"{tag}/{o.get('id')}: option keys wrong")
        for k in ("text", "explanation"):
            if not isinstance(o.get(k), str) or not o[k].strip(): errors.append(f"{tag}/{o.get('id')}: empty {k}")
    if oids.count(q.get("correctOptionId")) != 1: errors.append(f"{tag}: correctOptionId does not match exactly one option")
    else:
        for o in opts:
            is_c = o["id"] == q["correctOptionId"]
            if is_c != o["explanation"].startswith("Correct"): errors.append(f"{tag}/{o['id']}: explanation does not match correctness")

by = lambda k: collections.Counter(q[k] if k != "pos" else q["correctOptionId"] for q in data)
print(f"Questions: {len(data)}")
print("By topic:     ", dict(by("topic")))
print("By difficulty:", dict(by("difficulty")))
print("Correct pos:  ", dict(sorted(by("pos").items())))
runs = max(len(list(g)) for _, g in __import__("itertools").groupby(q["correctOptionId"] for q in data))
print("Longest run of identical correct letters:", runs)
print("RESULT:", "PASS" if not errors else "FAIL")
for e in errors: print(" -", e)
sys.exit(1 if errors else 0)
