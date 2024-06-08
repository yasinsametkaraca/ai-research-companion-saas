// rate-limit.ts is a function that uses the Ratelimit class from the @upstash/ratelimit package to rate limit requests.
// The function takes an identifier as a parameter and returns the result of the limit method of the Ratelimit instance.
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export async function rateLimit(identifier: string) { // this function is going to rate limit the user based on the identifier.
    const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(), // this will create a new redis client from the environment variables.
        limiter: Ratelimit.slidingWindow(10, "10 s"), // this will allow the user to make 10 requests in 10 seconds window anything about that is going to be blocked.
        analytics: true, // this will enable analytics for the ratelimiting.
        prefix: "@upstash/ratelimit" //
    })
    return await ratelimit.limit(identifier) // this will limit the user based on the identifier. Identifier can be anything like user id, ip address etc.
}