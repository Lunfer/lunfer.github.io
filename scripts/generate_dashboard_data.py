"""
generate_dashboard_data.py
==========================
Reads the PulseClub star-schema CSVs and regenerates the JS data constants
embedded inside public/pulseclub-dashboard.html.

Run from the repo root:
    python scripts/generate_dashboard_data.py

Requirements:
    pip install pandas --break-system-packages

What it replicates (DAX measure equivalents):
  - REVIEWS array        → AvgOverallScore, dimension avgs, WeakestDimension per club (×10 scale)
  - MV array             → monthly visit counts Jul 2025 – latest month
  - FRIENDS array        → friend visits, bringers, GuestConvertedMembers, GuestConversionRate
  - AVG_GUEST_CR         → AvgGuestCRAcrossClubs (AVERAGEX over clubs of per-club ratio)
  - BUBBLE array         → all-time visits per club (no date filter), AvgScore, ReviewCount
  - NM object            → new memberships per month/tier for 2024, MoM%, RetentionRate
  - MODAL_ROWS array     → yearly drill: visits, active members, net growth, joiners, leavers, friend visits
  - KPI values           → latest-month visits, active members, avg score + prior-month for MoM RAG
"""

import pandas as pd
import json
import re
import sys
from pathlib import Path

# ── Paths ─────────────────────────────────────────────────────────────────────
REPO = Path(__file__).resolve().parent.parent
DATA = REPO / "CaseStudies" / "PulseClubCS" / "Case study tables"
DASHBOARD = REPO / "public" / "pulseclub-dashboard.html"

print("Reading CSVs…")

# ── Load tables ───────────────────────────────────────────────────────────────
dim_club = pd.read_csv(DATA / "dim_club.csv")
dim_club.rename(columns={"ClubKey": "ClubKey"}, inplace=True)

fact_visit = pd.read_csv(DATA / "fact_visit.csv")
fact_visit["VisitDateTime"] = pd.to_datetime(fact_visit["VisitDateTime"], format="ISO8601", utc=True)
fact_visit["YearMonth"] = fact_visit["VisitDateTime"].dt.to_period("M")
fact_visit["Year"] = fact_visit["VisitDateTime"].dt.year
fact_visit["VisitClubKey"] = fact_visit["VisitClubKey"].astype(int)

fact_memberships = pd.read_csv(DATA / "fact_memberships.csv")
fact_memberships["StartDate"] = pd.to_datetime(fact_memberships["StartDate"], format="ISO8601", utc=True, errors="coerce")
fact_memberships["EndDate"]   = pd.to_datetime(fact_memberships["EndDate"],   format="ISO8601", utc=True, errors="coerce")
fact_memberships["CancelDate"] = pd.to_datetime(fact_memberships["CancelDate"], format="ISO8601", utc=True, errors="coerce")
fact_memberships["StartYM"] = fact_memberships["StartDate"].dt.to_period("M")
fact_memberships["StartYear"] = fact_memberships["StartDate"].dt.year

fact_reviews = pd.read_csv(DATA / "fact_club_reviews.csv")
fact_reviews["CreateDate"] = pd.to_datetime(fact_reviews["CreateDate"], format="ISO8601", utc=True)

# Country lookup
club_country = dim_club.set_index("ClubKey")["CountryName"].to_dict()

print("  CSVs loaded OK")

# ─────────────────────────────────────────────────────────────────────────────
# 1. REVIEWS — per-club avg scores (×10), weakest dimension
# ─────────────────────────────────────────────────────────────────────────────
print("Computing REVIEWS…")

dims = {
    "Atmosphere":   "AtmosphereReview",
    "Crowdedness":  "CrowdednessReview",
    "Equipment":    "EquipmentReview",
    "Hygiene":      "HygieneReview",
    "Staff":        "StaffReview",
}
dim_cols = list(dims.values())

rev_agg = (
    fact_reviews
    .groupby("ClubKey")[dim_cols]
    .mean()
    .mul(10)  # raw 0-10 → display 0-100
    .round(1)
)
rev_agg["reviews"] = fact_reviews.groupby("ClubKey").size()
rev_agg["overall"] = rev_agg[dim_cols].mean(axis=1).round(1)

def weakest(row):
    scores = {name: row[col] for name, col in dims.items()}
    wname = min(scores, key=scores.get)
    return wname, round(scores[wname], 1)

rev_agg[["weakest", "wval"]] = rev_agg.apply(
    lambda r: pd.Series(weakest(r)), axis=1
)
rev_agg["country"] = rev_agg.index.map(club_country).fillna("Unknown")

# Sort by review count descending for display
rev_agg = rev_agg.sort_values("reviews", ascending=False)

REVIEWS = []
for club_id, row in rev_agg.iterrows():
    REVIEWS.append({
        "id":      int(club_id),
        "country": row["country"],
        "reviews": int(row["reviews"]),
        "overall": float(row["overall"]),
        "weakest": row["weakest"],
        "wval":    float(row["wval"]),
        "atm":     float(row["AtmosphereReview"]),
        "crowd":   float(row["CrowdednessReview"]),
        "equip":   float(row["EquipmentReview"]),
        "hyg":     float(row["HygieneReview"]),
        "staff":   float(row["StaffReview"]),
    })

print(f"  {len(REVIEWS)} clubs with reviews")

# ─────────────────────────────────────────────────────────────────────────────
# 2. MV — daily visit counts (Jul 2025 to latest day), matching Power BI daily chart
# ─────────────────────────────────────────────────────────────────────────────
print("Computing MV (daily)…")

fact_visit["VisitDate"] = fact_visit["VisitDateTime"].dt.normalize()

daily_visits = (
    fact_visit
    .groupby("VisitDate")
    .size()
    .reset_index(name="v")
    .sort_values("VisitDate")
)

# Filter Jul 2025 onwards
cutoff = pd.Timestamp("2025-07-01", tz="UTC")
dv_filtered = daily_visits[daily_visits["VisitDate"] >= cutoff]

MV = []
for _, row in dv_filtered.iterrows():
    dt = row["VisitDate"]
    label = dt.strftime("%Y-%m-%d")
    MV.append({"l": label, "v": int(row["v"])})

print(f"  {len(MV)} days of visit data")

# Latest month KPI values (still month-based for KPI card)
fact_visit["YearMonth"] = fact_visit["VisitDateTime"].dt.to_period("M")
monthly_visits = fact_visit.groupby("YearMonth").size().reset_index(name="v")
monthly_visits["YearMonth"] = monthly_visits["YearMonth"].dt.to_timestamp()
monthly_visits = monthly_visits.sort_values("YearMonth")
cutoff_m = pd.Timestamp("2025-07-01")
mv_monthly = monthly_visits[monthly_visits["YearMonth"] >= cutoff_m]

latest_ym  = mv_monthly["YearMonth"].max()
prev_ym    = latest_ym - pd.DateOffset(months=1)
visits_cur = int(mv_monthly[mv_monthly["YearMonth"] == latest_ym]["v"].values[0])
visits_prv = int(mv_monthly[mv_monthly["YearMonth"] == prev_ym]["v"].values[0]) if prev_ym in mv_monthly["YearMonth"].values else None

# ─────────────────────────────────────────────────────────────────────────────
# 3. Active members KPI (memberships active on last day of latest month)
#    EndDate = 2099-12-31 → still active; CancelDate = last day they were active
# ─────────────────────────────────────────────────────────────────────────────
print("Computing active members KPI…")

def active_members_at(year, month):
    """Count memberships active during the given year-month."""
    period_start = pd.Timestamp(year=year, month=month, day=1, tz="UTC")
    # Last day of month
    if month == 12:
        period_end = pd.Timestamp(year=year+1, month=1, day=1, tz="UTC") - pd.Timedelta(days=1)
    else:
        period_end = pd.Timestamp(year=year, month=month+1, day=1, tz="UTC") - pd.Timedelta(days=1)

    started = fact_memberships["StartDate"] <= period_end
    not_ended = (
        fact_memberships["EndDate"].isna() |
        (fact_memberships["EndDate"] >= period_start)
    )
    return int((started & not_ended).sum())

latest_active = active_members_at(latest_ym.year, latest_ym.month)
prev_active   = active_members_at(prev_ym.year,   prev_ym.month)

# ─────────────────────────────────────────────────────────────────────────────
# 4. Avg review score KPI — latest month + all-time
# ─────────────────────────────────────────────────────────────────────────────
print("Computing avg score KPI…")

reviews_latest = fact_reviews[
    fact_reviews["CreateDate"].dt.to_period("M") == latest_ym.to_period("M")
]
reviews_prev = fact_reviews[
    fact_reviews["CreateDate"].dt.to_period("M") == prev_ym.to_period("M")
]

def avg_score(df):
    if len(df) == 0:
        return None
    return round(df[dim_cols].mean().mean() * 10, 1)

score_cur = avg_score(reviews_latest)
score_prv = avg_score(reviews_prev)

# MoM % helper
def mom_pct(cur, prv):
    if prv is None or prv == 0:
        return None
    return round((cur - prv) / prv * 100, 1)

visits_mom = mom_pct(visits_cur, visits_prv)
members_mom = mom_pct(latest_active, prev_active)
score_mom = mom_pct(score_cur, score_prv)

# RAG thresholds: visits ±5%, members ±2%, score ±1%
def rag(pct, threshold):
    if pct is None:
        return "grey"
    if abs(pct) <= threshold:
        return "amber"
    return "green" if pct > 0 else "red"

visits_rag  = rag(visits_mom,  5)
members_rag = rag(members_mom, 2)
score_rag   = rag(score_mom,   1)

rag_dot = {"green": "#6BBF6A", "amber": "#F0C97A", "red": "#E8907A", "grey": "#aaa"}

def fmt_de(n, decimals=0):
    """German locale number formatting: dot as thousands separator, comma decimal."""
    formatted = f"{n:,.{decimals}f}"
    return formatted.replace(",", "X").replace(".", ",").replace("X", ".")

def fmt_mom(pct):
    if pct is None:
        return "—"
    sign = "+" if pct > 0 else ""
    return f"{sign}{str(pct).replace('.', ',')}%"

latest_month_label = f"01.{latest_ym.month:02d}.{latest_ym.year}"

# All-time totals (bold big number in KPI card, matching Power BI)
total_visits_kpi   = len(fact_visit)
total_members_kpi  = int(fact_memberships["PeopleKey"].nunique())
score_alltime      = round(fact_reviews[dim_cols].mean().mean() * 10, 1)

KPI = {
    "visits": {
        "alltime":  fmt_de(total_visits_kpi),    # big bold number
        "cur":      fmt_de(visits_cur),           # current month (right side)
        "mom": fmt_mom(visits_mom),
        "rag": visits_rag,
        "dot": rag_dot[visits_rag],
        "date": latest_month_label,
    },
    "members": {
        "alltime":  fmt_de(total_members_kpi),
        "cur":      fmt_de(latest_active),
        "mom": fmt_mom(members_mom),
        "rag": members_rag,
        "dot": rag_dot[members_rag],
        "date": latest_month_label,
    },
    "score": {
        "alltime":  fmt_de(score_alltime, 1),
        "cur":      fmt_de(score_cur, 1) if score_cur else "—",
        "mom": fmt_mom(score_mom),
        "rag": score_rag,
        "dot": rag_dot[score_rag],
        "date": latest_month_label,
    },
}

print(f"  KPI visits alltime={total_visits_kpi}, cur={visits_cur} ({visits_rag})")
print(f"  KPI members alltime={total_members_kpi}, cur={latest_active} ({members_rag})")
print(f"  KPI score alltime={score_alltime}, cur={score_cur} ({score_rag})")

# ─────────────────────────────────────────────────────────────────────────────
# 5. FRIENDS — top clubs by friend visits, GuestConversionRate
#    GuestConvertedMembers: visitors who visited WITH a friend BEFORE their
#    earliest membership StartDate (i.e. visited as a guest, then converted)
#    Bringers: distinct members (PeopleKey) who visited with VisitedWithFriend=True
#    AvgGuestCRAcrossClubs: AVERAGEX(clubs, GuestConverted / Bringers)
# ─────────────────────────────────────────────────────────────────────────────
print("Computing FRIENDS / GuestConversionRate…")

friend_visits = fact_visit[fact_visit["VisitedWithFriend"] == True].copy()

# Per club: count of friend visits and total visits
club_friend = friend_visits.groupby("VisitClubKey").size().rename("friend")
club_total  = fact_visit.groupby("VisitClubKey").size().rename("total")

# Bringers per club: distinct PeopleKey who brought a friend
club_bringers = (
    friend_visits.groupby("VisitClubKey")["PeopleKey"]
    .nunique()
    .rename("bringers")
)

# GuestConvertedMembers per club:
# A guest = someone who visited with a friend at club X BEFORE their first membership start date
earliest_start = (
    fact_memberships.groupby("PeopleKey")["StartDate"]
    .min()
    .reset_index()
    .rename(columns={"StartDate": "EarliestStart"})
)

# Join friend visits to earliest membership start
fv_with_start = friend_visits.merge(earliest_start, on="PeopleKey", how="left")

# Guest = visited with friend AND (no membership at all OR visit before membership started)
fv_with_start["is_guest_visit"] = (
    fv_with_start["EarliestStart"].isna() |
    (fv_with_start["VisitDateTime"] < fv_with_start["EarliestStart"])
)

# GuestConverted per club: distinct guests who subsequently became members
# (i.e. is_guest_visit=True AND EarliestStart is not null = they DID eventually join)
converted_guests = fv_with_start[
    fv_with_start["is_guest_visit"] &
    fv_with_start["EarliestStart"].notna()
]
guest_converted = (
    converted_guests
    .groupby("VisitClubKey")["PeopleKey"]
    .nunique()
    .rename("converted")
)

# Per club per tier: join converted guests to their membership tier
earliest_mem = (
    fact_memberships.sort_values("StartDate")
    .groupby("PeopleKey")
    .first()
    .reset_index()[["PeopleKey", "MembershipCode"]]
)
converted_with_tier = converted_guests[["VisitClubKey","PeopleKey"]].drop_duplicates().merge(
    earliest_mem, on="PeopleKey", how="left"
)
converted_by_tier = (
    converted_with_tier
    .groupby(["VisitClubKey","MembershipCode"])["PeopleKey"]
    .nunique()
    .unstack(fill_value=0)
)
for t in ["Diamond","Gold","Platinum","Silver","Limited"]:
    if t not in converted_by_tier.columns:
        converted_by_tier[t] = 0

# Assemble per-club friend table
friends_df = (
    pd.concat([club_friend, club_total, club_bringers, guest_converted], axis=1)
    .reset_index()
    .rename(columns={"index": "ClubKey", "VisitClubKey": "ClubKey"})
)
friends_df["ClubKey"] = friends_df.index if "ClubKey" not in friends_df.columns else friends_df["ClubKey"]
friends_df = friends_df.reset_index().rename(columns={"VisitClubKey": "ClubKey"})
friends_df["converted"] = friends_df["converted"].fillna(0).astype(int)
friends_df["bringers"]  = friends_df["bringers"].fillna(0).astype(int)
friends_df["cr"] = (friends_df["converted"] / friends_df["bringers"].replace(0, float("nan")) * 100).round(1)
friends_df["country"] = friends_df["ClubKey"].map(club_country).fillna("Unknown")

# AvgGuestCRAcrossClubs = AVERAGEX(clubs with bringers > 0, converted/bringers)
valid = friends_df[friends_df["bringers"] > 0]
AVG_GUEST_CR = round((valid["converted"] / valid["bringers"]).mean() * 100, 1)

# Top 15 by friend visits
top_friends = friends_df.sort_values("friend", ascending=False).head(15)

FRIENDS = []
for _, row in top_friends.iterrows():
    club = int(row["ClubKey"])
    tiers_for_club = {}
    for t in ["Diamond","Gold","Platinum","Silver","Limited"]:
        tiers_for_club[t] = int(converted_by_tier.loc[club, t]) if club in converted_by_tier.index else 0
    FRIENDS.append({
        "id":        club,
        "country":   row["country"],
        "friend":    int(row["friend"]),
        "total":     int(row["total"]),
        "bringers":  int(row["bringers"]),
        "converted": int(row["converted"]),
        "cr":        float(row["cr"]) if not pd.isna(row["cr"]) else None,
        "tiers":     tiers_for_club,
    })

print(f"  {len(FRIENDS)} clubs in FRIENDS, AvgGuestCR={AVG_GUEST_CR}%")

# ─────────────────────────────────────────────────────────────────────────────
# 6. BUBBLE — all-time visits per club (REMOVEFILTERS dim_calendar)
# ─────────────────────────────────────────────────────────────────────────────
print("Computing BUBBLE…")

club_total_all = fact_visit.groupby("VisitClubKey").size().rename("visits")

BUBBLE = []
for club_id, row in rev_agg.iterrows():
    visits = int(club_total_all.get(club_id, 0))
    BUBBLE.append({
        "id":      int(club_id),
        "country": row["country"],
        "visits":  visits,
        "score":   float(row["overall"]),
        "reviews": int(row["reviews"]),
    })

print(f"  {len(BUBBLE)} clubs in BUBBLE")

# ─────────────────────────────────────────────────────────────────────────────
# 7. NM — new memberships per month (2024), per tier + MoM% + RetentionRate
#    RetentionRate = memberships started that month with EndDate=2099-12-31 / total started
# ─────────────────────────────────────────────────────────────────────────────
print("Computing NM (new memberships 2024)…")

mem_2024 = fact_memberships[fact_memberships["StartYear"] == 2024].copy()
mem_2024["Month"] = mem_2024["StartDate"].dt.month

tiers = ["Diamond", "Gold", "Platinum", "Silver", "Limited"]
nm_data = {t: [0]*12 for t in tiers}
nm_ret  = [0.0]*12
nm_total = [0]*12

for month in range(1, 13):
    m_df = mem_2024[mem_2024["Month"] == month]
    nm_total[month-1] = len(m_df)
    for tier in tiers:
        nm_data[tier][month-1] = int((m_df["MembershipCode"] == tier).sum())
    # Retention: EndDate = 2099-12-31 (active/not cancelled)
    still_active = (
        m_df["EndDate"].dt.year == 2099
    ).sum()
    nm_ret[month-1] = round(still_active / len(m_df) * 100, 1) if len(m_df) > 0 else 0.0

# MoM% change on total new memberships per month
nm_mom = [None]
for i in range(1, 12):
    if nm_total[i-1] > 0:
        pct = round((nm_total[i] - nm_total[i-1]) / nm_total[i-1] * 100, 1)
        nm_mom.append(pct)
    else:
        nm_mom.append(None)

NM = {
    "months":   ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    "Diamond":  nm_data["Diamond"],
    "Gold":     nm_data["Gold"],
    "Platinum": nm_data["Platinum"],
    "Silver":   nm_data["Silver"],
    "Limited":  nm_data["Limited"],
    "mom":      nm_mom,
    "ret":      nm_ret,
}

print(f"  NM retention Jan={nm_ret[0]}%, Sep={nm_ret[8]}%")

# ─────────────────────────────────────────────────────────────────────────────
# 8. MODAL_ROWS — yearly drill: visits, active members, joiners, leavers, friend visits
# ─────────────────────────────────────────────────────────────────────────────
print("Computing MODAL_ROWS…")

def year_quarter_stats(year, quarter=None):
    """
    Compute visit/member/joiner/leaver/friend stats for a year or year+quarter.
    quarter: 1-4 or None for full year
    """
    if quarter:
        months = list(range((quarter-1)*3+1, (quarter-1)*3+4))
        start_dt = pd.Timestamp(year=year, month=months[0],  day=1, tz="UTC")
        end_dt   = pd.Timestamp(year=year, month=months[-1], day=1, tz="UTC") + pd.offsets.MonthEnd(1)
        end_dt   = end_dt.tz_localize("UTC") if end_dt.tzinfo is None else end_dt
    else:
        start_dt = pd.Timestamp(year=year, month=1,  day=1, tz="UTC")
        end_dt   = pd.Timestamp(year=year, month=12, day=31, tz="UTC")

    # Visits in period
    v_mask = (fact_visit["VisitDateTime"] >= start_dt) & (fact_visit["VisitDateTime"] <= end_dt)
    visits = int(v_mask.sum())
    friend = int((fact_visit[v_mask]["VisitedWithFriend"] == True).sum())

    # Joiners: memberships started in period
    j_mask = (fact_memberships["StartDate"] >= start_dt) & (fact_memberships["StartDate"] <= end_dt)
    joiners = int(j_mask.sum())

    # Leavers: memberships whose CancelDate falls in period
    l_mask = (
        fact_memberships["CancelDate"].notna() &
        (fact_memberships["CancelDate"] >= start_dt) &
        (fact_memberships["CancelDate"] <= end_dt)
    )
    leavers = int(l_mask.sum())

    net = joiners - leavers

    # Active at end of period
    active = active_members_at(
        end_dt.year,
        end_dt.month if hasattr(end_dt, 'month') else 12
    )

    return visits, active, net, joiners, leavers, friend

MODAL_ROWS = []
for year in [2023, 2024, 2025]:
    yv, ya, yn, yj, yl, yf = year_quarter_stats(year)
    children = []
    for q in range(1, 5):
        qv, qa, qn, qj, ql, qf = year_quarter_stats(year, q)
        children.append({
            "q": f"Q{q}",
            "visits": qv, "active": qa, "net": qn,
            "joiners": qj, "leavers": ql, "friend": qf,
        })
    MODAL_ROWS.append({
        "year": str(year),
        "visits": yv, "active": ya, "net": yn,
        "joiners": yj, "leavers": yl, "friend": yf,
        "children": children,
    })

# Summary box totals (all years combined)
total_joiners = sum(r["joiners"] for r in MODAL_ROWS)
total_leavers = sum(r["leavers"] for r in MODAL_ROWS)

print(f"  Modal: total joiners={total_joiners}, leavers={total_leavers}")

# ─────────────────────────────────────────────────────────────────────────────
# 9. Build summary box text
# ─────────────────────────────────────────────────────────────────────────────
total_visits_all = int(fact_visit.shape[0]) - 1  # subtract header
total_visits_all = int(fact_visit.shape[0])

# AvgOverallScore across all reviews
overall_avg_score = round(fact_reviews[dim_cols].mean().mean() * 10, 1)

# Weakest dim overall (by avg score across all clubs)
dim_avgs = {name: round(fact_reviews[col].mean() * 10, 1) for name, col in dims.items()}
weakest_dim_overall = min(dim_avgs, key=dim_avgs.get)
weakest_dim_score   = dim_avgs[weakest_dim_overall]

# Friend visit % overall
total_visits = len(fact_visit)
friend_pct = round(len(friend_visits) / total_visits * 100, 1)

SUMMARY = {
    "total_visits":    fmt_de(total_visits),
    "active_members":  fmt_de(latest_active),
    "total_joiners":   fmt_de(total_joiners),
    "total_leavers":   fmt_de(total_leavers),
    "avg_score":       fmt_de(overall_avg_score, 1),
    "weakest_dim":     weakest_dim_overall,
    "weakest_score":   fmt_de(weakest_dim_score, 1),
    "friend_pct":      fmt_de(friend_pct, 1),
}

print(f"  Summary: visits={SUMMARY['total_visits']}, score={SUMMARY['avg_score']}, weakest={weakest_dim_overall} {weakest_dim_score}")

# ─────────────────────────────────────────────────────────────────────────────
# 10. Inject into dashboard HTML
# Strategy: replace the entire DATA block between two sentinel comments
# atomically, avoiding any bracket-scanning bugs from iterative replacement.
# ─────────────────────────────────────────────────────────────────────────────
print("Injecting into dashboard HTML…")

html = DASHBOARD.read_text(encoding="utf-8")

def arr(lst):
    return "[" + ",".join("null" if x is None else str(x) for x in lst) + "]"

def reviews_to_js(reviews):
    lines = []
    for d in reviews:
        lines.append(
            f"  {{id:{d['id']}, country:{json.dumps(d['country'])},"
            f"reviews:{d['reviews']},overall:{d['overall']},"
            f"weakest:{json.dumps(d['weakest'])},wval:{d['wval']},"
            f"atm:{d['atm']},crowd:{d['crowd']},equip:{d['equip']},hyg:{d['hyg']},staff:{d['staff']}}}"
        )
    return "[\n" + ",\n".join(lines) + "\n]"

def mv_to_js(mv):
    lines = [f"  {{l:{json.dumps(d['l'])},v:{d['v']}}}" for d in mv]
    return "[\n" + ",\n".join(lines) + "\n]"

def friends_to_js(friends):
    lines = []
    for d in friends:
        cr = str(d['cr']) if d['cr'] is not None else "null"
        t = d.get('tiers', {})
        tiers_js = (f"{{Diamond:{t.get('Diamond',0)},Gold:{t.get('Gold',0)},"
                    f"Platinum:{t.get('Platinum',0)},Silver:{t.get('Silver',0)},"
                    f"Limited:{t.get('Limited',0)}}}")
        lines.append(
            f"  {{id:{d['id']},country:{json.dumps(d['country'])},"
            f"friend:{d['friend']},total:{d['total']},bringers:{d['bringers']},"
            f"converted:{d['converted']},cr:{cr},tiers:{tiers_js}}}"
        )
    return "[\n" + ",\n".join(lines) + "\n]"

def bubble_to_js(bubble):
    lines = []
    for d in bubble:
        lines.append(
            f"  {{id:{d['id']},country:{json.dumps(d['country'])},"
            f"visits:{d['visits']},score:{d['score']},reviews:{d['reviews']}}}"
        )
    return "[\n" + ",\n".join(lines) + "\n]"

def nm_to_js(nm):
    months_js = json.dumps(nm["months"])
    mom_js = arr(nm["mom"])
    return (
        "{\n"
        f"  months:{months_js},\n"
        f"  Diamond:{arr(nm['Diamond'])},\n"
        f"  Gold:{arr(nm['Gold'])},\n"
        f"  Platinum:{arr(nm['Platinum'])},\n"
        f"  Silver:{arr(nm['Silver'])},\n"
        f"  Limited:{arr(nm['Limited'])},\n"
        f"  mom:{mom_js},\n"
        f"  ret:{arr(nm['ret'])},\n"
        "}"
    )

def modal_to_js(rows):
    lines = []
    for r in rows:
        children_js = []
        for c in r["children"]:
            children_js.append(
                f"    {{q:{json.dumps(c['q'])},visits:{c['visits']},active:{c['active']},"
                f"net:{c['net']},joiners:{c['joiners']},leavers:{c['leavers']},friend:{c['friend']}}}"
            )
        children_str = "[\n" + ",\n".join(children_js) + "\n  ]"
        lines.append(
            f"  {{year:{json.dumps(r['year'])},visits:{r['visits']},active:{r['active']},"
            f"net:{r['net']},joiners:{r['joiners']},leavers:{r['leavers']},friend:{r['friend']},"
            f"children:{children_str}}}"
        )
    return "[\n" + ",\n".join(lines) + "\n]"

# Build the entire data block as one string
data_block = f"""// ── DATA ── (auto-generated by generate_dashboard_data.py — do not edit manually)
const REVIEWS = {reviews_to_js(REVIEWS)};

const MV = {mv_to_js(MV)};

const FRIENDS = {friends_to_js(FRIENDS)};
const AVG_GUEST_CR = {AVG_GUEST_CR};

const BUBBLE = {bubble_to_js(BUBBLE)};

const NM = {nm_to_js(NM)};

const MODAL_ROWS = {modal_to_js(MODAL_ROWS)};

"""

# Replace everything between the DATA sentinel and the Chart defaults sentinel atomically
DATA_START = "// ── DATA ──"
DATA_END   = "// ── Chart defaults"

start_idx = html.find(DATA_START)
end_idx   = html.find(DATA_END)

if start_idx == -1 or end_idx == -1:
    print(f"  ERROR: could not find sentinels (start={start_idx}, end={end_idx})")
    print("  Aborting injection — HTML unchanged")
else:
    html = html[:start_idx] + data_block + html[end_idx:]
    print("  Replaced DATA block")

# ── KPI card values ────────────────────────────────────────────────────────────
# Replace KPI display values in HTML (they're in the static HTML, not JS constants)
kpi = KPI

def replace_kpi_html(html, elem_id, new_content):
    pattern = rf'(<[^>]+id="{elem_id}"[^>]*>)(.*?)(</)'
    return re.sub(pattern, rf'\g<1>{new_content}\g<3>', html, flags=re.DOTALL)

html = replace_kpi_html(html, "val-visits",   kpi["visits"]["alltime"])
html = replace_kpi_html(html, "val-members",  kpi["members"]["alltime"])
html = replace_kpi_html(html, "val-score",    kpi["score"]["alltime"])

# Right-side current month value (no emoji/dot — matches PBI)
def cur_html(k):
    e = kpi[k]
    return f'\n            {e["cur"]}<br><span class="kpi-date" id="date-{k}">As of: {e["date"]}</span>\n          '

html = replace_kpi_html(html, "delta-visits",  cur_html("visits"))
html = replace_kpi_html(html, "delta-members", cur_html("members"))
html = replace_kpi_html(html, "delta-score",   cur_html("score"))

# Dot colours (on the bold all-time number, matches PBI RAG on current month trend)
for k in ("visits", "members", "score"):
    dot_id = f"dot-{k}"
    html = re.sub(
        rf'(<[^>]+id="{dot_id}"[^>]+style=")background:[^"]+(")',
        rf'\g<1>background:{kpi[k]["dot"]}\g<2>',
        html
    )

# ── Summary box ───────────────────────────────────────────────────────────────
s = SUMMARY
summary_html = (
    f"<h3>Summary</h3>\n"
    f"        <p>So far, PulseClub recorded <u>{s['total_visits']} visits</u> and "
    f"<u>{s['active_members']} active members</u>.<br>\n"
    f"        Membership is growing with <u>{s['total_joiners']} joiners</u> and "
    f"<u>{s['total_leavers']} leavers</u> this period.<br>\n"
    f"        Overall satisfaction is moderate at <u>{s['avg_score']} out of 100</u>.<br>\n"
    f"        Members rate {s['weakest_dim']} as the biggest improvement area ({s['weakest_score']} average).<br>\n"
    f"        {s['friend_pct']}% of visits were with a friend.</p>"
)
html = re.sub(
    r'<h3>Summary</h3>[\s\S]*?</p>',
    summary_html,
    html,
    flags=re.DOTALL
)

# ── Write output ───────────────────────────────────────────────────────────────
DASHBOARD.write_text(html, encoding="utf-8")
print(f"✓  Written {DASHBOARD} ({len(html):,} chars)")
