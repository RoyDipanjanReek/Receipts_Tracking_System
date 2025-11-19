"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* { Hero Section } */}
      <section className="py-20 md:py-28 bg-linear-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Intelligent Receipt Scanning
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Scan, analyze and organized your reciept with AI powered
                precision. Save time and gain insights from your expenses.
              </p>
            </div>

            <div className="space-x-4">
              <Link href="/receipts">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline">
                  Learn More 
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* {PDF drop zone} */}
        <div className="mt-12 flex justify-center">
          <div className="relative w-full max-w-3xl rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden dark:border-gray-800 dark:bg-gray-950">
            <div className="p-6 md:p-8 relative">
                <p>PDF dropzone goes here....</p>
            </div>
          </div>
        </div>
      </section>
      {/* { Feature Section } */}

      <section id="features" className="py-16 md:py-24"></section>
      {/* { Pricing Section } */}
      {/* { Info Section } */}
      {/* { Footter Section } */}
    </div>
  );
}
