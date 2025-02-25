import { NextRequest, NextResponse } from "next/server"

// Configure fallback image path
const FALLBACK_IMAGE = "/Images/image8.svg" // Update this to your placeholder path

// Rate limiting configuration for Pinata gateway
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 40 // Adjust based on your Pinata plan

// Track request timestamps to implement rate limiting
let requestTimestamps: number[] = []

export async function GET(request: NextRequest) {
  try {
    // Get IPFS hash from the request URL
    const { searchParams } = new URL(request.url)
    const ipfsHash = searchParams.get("hash")

    if (!ipfsHash) {
      return NextResponse.redirect(new URL(FALLBACK_IMAGE, request.url))
    }

    // Implement rate limiting to avoid 429 errors
    const now = Date.now()

    // Remove timestamps outside the current window
    requestTimestamps = requestTimestamps.filter((timestamp) => timestamp > now - RATE_LIMIT_WINDOW)

    // Check if we're over the rate limit
    if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      console.warn("IPFS gateway rate limit exceeded, using fallback image")
      return NextResponse.redirect(new URL(FALLBACK_IMAGE, request.url))
    }

    // Add current request timestamp
    requestTimestamps.push(now)

    // Try a different IPFS gateway - using public gateways as alternatives
    const gateways = [
      "https://gateway.pinata.cloud/ipfs/",
      "https://ipfs.io/ipfs/",
      "https://cloudflare-ipfs.com/ipfs/",
      "https://gateway.ipfs.io/ipfs/",
    ]

    let imageBuffer: ArrayBuffer | null = null
    let responseHeaders = {}

    // Try each gateway until successful
    for (const gateway of gateways) {
      try {
        // Use a timeout to avoid hanging requests
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(`${gateway}${ipfsHash}`, {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          imageBuffer = await response.arrayBuffer()

          // Get content type from response
          const contentType = response.headers.get("content-type")
          if (contentType) {
            responseHeaders = {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400", // Cache for 24 hours
            }
          }

          break // Exit loop on successful fetch
        }
      } catch (fetchError) {
        console.warn(`Failed to fetch from gateway ${gateway}:`, fetchError)
        // Continue to next gateway
      }
    }

    // If all gateways failed, use fallback
    if (!imageBuffer) {
      console.warn("All IPFS gateways failed, using fallback image")
      return NextResponse.redirect(new URL(FALLBACK_IMAGE, request.url))
    }

    // Determine content type if not already set
    if (!("Content-Type" in responseHeaders)) {
      responseHeaders = {
        "Content-Type": "image/jpeg", // Default to JPEG
        "Cache-Control": "public, max-age=86400",
      }
    }

    return new NextResponse(imageBuffer, {
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("IPFS proxy error:", error)
    return NextResponse.redirect(new URL(FALLBACK_IMAGE, request.url))
  }
}
