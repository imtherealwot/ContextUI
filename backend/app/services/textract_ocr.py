import boto3
import os

def extract_text_from_image(image_path: str) -> str:
    aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    aws_region = os.getenv("AWS_REGION", "us-east-1")

    if not aws_access_key or not aws_secret_key:
        raise EnvironmentError("AWS credentials not set in environment variables.")

    textract = boto3.client(
        "textract",
        region_name=aws_region,
        aws_access_key_id=aws_access_key,
        aws_secret_access_key=aws_secret_key
    )

    with open(image_path, "rb") as document:
        image_bytes = document.read()

    response = textract.detect_document_text(Document={"Bytes": image_bytes})

    blocks = response.get("Blocks", [])
    lines = [block["Text"] for block in blocks if block["BlockType"] == "LINE"]
    return "\n".join(lines)