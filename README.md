# Health workout service

A private, local-first daily gym-plan service. It schedules a plan at 7:00 AM India time, records a small knee-symptom check-in on the local machine, and can send an approved WhatsApp template when configured.

The initial programme is strength-focused because the clinician has advised strength training. It is deliberately conservative: it never diagnoses a knee condition, and a check-in reporting locking, giving way, or new swelling switches to a pause-and-seek-advice message.

## Run locally

Requires Node.js 22 or later. No packages need to be installed.

```sh
npm test
npm start
```

Use another terminal to record a check-in:

```sh
curl -X POST http://localhost:3000/check-ins \
  -H 'content-type: application/json' \
  -d '{"kneePain":2,"newSwelling":false,"locking":false,"givingWay":false,"energy":"okay"}'
```

View the next plan at `http://localhost:3000/daily-plan`. `POST /send-today` previews the delivery; without provider settings it writes the message to the server log.

## WhatsApp setup

Copy `.env.example` to `.env` and load its values through your process manager. The provider configuration is intentionally not included in the repository.

Create and obtain approval for a WhatsApp Content Template containing a first variable for the full workout message. Set `TWILIO_CONTENT_SID` to that template's identifier. The service will use the official Twilio Messages API only when all five WhatsApp variables are set; otherwise it safely remains in preview mode.

Do not put an MRI report, medication names, or other sensitive clinical information in WhatsApp messages. Future report upload should be consented, encrypted, access-controlled, and reviewed by a clinician rather than treated as an automatic diagnosis.
