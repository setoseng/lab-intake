import re
from datetime import datetime, timezone

from flask import Blueprint, request

from db import get_db
from validation import clean_optional, validate_submission

bp = Blueprint("api", __name__, url_prefix="/api")


# Panels
def find_panels(db):
    return list(db.panels.find({}, {"_id": 0}))


def find_panel(db, sample_type):
    return db.panels.find_one({"sample_type": sample_type}, {"_id": 0})


# Panel Routes
@bp.get("/panels")
def list_panels():
    db = get_db()
    panels = find_panels(db)

    return {"panels": panels}


# Samples
def find_samples(db, sample_type, search):
    query = {}
    if sample_type:
        query["sample_type"] = sample_type

    if search:
        cleaned_search = re.escape(search)
        regex_query = {"$regex": cleaned_search, "$options": "i"}
        query["$or"] = [{"sample_id": regex_query}, {"name": regex_query}]

    return list(db.samples.find(query, {"_id": 0}).sort("sample_id", 1))


def find_sample(db, sample_id):
    """Case-insensitive lookup by sample_id, minus Mongo's _id."""
    return db.samples.find_one(
        {"sample_id": sample_id.strip().upper()}, {"_id": 0}
    )


# Sample Routes
@bp.get("/samples")
def list_samples():
    db = get_db()
    sample_type = request.args.get("sample_type")
    search = request.args.get("search")
    samples = find_samples(db, sample_type, search)

    return {"samples": samples}


@bp.get("/sample/<sample_id>")
def get_sample(sample_id):
    db = get_db()
    sample = find_sample(db, sample_id)

    if sample is None:
        return {"error": "Sample NOT Found", "sample_id": sample_id}, 404

    panel = find_panel(db, sample["sample_type"])
    if panel is None:
        return {
            "error": f"No panel configured for sample type '{sample['sample_type']}'"  # noqa: E501
        }, 500

    return {
        "sample_id": sample["sample_id"],
        "name": sample["name"],
        "date_of_birth": sample["date_of_birth"],
        "sample_type": sample["sample_type"],
        "requires_priority": panel["requires_priority"],
        "requires_volume": panel["requires_volume"],
        "is_submitted": sample["collection_date"] is not None,
    }


@bp.post("/sample/submit")
def submit_sample():
    db = get_db()

    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return {"error": "Request body must be a JSON object"}, 400

    sample_id = payload.get("sample_id")
    if not isinstance(sample_id, str) or not sample_id.strip():
        return {"errors": {"sample_id": "Sample ID is required"}}, 400

    sample = find_sample(db, sample_id)
    if sample is None:
        return {"error": "Sample NOT Found", "sample_id": sample_id}, 404
    if sample["collection_date"] is not None:
        return {
            "error": f"Sample {sample['sample_id']} already has a submission"
        }, 409

    # Find the panel the sample belongs to
    panel = find_panel(db, sample["sample_type"])
    if panel is None:
        return {
            "error": f"No panel configured for sample type '{sample['sample_type']}'"  # noqa: E501
        }, 500
    # Validate the submission before we write to db
    errors = validate_submission(payload, sample, panel)
    if errors:
        return {"errors": errors}, 400

    # build out db payload; blank optional fields are stored as None
    update = {
        "collection_date": payload["collection_date"].strip(),
        "priority": clean_optional(payload.get("priority"), lower=True),
        "volume": clean_optional(payload.get("volume")),
        "notes": clean_optional(payload.get("notes")),
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    }
    # update one
    db.samples.update_one({"sample_id": sample["sample_id"]}, {"$set": update})

    # explicitly return what was written to the db not what we built
    return find_sample(db, sample["sample_id"]), 200
