# 🤖 Fintrix AI — Conversational Financial Intelligence Agent Backend
> Powered by Local Ollama & SmolAgents | Track 1: Payments Risk & Forensics

---

## 📌 Overview

**Fintrix AI** is the backend agentic conversational intelligence layer designed to serve:
1. The **Fintrix Web Application** (Frontend)
2. The **Interactive Analytics Dashboard**

It connects local Ollama tool-calling LLMs with deterministic data retrieval tools, risk scoring models, and domain knowledge to provide explainable financial forensics on real UPI transaction and dispute datasets without hallucination.

---

## 📁 Project Structure

```
fintrix_ai/
│
├── .env                     # Local environment variables
├── .env.example             # Template environment variables
├── .gitignore               # Ignored artifacts and secrets
├── requirements.txt         # Python dependencies
├── README.md                # Documentation & quickstart guide
│
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application server
│   │
│   ├── agent/               # SmolAgents orchestration
│   │   ├── __init__.py
│   │   ├── agent.py         # Agent factory (ToolCallingAgent / CodeAgent)
│   │   ├── config.py        # Environment & Ollama configuration
│   │   └── prompts.py       # Financial system prompts
│   │
│   ├── tools/               # Controlled deterministic tools (Phases 3-9)
│   │   ├── transaction_tools.py # get_transaction(txn_id)
│   │   ├── customer_tools.py    # get_customer(user_id)
│   │   ├── merchant_tools.py    # get_merchant(merchant_id)
│   │   ├── chargeback_tools.py  # get_chargebacks(...)
│   │   ├── analytics_tools.py   # Aggregations & calculations
│   │   ├── risk_tools.py        # ML anomaly & risk scoring
│   │   └── knowledge_tools.py   # Static glossary & domain facts
│   │
│   ├── data/                # Data loader for clean datasets
│   │   └── data_loader.py   # Cached access to 20K txns, 2.8K CB, 36K KYC, 6.2K merchants
│   │
│   ├── rag/                 # Modular RAG subsystem
│   │   ├── retriever.py     # Static document retriever
│   │   └── documents/       # Knowledge base markdown files
│   │
│   └── schemas/             # Pydantic request/response models
│       └── response_models.py
│
└── tests/
    └── test_agent.py        # Agent verification test
```

---

## 🚀 Quickstart & Setup

### 1. Install Dependencies
```bash
cd fintrix_ai
pip install -r requirements.txt
```

### 2. Configure Local Ollama Environment
Create or update `fintrix_ai/.env`:
```env
OLLAMA_MODEL=llama3.2
LLM_PROVIDER=ollama
HOST=0.0.0.0
PORT=8000
```
*Note: Make sure you have [Ollama](https://ollama.com/) running locally and have pulled the model (`ollama pull llama3.2`).*

---

### 3. Run Agent Verification Tests
You can run the test suite to verify the agent tool bindings and Ollama connection:
```bash
pytest fintrix_ai/tests/
```

Expected Output:
```text
============================= test session starts =============================
collected 76 items

test_agent.py .
test_analytics_tools.py ........
...
============================= 76 passed =============================
```

---

### 4. Run the FastAPI Server
```bash
cd fintrix_ai
uvicorn app.main:app --reload --port 8000
```
Visit API Documentation: `http://localhost:8000/docs`

---

## 🔒 Safety & Architectural Rules
1. **No Hallucinations**: Financial amounts, complaint counts, and user data are retrieved via deterministic Python tools.
2. **Database Migration**: Modular data loader supports current clean CSVs.
3. **No Unrestricted Access**: The LLM interacts strictly through typed tools.
