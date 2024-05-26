# Artificial Intelligence Research Companion SaaS Platform

<h3 align="center">Welcome to AI Research Companion, a dynamic SaaS application built on Next.js 14 </h3>

## <a name="tech-stack">Tech Stack</a>

- Next.js
- Prisma
- React Hook Form
- OpenAI
- Node.js
- TypeScript
- TailwindCSS
- Stripe
- Zod
- pinecone-database
- Upstash
- langchain
- replicate
- Shadcn
- zustand

## <a name="features">Features</a>

👉 **Chat with AI Models:** Engage in conversations with pre-existing AI models of various categories.

👉 **Create Your Own Models:** Unlock the creativity within you! Users on the Pro Plan can build and customize their own AI models by providing essential information.

👉 **Search Functionality:** Easily find existing models by name or category with our efficient search feature..

👉 **Authentication with Clerk:** User management through Clerk, ensuring secure and efficient authentication.

👉 **Dark and Light Theme Switching:** Elevate user experience with the option to switch between dark and light themes based on preferences..

👉 **Model Management:** Enjoy flexibility with the ability to update and delete your custom AI models.

## <a name="quick-start">Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/Ponnada96/AI-Companion.git
cd ai-companion
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
#CLERK
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

#PRISMA POSTGRESQL DATABASE CONNECTION
DATABASE_URL=
DIRECT_URL=

#CLOUDINARY 
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

#PINECONE
PINECONE_INDEX=
PINECONE_ENVIRONMENT=
PINECONE_API_KEY=

#UPSTASH
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

#OPENAI
OPENAI_API_KEY=

#REPLICATE
REPLICATE_API_TOKEN=

#STRIPE
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace the placeholder values with your actual credentials

**Running the Project**

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.


See how a minor change to your commit message style can make you a better programmer.

Format: `<type>(<scope>): <subject>`

`<scope>` is optional

### Example 

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```
More Examples:

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

## Pinecone

In simple terms, Pinecone is a cloud-based vector database for machine learning applications.

By representing data as vectors, Pinecone can quickly search for similar data points in a database.

This makes it ideal for a range of use cases, including semantic search, similarity search for images and audio, recommendation systems, record matching, anomaly detection, and more.

If you're thinking, 'You call that simple?' then perhaps you're not familiar with vector databases.

Vector databases are designed to handle the unique structure of vector embeddings, which are dense vectors of numbers that represent text. They're used in machine learning to capture the meaning of words and map their semantic meaning. These databases index vectors for easy search and retrieval by comparing values and finding those that are most similar to one another, making them ideal for natural language processing and AI-driven applications.