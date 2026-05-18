# AI Pregnancy Calorie Calculator

A free online tool that helps expecting mothers estimate their daily pregnancy calorie needs using the Mifflin-St Jeor BMR equation and Institute of Medicine pregnancy calorie guidelines.

## What it does

- Estimates daily pregnancy calorie needs by age, height, weight, pregnancy week, pregnancy type, and activity level
- Shows macro targets (protein, carbs, fats) with pregnancy-specific protein additions
- Provides AI-powered nutrition tips, meal plan examples, and a weekly weight gain tracker
- All calculations are transparent — the formula steps are displayed on the result page

## Formula

Mifflin-St Jeor female BMR → BMI-adjusted BMR → TDEE (activity factor) → pregnancy calorie addition (week-by-week curve, Weeks 1-42) → final daily calorie target. IOM 2009 pregnancy weight gain guidance is provided as a reference range.

## Tech

- Frontend: vanilla HTML/CSS/JavaScript, mobile-first single-page app
- AI integration: same-domain Vercel serverless proxy (OpenAI-compatible API)
- Hosting: Vercel with production domain `aipregnancycaloriecalculator.online`

## Live site

https://aipregnancycaloriecalculator.online

## Disclaimer

This tool provides educational nutrition guidance only. It is not a medical device and does not diagnose, treat, or replace prenatal care. Users should discuss their personal nutrition plan with their healthcare provider.
