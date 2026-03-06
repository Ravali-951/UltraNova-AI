import openai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')
print(f"API Key starts with: {api_key[:10]}...")
print(f"API Key length: {len(api_key)}")

openai.api_key = api_key

try:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Say 'OpenAI is working!'"}]
    )
    print("✅ SUCCESS:", response.choices[0].message.content)
except Exception as e:
    print("❌ ERROR:", e)