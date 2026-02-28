import { NextResponse } from 'next/server';

const KNOWLEDGE_BASE: Record<string, string[]> = {
    "default": [
        "That is a fascinating perspective on startup development.",
        " The UltraNova AI Founder OS is designed precisely to handle complex scenarios like this.",
        " By analyzing your product-market fit with the Marketing Agent and validating technical feasibility with the Tech Agent, we can map out a robust timeline natively.",
        " I recommend bringing this direct concept to the 'Decisions' panel in your main console."
    ],
    "what is": [
        "UltraNova is an operating system where an interconnected council of AI agents helps you ideate, plan, build, and scale your startup.",
        " It acts as a full co-founder team.",
        " Five specialized agents debate your ideas to ensure you make bulletproof decisions."
    ],
    "agents": [
        "The council consists of Product, Sales, Tech, Marketing, and Ops.",
        " They debate ideas, score risks, and provide actionable roadmaps.",
        " Unlike standard chat interfaces, they interact with *each other* to find the optimal path forward based on conflicting startup priorities."
    ],
    "solo": [
        "Absolutely! It's designed specifically to give solo founders the brain trust, bandwidth, and accountability of a full founding team.",
        " You'll never have to build in a vacuum again, which minimizes the psychological and tactical friction of solo journeys."
    ],
    "price": [
        "We are currently in Early Access.",
        " Pricing will be tiered based on the computational resources required for your agent council running concurrent processes.",
        " Join the waitlist to secure an early adopter rate!"
    ],
    "tech": [
        "The Tech agent constantly evaluates architecture choices, technical debt accumulation, and long-term scaling viability.",
        " It's built to prevent you from getting locked into the wrong tech stack early on."
    ],
    "marketing": [
        "The Marketing agent continuously analyzes market trends, positioning, and Go-To-Market strategies.",
        " It ensures you aren't just building a great product in isolated code, but building one people actually want."
    ]
};

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const query = message.trim();
        const lowerQuery = query.toLowerCase();

        let fullText = "";

        // Known exact matches
        for (const key of Object.keys(KNOWLEDGE_BASE)) {
            if (key !== "default" && lowerQuery.includes(key)) {
                fullText = KNOWLEDGE_BASE[key].join('');
                break;
            }
        }

        // Dynamic Generative Fallback for arbitrary inputs
        if (!fullText) {
            const words = query.split(' ');
            const subject = words.length > 3 ? `your idea regarding "${words.slice(0, 4).join(' ')}..."` : `this concept`;

            const dynamicResponses = [
                `That's an interesting question about ${subject}.`,
                ` Our AI Founder OS is uniquely equipped to analyze topics like this.`,
                ` Based on initial heuristics, the Product Agent would likely break down the core user journeys, while the Tech Agent assesses the scaling implications.`,
                ` If you input this into the Think panel, the five agents will debate the viability and provide a definitive roadmap.`
            ];
            fullText = dynamicResponses.join('');
        }

        // Convert into a stream, word by word
        const resultWords = fullText.split(/(?<=\s+)/);

        // Create streaming HTTP response
        const stream = new ReadableStream({
            async start(controller) {
                // Initial simulated 'thinking' delay before stream starts
                await new Promise(r => setTimeout(r, 600));

                for (const word of resultWords) {
                    // Typist speed delay per loop
                    await new Promise(r => setTimeout(r, 35));
                    controller.enqueue(new TextEncoder().encode(word));
                }
                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
            },
        });

    } catch (err) {
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }
}
