"""
pbix_extractor.py
=================
Extracts the semantic model from a Power BI .pbix file and identifies
unused measures / calculated columns.

Requirements (install once):
    pip install pbixray pandas openpyxl --break-system-packages

Usage:
    python pbix_extractor.py "path/to/YourFile.pbix"

Output:
    semantic_model_extract.xlsx  (written to the current working directory)

==========================================================================
⚠️  HEURISTIC WARNING — READ BEFORE ACTING ON RESULTS
==========================================================================
Visual-usage detection is based on parsing the Report/Layout JSON that
Power BI Desktop embeds inside the .pbix ZIP.  The schema of that JSON
file varies across Desktop versions and visual types.  References used
*only* in:
  • conditional formatting rules
  • tooltip-only visuals
  • some custom visuals
  • report-level / page-level filter expressions using complex DAX
  • RLS (Row-Level Security) filter expressions
…may be missed, causing those items to be false-positively flagged as
"Unused".

Treat the UNUSED sheets as a prioritised review list, not a deletion list.
Verify each flagged item in Power BI Desktop before removing it.
==========================================================================
"""

import sys
import re
import json
import zipfile
import pathlib
import argparse
import warnings
from collections import defaultdict

import pandas as pd

# ---------------------------------------------------------------------------
# 0.  Argument handling
# ---------------------------------------------------------------------------
parser = argparse.ArgumentParser(description="Extract Power BI semantic model to Excel")
parser.add_argument(
    "pbix_path", nargs="?", default=None,
    help="Path to the .pbix file.  If omitted the script looks for any *.pbix "
         "sitting next to itself."
)
args = parser.parse_args()

if args.pbix_path:
    PBIX_PATH = pathlib.Path(args.pbix_path)
else:
    here = pathlib.Path(__file__).parent
    candidates = list(here.glob("*.pbix"))
    if not candidates:
        sys.exit(
            "❌  No .pbix found.  Pass the path explicitly:\n"
            "    python pbix_extractor.py 'path/to/YourFile.pbix'"
        )
    PBIX_PATH = candidates[0]
    print(f"ℹ️   Auto-detected: {PBIX_PATH}")

if not PBIX_PATH.exists():
    sys.exit(f"❌  File not found: {PBIX_PATH}")

OUTPUT_PATH = pathlib.Path("semantic_model_extract.xlsx")

# ---------------------------------------------------------------------------
# 1.  Load with pbixray
# ---------------------------------------------------------------------------
try:
    from pbixray import PBIXRay
except ImportError:
    sys.exit(
        "❌  pbixray not installed.  Run:\n"
        "    pip install pbixray pandas openpyxl --break-system-packages"
    )

print(f"📂  Loading: {PBIX_PATH}")
model = PBIXRay(str(PBIX_PATH))

# ---------------------------------------------------------------------------
# 2.  Helper: safely retrieve a DataFrame attribute
# ---------------------------------------------------------------------------
def safe_df(attr: str) -> pd.DataFrame:
    """
    Return model.<attr> as a DataFrame.
    Returns an empty DataFrame (with a note column) on any failure.
    """
    try:
        val = getattr(model, attr, None)
        if val is None:
            return pd.DataFrame()
        if isinstance(val, pd.DataFrame):
            return val.copy().reset_index(drop=True)
        # Some attrs return lists/arrays
        return pd.DataFrame(val).reset_index(drop=True)
    except Exception as exc:
        warnings.warn(f"Could not read model.{attr}: {exc}")
        return pd.DataFrame()


# ---------------------------------------------------------------------------
# 3.  Extract raw DataFrames using the correct pbixray attribute names
#
#   Confirmed attribute map (from introspection of this model):
#     dax_measures  → all calculated measures
#     dax_columns   → all calculated columns
#     dax_tables    → all calculated tables
#     schema        → full column schema (every table × column × dtype)
#     relationships → table relationships
#     power_query   → M source code per table
# ---------------------------------------------------------------------------
print("🔍  Extracting model metadata …")

measures_raw      = safe_df("dax_measures")    # cols: TableName, Name, Expression, DisplayFolder, Description
calc_cols_raw     = safe_df("dax_columns")     # cols: TableName, ColumnName, Expression
calc_tables_raw   = safe_df("dax_tables")      # cols: TableName, Expression
schema_raw        = safe_df("schema")          # cols: TableName, ColumnName, PandasDataType
relationships_raw = safe_df("relationships")   # cols: FromTableName, FromColumnName, ToTableName, ToColumnName, ...
pq_raw            = safe_df("power_query")     # cols: TableName, Expression

# Optionally pull the rich tmschema columns table for a more detailed schema
tmschema_cols     = safe_df("tmschema_columns")  # may include FormatString, IsHidden, etc.

for label, df in [
    ("Measures",       measures_raw),
    ("Calc columns",   calc_cols_raw),
    ("Calc tables",    calc_tables_raw),
    ("Schema",         schema_raw),
    ("Relationships",  relationships_raw),
    ("Power Query",    pq_raw),
    ("tmschema_cols",  tmschema_cols),
]:
    print(f"  {label:18s}: {len(df):4d} rows | cols: {list(df.columns)[:8]}")

# ---------------------------------------------------------------------------
# 4.  Tidy the Measures sheet
#     pbixray cols: TableName, Name, Expression, DisplayFolder, Description
# ---------------------------------------------------------------------------
def build_measures_df(raw: pd.DataFrame) -> pd.DataFrame:
    """Return a clean Measures DataFrame with canonical column names."""
    if raw.empty:
        return raw

    col_map = {
        "TableName":     "Table",
        "Name":          "Name",
        "Expression":    "DAXExpression",
        "DisplayFolder": "DisplayFolder",
        "Description":   "Description",
    }
    # Add FormatString if present
    if "FormatString" in raw.columns:
        col_map["FormatString"] = "FormatString"

    available = {k: v for k, v in col_map.items() if k in raw.columns}
    df = raw[list(available.keys())].rename(columns=available)

    # Ensure expected columns exist even if missing from this version
    for col in ["Name", "Table", "DAXExpression", "DisplayFolder", "Description", "FormatString"]:
        if col not in df.columns:
            df[col] = ""

    return df.reset_index(drop=True)


# ---------------------------------------------------------------------------
# 5.  Tidy the Calc Columns sheet
#     pbixray cols: TableName, ColumnName, Expression
# ---------------------------------------------------------------------------
def build_calc_cols_df(raw: pd.DataFrame) -> pd.DataFrame:
    if raw.empty:
        return raw

    col_map = {
        "TableName":  "Table",
        "ColumnName": "Name",
        "Expression": "DAXExpression",
    }
    available = {k: v for k, v in col_map.items() if k in raw.columns}
    df = raw[list(available.keys())].rename(columns=available)

    for col in ["Name", "Table", "DAXExpression"]:
        if col not in df.columns:
            df[col] = ""

    return df.reset_index(drop=True)


measures  = build_measures_df(measures_raw)
calc_cols = build_calc_cols_df(calc_cols_raw)

# ---------------------------------------------------------------------------
# 6.  Collect all known item names (for reference-scanning)
# ---------------------------------------------------------------------------
all_measures  = set(measures["Name"].dropna().str.strip()) if "Name" in measures.columns else set()
all_calc_cols = set(calc_cols["Name"].dropna().str.strip()) if "Name" in calc_cols.columns else set()
all_items     = all_measures | all_calc_cols

print(f"\n  📊  Unique measure names   : {len(all_measures)}")
print(f"  📊  Unique calc-col names  : {len(all_calc_cols)}")

# ---------------------------------------------------------------------------
# 7.  DAX dependency scanning
#     Regex  \[identifier\]  captures all [Name] tokens inside DAX expressions.
#     We filter to tokens that match a known measure or calc column.
# ---------------------------------------------------------------------------
_DAX_REF = re.compile(r"\[([^\]]+)\]")


def dax_refs_in(expression: str) -> set:
    """Return set of all [Name] tokens found in a DAX expression string."""
    if not isinstance(expression, str) or not expression.strip():
        return set()
    return {t.strip() for t in _DAX_REF.findall(expression)}


def build_dep_graph(df: pd.DataFrame,
                    name_col: str = "Name",
                    expr_col: str = "DAXExpression") -> dict:
    """
    Build: { item_name -> set of known items it references in its DAX }.
    Every item gets an entry (even if its deps set is empty) so we can
    later identify items that reference nothing.
    """
    graph: dict = {}
    if df.empty or name_col not in df.columns or expr_col not in df.columns:
        return graph
    for _, row in df.iterrows():
        name = str(row[name_col]).strip()
        refs = dax_refs_in(str(row.get(expr_col, "")))
        graph[name] = refs & all_items   # keep only known items
    return graph


measure_deps  = build_dep_graph(measures)
calc_col_deps = build_dep_graph(calc_cols)
all_deps      = {**measure_deps, **calc_col_deps}   # combined graph

# Items that appear as a dependency of at least one other item
used_in_dax_by_others: set = set()
for deps in all_deps.values():
    used_in_dax_by_others |= deps

# ---------------------------------------------------------------------------
# 8.  Report/Layout scanning for visual usage
#
#     The .pbix is a ZIP archive.  The file "Report/Layout" contains JSON
#     (usually UTF-16-LE encoded) that describes every page and visual.
#
#     We use three complementary passes:
#       A. Structural JSON walk  – catches most well-formed references
#       B. Regex on raw text     – catches [MeasureName] inside DAX strings
#       C. queryRef regex        – catches "queryRef":"Table.Name" patterns
#
#     All three are additive; results are unioned into `used_in_visuals`.
# ---------------------------------------------------------------------------
print("\n🔎  Scanning Report/Layout for visual references …")

used_in_visuals: set = set()


def walk_layout_json(obj, depth: int = 0):
    """
    Recursively walk the parsed layout JSON tree, collecting field references.

    Common patterns across Desktop versions:
      • {"queryRef": "TableName.MeasureName"}
      • {"Property": "MeasureName", ...}
      • {"Name": "MeasureName", ...}   (inside column/measure descriptors)
      • {"Expression": {"Measure": {"Property": "...", ...}}}
    """
    if depth > 80:  # safety cap for deeply nested structures
        return

    if isinstance(obj, dict):
        # Pattern A – queryRef (most reliable indicator of visual usage)
        qr = obj.get("queryRef")
        if isinstance(qr, str):
            # Format is typically "Table.ColumnOrMeasure"; take the last segment
            candidate = qr.split(".")[-1].strip()
            if candidate in all_items:
                used_in_visuals.add(candidate)

        # Pattern B – Property key (appears in column/measure binding nodes)
        prop = obj.get("Property")
        if isinstance(prop, str) and prop.strip() in all_items:
            used_in_visuals.add(prop.strip())

        # Pattern C – Name key (appears in field list descriptors)
        for key in ("Name", "name"):
            val = obj.get(key)
            if isinstance(val, str) and val.strip() in all_items:
                used_in_visuals.add(val.strip())

        # Pattern D – Column/Measure inside calculation expressions in filters
        for key in ("Column", "Measure"):
            sub = obj.get(key)
            if isinstance(sub, dict):
                p = sub.get("Property", "")
                if isinstance(p, str) and p.strip() in all_items:
                    used_in_visuals.add(p.strip())

        for v in obj.values():
            walk_layout_json(v, depth + 1)

    elif isinstance(obj, list):
        for item in obj:
            walk_layout_json(item, depth + 1)


try:
    with zipfile.ZipFile(str(PBIX_PATH), "r") as zf:
        # Find Report/Layout (case-insensitive, handles path separators)
        layout_entry = next(
            (n for n in zf.namelist() if n.lower().replace("\\", "/") == "report/layout"),
            None
        )

        if layout_entry is None:
            warnings.warn(
                "⚠️  Report/Layout not found in the .pbix — visual usage detection skipped."
            )
        else:
            raw_bytes = zf.read(layout_entry)

            # Attempt multiple encodings; Power BI Desktop typically uses UTF-16-LE
            layout_text = None
            for enc in ("utf-16-le", "utf-8-sig", "utf-8", "latin-1"):
                try:
                    decoded = raw_bytes.decode(enc)
                    # Sanity-check: valid layout JSON contains "sections"
                    if "section" in decoded.lower() or "{" in decoded:
                        layout_text = decoded
                        break
                except UnicodeDecodeError:
                    continue

            if layout_text is None:
                warnings.warn("⚠️  Could not decode Report/Layout — visual usage will be empty.")
            else:
                # Pass 1: structural JSON walk
                try:
                    layout_json = json.loads(layout_text)
                    walk_layout_json(layout_json)
                except json.JSONDecodeError:
                    warnings.warn(
                        "⚠️  Report/Layout could not be fully parsed as JSON. "
                        "Falling back to regex-only scan."
                    )

                # Pass 2: regex on raw text — [MeasureName] tokens
                for token in _DAX_REF.findall(layout_text):
                    if token.strip() in all_items:
                        used_in_visuals.add(token.strip())

                # Pass 3: queryRef regex — "queryRef":"Table.Name"
                for m in re.finditer(r'"queryRef"\s*:\s*"([^"]+)"', layout_text):
                    candidate = m.group(1).split(".")[-1].strip()
                    if candidate in all_items:
                        used_in_visuals.add(candidate)

                # Pass 4: scan for known names appearing as quoted strings anywhere in layout
                # (broadest fallback — may produce a small number of false positives)
                for name in all_items:
                    # Look for the name surrounded by quotes or brackets in the layout JSON
                    pattern = re.compile(
                        r'(?<![A-Za-z0-9_])' + re.escape(name) + r'(?![A-Za-z0-9_])'
                    )
                    if pattern.search(layout_text):
                        used_in_visuals.add(name)

except Exception as exc:
    warnings.warn(f"⚠️  Error reading .pbix as ZIP for layout scan: {exc}")

print(f"  Items found in visuals (raw): {len(used_in_visuals)}")

# ---------------------------------------------------------------------------
# 9.  Transitive usage resolution
#
#     Build a REVERSE dependency graph: dep -> {items that use it}.
#     BFS from the visually-used seeds to find everything reachable.
#     This handles:
#       • Chains: Visual → A → B → C  (C is transitively used)
#       • Circular references: A ↔ B  (visited set prevents infinite loops;
#         if neither is seeded from visuals, both remain "unused")
# ---------------------------------------------------------------------------
print("🔗  Resolving transitive usage …")

reverse_graph: dict = defaultdict(set)   # dep_name -> set of names that depend on it
for item, deps in all_deps.items():
    for dep in deps:
        reverse_graph[dep].add(item)


def bfs_reachable(seeds: set) -> set:
    """Return all nodes reachable from seeds via the reverse dependency graph."""
    visited: set = set(seeds)
    queue: list  = list(seeds)
    while queue:
        node = queue.pop()
        for user in reverse_graph.get(node, set()):
            if user not in visited:
                visited.add(user)
                queue.append(user)
    return visited


transitively_used: set = bfs_reachable(used_in_visuals)

# ---------------------------------------------------------------------------
# 10. Annotate Measures and Calc Columns with usage flags
# ---------------------------------------------------------------------------
def annotate(df: pd.DataFrame, name_col: str = "Name") -> pd.DataFrame:
    """
    Add four boolean columns:
      UsedInDAX        – referenced by at least one other measure/calc-col
      UsedInVisuals    – directly detected in Report/Layout
      UsedTransitively – reachable from a visual via the dependency chain
      Unused           – NOT transitively used (the flag to act on)
    """
    df = df.copy()
    if name_col not in df.columns:
        return df
    names = df[name_col].str.strip()
    df["UsedInDAX"]        = names.isin(used_in_dax_by_others)
    df["UsedInVisuals"]    = names.isin(used_in_visuals)
    df["UsedTransitively"] = names.isin(transitively_used)
    df["Unused"]           = ~names.isin(transitively_used)
    return df


measures  = annotate(measures)
calc_cols = annotate(calc_cols)

# Separate unused-only sheets
unused_measures  = (
    measures[measures["Unused"]].copy()
    if "Unused" in measures.columns else pd.DataFrame()
)
unused_calc_cols = (
    calc_cols[calc_cols["Unused"]].copy()
    if "Unused" in calc_cols.columns else pd.DataFrame()
)

print(f"  Transitively used: {len(transitively_used)} items")
print(f"  Unused measures  : {len(unused_measures)}")
print(f"  Unused calc cols : {len(unused_calc_cols)}")

# ---------------------------------------------------------------------------
# 11. Build the DAX Dependency Graph sheet (for audit / manual tracing)
# ---------------------------------------------------------------------------
dep_rows = []
for item, deps in sorted(all_deps.items()):
    item_type = "Measure" if item in all_measures else "Calc Column"
    if deps:
        for dep in sorted(deps):
            dep_rows.append({
                "Item":      item,
                "ItemType":  item_type,
                "DependsOn": dep,
                "DepType":   "Measure" if dep in all_measures else "Calc Column",
            })
    else:
        dep_rows.append({
            "Item":      item,
            "ItemType":  item_type,
            "DependsOn": "(none)",
            "DepType":   "",
        })
dep_df = pd.DataFrame(dep_rows) if dep_rows else pd.DataFrame({"(no data)": []})

# ---------------------------------------------------------------------------
# 12. Write Excel file
# ---------------------------------------------------------------------------
print(f"\n💾  Writing: {OUTPUT_PATH}")


def write_sheet(writer: "pd.ExcelWriter", df: "pd.DataFrame", name: str) -> None:
    """Write df to a named sheet; write a placeholder row if the df is empty."""
    if df is None or (isinstance(df, pd.DataFrame) and df.empty):
        pd.DataFrame({"(no data)": ["—"]}).to_excel(writer, sheet_name=name, index=False)
    else:
        df.to_excel(writer, sheet_name=name, index=False)


with pd.ExcelWriter(OUTPUT_PATH, engine="openpyxl") as writer:
    write_sheet(writer, measures,          "Measures")
    write_sheet(writer, calc_cols,         "Calc Columns")
    write_sheet(writer, calc_tables_raw,   "Calc Tables")
    write_sheet(writer, schema_raw,        "Schema")
    write_sheet(writer, relationships_raw, "Relationships")
    write_sheet(writer, pq_raw,            "Power Query")
    write_sheet(writer, unused_measures,   "UNUSED Measures")
    write_sheet(writer, unused_calc_cols,  "UNUSED Calc Columns")
    write_sheet(writer, dep_df,            "DAX Dependency Graph")

# ---------------------------------------------------------------------------
# 13. Console summary
# ---------------------------------------------------------------------------
print("\n✅  Done!\n")
print(f"   Output  : {OUTPUT_PATH.resolve()}")
print()
print("   Sheet                       Rows")
print("   " + "─" * 43)
for label, df in [
    ("Measures",             measures),
    ("Calc Columns",         calc_cols),
    ("Calc Tables",          calc_tables_raw),
    ("Schema",               schema_raw),
    ("Relationships",        relationships_raw),
    ("Power Query",          pq_raw),
    ("UNUSED Measures",      unused_measures),
    ("UNUSED Calc Columns",  unused_calc_cols),
    ("DAX Dependency Graph", dep_df),
]:
    rows = len(df) if isinstance(df, pd.DataFrame) else 0
    print(f"   {label:28s}  {rows:4d}")

print("""
⚠️  HEURISTIC DISCLAIMER
   "Unused" flags are heuristic — the following usage patterns MAY be missed:
     • Conditional formatting rules
     • Tooltip-only visuals
     • Some custom visuals
     • RLS (Row-Level Security) filter expressions
     • Complex report/page-level filter DAX

   Review each flagged item in Power BI Desktop (hover in the Fields pane
   to see "Used in reports") before deleting anything.  The DAX Dependency
   Graph sheet lets you trace why a measure was or was not flagged.
""")
