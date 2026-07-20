# Healthy Lunchbox: Disaster Recovery & Continuity Plan

## Overview
This document outlines the Disaster Recovery (DR) and Data Retention protocols for the Healthy Lunchbox platform. It is designed to ensure High Availability, compliance with UK HMRC data retention laws (6 years), and GDPR adherence.

## 1. Automated Backups & System Snapshots
The platform leverages an active configuration backup endpoint:
- **API Endpoint:** `GET /api/settings/backup`
- **Output:** A timestamped JSON payload containing critical system settings, API integration keys, registered users, and active shops.
- **Frequency:** Can be triggered manually via the Admin Console (`/admin/settings` -> System Tab) or set up on an automated cron job.

## 2. Recovery Procedures (RTO & RPO)
In the event of database corruption or hardware failure:
1. **Identify the latest backup payload:** Locate the most recent `platform-backup-[timestamp].json` file.
2. **Database Reset:** Flush the existing corrupted Prisma database utilizing `npx prisma db push --force-reset`.
3. **Restore Data:** Inject the JSON payload via the internal backend restore script (to be implemented in `v2`) or manually re-upload configurations via the NestJS Settings Service.

## 3. Data Retention & Archival
To comply with regulatory standards:
- **Financial Records:** `Payout` and `Booking` models must be retained for a minimum of 6 years (HMRC compliance).
- **PII / Chat Logs:** `SupportTicket` and conversational histories are actively purged by the `DataRetentionService` (Cron Job) after 3 years unless explicitly required for an ongoing dispute.
- **Service Location:** `backend/src/common/data-retention.service.ts`

## 4. Multi-Zone Scalability
The database schema uses the `Zone` entity (`zoneId` on `User`, `Shop`, and `Address`) to physically shard or logically separate cities (e.g., London vs Manchester). If a zone experiences localized downtime (e.g. regional delivery strike), other zones will continue to operate entirely independently.
