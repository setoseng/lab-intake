PANELS = [
    {
        "sample_type": "blood",
        "display_name": "Blood Panel",
        "requires_priority": True,
        "requires_volume": True,
    },
    {
        "sample_type": "urine",
        "display_name": "Urine Panel",
        "requires_priority": False,
        "requires_volume": True,
    },
    {
        "sample_type": "saliva",
        "display_name": "Saliva Panel",
        "requires_priority": True,
        "requires_volume": False,
    },
]

SAMPLES = [
    {
        "sample_id": "BLD-001",
        "sample_type": "blood",
        "name": "Maria Okafor",
        "date_of_birth": "1984-03-12",
    },
    {
        "sample_id": "BLD-002",
        "sample_type": "blood",
        "name": "Priya Shah",
        "date_of_birth": "1991-07-22",
    },
    {
        "sample_id": "BLD-003",
        "sample_type": "blood",
        "name": "James Whitaker",
        "date_of_birth": "1976-11-04",
    },
    {
        "sample_id": "URN-001",
        "sample_type": "urine",
        "name": "Kenji Nakamura",
        "date_of_birth": "1988-05-09",
    },
    {
        "sample_id": "URN-002",
        "sample_type": "urine",
        "name": "Aisha Rahman",
        "date_of_birth": "1995-12-30",
    },
    {
        "sample_id": "URN-003",
        "sample_type": "urine",
        "name": "Thomas Nguyen",
        "date_of_birth": "1969-08-15",
    },
    {
        "sample_id": "SAL-001",
        "sample_type": "saliva",
        "name": "Daniel Okonkwo",
        "date_of_birth": "1982-09-27",
    },
    {
        "sample_id": "SAL-002",
        "sample_type": "saliva",
        "name": "Hannah Berg",
        "date_of_birth": "1998-02-11",
    },
    {
        "sample_id": "SAL-003",
        "sample_type": "saliva",
        "name": "Omar Haddad",
        "date_of_birth": "1973-06-21",
    },
]

SUBMISSION_FIELDS = {
    "collection_date": None,
    "volume": None,
    "priority": None,
    "notes": None,
    "submitted_at": None,
}


def seed(db):
    # drop collections so seed.py can be idempotent
    db.panels.drop()
    db.samples.drop()
    # We do not insert directly using insert_many(PANELS)
    # because Mongo will change the original PANELS variable
    # the database will asign a unique id _id
    # this will cause an error on every seed after the first
    db.panels.insert_many([dict(p) for p in PANELS])
    db.samples.create_index("sample_id", unique=True)
    db.samples.insert_many([{**s, **SUBMISSION_FIELDS} for s in SAMPLES])
