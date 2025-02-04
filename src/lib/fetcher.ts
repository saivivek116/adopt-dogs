"use client";
import { Dog } from './types';

// lib/fetcher.ts

export interface RequestConfig {
  url: string
  method?: string
  body?: any
}


export default async function universalFetcher(config: RequestConfig) {
  const { url, method = 'GET', body } = config
  const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`

  const options: RequestInit = {
    method,
    credentials: 'include',  // crucial for cookies
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const res = await fetch(fullUrl, options)
  if (res.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    throw new Error(`Request failed with ${res.status}: ${res.statusText}`)
  }
  
  const contentType = res.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }

  return await res.text();


}



export async function fetchDogs(dogIds){
  try {
    const dogsresponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dogs`, {
      method: 'POST',
      body: JSON.stringify(dogIds),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (dogsresponse.status === 401) {
      throw new Error("Unauthorized");
    }
    if (!dogsresponse.ok) {
      throw new Error('An error occurred while fetching dogs');
    }
    const dogsData: Dog[] = await dogsresponse.json();
    return dogsData;
  } catch (error) {
    return { error: error.message };
  }
}
