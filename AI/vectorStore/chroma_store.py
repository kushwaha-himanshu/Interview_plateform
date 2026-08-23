from embeddings.upsate_embedding import embeddings
from langchain_chroma import Chroma
from processing.text_splitter import texts


# remove duplicates
unique_texts=[]
seen=set()

for doc in texts:
    content=doc.page_content.strip()
    if content not in seen:
        seen.add(content)
        unique_texts.append(doc)
texts =unique_texts
print("Unique chunks:", len(texts))

# store vectors
vectorstore = Chroma.from_documents(
    documents=texts,
    embedding=embeddings,
    persist_directory="./chroma_db")

print("Vectors stored successfully!")

# mmr retriever 
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 3,
        "fetch_k":15,
        "lambda_mult":0.5
                   }) 

