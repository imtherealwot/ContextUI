from app.services.mongo import get_vector_collection
from dotenv import load_dotenv
load_dotenv()

def debug_filenames():
    collection = get_vector_collection()
    filenames = collection.distinct("metadata.filename")
    print("Stored filenames in MongoDB:")
    for name in filenames:
        print(f"- {name!r}")

debug_filenames()