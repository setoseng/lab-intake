from datetime import date

PRIORITY_VALUES = {"high", "medium", "low"}

# Panel flag -> the payload field it makes mandatory.
# Add more required fields by adding a pair here.
CONDITIONAL_RULE = {
    "requires_priority": "priority",
    "requires_volume": "volume",
}

FIELD_LABELS = {
    "collection_date": "Collection date",
    "priority": "Priority",
    "volume": "Volume",
    "notes": "Notes",
}


def is_blank(value):
    """Return True if value is None or a string that's empty after stripping."""
    return value is None or (isinstance(value, str) and not value.strip())


def clean_optional(value, lower=False):
    """Normalize an optional field for storage; blank values become None."""
    if is_blank(value):
        return None
    if isinstance(value, str):
        value = value.strip()
        return value.lower() if lower else value
    return value


def validate_collection_date(value, sample):
    """Return an error message, or None if the collection date is valid."""
    if is_blank(value) or not isinstance(value, str):
        return "Collection date is required"
    try:
        collected_date = date.fromisoformat(value.strip())
    except ValueError:
        return "Collection date must be a valid date (YYYY-MM-DD)"

    # Guard for future and before DOB dates
    if collected_date > date.today():
        return "Collection date cannot be in the future"
    if collected_date < date.fromisoformat(sample["date_of_birth"]):
        return "Collection date cannot be before the patient's date of birth"

    return None


def validate_priority(value):
    if (
        not isinstance(value, str)
        or value.strip().lower() not in PRIORITY_VALUES
    ):
        return "Priority must be one of: high, medium, low"
    return None


def validate_volume(value):
    # bool is a subclass of int, so reject it before the int check
    if isinstance(value, bool) or not isinstance(value, int):
        return "Volume must be a whole number"
    if value <= 0:
        return "Volume must be greater than zero"
    return None


def validate_notes(value):
    if not isinstance(value, str):
        return "Notes must be text"
    return None


# Checked only when the client actually supplied a value.
# Add more optional fields by adding a pair here.
OPTIONAL_VALIDATORS = {
    "priority": validate_priority,
    "volume": validate_volume,
    "notes": validate_notes,
}


def validate_submission(payload, sample, panel):
    """Return {field: message}. An empty dict means the payload is valid."""
    errors = {}

    # collection_date is required for every panel
    date_error = validate_collection_date(
        payload.get("collection_date"), sample
    )
    if date_error:
        errors["collection_date"] = date_error

    # The panel decides which of the optional fields are mandatory
    for flag, field in CONDITIONAL_RULE.items():
        if panel.get(flag) and is_blank(payload.get(field)):
            errors[field] = (
                f"{FIELD_LABELS[field]} is required for "
                f"{panel['display_name']} samples"
            )

    # Everything supplied must be well formed; blanks are stored as None
    for field, validator in OPTIONAL_VALIDATORS.items():
        value = payload.get(field)
        if field in errors or is_blank(value):
            continue
        error = validator(value)
        if error:
            errors[field] = error

    return errors
