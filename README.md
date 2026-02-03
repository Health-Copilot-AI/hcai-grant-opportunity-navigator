# GrantFlow Navigator

A modern, responsive web application for navigating and managing grant opportunities for FIU Herbert Wertheim College of Medicine's NeighborhoodHELP and FIU Thrive programs.

## Features

- **Dashboard**: Overview of all opportunities with key metrics and visualizations
- **Opportunities Browser**: Filterable grid of all 27+ grant opportunities
- **Detailed Views**: In-depth information for each opportunity including research documents
- **Timeline**: Track upcoming and past deadlines with visual charts
- **Relationships**: Leverage prior funder relationships for higher success rates
- **Search**: Full-text search across all opportunities and content

## Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components)
- **Styling**: Tailwind CSS with CSS variable theming
- **Charts**: Recharts
- **UI Components**: Radix UI primitives
- **Data**: File-based (CSV, Markdown, YAML)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATA_PATH` | Path to opportunities data | `./data/opportunities` |
| `PORT` | Server port | `3000` |

## Project Structure

```
hcai-grant-opportunity-navigator/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── opportunities/     # Opportunities list and detail
│   ├── timeline/          # Deadline timeline
│   ├── relationships/     # Prior relationships
│   ├── search/            # Search page
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── dashboard/        # Dashboard-specific
│   ├── opportunities/    # Opportunity cards/filters
│   ├── charts/           # Chart components
│   └── detail/           # Detail page components
├── lib/                   # Utilities and data layer
│   ├── data/             # Data loaders
│   ├── parsers/          # CSV/MD/YAML parsers
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── data/                  # Bundled opportunity data
│   └── opportunities/    # CSV and folder structure
└── tests/                # Test files
```

## Deployment

### Railway

1. Connect your GitHub repository
2. Set environment variables if needed
3. Deploy - Railway will auto-detect Next.js

The app includes:
- `railway.toml` configuration
- Health check endpoint at `/api/health`
- Bundled data in `data/opportunities/`

### Manual Build

```bash
npm run build
npm start
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/opportunities` | List all opportunities |
| `GET /api/opportunities/[id]` | Get single opportunity |
| `GET /api/global` | Aggregated stats and lists |

## Data Schema

Opportunities are sourced from:
- `ENRICHED-OPPORTUNITIES.csv` - Main data with scores
- Individual folders with README.md and research documents

See `lib/types/index.ts` for full TypeScript definitions.

## License

Internal use only - FIU HWCOM
