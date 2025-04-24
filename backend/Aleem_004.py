from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings


def load_documents():
    loader = PyPDFLoader("sample.pdf")
    documents = loader.load()
    print(f"✅ Loaded {len(documents)} pages from PDF.")
    return documents


def create_vectorstore():
    documents = load_documents()

    # Use HuggingFace embeddings locally (no OpenAI key required)
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = FAISS.from_documents(documents, embedding=embeddings)
    vectorstore.save_local("vectorstore")
    print("✅ Vectorstore created and saved to 'vectorstore/'.")


if __name__ == "__main__":
    create_vectorstore()
