# Download PGN from view.livechesscloud

A tool to download PGN files from tournaments hosted on view.livechesscloud. The links provided by view.livechesscloud do not offer a direct download option for PGNs. Instead, they continuously poll moves from a JSON endpoint, which can be used to generate PGN files.

## API Endpoints

- **Download All PGN:**
```ruby
GET /api/:tournamentId/download/all
```
- **Download PGN for a Specific Round:**
```ruby
GET /api/:tournamentId/download/:roundId
```
- **Download PGN for a Specific Game within a Round:**
```ruby
GET /api/:tournamentId/download/:roundId/:gameId
```
