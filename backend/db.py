import mongomock

# To switch to a real instance: import pymongo and use
# pymongo.MongoClient("mongodb://localhost:27017") instead.

_client = mongomock.MongoClient()
_db = _client["lab-intake"]


# We use a function so we can easily swap Mongo clients
def get_db():
    return _db
