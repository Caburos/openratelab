# Brief — 2026-09-25 — gmail-promotions-tab-plain-text

**Mode:** blog-trend
**Topic:** Why Gmail keeps filing an email into Promotions, and what actually changes when a plain-text version lands in Primary instead
**Angle:** The Promotions tab isn't really about content quality, it's a formatting/engagement signal problem; a heavily templated HTML welcome email reads to Gmail's classifier the same way a marketing blast does, regardless of how personal the copy is
**Target keyword:** why does gmail put my emails in promotions

## Why this topic

Sharpened from today's discovery report's "Email Revenue Systems" bucket,
a very fresh (0.3 days) r/emailmarketing thread: "Gmail filed my welcome
email under Promotions five times. The plain version hit Primary."
(https://www.reddit.com/r/Emailmarketing/comments/1wpeu4r/gmail_filed_my_welcome_email_under_promotions/).
Genuinely distinct from our existing deliverability content (SPF/DKIM
guide covers authentication, open-rate-data-accuracy covers iOS MPP) —
this is specifically about Gmail's tab classification, a different
mechanism most DTC brands don't think about until it's already hurting a
flow.

## Outline

- What actually drives Gmail's Promotions classification: heavy HTML,
  image-to-text ratio, marketing-style formatting patterns, engagement
  history with the sender, not the literal words in the copy
- Why a welcome email is especially exposed to this: it's often the most
  heavily templated, most "on-brand" email in the whole flow, which is
  exactly the pattern Gmail's classifier is tuned to catch
- The plain-text test: what changed when a lighter, less templated
  version landed in Primary instead, and why that's a real signal, not a
  coincidence
- What this actually means for flow design: it's not "always send plain
  text," it's understanding which emails in a flow benefit from landing
  in Primary (welcome, receipts, key lifecycle moments) versus which are
  fine in Promotions
- A practical check: how to test whether a specific email is landing in
  Promotions, and what to try first before assuming it's unfixable

## LinkedIn angle

A welcome email kept landing in Gmail's Promotions tab. Five times. The plain-text version hit Primary on the first try. Here's what that actually reveals about how Gmail decides.

## Suggested internal links

- The Klaviyo Welcome Series That Converts — https://openratelab.com/blog/klaviyo-welcome-series-guide
- Email Deliverability for DTC Brands: SPF, DKIM, and Sender Reputation Explained — https://openratelab.com/blog/email-deliverability-guide-dtc

## Source evidence

- [Gmail filed my welcome email under Promotions five times. The plain version hit Primary.](https://www.reddit.com/r/Emailmarketing/comments/1wpeu4r/gmail_filed_my_welcome_email_under_promotions/) — r/emailmarketing, ~0.3 days
