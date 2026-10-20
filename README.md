# Smart Quiz AZ-900

Build the first version of **Smart Quiz — AZ-900 Exam Prep**, an educational web app for the #1MillionDevs Vibe Coding Hackathon.

I am responsible for the UI and learner experience. Another teammate is responsible for the question bank, answer validation, scoring logic and testing. Build the interface so it can connect cleanly to a structured question bank later.

## 1. Visual design

Create a polished, modern, responsive web app with:

- Deep navy backgrounds and white or light-grey cards.

- Electric purple and cyan accents.

- Clear typography, rounded cards, subtle shadows and tasteful transitions.

- A professional dashboard that looks impressive in a live demonstration.

- Accessible contrast, keyboard navigation and mobile-friendly layouts.

The app should feel like a premium learning platform, not a generic template.

## 2. Homepage and dashboard

Include:

- Smart Quiz branding with a simple graduation-cap or quiz-themed icon.

- Heading: “Study smarter. Understand every answer.”

- Supporting text explaining that learners practise AZ-900 concepts and learn from mistakes.

- A prominent “Start Practising” button.

- Three topic cards:

  1. Describe cloud concepts.

  2. Describe Azure architecture and services.

  3. Describe Azure management and governance.

- A progress section with sensible empty states for new learners.

- A small disclaimer that this is an unofficial study tool.

Do not display invented user scores or fake progress.

## 3. Quiz setup screen

When a learner selects Start Practising or a topic:

- Show the selected topic.

- Allow 5, 10 or 15 questions when enough questions are available.

- Display a clear Start Quiz button.

- Provide an easy way to return to the dashboard.

## 4. Quiz screen

Design a reusable quiz screen containing:

- Topic name and question number.

- A progress bar.

- The question text.

- Four selectable answer cards labelled A, B, C and D.

- A Submit Answer button.

- A reserved feedback panel for correct or incorrect results.

- A Next Question button.

- A clear exit or back action.

Initially, use a small set of clearly labelled demonstration questions so the screen can be previewed. Keep demonstration data separate from the final question bank.

The interface must not reveal the correct answer before submission. Once an answer has been submitted, show the feedback supplied by the quiz logic rather than generating a new answer in the UI.

## 5. Results screen

Design a results page with:

- Score and percentage.

- Correct and incorrect answer counts.

- Topic performance.

- Buttons for Review Mistakes, Practise Weak Topics and Return to Dashboard.

Use actual session data. Show a helpful empty state if there are no completed attempts.

## 6. Components and integration

Create reusable components for:

- Header and navigation.

- Topic cards.

- Quiz answer options.

- Progress indicators.

- Feedback panel.

- Results summary.

Keep styling and presentation separate from quiz data and scoring logic. Use React and TypeScript if supported by the existing project. Avoid duplicating state across screens.

Do not add authentication, a database or an AI API in this first pass. Do not create nonfunctional buttons or claim that persistence exists when it does not.

## 7. Build order

First build the homepage, topic selection, quiz screen and results screen. Connect the basic navigation and demonstrate the complete learner journey using sample data.

Before finishing, check the layout on desktop and mobile, make sure all buttons have meaningful behaviour, and list anything that remains incomplete.

Prioritise a cohesive, working prototype over unnecessary features.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c9232789-df46-5df7-a369-2efd9e67e678).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
