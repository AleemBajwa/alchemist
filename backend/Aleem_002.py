from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(".env"))

from langchain_community.llms import Ollama
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

# Load local LLM using Ollama (Mistral)
llm = Ollama(model="mistral")

# Use HuggingFace Embeddings
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Load local FAISS vectorstore with smaller retrieval
db = FAISS.load_local("vectorstore", embeddings=embedding, allow_dangerous_deserialization=True)
retriever = db.as_retriever(search_kwargs={"k": 2})  # Smaller k = faster

# Optional memory to maintain chat history
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Run the full DeepSearch agent
def run_agent(query, session_id):
    print(f"🔍 Received query: {query}")
    import time
    start = time.time()

    chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory
    )
    result = chain.run(query)

    print("✅ LangChain Response Time:", round(time.time() - start, 2), "seconds")
    return result
