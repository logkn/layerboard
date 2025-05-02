from openai import OpenAI

client = OpenAI(base_url="http://localhost:8080/v1")

response = client.chat.completions.create(
    model="qwen3-32b",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Prove or disprove: We can measure the one-way speed of light.",
        },
    ],
)

print(response.choices[0].message.content)
