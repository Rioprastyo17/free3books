from flask import Flask, request, jsonify
from flask_cors import CORS  # Import Flask-CORS
from langchain_community.document_loaders import UnstructuredPDFLoader
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_ollama.chat_models import ChatOllama
from langchain_core.runnables import RunnablePassthrough
from langchain.retrievers.multi_query import MultiQueryRetriever

# Suppress warnings
import warnings
warnings.filterwarnings('ignore')

# Set environment variable for protobuf
import os
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

PERSIST_DIRECTORY = "data"

# Initialize embedding function
embedding_function = OllamaEmbeddings(model="nomic-embed-text")

# Initialize Chroma vector database
vector_db = Chroma(
    collection_name="sampelkodeD",
    persist_directory=PERSIST_DIRECTORY,
    embedding_function=embedding_function
)

# Set up LLM and retrieval
local_model = "tinyllama:latest"  # or whichever model you prefer
llm = ChatOllama(model=local_model)

# Query prompt template
QUERY_PROMPT = PromptTemplate(
    input_variables=["question"],
    template="""You are an AI language model assistant. Your task is to generate 2
    different versions of the given user question to retrieve relevant documents from
    a vector database. By generating multiple perspectives on the user question, your
    goal is to help the user overcome some of the limitations of the distance-based
    similarity search. Provide these alternative questions separated by newlines.
    Original question: {question}""",
)

# Set up retriever
retriever = MultiQueryRetriever.from_llm(
    vector_db.as_retriever(), 
    llm,
    prompt=QUERY_PROMPT
)

# RAG prompt template
template = """Answer the question based ONLY on the following context:
{context}
Question: {question}
"""

prompt = ChatPromptTemplate.from_template(template)

# Create chain
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

def chat_with_pdf(question):
    """Function to handle chat with PDF context."""
    try:
        # Proses pertanyaan melalui chain
        print("Processing question:", question)  # Log pertanyaan
        answer = chain.invoke({"question": question})
        print("Answer:", answer)  # Log jawaban
        return {"status": "success", "answer": answer}
    except Exception as e:
        # Tangani error dan kembalikan pesan error
        print("Error in chat_with_pdf:", str(e))  # Log error
        return {"status": "error", "message": str(e)}


app = Flask(__name__)
CORS(app)  # Aktifkan CORS untuk semua rute

@app.route('/chat', methods=['POST'])
def chat():
    """Endpoint untuk menangani pertanyaan dari frontend."""
    try:
        if not request.is_json:
            return jsonify({"status": "error", "message": "Request must be JSON"}), 400

        data = request.get_json()
        print("Received data:", data)  # Log data yang diterima

        question = data.get('question', '')

        if not question:
            return jsonify({"status": "error", "message": "Question is required"}), 400

        # Panggil fungsi chat_with_pdf
        response = chat_with_pdf(question)
        return jsonify(response)
    except Exception as e:
        print("Error in /chat endpoint:", str(e))  # Log error
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)