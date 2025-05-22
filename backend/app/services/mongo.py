from pymongo import MongoClient
import os

def get_vector_collection():
    uri = os.environ["MONGO_URI"]
    db_name = os.environ.get("MONGODB_DB_NAME", "concierge")
    collection_name = os.environ.get("MONGODB_COLLECTION_NAME", "docs")

    client = MongoClient(uri)
    db = client[db_name]
    return db[collection_name]
