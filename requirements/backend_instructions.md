# Overview

Use this guide to build a backend for the emoji generator app.

# Tech Stack

- Next.js
- Supabase
- shadcn/ui
- Clerk
- Lucide React

# Tables and Buckets

## emojis
create table
  public.emojis (
    id bigint generated always as identity not null,
    image_url text not null,
    prompt text not null,
    likes_count numeric null default 0,
    creator_user_id text not null,
    created_at timestamp with time zone null default now(),
    constraint emojis_pkey primary key (id)
  ) tablespace pg_default;

## profiles

create table
  public.profiles (
    user_id text not null,
    credits integer not null default 3,
    tier text not null default 'free'::text,
    stripe_customer_id text not null,
    stripe_subscription_id text not null,
    created_at timestamp with time zone not null default current_timestamp,
    updated_at timestamp with time zone not null default current_timestamp,
    constraint profiles_pkey primary key (user_id),
    constraint profiles_tier_check check ((tier = any (array['free'::text, 'pro'::text])))
  ) tablespace pg_default;

## buckets
emojis

# Requirements

1. **Create user to user table**
   - After a user sign-in via Clerk, get the `userId` from Clerk and check if this `userId` exists in the `profiles` table, matching `user_id`.
   - If the user doesn’t exist, create a user in the `profiles` table.
   - If the user already exists, proceed and pass on `user_id` to functions like generating emojis.

2. **Upload emoji to "emojis" Supabase storage bucket**
   - When a user generates an emoji, upload the emoji image file returned from Replicate to the Supabase `emojis` storage bucket.
   - Add the image URL to the `emojis` data table as `image_url`, and set `creator_user_id` to be the actual `user_id`.

3. **Display all images in emojigrid**
   - The emoji grid should fetch and display all images from the `emojis` data table.
   - When a new emoji is generated, the emoji grid should be updated automatically to add the new emoji to the grid.

4. **Likes interaction**
   - When a user clicks on the 'like' button, the `num_likes` should increase in the `emojis` table.
   - When a user un-checks the 'like' button, the `num_likes` should decrease in the `emojis` table.

# Documentation

## Example of uploading files to Supabase storage
```javascript
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client
const supabase = createClient('your-supabase-url', 'your-supabase-api-key');

// Upload a file using standard upload method
const { data, error } = await supabase.storage.from('bucket_name').upload('file_path', file);
if (error) {
  // Handle error
} else {
  // Handle success
}
```