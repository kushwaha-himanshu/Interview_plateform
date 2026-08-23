from bs4 import BeautifulSoup


def clean_documents(docs):

    for doc in docs:

        soup = BeautifulSoup(
            doc.page_content,
            "html.parser"
        )

        doc.page_content = soup.get_text(
            " ",
            strip=True
        )

        # Remove complex metadata
        doc.metadata.pop("coordinates", None)

    return docs