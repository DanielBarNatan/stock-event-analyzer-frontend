from openai import AsyncOpenAI
from app.core.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def get_historical_event(query: str):
    prompt = f"""Based on the search query "{query}", find information about this specific historical event or the most directly related significant U.S. historical event. If the query mentions a specific event (like "2008 financial crisis", "great depression", "black monday", etc.), provide information about that exact event.

IMPORTANT: For the date field, provide the MOST SPECIFIC date possible. Always try to provide the exact date (YYYY-MM-DD) when the event occurred or began. For example:
- Black Monday: "1987-10-19" (not just "1987")
- 2008 Financial Crisis: "2008-09-15" (Lehman Brothers collapse date)
- Great Depression: "1929-10-29" (Black Tuesday)
- Housing Crisis: "2007-06-15" (when it became evident)

Return ONLY a valid JSON object with the following structure:

{{
  "event": "Brief event name that matches the search query",
  "date": "YYYY-MM-DD (exact date when the event occurred or began)",
  "influencers": ["Key person 1", "Key person 2"],
  "description": "Detailed description of what happened on this specific date",
  "reason": "Why this event matches the search query",
  "impact": "How this affected markets/economy starting from this date",
  "whyThisMatters": "A concise sentence that summarizes the significance of the event to markets",
  "simplifiedExplanation": "A beginner-friendly explanation of this event using simple language",
  "marketAnalysis": {{
    "shortTerm": "Detailed explanation of the immediate market reaction (1-7 days)",
    "mediumTerm": "Analysis of how markets evolved in the weeks and months following the event",
    "longTerm": "Explanation of lasting market impacts and potential policy changes",
    "simplifiedExplanation": "An explanation of market reactions in simple terms"
  }},
  "economicIndicators": {{
    "gdpImpact": "How this event affected GDP growth",
    "employmentImpact": "Effects on employment/unemployment rates",
    "interestRates": "Changes to interest rate policy that resulted from this event",
    "inflation": "Impact on inflation/deflation trends",
    "simplifiedExplanation": "A simple explanation of how this event affected the economy"
  }},
  "investorLessons": "2-3 key takeaways or lessons that investors learned from this event",
  "glossary": {{
    "Term 1": "Simple definition of financial term mentioned in the analysis",
    "Term 2": "Simple definition of financial term mentioned in the analysis"
  }},
  "relatedEvents": [
    {{
      "event": "Similar historical event 1",
      "date": "YYYY-MM-DD",
      "note": "Brief note about how this relates to the main event",
      "comparison": "Specific comparison of market impacts between this event and the main event",
      "simplifiedExplanation": "A simple explanation of how this related event is similar to or different"
    }}
  ],
  "source": "General historical source or 'Historical records'"
}}

Make sure the response is valid JSON only, no additional text."""
    
    try:
        completion = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a financial historian and market analyst who provides accurate, structured data about specific U.S. historical events and their market impacts."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=1500,
            temperature=0.2,
        )
        
        response_content = completion.choices[0].message.content.strip()
        return response_content
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}") 