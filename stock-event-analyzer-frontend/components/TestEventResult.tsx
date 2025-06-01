import React from "react";
import EventResult from "./EventResult";

// Enhanced sample data with all new fields including simplified explanations
const sampleEventData = {
  event: "2008 Financial Crisis",
  date: "2008-09-15",
  influencers: ["Lehman Brothers", "AIG", "Federal Reserve", "Treasury Secretary Henry Paulson"],
  description: "Lehman Brothers, a global financial services firm, filed for Chapter 11 bankruptcy protection, marking the largest bankruptcy filing in U.S. history at that time with over $600 billion in assets. This occurred after the Federal Reserve and Treasury declined to guarantee its loans or orchestrate a bailout, unlike their actions with Bear Stearns earlier that year.",
  reason: "This event marked the peak of the 2008 financial crisis and led to a major market crash. It's considered the defining moment when the housing crisis transformed into a full-blown global financial meltdown.",
  impact: "The S&P 500 dropped nearly 9% in a single day, and credit markets froze globally. International markets plunged, with some experiencing their worst declines on record. The collapse triggered a chain reaction across financial institutions worldwide.",
  whyThisMatters: "This event triggered widespread concern over the stability of the global financial system, leading investors to flee from all types of risk assets and causing a severe market crash that required massive government intervention to stabilize.",
  simplifiedExplanation: "Imagine a big bank called Lehman Brothers that had borrowed a lot of money to buy houses and make loans. When house prices started falling, they couldn't pay back what they owed. Unlike other troubled banks that got help from the government, Lehman was allowed to fail. This scared everyone because people wondered which bank might collapse next. The stock market crashed, loans became hard to get, and the government eventually had to step in with emergency measures to prevent a complete economic collapse. This event marked the most serious financial crisis since the Great Depression of the 1930s.",
  marketAnalysis: {
    shortTerm: "Markets experienced extreme volatility with the Dow dropping 504 points (4.4%) on the day of the bankruptcy. The following week saw violent swings in asset prices as investors panicked. Financial sector stocks were hit hardest, with Morgan Stanley and Goldman Sachs shares falling over 40% within days. Money market funds 'broke the buck' as the Reserve Primary Fund fell below $1 NAV due to Lehman exposure.",
    mediumTerm: "Over the next three months, global equity markets lost approximately $35 trillion in value. Credit markets seized completely, with LIBOR-OIS spreads reaching record levels indicating extreme banking sector stress. The VIX volatility index hit an all-time high of 80.86 on October 27, 2008. Government intervention became necessary worldwide, with the $700 billion TARP program in the US being the most notable.",
    longTerm: "The crisis led to significant financial regulation overhauls, including the Dodd-Frank Act of 2010. Central banks maintained near-zero interest rates for years, with the Federal Reserve keeping rates at 0-0.25% until December 2015. This created a prolonged low-yield environment that pushed investors into riskier assets. Bank business models transformed dramatically with higher capital requirements and reduced proprietary trading.",
    simplifiedExplanation: "In the days after Lehman collapsed, stocks fell sharply and people panicked. Over the next few months, it became very difficult to get loans, and the government had to step in with a $700 billion rescue package. In the long run, new rules were created to prevent banks from taking too many risks, and interest rates were kept very low for years to help the economy recover. Many people lost their homes and jobs, and it took about 6 years for the job market to fully recover. The stock market eventually recovered and went on to reach new highs, but the crisis changed how banks operate and how the government regulates them."
  },
  economicIndicators: {
    gdpImpact: "US GDP contracted by 8.4% in Q4 2008, marking the worst quarterly drop since 1958. The recession officially lasted 18 months (December 2007 to June 2009), making it the longest since the Great Depression. Overall, the crisis erased approximately $8 trillion in US economic output.",
    employmentImpact: "Unemployment rose from 5% to 10% during the crisis, with 8.7 million jobs lost. The labor market took over 6 years to recover pre-crisis employment levels, with long-term unemployment reaching record highs. Certain sectors like construction and manufacturing were disproportionately affected.",
    interestRates: "The Federal Reserve slashed the federal funds rate to near zero (0-0.25%) by December 2008 and maintained this policy until December 2015. Quantitative easing programs were introduced, with the Fed's balance sheet expanding from $900 billion to $4.5 trillion. These unprecedented monetary policies fundamentally altered global fixed income markets.",
    inflation: "Despite aggressive monetary easing, inflation remained subdued due to economic slack and deleveraging. Deflationary pressures were a greater concern, prompting the Fed to target 2% inflation explicitly for the first time. Some asset classes experienced inflation (housing, equities) while consumer price inflation remained low.",
    simplifiedExplanation: "The crisis hurt the overall economy badly. The country's total economic output (GDP) shrank, meaning less goods and services were being produced. Unemployment doubled from 5% to 10%, with nearly 9 million people losing their jobs. To help fix things, the Federal Reserve (the nation's central bank) cut interest rates to nearly zero, making it cheaper to borrow money. This was like emergency medicine for the economy. Even with all this money being pumped in, prices didn't rise much because people were spending less and businesses weren't raising prices when demand was so low."
  },
  investorLessons: "1) Systemic risk can materialize rapidly, highlighting the importance of diversification beyond just asset classes and into different strategies and approaches. 2) Government and central bank intervention became expected market stabilizers, creating moral hazard but also providing a 'policy put' that supported markets in subsequent crises. 3) Traditional risk models failed during the crisis as correlations approached 1.0 across supposedly uncorrelated assets, demonstrating that historical relationships break down during panic events.",
  glossary: {
    "Systemic Risk": "The risk that an entire financial system could collapse due to the failure of one or a few major components, potentially causing a domino effect throughout the entire system.",
    "LIBOR-OIS Spread": "A measure of banks' reluctance to lend to each other. A wider spread indicates stress in the banking system as banks charge each other more to borrow money.",
    "Quantitative Easing": "A monetary policy where a central bank buys government bonds or other securities to inject money into the economy to expand economic activity.",
    "Moral Hazard": "When people or institutions take more risks because they know they will be protected from the consequences, such as banks taking excessive risks knowing the government might bail them out.",
    "Proprietary Trading": "When banks use their own money to make investments to gain profit, rather than earning commission by trading on behalf of clients."
  },
  relatedEvents: [
    {
      event: "Black Monday",
      date: "1987-10-19",
      note: "Similar market crash where the Dow Jones lost over 22% in a single day, though for different underlying reasons.",
      comparison: "While Black Monday was a steeper one-day decline (22% vs. 4.4% for Lehman), the 2008 crisis had much longer-lasting economic effects. Black Monday was primarily a market phenomenon without significant bank failures or credit market freezes, whereas Lehman Brothers' collapse threatened the entire financial system's functioning.",
      simplifiedExplanation: "Black Monday was a day in 1987 when the stock market crashed much faster than during the 2008 crisis (22% in one day vs. 4.4%). However, the 2008 crisis was much worse overall because it affected banks, loans, housing, and jobs—not just stocks. After Black Monday, the market recovered relatively quickly, while the 2008 crisis took years to recover from and required massive government intervention."
    },
    {
      event: "Dot-com Bubble Burst",
      date: "2000-03-10",
      note: "Previous major financial crisis that similarly led to widespread market losses and economic impacts.",
      comparison: "The dot-com crash primarily affected technology stocks and venture capital, with the NASDAQ falling 78% from peak to trough. Unlike 2008, banking systems remained largely intact, and the recession was milder (8 months vs. 18 months). Recovery was also different - tech stocks took 15 years to reach previous highs, while most financial stocks never fully recovered to pre-2008 levels.",
      simplifiedExplanation: "The dot-com bubble happened when internet companies became extremely overvalued in the late 1990s. When it burst in 2000, mostly tech companies and their investors were hurt. The banking system stayed healthy, unlike in 2008 when the entire financial system was at risk. The dot-com crash caused a mild recession (8 months), while the 2008 crisis caused a severe recession (18 months) that affected everyone, not just tech investors."
    }
  ],
  source: "Financial History Records, Federal Reserve Economic Data, U.S. Treasury Reports"
};

export default function TestEventResult() {
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <h1 className="text-2xl font-bold text-white mb-6">Test Event Result Component</h1>
      <EventResult data={sampleEventData} isLoading={false} />
    </div>
  );
} 