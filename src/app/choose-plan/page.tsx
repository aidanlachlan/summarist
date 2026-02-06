"use client";

import { getCheckoutUrl } from "@/lib/stripe";
import { useState } from "react";
import Image from "next/image";
import { AiOutlineFileText, AiOutlineBulb } from "react-icons/ai";
import { RiPlantLine } from "react-icons/ri";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import Footer from "@/components/Footer";
import "@/app/home.css";

export default function ChoosePlan() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"yearly" | "monthly">(
    "yearly",
  );
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const faqData = [
    {
      question: "How does the free 7-day trial work?",
      answer:
        "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
    },
    {
      question:
        "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
      answer:
        "While an annual plan is active, it is not possible to switch to a monthly plan. However, once your annual subscription expires, you can easily transition to a monthly plan by selecting the monthly option during checkout.",
    },
    {
      question: "What's included in the Premium plan?",
      answer:
        "Premium members have unlimited access to all book summaries, audio content, highlights, and personalized recommendations. You also get offline access to saved content.",
    },
    {
      question: "Can I cancel during my trial or subscription?",
      answer:
        "Yes, you can cancel your subscription at any time. If you cancel during your free trial, you will not be charged. If you cancel after your trial, you will retain access until the end of your billing period.",
    },
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);

    // Replace these with your actual Stripe price IDs
    const priceId =
      selectedPlan === "yearly"
        ? "price_1SxIsqQstFjfOhVihLYvMYMP"
        : "price_1SxJBeQstFjfOhViXwW3bjG6";

    try {
      const checkoutUrl = await getCheckoutUrl(priceId);
      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative">
        {/* Background with curved bottom */}
        <div className="absolute top-0 left-0 w-full h-full bg-[#032b41] rounded-b-[16rem] -z-10" />

        <div className="pt-12 mb-6">
          <div className="max-w-[1000px] mx-auto px-6 text-center">
            <h1 className="text-white text-[48px] md:text-5xl font-bold mb-10 leading-14">
              Get unlimited access to many amazing books to read
            </h1>
            <p className="text-white text-xl mb-8">
              Turn ordinary moments into amazing learning opportunities
            </p>
            <figure className="flex justify-center max-w-[340px] mx-auto rounded-t-[180px] overflow-hidden">
              <Image
                src="/pricing.png"
                alt="Pricing illustration"
                width={340}
                height={340}
                className="w-full"
              />
            </figure>
          </div>
        </div>
      </div>

      {/* Features Row */}
      <div className="py-12 px-6">
        <div className="max-w-[800px] mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col items-center text-center">
            <AiOutlineFileText className="w-12 h-12 text-[#032b41] mb-4" />
            <p className="text-[#394547]">
              <span className="font-bold">Key ideas in few min</span> with many
              books to read
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <RiPlantLine className="w-12 h-12 text-[#032b41] mb-4" />
            <p className="text-[#394547]">
              <span className="font-bold">3 million</span> people growing with
              Summarist everyday
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <AiOutlineBulb className="w-12 h-12 text-[#032b41] mb-4" />
            <p className="text-[#394547]">
              <span className="font-bold">Precise recommendations</span>{" "}
              collections curated by experts
            </p>
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="px-6">
        <div className="max-w-[600px] mx-auto">
          <h2 className="text-[32px] font-bold text-[#032b41] text-center mb-8">
            Choose the plan that fits you
          </h2>

          {/* Yearly Plan */}
          <div
            onClick={() => setSelectedPlan("yearly")}
            className={`border-2 rounded-lg p-6 mb-4 cursor-pointer transition-all ${
              selectedPlan === "yearly"
                ? "border-[#2bd97c] bg-[#f1f6f4]"
                : "border-[#bac8ce]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                  selectedPlan === "yearly"
                    ? "border-[#2bd97c]"
                    : "border-[#bac8ce]"
                }`}
              >
                {selectedPlan === "yearly" && (
                  <div className="w-3 h-3 rounded-full bg-[#2bd97c]" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-[#032b41] text-lg">
                  Premium Plus Yearly
                </h3>
                <p className="text-2xl font-bold text-[#032b41] my-2">
                  $99.99/year
                </p>
                <p className="text-sm text-[#6b757b]">
                  7-day free trial included
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#bac8ce]" />
            <span className="text-[#6b757b]">or</span>
            <div className="flex-1 h-px bg-[#bac8ce]" />
          </div>

          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedPlan === "monthly"
                ? "border-[#2bd97c] bg-[#f1f6f4]"
                : "border-[#bac8ce]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                  selectedPlan === "monthly"
                    ? "border-[#2bd97c]"
                    : "border-[#bac8ce]"
                }`}
              >
                {selectedPlan === "monthly" && (
                  <div className="w-3 h-3 rounded-full bg-[#2bd97c]" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-[#032b41] text-lg">
                  Premium Monthly
                </h3>
                <p className="text-2xl font-bold text-[#032b41] my-2">
                  $9.99/month
                </p>
                <p className="text-sm text-[#6b757b]">No trial included</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA Button */}
      <div className="sticky bottom-0 bg-white py-6 px-6  border-[#e1e7ea]">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-[#2bd97c] text-[#032b41] font-semibold py-4 rounded-lg cursor-pointer hover:bg-[#20ba68] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Loading..."
              : selectedPlan === "yearly"
                ? "Start your free 7-day trial"
                : "Start your first month"}
          </button>
          <p className="text-center text-sm text-[#6b757b] mt-3">
            {selectedPlan === "yearly"
              ? "Cancel your trial at any time before it ends, and you won't be charged."
              : "30-day money back guarantee, no questions asked."}
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="py-12 px-6">
        <div className="max-w-[1022px] mx-auto">
          {faqData.map((item, index) => (
            <div key={index} className="border-b border-[#e1e7ea]">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between py-6 cursor-pointer"
              >
                <h3 className="font-semibold text-[#032b41] text-[24px] text-left pr-4">
                  {item.question}
                </h3>
                {openAccordion === index ? (
                  <IoChevronUp className="w-6 h-6 text-[#032b41] flex-shrink-0" />
                ) : (
                  <IoChevronDown className="w-6 h-6 text-[#032b41] flex-shrink-0" />
                )}
              </button>
              <div
                className={`grid transition-all duration-350 ease-in-out ${
                  openAccordion === index
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-[#394547] leading-relaxed pb-6 text-[16px]">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="homepage">
        <Footer />
      </div>
    </>
  );
}
